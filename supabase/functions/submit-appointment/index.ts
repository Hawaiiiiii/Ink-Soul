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
        const { customer_name, email, phone, project_type, description, body_zone, preferred_date, preferred_time } = await req.json();

        console.log('Appointment submission received:', { customer_name, email, project_type });

        // Validate required parameters
        if (!customer_name || !email) {
            throw new Error('Customer name and email are required');
        }

        // Get environment variables
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        console.log('Environment variables validated, creating appointment...');

        // Create appointment record in database
        const appointmentData = {
            customer_name,
            email,
            phone: phone || null,
            project_type: project_type || null,
            description: description || null,
            body_zone: body_zone || null,
            preferred_date: preferred_date || null,
            preferred_time: preferred_time || null,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        console.log('Inserting appointment into database...');

        const appointmentResponse = await fetch(`${supabaseUrl}/rest/v1/appointment_requests`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(appointmentData)
        });

        if (!appointmentResponse.ok) {
            const errorText = await appointmentResponse.text();
            console.error('Failed to create appointment:', errorText);
            throw new Error(`Failed to create appointment: ${errorText}`);
        }

        const appointment = await appointmentResponse.json();
        const appointmentId = appointment[0].id;
        console.log('Appointment created successfully:', appointmentId);

        const result = {
            data: {
                success: true,
                appointmentId: appointmentId,
                message: 'Appointment submitted successfully'
            }
        };

        console.log('Appointment submission completed successfully');

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Appointment submission error:', error);

        const errorResponse = {
            error: {
                code: 'APPOINTMENT_SUBMISSION_FAILED',
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
