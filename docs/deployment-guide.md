# Guía de Deployment - Sistema de Pagos Stripe

## Requisitos Previos

### Credenciales Necesarias

1. **Stripe Keys** (obtener de https://dashboard.stripe.com/apikeys):
   - `STRIPE_PUBLISHABLE_KEY`: pk_test_... (para frontend)
   - `STRIPE_SECRET_KEY`: sk_test_... (para Edge Functions)
   - `STRIPE_WEBHOOK_SECRET`: whsec_... (se genera al configurar webhook)

2. **Supabase** (ya configurado):
   - URL: https://enitsirdzrsqtgjksctk.supabase.co
   - Anon Key: Configurada
   - Service Role Key: Configurada

## Paso 1: Configurar Variables de Entorno

### Frontend (.env)
```bash
cd /workspace/ink-soul-app
echo "VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY" >> .env
```

### Edge Functions (Supabase Secrets)
Las siguientes variables se configuran automáticamente durante el deployment:
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

## Paso 2: Desplegar Edge Functions

```bash
cd /workspace

# Deploy todas las Edge Functions con secrets
# Las functions se deployarán con las credenciales proporcionadas
```

Edge Functions a desplegar:
1. `create-payment-intent` - Crear intención de pago
2. `confirm-payment` - Confirmar pago
3. `get-orders` - Obtener órdenes
4. `stripe-webhook` - Webhook de Stripe

## Paso 3: Configurar Webhook en Stripe Dashboard

### 3.1 Obtener URL del Webhook
Después del deployment, la URL será:
```
https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/stripe-webhook
```

### 3.2 En Stripe Dashboard
1. Ir a: https://dashboard.stripe.com/webhooks
2. Click en "Add endpoint"
3. URL del endpoint: `https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/stripe-webhook`
4. Seleccionar eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
5. Click "Add endpoint"
6. Copiar el "Signing secret" (whsec_...)
7. Configurar como variable de entorno `STRIPE_WEBHOOK_SECRET`

## Paso 4: Build y Deploy Frontend

```bash
cd /workspace/ink-soul-app

# Build de producción
pnpm run build

# Deploy (se ejecutará automáticamente)
```

## Paso 5: Testing End-to-End

### 5.1 Tarjetas de Prueba
Usar en modo test:

**Pago Exitoso:**
- Número: 4242 4242 4242 4242
- Fecha: Cualquier fecha futura (e.g., 12/25)
- CVC: Cualquier 3 dígitos (e.g., 123)

**Pago Rechazado:**
- Número: 4000 0000 0000 0002

**3D Secure (autenticación):**
- Número: 4000 0025 0000 3155

### 5.2 Flujo de Prueba Completo
1. ✅ Navegar a la tienda
2. ✅ Añadir productos al carrito
3. ✅ Ir a checkout
4. ✅ Completar información de envío
5. ✅ Ingresar tarjeta de prueba
6. ✅ Confirmar pago
7. ✅ Verificar redirección a página de éxito
8. ✅ Verificar orden en base de datos
9. ✅ Verificar webhook recibido en Stripe Dashboard

### 5.3 Verificación de Base de Datos
```sql
-- Ver últimas órdenes
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Ver items de una orden específica
SELECT * FROM order_items WHERE order_id = 'UUID_DE_ORDEN';

-- Ver órdenes por estado
SELECT status, COUNT(*) FROM orders GROUP BY status;
```

## Paso 6: Monitoreo

### Logs de Edge Functions
Acceder en: Supabase Dashboard → Edge Functions → Logs

### Transacciones de Stripe
Ver en: https://dashboard.stripe.com/payments

### Webhooks de Stripe
Verificar en: https://dashboard.stripe.com/webhooks
- Estado de entrega
- Eventos recibidos
- Intentos fallidos

## Troubleshooting

### Error: "Stripe secret key not configured"
**Solución:** Verificar que STRIPE_SECRET_KEY esté configurada en Supabase

### Error: "Invalid signature" en webhook
**Solución:** 
1. Verificar que STRIPE_WEBHOOK_SECRET sea correcta
2. Asegurar que la URL del webhook en Stripe sea exacta
3. Revisar que los eventos seleccionados sean correctos

### Pago procesado pero orden no actualizada
**Solución:**
1. Verificar logs del webhook
2. Comprobar que el webhook esté recibiendo eventos
3. Revisar permisos de Supabase Service Role Key

### Carrito no se limpia después del pago
**Solución:**
1. Verificar que la redirección a /checkout/success funcione
2. Limpiar localStorage manualmente: `localStorage.removeItem('ink-soul-cart')`

## Seguridad en Producción

### Checklist Pre-Launch
- [ ] Cambiar de claves de test a claves de producción
- [ ] Activar cuenta de Stripe (verificación de negocio)
- [ ] Configurar webhook en modo producción
- [ ] Habilitar 3D Secure (SCA compliance)
- [ ] Configurar políticas de reembolso
- [ ] Implementar logging y alertas
- [ ] Testing exhaustivo con tarjetas reales
- [ ] Revisar términos y condiciones
- [ ] Configurar email de confirmación
- [ ] Backup de base de datos configurado

### Variables de Entorno Producción
```bash
# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Backend
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Métricas de Éxito

### KPIs a Monitorear
- Tasa de conversión (carritos → compras)
- Valor promedio de orden
- Productos más vendidos
- Tasa de abandono de carrito
- Errores de pago (por tipo)
- Tiempo promedio de checkout

### Queries Útiles
```sql
-- Tasa de conversión diaria
SELECT 
  DATE(created_at) as fecha,
  COUNT(*) as ordenes,
  SUM(total_amount) as ingresos_totales
FROM orders 
WHERE status = 'completed'
GROUP BY DATE(created_at)
ORDER BY fecha DESC;

-- Productos más vendidos
SELECT 
  oi.product_name,
  SUM(oi.quantity) as total_vendido,
  SUM(oi.quantity * oi.price_at_time) as ingresos
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY oi.product_name
ORDER BY total_vendido DESC;
```

## Contacto y Soporte

### Recursos
- Documentación Stripe: https://stripe.com/docs
- Supabase Docs: https://supabase.com/docs
- Estado del sistema: Revisar `/workspace/docs/stripe-integration-status.md`

### Próximos Pasos
1. Proporcionar credenciales de Stripe
2. Ejecutar deployment automático
3. Configurar webhook en Stripe Dashboard
4. Realizar testing completo
5. Go live
