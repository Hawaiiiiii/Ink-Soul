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
        const { name, email, subject, message } = await req.json();

        console.log('Contact message received:', { name, email, subject });

        // Validate required parameters
        if (!name || !email || !message) {
            throw new Error('Name, email and message are required');
        }

        // Get environment variables
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        console.log('Environment variables validated, creating contact message...');

        // Create contact message record in database
        const contactData = {
            name,
            email,
            subject: subject || null,
            message,
            created_at: new Date().toISOString()
        };

        console.log('Inserting contact message into database...');

        const contactResponse = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(contactData)
        });

        if (!contactResponse.ok) {
            const errorText = await contactResponse.text();
            console.error('Failed to create contact message:', errorText);
            throw new Error(`Failed to create contact message: ${errorText}`);
        }

        const contact = await contactResponse.json();
        const messageId = contact[0].id;
        console.log('Contact message created successfully:', messageId);

        const result = {
            data: {
                success: true,
                messageId: messageId,
                message: 'Contact message sent successfully'
            }
        };

        console.log('Contact message submission completed successfully');

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Contact message submission error:', error);

        const errorResponse = {
            error: {
                code: 'CONTACT_MESSAGE_FAILED',
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
