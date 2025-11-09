Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get query parameters
        const url = new URL(req.url);
        const customerEmail = url.searchParams.get('email');
        const orderId = url.searchParams.get('orderId');
        const limit = url.searchParams.get('limit') || '50';

        console.log('Get orders request:', { customerEmail, orderId, limit });

        let queryUrl = `${supabaseUrl}/rest/v1/orders?select=*,order_items(*)&order=created_at.desc&limit=${limit}`;

        // Filter by email if provided
        if (customerEmail) {
            queryUrl += `&customer_email=eq.${encodeURIComponent(customerEmail)}`;
        }

        // Filter by specific order ID if provided
        if (orderId) {
            queryUrl += `&id=eq.${orderId}`;
        }

        console.log('Fetching orders...');

        const ordersResponse = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        if (!ordersResponse.ok) {
            const errorText = await ordersResponse.text();
            console.error('Failed to fetch orders:', errorText);
            throw new Error(`Failed to fetch orders: ${errorText}`);
        }

        const orders = await ordersResponse.json();
        console.log('Orders retrieved successfully:', orders.length);

        const result = {
            data: {
                orders: orders,
                count: orders.length
            }
        };

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get orders error:', error);

        const errorResponse = {
            error: {
                code: 'GET_ORDERS_FAILED',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
