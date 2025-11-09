// Edge Function: flash-confirm-booking
// Procesar webhook de Stripe y confirmar booking flash tattoo

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const resendFrom = Deno.env.get('RESEND_FROM') || 'Ink & Soul <notifications@resend.dev>';
    const notifyTo1 = Deno.env.get('NOTIFY_TO_1') || 'inkandsoul@gmail.com';
    const notifyTo2 = Deno.env.get('NOTIFY_TO_2') || 'daviderikgarciaarenas@gmail.com';

    const payload = await req.json();

    // Verificar que sea un evento de payment_intent.succeeded
    if (payload.type !== 'payment_intent.succeeded') {
      return new Response(
        JSON.stringify({ received: true, message: 'Event type not handled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paymentIntent = payload.data.object;
    const paymentIntentId = paymentIntent.id;

    console.log('Procesando pago exitoso:', paymentIntentId);

    // 1. Buscar el booking asociado
    const bookingResponse = await fetch(
      `${supabaseUrl}/rest/v1/flash_bookings?stripe_payment_intent_id=eq.${paymentIntentId}`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    const bookings = await bookingResponse.json();
    if (!bookings || bookings.length === 0) {
      console.error('Booking no encontrado para payment intent:', paymentIntentId);
      return new Response(
        JSON.stringify({ received: true, error: 'Booking not found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const booking = bookings[0];

    // 2. Actualizar booking a confirmed
    await fetch(`${supabaseUrl}/rest/v1/flash_bookings?id=eq.${booking.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'confirmed' })
    });

    // 3. Marcar slot como taken
    if (booking.slot_id) {
      await fetch(`${supabaseUrl}/rest/v1/flash_slots?id=eq.${booking.slot_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          taken: true,
          booking_id: booking.id
        })
      });
    }

    // 4. Decrementar stock del diseño
    const designResponse = await fetch(
      `${supabaseUrl}/rest/v1/flash_designs?id=eq.${booking.design_id}`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    const designs = await designResponse.json();
    if (designs && designs.length > 0) {
      const design = designs[0];
      await fetch(`${supabaseUrl}/rest/v1/flash_designs?id=eq.${booking.design_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: Math.max(0, design.stock - 1) })
      });
    }

    // 5. Obtener información completa para emails
    const eventResponse = await fetch(
      `${supabaseUrl}/rest/v1/flash_events?id=eq.${booking.event_id}`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    const events = await eventResponse.json();
    const event = events && events.length > 0 ? events[0] : null;

    // 6. Enviar emails de confirmación
    if (resendApiKey) {
      try {
        // Email al cliente
        const clientEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"></head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0b0b0b;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1a1a1a; border: 1px solid #C6A45D; border-radius: 8px;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0b0b0b 0%, #1a1a1a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #C6A45D;">
                        <h1 style="margin: 0; color: #C6A45D; font-size: 28px;">Ink & Soul</h1>
                        <p style="margin: 8px 0 0 0; color: #EAE6DA; font-size: 12px; text-transform: uppercase;">by Asunaah</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px;">
                        <h2 style="color: #C6A45D; margin: 0 0 20px 0;">Reserva Confirmada</h2>
                        <p style="color: #EAE6DA; line-height: 1.6;">Hola ${booking.client_name},</p>
                        <p style="color: #EAE6DA; line-height: 1.6;">Tu reserva de flash tattoo ha sido confirmada exitosamente.</p>
                        <div style="background-color: #0b0b0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
                          <p style="color: #C6A45D; margin: 0 0 10px 0;"><strong>Detalles de tu reserva:</strong></p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Evento: ${event ? event.title : 'Flash Tattoo'}</p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Tamaño: ${booking.size}</p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Zona: ${booking.zone}</p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Color: ${booking.with_color ? 'Sí' : 'No'}</p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Total: ${(booking.price_total / 100).toFixed(2)}€</p>
                        </div>
                        <p style="color: #EAE6DA; line-height: 1.6;">Te esperamos en el estudio. Cualquier duda, contáctanos por WhatsApp o email.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #0b0b0b; padding: 20px; text-align: center; border-top: 1px solid #333;">
                        <p style="margin: 0; color: #888; font-size: 12px;">Ink & Soul · Fineline Tattooing</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [booking.client_email],
            subject: `[Ink & Soul] Confirmación de Flash Tattoo - ${booking.client_name}`,
            html: clientEmailHtml
          })
        });

        // Email al estudio
        const studioEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"></head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0b0b0b;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; width: 100%; background-color: #1a1a1a; border: 1px solid #C6A45D; border-radius: 8px;">
                    <tr>
                      <td style="padding: 30px;">
                        <h2 style="color: #C6A45D; margin: 0 0 20px 0;">Nueva Reserva Flash Tattoo</h2>
                        <div style="background-color: #0b0b0b; padding: 20px; border-radius: 8px;">
                          <p style="color: #C6A45D; margin: 0 0 10px 0;"><strong>Cliente:</strong></p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Nombre: ${booking.client_name}</p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Email: ${booking.client_email}</p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Teléfono: ${booking.client_phone || 'No proporcionado'}</p>
                          <hr style="border: 0; border-top: 1px solid #333; margin: 15px 0;">
                          <p style="color: #C6A45D; margin: 0 0 10px 0;"><strong>Reserva:</strong></p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Tamaño: ${booking.size}</p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Zona: ${booking.zone}</p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Color: ${booking.with_color ? 'Sí' : 'No'}</p>
                          <p style="color: #EAE6DA; margin: 5px 0;">Total: ${(booking.price_total / 100).toFixed(2)}€</p>
                          ${booking.notes ? `<p style="color: #EAE6DA; margin: 5px 0;">Notas: ${booking.notes}</p>` : ''}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [notifyTo1, notifyTo2],
            subject: `[Ink & Soul] Nueva Reserva Flash - ${booking.client_name}`,
            html: studioEmailHtml
          })
        });

        console.log('Emails enviados exitosamente');

      } catch (emailError) {
        console.error('Error enviando emails:', emailError);
        // No fallar el proceso si fallan los emails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Booking confirmed successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error en flash-confirm-booking:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'FLASH_CONFIRM_ERROR',
          message: error.message
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
