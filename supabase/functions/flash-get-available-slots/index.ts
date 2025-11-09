// Edge Function: flash-get-available-slots
// Obtener slots disponibles para un evento y diseño específico

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get('eventId');
    const designId = url.searchParams.get('designId');
    const date = url.searchParams.get('date'); // YYYY-MM-DD format

    if (!eventId) {
      throw new Error('eventId es requerido');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Construir query para slots
    let slotsQuery = `${supabaseUrl}/rest/v1/flash_slots?event_id=eq.${eventId}&taken=eq.false`;
    
    if (designId) {
      slotsQuery += `&design_id=eq.${designId}`;
    }
    
    if (date) {
      slotsQuery += `&slot_date=eq.${date}`;
    }

    slotsQuery += '&order=slot_date.asc,start_time.asc';

    const slotsResponse = await fetch(slotsQuery, {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey
      }
    });

    const slots = await slotsResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        data: slots
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error en flash-get-available-slots:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'FLASH_SLOTS_ERROR',
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
