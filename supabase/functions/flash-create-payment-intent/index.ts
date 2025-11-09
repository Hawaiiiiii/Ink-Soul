// Edge Function: flash-create-payment-intent
// Crear PaymentIntent de Stripe para reserva de flash tattoo

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

interface BookingRequest {
  eventId: string;
  designId: string;
  slotId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  size: 'S' | 'M' | 'L';
  zone: string;
  withColor: boolean;
  notes?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY no configurada');
    }

    const bookingData: BookingRequest = await req.json();

    console.log('Creando payment intent para flash booking:', {
      designId: bookingData.designId,
      size: bookingData.size,
      withColor: bookingData.withColor
    });

    // 1. Verificar disponibilidad del slot
    const slotResponse = await fetch(
      `${supabaseUrl}/rest/v1/flash_slots?id=eq.${bookingData.slotId}&taken=eq.false`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        }
      }
    );

    const slots = await slotResponse.json();
    if (!slots || slots.length === 0) {
      throw new Error('Slot no disponible o ya reservado');
    }

    // 2. Obtener datos del diseño
    const designResponse = await fetch(
      `${supabaseUrl}/rest/v1/flash_designs?id=eq.${bookingData.designId}`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        }
      }
    );

    const designs = await designResponse.json();
    if (!designs || designs.length === 0) {
      throw new Error('Diseño no encontrado');
    }

    const design = designs[0];

    // 3. Verificar stock disponible
    if (design.stock <= 0) {
      throw new Error('Diseño agotado');
    }

    // 4. Calcular precio total
    let priceTotal = design.base_price;
    
    // Añadir extra por color si aplica
    if (bookingData.withColor && design.color_extra) {
      priceTotal += design.color_extra;
    }

    // Validar que el precio sea válido
    if (priceTotal <= 0) {
      throw new Error('Precio inválido');
    }

    console.log('Precio calculado:', {
      base: design.base_price,
      colorExtra: bookingData.withColor ? design.color_extra : 0,
      total: priceTotal
    });

    // 5. Crear payment intent en Stripe
    const stripeParams = new URLSearchParams();
    stripeParams.append('amount', priceTotal.toString());
    stripeParams.append('currency', 'eur');
    stripeParams.append('payment_method_types[]', 'card');
    stripeParams.append('metadata[event_id]', bookingData.eventId);
    stripeParams.append('metadata[design_id]', bookingData.designId);
    stripeParams.append('metadata[slot_id]', bookingData.slotId);
    stripeParams.append('metadata[client_name]', bookingData.clientName);
    stripeParams.append('metadata[client_email]', bookingData.clientEmail);
    stripeParams.append('metadata[size]', bookingData.size);
    stripeParams.append('metadata[zone]', bookingData.zone);
    stripeParams.append('metadata[with_color]', bookingData.withColor.toString());

    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: stripeParams.toString()
    });

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.text();
      console.error('Error de Stripe:', errorData);
      throw new Error(`Error de Stripe: ${errorData}`);
    }

    const paymentIntent = await stripeResponse.json();

    // 6. Crear registro de booking en estado pending
    const bookingRecord = {
      event_id: bookingData.eventId,
      design_id: bookingData.designId,
      slot_id: bookingData.slotId,
      client_name: bookingData.clientName,
      client_email: bookingData.clientEmail,
      client_phone: bookingData.clientPhone || null,
      size: bookingData.size,
      zone: bookingData.zone,
      with_color: bookingData.withColor,
      price_total: priceTotal,
      stripe_payment_intent_id: paymentIntent.id,
      status: 'pending',
      notes: bookingData.notes || null
    };

    const bookingResponse = await fetch(`${supabaseUrl}/rest/v1/flash_bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(bookingRecord)
    });

    if (!bookingResponse.ok) {
      const errorText = await bookingResponse.text();
      console.error('Error creando booking:', errorText);
      
      // Si falla la creación del booking, cancelar el payment intent
      await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntent.id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`
        }
      });
      
      throw new Error(`Error creando booking: ${errorText}`);
    }

    const booking = await bookingResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          bookingId: booking[0].id,
          priceTotal: priceTotal
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error en flash-create-payment-intent:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'FLASH_PAYMENT_INTENT_ERROR',
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
