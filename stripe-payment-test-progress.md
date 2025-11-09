# Testing Sistema de Pagos - Ink & Soul

## Test Plan
**Website Type**: MPA (Multi-Page Application)
**Deployed URL**: https://1a3ujjc1eeuf.space.minimax.io
**Test Date**: 2025-11-01 15:56
**Focus**: Sistema completo de pagos Stripe

### Pathways Críticos a Testear
- [ ] 1. Navegación y visualización de productos (Tienda)
- [ ] 2. Sistema de carrito (Añadir, editar, eliminar productos)
- [ ] 3. Flujo de checkout completo
- [ ] 4. Integración con Stripe (formulario de pago)
- [ ] 5. Confirmación de pago exitoso
- [ ] 6. Verificación de órdenes en base de datos

## Infraestructura Desplegada

### Edge Functions ✅
- create-payment-intent: https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/create-payment-intent
- confirm-payment: https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/confirm-payment
- get-orders: https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/get-orders
- stripe-webhook: https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/stripe-webhook

### Base de Datos ✅
- Tabla orders creada
- Tabla order_items creada

## Testing Progress

### Step 2: Comprehensive Testing
**Status**: Iniciando...

---
**Testing Sessions**
