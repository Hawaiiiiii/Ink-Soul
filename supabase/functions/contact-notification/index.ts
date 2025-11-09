// Edge Function: contact-notification
// Procesa notificaciones de formulario de contacto

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const formData = await req.json() as ContactFormData
    const { name, email, subject, message } = formData

    // Validar datos
    if (!name || !email || !subject || !message) {
      throw new Error('Todos los campos son requeridos')
    }

    // Formatear contenido para el email
    const contenidoHtml = `
      <div style="background-color: #0b0b0b; padding: 20px; border-radius: 8px; border-left: 4px solid #C6A45D;">
        <p style="margin: 0 0 15px 0; color: #EAE6DA; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
          Datos del contacto:
        </p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #C6A45D; font-weight: 600; width: 120px;">Nombre:</td>
            <td style="padding: 8px 0; color: #EAE6DA;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #C6A45D; font-weight: 600;">Email:</td>
            <td style="padding: 8px 0; color: #EAE6DA;">
              <a href="mailto:${email}" style="color: #C6A45D; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #C6A45D; font-weight: 600;">Asunto:</td>
            <td style="padding: 8px 0; color: #EAE6DA;">${subject}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
          <p style="margin: 0 0 10px 0; color: #C6A45D; font-weight: 600;">Mensaje:</p>
          <p style="margin: 0; color: #EAE6DA; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `

    // Llamar a send-notification
    const { data: notificationResult, error: notificationError } = await supabase.functions.invoke(
      'send-notification',
      {
        body: {
          tipo: 'consulta',
          asunto: `Nueva consulta: ${subject}`,
          contenido: contenidoHtml,
          datosExtra: {
            nombre: name,
            email: email,
            asunto: subject,
            mensaje: message,
            fecha: new Date().toISOString()
          }
        }
      }
    )

    if (notificationError) {
      throw notificationError
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Consulta recibida y notificación enviada',
        data: notificationResult
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error en contact-notification:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'CONTACT_NOTIFICATION_ERROR',
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
