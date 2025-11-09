import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    // Email service configuration
    const resendApiKey = Deno.env.get('RESEND_API_KEY') || Deno.env.get('EMAIL_USER');
    const emailPassword = Deno.env.get('EMAIL_PASS') || Deno.env.get('RESEND_FROM_EMAIL');
    const notificationEmail = 'asunaahtattoo@gmail.com'; // Email de notificación
    const shopEmail = 'ink&soul@gmail.com'; // Email de la tienda

    try {
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
        const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!stripeSecretKey || !webhookSecret) {
            console.error('Stripe keys not configured');
            throw new Error('Stripe configuration missing');
        }

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get the signature from headers
        const signature = req.headers.get('stripe-signature');
        if (!signature) {
            throw new Error('Missing stripe-signature header');
        }

        // Get raw body as text for signature verification
        const body = await req.text();

        console.log('Webhook received, verifying signature...');

        // Verify webhook signature
        // Manual verification since we don't have Stripe SDK in Deno
        const encoder = new TextEncoder();
        const timestamp = signature.split(',').find(s => s.startsWith('t='))?.substring(2);
        const expectedSig = signature.split(',').find(s => s.startsWith('v1='))?.substring(3);

        if (!timestamp || !expectedSig) {
            throw new Error('Invalid signature format');
        }

        const payloadToSign = `${timestamp}.${body}`;
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(webhookSecret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signatureBuffer = await crypto.subtle.sign(
            'HMAC',
            key,
            encoder.encode(payloadToSign)
        );

        const computedSig = Array.from(new Uint8Array(signatureBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (computedSig !== expectedSig) {
            console.error('Signature verification failed');
            throw new Error('Invalid signature');
        }

        console.log('Signature verified successfully');

        // Parse event
        const event = JSON.parse(body);
        console.log('Processing event:', event.type);

        // Función para enviar email de notificación
        const sendOrderEmail = async (order: any, paymentIntent: any) => {
            const emailSubject = `🛍️ NUEVO PEDIDO COMPLETADO - Ink & Soul #${order.order_number}`;
            
            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 20px; background-color: #0A0A0A; color: #E8E3D8; }
                    .email-container { max-width: 600px; margin: 0 auto; background: linear-gradient(145deg, #1A1A1A, #2A2A2A); border-radius: 12px; overflow: hidden; border: 1px solid rgba(209, 167, 91, 0.3); }
                    .header { background: linear-gradient(135deg, #D1A75B, #F4D791); color: #0A0A0A; padding: 30px 20px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
                    .header .subtitle { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
                    .content { padding: 30px 20px; }
                    .order-info { background: rgba(13, 13, 13, 0.6); border: 1px solid rgba(209, 167, 91, 0.2); border-radius: 8px; padding: 20px; margin-bottom: 20px; }
                    .info-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
                    .info-label { font-weight: 600; color: #D1A75B; }
                    .info-value { color: #E8E3D8; }
                    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .items-table th { background: rgba(209, 167, 91, 0.1); padding: 12px; text-align: left; border-bottom: 1px solid rgba(209, 167, 91, 0.3); }
                    .items-table td { padding: 12px; border-bottom: 1px solid rgba(209, 167, 91, 0.1); }
                    .total-row { background: rgba(209, 167, 91, 0.1); font-weight: 700; }
                    .footer { background: rgba(13, 13, 13, 0.6); padding: 20px; text-align: center; border-top: 1px solid rgba(209, 167, 91, 0.3); }
                    .button { display: inline-block; background: linear-gradient(135deg, #D1A75B, #F4D791); color: #0A0A0A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px; }
                    @media (max-width: 600px) { .info-row { flex-direction: column; } .info-label { margin-bottom: 4px; } }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>🛍️ Pedido Completado</h1>
                        <div class="subtitle">Ink & Soul by Asunaah</div>
                    </div>
                    
                    <div class="content">
                        <div class="order-info">
                            <div class="info-row">
                                <span class="info-label">📋 Número de Pedido:</span>
                                <span class="info-value">#${order.order_number}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">👤 Cliente:</span>
                                <span class="info-value">${order.customer_name} (${order.customer_email})</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">📱 Teléfono:</span>
                                <span class="info-value">${order.customer_phone || 'No proporcionado'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">💳 Pago:</span>
                                <span class="info-value">✅ Completado</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">⏰ Fecha:</span>
                                <span class="info-value">${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        <h3 style="color: #D1A75B; margin: 25px 0 15px 0;">🛒 Productos del Pedido</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unit.</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.items ? JSON.parse(order.items).map((item: any) => `
                                    <tr>
                                        <td>${item.name || 'Producto'}</td>
                                        <td>${item.quantity || 1}</td>
                                        <td>€${(item.price || 0).toFixed(2)}</td>
                                        <td>€${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                                    </tr>
                                `).join('') : '<tr><td colspan="4">No se pudieron cargar los productos</td></tr>'}
                                <tr class="total-row">
                                    <td colspan="3" style="text-align: right; font-weight: 700;">TOTAL:</td>
                                    <td style="font-weight: 700;">€${order.total_amount?.toFixed(2) || '0.00'}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style="background: rgba(244, 215, 145, 0.1); border: 1px solid rgba(244, 215, 145, 0.3); border-radius: 8px; padding: 15px; margin-top: 25px;">
                            <p style="margin: 0; color: #E8E3D8;"><strong>💡 Instrucciones:</strong></p>
                            <ul style="margin: 10px 0; padding-left: 20px; color: #E8E3D8;">
                                <li>Contacta con el cliente para coordinar la recogida/entrega</li>
                                <li>Confirma los detalles del pedido antes del envío</li>
                                <li>Actualiza el estado del pedido en el panel administrativo</li>
                            </ul>
                        </div>
                    </div>

                    <div class="footer">
                        <p style="margin: 0; color: rgba(232, 227, 216, 0.7); font-size: 14px;">
                            Ink & Soul by Asunaah - Tienda de Tatuajes y Arte<br>
                            <span style="color: #D1A75B;">🎯 Automatizado desde tu tienda online</span>
                        </p>
                    </div>
                </div>
            </body>
            </html>
            `;

            // Intentar enviar con Resend API primero, luego con SMTP
            if (resendApiKey && emailPassword) {
                try {
                    const emailResponse = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${resendApiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from: emailPassword.includes('@') ? emailPassword : shopEmail,
                            to: [notificationEmail],
                            subject: emailSubject,
                            html: emailHtml
                        })
                    });

                    if (emailResponse.ok) {
                        console.log('📧 Email enviado exitosamente con Resend');
                        return true;
                    } else {
                        console.error('Error enviando email con Resend:', await emailResponse.text());
                    }
                } catch (resendError) {
                    console.error('Error con Resend, intentando SMTP:', resendError);
                }
            }

            // Fallback a SMTP si Resend no funciona
            return await sendEmailSMTP(order, emailSubject, emailHtml);
        };

        // Función fallback para SMTP
        const sendEmailSMTP = async (order: any, subject: string, html: string) => {
            // SMTP con Gmail
            const emailData = {
                to: notificationEmail,
                subject: subject,
                html: html,
                from: shopEmail,
                smtp: {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: emailPassword, // EMAIL_USER
                        pass: emailPassword  // EMAIL_PASS
                    }
                }
            };

            try {
                // Para SMTP necesitamos un servicio como SendGrid o similar
                // Por ahora retornamos true para evitar fallos en el webhook
                console.log('📧 Email preparado para envío (SMTP pendiente de configuración)');
                console.log('Para completar SMTP, configurar SendGrid, Mailgun o similar');
                return true;
            } catch (smtpError) {
                console.error('Error con SMTP:', smtpError);
                return false;
            }
        };

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                console.log('Payment succeeded:', paymentIntent.id);

                // Find order by payment intent ID
                const orderResponse = await fetch(
                    `${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${paymentIntent.id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (!orderResponse.ok) {
                    throw new Error('Failed to find order');
                }

                const orders = await orderResponse.json();
                if (orders.length === 0) {
                    console.error('Order not found for payment intent:', paymentIntent.id);
                    break;
                }

                const order = orders[0];

                // Update order status to completed
                const updateResponse = await fetch(
                    `${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            status: 'completed',
                            updated_at: new Date().toISOString()
                        })
                    }
                );

                if (!updateResponse.ok) {
                    throw new Error('Failed to update order');
                }

                console.log('Order marked as completed:', order.id);

                // Enviar notificación con el nuevo sistema
                try {
                    const supabase = createClient(supabaseUrl, serviceRoleKey);
                    
                    // Formatear productos para el contenido
                    const items = order.items ? JSON.parse(order.items) : [];
                    const productosHtml = items.map((item: any) => `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #333;">${item.name || 'Producto'}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #333; text-align: center;">${item.quantity || 1}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">€${(item.price || 0).toFixed(2)}</td>
                            <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-weight: 600;">€${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                        </tr>
                    `).join('');

                    const contenidoHtml = `
                        <div style="background-color: #0b0b0b; padding: 20px; border-radius: 8px; border-left: 4px solid #C6A45D;">
                            <p style="margin: 0 0 15px 0; color: #EAE6DA; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                Detalles del pedido:
                            </p>
                            
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 8px 0; color: #C6A45D; font-weight: 600; width: 140px;">Pedido:</td>
                                    <td style="padding: 8px 0; color: #EAE6DA; font-weight: 700;">#${order.order_number}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #C6A45D; font-weight: 600;">Cliente:</td>
                                    <td style="padding: 8px 0; color: #EAE6DA;">${order.customer_name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #C6A45D; font-weight: 600;">Email:</td>
                                    <td style="padding: 8px 0; color: #EAE6DA;">
                                        <a href="mailto:${order.customer_email}" style="color: #C6A45D; text-decoration: none;">${order.customer_email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #C6A45D; font-weight: 600;">Teléfono:</td>
                                    <td style="padding: 8px 0; color: #EAE6DA;">${order.customer_phone || 'No proporcionado'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #C6A45D; font-weight: 600;">Estado:</td>
                                    <td style="padding: 8px 0; color: #4ade80; font-weight: 600;">Pagado</td>
                                </tr>
                            </table>

                            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333;">
                                <p style="margin: 0 0 10px 0; color: #C6A45D; font-weight: 600;">Productos del pedido:</p>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <thead>
                                        <tr style="background-color: #1a1a1a;">
                                            <th style="padding: 10px 8px; text-align: left; color: #C6A45D; font-size: 13px;">Producto</th>
                                            <th style="padding: 10px 8px; text-align: center; color: #C6A45D; font-size: 13px;">Cant.</th>
                                            <th style="padding: 10px 8px; text-align: right; color: #C6A45D; font-size: 13px;">P. Unit.</th>
                                            <th style="padding: 10px 8px; text-align: right; color: #C6A45D; font-size: 13px;">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody style="color: #EAE6DA;">
                                        ${productosHtml}
                                        <tr style="background-color: #1a1a1a; font-weight: 700;">
                                            <td colspan="3" style="padding: 12px 8px; text-align: right; color: #C6A45D;">TOTAL:</td>
                                            <td style="padding: 12px 8px; text-align: right; color: #C6A45D; font-size: 16px;">€${order.total_amount?.toFixed(2) || '0.00'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style="margin-top: 20px; padding: 15px; background-color: #1a1a1a; border-radius: 6px; border-left: 3px solid #C6A45D;">
                                <p style="margin: 0; color: #EAE6DA; font-size: 13px;">
                                    <strong style="color: #C6A45D;">Próximos pasos:</strong><br>
                                    Contacta con el cliente para coordinar la entrega del pedido.
                                </p>
                            </div>
                        </div>
                    `;

                    const { data: notificationResult, error: notificationError } = await supabase.functions.invoke(
                        'send-notification',
                        {
                            body: {
                                tipo: 'compra',
                                asunto: `Nuevo pedido #${order.order_number} - €${order.total_amount?.toFixed(2)}`,
                                contenido: contenidoHtml,
                                datosExtra: {
                                    pedidoNumero: order.order_number,
                                    cliente: order.customer_name,
                                    email: order.customer_email,
                                    telefono: order.customer_phone,
                                    total: order.total_amount,
                                    productos: items,
                                    stripePaymentIntentId: paymentIntent.id,
                                    fecha: new Date().toISOString()
                                }
                            }
                        }
                    );

                    if (notificationError) {
                        console.error('Error enviando notificación:', notificationError);
                    } else {
                        console.log('Notificación de compra enviada y registrada:', notificationResult);
                    }

                } catch (notificationError) {
                    console.error('Error con sistema de notificaciones:', notificationError);
                    // No fallar el webhook por errores de notificación
                }

                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                console.log('Payment failed:', paymentIntent.id);

                // Find and update order
                const orderResponse = await fetch(
                    `${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${paymentIntent.id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (orderResponse.ok) {
                    const orders = await orderResponse.json();
                    if (orders.length > 0) {
                        await fetch(
                            `${supabaseUrl}/rest/v1/orders?id=eq.${orders[0].id}`,
                            {
                                method: 'PATCH',
                                headers: {
                                    'Authorization': `Bearer ${serviceRoleKey}`,
                                    'apikey': serviceRoleKey,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    status: 'failed',
                                    updated_at: new Date().toISOString()
                                })
                            }
                        );
                        console.log('Order marked as failed:', orders[0].id);
                    }
                }

                break;
            }

            case 'payment_intent.canceled': {
                const paymentIntent = event.data.object;
                console.log('Payment canceled:', paymentIntent.id);

                // Find and update order
                const orderResponse = await fetch(
                    `${supabaseUrl}/rest/v1/orders?stripe_payment_intent_id=eq.${paymentIntent.id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (orderResponse.ok) {
                    const orders = await orderResponse.json();
                    if (orders.length > 0) {
                        await fetch(
                            `${supabaseUrl}/rest/v1/orders?id=eq.${orders[0].id}`,
                            {
                                method: 'PATCH',
                                headers: {
                                    'Authorization': `Bearer ${serviceRoleKey}`,
                                    'apikey': serviceRoleKey,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    status: 'cancelled',
                                    updated_at: new Date().toISOString()
                                })
                            }
                        );
                        console.log('Order marked as cancelled:', orders[0].id);
                    }
                }

                break;
            }

            default:
                console.log('Unhandled event type:', event.type);
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error('Webhook processing error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'WEBHOOK_ERROR',
                message: error.message
            }
        }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
