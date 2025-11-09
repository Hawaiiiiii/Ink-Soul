// Edge Function: send-notification
// Envía notificaciones por email usando Resend API y las registra en Supabase

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface NotificationRequest {
  tipo: 'consulta' | 'cita' | 'compra'
  asunto: string
  contenido: string
  datosExtra?: any
}

// Template HTML con diseño Ink & Soul
function createEmailTemplate(tipo: string, asunto: string, contenido: string): string {
  const tipoEmoji = tipo === 'consulta' ? '💬' : tipo === 'cita' ? '📅' : '🛒'
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${asunto}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background-color: #0b0b0b;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1a1a1a; border: 1px solid #C6A45D; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b0b0b 0%, #1a1a1a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #C6A45D;">
              <h1 style="margin: 0; color: #C6A45D; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                Ink & Soul
              </h1>
              <p style="margin: 8px 0 0 0; color: #EAE6DA; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
                by Asunaah
              </p>
            </td>
          </tr>
          
          <!-- Badge de tipo -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <div style="display: inline-block; background-color: #C6A45D; color: #0b0b0b; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ${tipoEmoji} ${tipo.toUpperCase()}
              </div>
            </td>
          </tr>
          
          <!-- Asunto -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h2 style="margin: 0; color: #EAE6DA; font-size: 22px; font-weight: 600; line-height: 1.4;">
                ${asunto}
              </h2>
            </td>
          </tr>
          
          <!-- Contenido -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="color: #b8b8b8; font-size: 15px; line-height: 1.6;">
                ${contenido}
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0b0b0b; padding: 30px; text-align: center; border-top: 1px solid #333;">
              <p style="margin: 0 0 10px 0; color: #888; font-size: 12px;">
                Esta notificación fue generada automáticamente desde tu sitio web
              </p>
              <p style="margin: 0; color: #C6A45D; font-size: 11px; letter-spacing: 1px;">
                INK & SOUL · FINELINE TATTOOING
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const resendFrom = Deno.env.get('RESEND_FROM') || 'Ink & Soul <notifications@resend.dev>'
    
    // Destinatarios por defecto
    const destinatarios = [
      Deno.env.get('NOTIFY_TO_1') || 'inkandsoul@gmail.com',
      Deno.env.get('NOTIFY_TO_2') || 'daviderikgarciaarenas@gmail.com'
    ]

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const requestData = await req.json() as NotificationRequest

    const { tipo, asunto, contenido, datosExtra } = requestData

    // Validar datos requeridos
    if (!tipo || !asunto || !contenido) {
      throw new Error('Faltan campos requeridos: tipo, asunto, contenido')
    }

    // 1. Registrar notificación en la base de datos
    const { data: notificationRecord, error: dbError } = await supabase
      .from('notificaciones')
      .insert({
        tipo,
        asunto,
        contenido,
        enviado_a: destinatarios,
        datos_extra: datosExtra || {}
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error al registrar notificación:', dbError)
      throw new Error(`Error de base de datos: ${dbError.message}`)
    }

    // 2. Enviar email con Resend (si la API key está configurada)
    let emailSent = false
    let emailError = null

    if (resendApiKey) {
      try {
        const emailHtml = createEmailTemplate(tipo, asunto, contenido)
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: resendFrom,
            to: destinatarios,
            subject: `[Ink & Soul] ${asunto}`,
            html: emailHtml
          })
        })

        const emailData = await emailResponse.json()

        if (!emailResponse.ok) {
          emailError = emailData.message || 'Error desconocido al enviar email'
          console.error('Error de Resend:', emailData)
        } else {
          emailSent = true
          console.log('Email enviado exitosamente:', emailData)
        }
      } catch (error) {
        emailError = error.message
        console.error('Error al enviar email:', error)
      }
    } else {
      console.warn('RESEND_API_KEY no configurada, email no enviado')
    }

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          notificationId: notificationRecord.id,
          emailSent,
          emailError,
          message: emailSent 
            ? 'Notificación enviada y registrada exitosamente' 
            : 'Notificación registrada (email no enviado: API key no configurada)'
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error en send-notification:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'NOTIFICATION_ERROR',
          message: error.message
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
