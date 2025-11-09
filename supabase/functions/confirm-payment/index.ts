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
        const { paymentIntentId, orderId } = await req.json();

        console.log('Confirm payment request received:', { paymentIntentId, orderId });

        // Validate required parameters
        if (!paymentIntentId) {
            throw new Error('Payment Intent ID is required');
        }

        if (!orderId) {
            throw new Error('Order ID is required');
        }

        // Get environment variables
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!stripeSecretKey) {
            console.error('Stripe secret key not found in environment');
            throw new Error('Stripe secret key not configured');
        }

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        console.log('Retrieving payment intent from Stripe...');

        // Retrieve payment intent from Stripe
        const stripeResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${stripeSecretKey}`,
            }
        });

        if (!stripeResponse.ok) {
            const errorData = await stripeResponse.text();
            console.error('Stripe API error:', errorData);
            throw new Error(`Failed to retrieve payment intent: ${errorData}`);
        }

        const paymentIntent = await stripeResponse.json();
        console.log('Payment intent retrieved:', paymentIntent.id, 'Status:', paymentIntent.status);

        // Determine order status based on payment intent status
        let orderStatus = 'pending';
        if (paymentIntent.status === 'succeeded') {
            orderStatus = 'completed';
        } else if (paymentIntent.status === 'processing') {
            orderStatus = 'processing';
        } else if (paymentIntent.status === 'canceled') {
            orderStatus = 'cancelled';
        } else if (paymentIntent.status === 'requires_payment_method') {
            orderStatus = 'failed';
        }

        console.log('Updating order status to:', orderStatus);

        // Update order status in database
        const updateData = {
            status: orderStatus,
            updated_at: new Date().toISOString()
        };

        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error('Failed to update order:', errorText);
            throw new Error(`Failed to update order: ${errorText}`);
        }

        const updatedOrder = await updateResponse.json();
        console.log('Order updated successfully:', orderId);

        const result = {
            data: {
                orderId: orderId,
                paymentIntentId: paymentIntentId,
                status: orderStatus,
                paymentStatus: paymentIntent.status,
                amount: paymentIntent.amount / 100, // Convert from cents
                currency: paymentIntent.currency
            }
        };

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Confirm payment error:', error);

        const errorResponse = {
            error: {
                code: 'CONFIRM_PAYMENT_FAILED',
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
