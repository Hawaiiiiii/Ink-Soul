// Edge Function: appointment-notification
// Procesa notificaciones de solicitudes de citas

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface AppointmentFormData {
  name: string
  email: string
  phone: string
  design: string
  size: string
  placement: string
  date: string
  time: string
  message?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const appointmentData = await req.json() as AppointmentFormData
    const { name, email, phone, design, size, placement, date, time, message } = appointmentData

    // Validar datos requeridos
    if (!name || !email || !phone || !design || !size || !placement || !date || !time) {
      throw new Error('Todos los campos obligatorios deben ser completados')
    }

    // Formatear fecha legible
    const fechaFormateada = new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Formatear contenido para el email
    const contenidoHtml = `
      <div style="background-color: #0b0b0b; padding: 20px; border-radius: 8px; border-left: 4px solid #C6A45D;">
        <p style="margin: 0 0 15px 0; color: #EAE6DA; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
          Detalles de la solicitud de cita:
        </p>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #C6A45D; font-weight: 600; width: 140px;">Nombre:</td>
            <td style="padding: 8px 0; color: #EAE6DA;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #C6A45D; font-weight: 600;">Email:</td>
            <td style="padding: 8px 0; color: #EAE6DA;">
              <a href="mailto:${email}" style="color: #C6A45D; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #C6A45D; font-weight: 600;">Teléfono:</td>
            <td style="padding: 8px 0; color: #EAE6DA;">
              <a href="tel:${phone}" style="color: #C6A45D; text-decoration: none;">${phone}</a>
            </td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
          <p style="margin: 0 0 10px 0; color: #C6A45D; font-weight: 600;">Detalles del tatuaje:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #C6A45D; font-weight: 600; width: 140px;">Diseño:</td>
              <td style="padding: 8px 0; color: #EAE6DA;">${design}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #C6A45D; font-weight: 600;">Tamaño:</td>
              <td style="padding: 8px 0; color: #EAE6DA;">${size}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #C6A45D; font-weight: 600;">Ubicación:</td>
              <td style="padding: 8px 0; color: #EAE6DA;">${placement}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #1a1a1a; border-radius: 6px;">
          <p style="margin: 0 0 5px 0; color: #C6A45D; font-weight: 600;">Fecha y hora solicitada:</p>
          <p style="margin: 0; color: #EAE6DA; font-size: 16px; font-weight: 600;">
            ${fechaFormateada} a las ${time}
          </p>
        </div>
        
        ${message ? `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
          <p style="margin: 0 0 10px 0; color: #C6A45D; font-weight: 600;">Mensaje adicional:</p>
          <p style="margin: 0; color: #EAE6DA; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        ` : ''}
      </div>
    `

    // Llamar a send-notification
    const { data: notificationResult, error: notificationError } = await supabase.functions.invoke(
      'send-notification',
      {
        body: {
          tipo: 'cita',
          asunto: `Nueva solicitud de cita de ${name}`,
          contenido: contenidoHtml,
          datosExtra: {
            nombre: name,
            email: email,
            telefono: phone,
            diseno: design,
            tamano: size,
            ubicacion: placement,
            fecha: date,
            hora: time,
            mensaje: message,
            fechaSolicitud: new Date().toISOString()
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
        message: 'Solicitud de cita recibida y notificación enviada',
        data: notificationResult
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error en appointment-notification:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'APPOINTMENT_NOTIFICATION_ERROR',
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
