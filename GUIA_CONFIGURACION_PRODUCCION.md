# Guía de Configuración de Supabase para Producción
# Ink & Soul by Asunaah - Tienda Online

## IMPORTANTE: CONFIGURACIÓN REQUERIDA PARA PRODUCCIÓN

La tienda actualmente usa datos estáticos de un archivo JSON. Para una implementación de producción completa, necesitas configurar Supabase.

---

## Paso 1: Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Guarda las credenciales:
   - **Project URL** (SUPABASE_URL)
   - **Anon/Public Key** (SUPABASE_ANON_KEY)
   - **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY) - para edge functions

---

## Paso 2: Configurar Base de Datos

### 2.1 Crear Esquema y Tablas

1. Ve a SQL Editor en tu proyecto Supabase
2. Ejecuta el archivo completo: `supabase_database_schema_complete.sql`
   - Esto creará las 5 tablas: products, orders, order_items, appointments, contact_messages
   - Configurará todas las políticas RLS (Row Level Security)
   - Creará los índices necesarios

### 2.2 Insertar Productos

1. Después de crear el esquema, ejecuta: `supabase_complete_products_setup.sql`
2. Esto insertará los 15 productos (5 originales + 10 nuevos) en la base de datos

### Verificación
Ejecuta este query para verificar:
```sql
SELECT category, COUNT(*) as total 
FROM products 
GROUP BY category 
ORDER BY category;
```

Deberías ver:
- aftercare: 3 productos
- merchandise: 8 productos
- prints: 4 productos

---

## Paso 3: Configurar Edge Functions

### 3.1 Instalar Supabase CLI
```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### 3.2 Inicializar y Deploy Edge Functions
```bash
cd /workspace

# Autenticarse
supabase login

# Vincular proyecto
supabase link --project-ref TU_PROJECT_REF

# Deploy edge functions
supabase functions deploy submit-appointment
supabase functions deploy send-contact-message
supabase functions deploy create-payment-intent
```

### 3.3 Configurar Secrets para Edge Functions
```bash
# Stripe API Key (necesario para pagos)
supabase secrets set STRIPE_SECRET_KEY=tu_stripe_secret_key_aqui

# Verificar secrets
supabase secrets list
```

---

## Paso 4: Configurar Stripe para Pagos

### 4.1 Crear Cuenta Stripe
1. Ve a https://stripe.com
2. Crea una cuenta
3. Obtén tus API keys (Dashboard → Developers → API Keys):
   - **Publishable Key** (pk_live_... o pk_test_...)
   - **Secret Key** (sk_live_... o sk_test_...)

### 4.2 Configurar Webhook de Stripe (Opcional pero Recomendado)
1. En Stripe Dashboard → Developers → Webhooks
2. Agregar endpoint: `https://TU_PROJECT.supabase.co/functions/v1/stripe-webhook`
3. Eventos a escuchar:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - charge.refunded

---

## Paso 5: Actualizar Frontend

### 5.1 Actualizar Credenciales Supabase
Editar: `/workspace/ink-soul-app/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://TU_PROJECT.supabase.co"
const supabaseAnonKey = "TU_ANON_KEY_AQUI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const isDemoMode = false  // Cambiar a false
```

### 5.2 Actualizar Stripe Publishable Key
Editar: `/workspace/ink-soul-app/src/pages/ShopPage.tsx`

Línea 9:
```typescript
const stripePromise = loadStripe('TU_STRIPE_PUBLISHABLE_KEY_AQUI')
```

### 5.3 Rebuild y Redeploy
```bash
cd /workspace/ink-soul-app
pnpm run build
# Luego usa la herramienta de deploy
```

---

## Paso 6: Testing de Producción

### 6.1 Verificar Base de Datos
```sql
-- Ver todos los productos
SELECT id, name, price, category, stock FROM products ORDER BY category, name;

-- Verificar políticas RLS
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

### 6.2 Test Edge Functions
```bash
# Test submit-appointment
curl -X POST https://TU_PROJECT.supabase.co/functions/v1/submit-appointment \
  -H "Authorization: Bearer TU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "email": "test@example.com",
    "phone": "+34600000000",
    "project_type": "devocional",
    "description": "Test appointment",
    "preferred_date": "2025-12-01"
  }'

# Test create-payment-intent
curl -X POST https://TU_PROJECT.supabase.co/functions/v1/create-payment-intent \
  -H "Authorization: Bearer TU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 45.00,
    "currency": "eur",
    "cartItems": [{"product_id": "test-id", "quantity": 1, "price": 45}],
    "customerEmail": "test@example.com"
  }'
```

### 6.3 Test Frontend en Producción
1. Visitar la tienda online
2. Verificar que los productos se cargan desde Supabase (no JSON)
3. Probar filtros de categorías
4. Intentar compra de prueba (usar tarjeta de test Stripe: 4242 4242 4242 4242)

---

## Checklist de Producción

- [ ] Proyecto Supabase creado
- [ ] Base de datos configurada (schema + productos)
- [ ] Edge Functions desplegadas
- [ ] Secrets configurados (Stripe)
- [ ] Frontend actualizado con credenciales reales
- [ ] Sitio web rebuildeado y redesployado
- [ ] Tests de edge functions exitosos
- [ ] Test de compra completo (end-to-end)
- [ ] Verificación de RLS policies
- [ ] Monitoring configurado (opcional)

---

## Archivos de Referencia

- `/workspace/supabase_database_schema_complete.sql` - Schema completo
- `/workspace/supabase_complete_products_setup.sql` - Solo productos
- `/workspace/supabase/functions/` - Edge functions
- `/workspace/ink-soul-app/src/lib/supabase.ts` - Cliente Supabase
- `/workspace/ink-soul-app/src/pages/ShopPage.tsx` - Página de tienda

---

## Soporte

Para problemas con:
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Edge Functions**: https://supabase.com/docs/guides/functions

---

## Notas Importantes

1. **Modo Demo vs Producción**: Actualmente en modo demo (isDemoMode = true). Cambiar a false después de configurar credenciales.

2. **Seguridad**: 
   - NUNCA commitear API keys al repositorio
   - Usar variables de entorno
   - Service Role Key solo en backend (edge functions)

3. **Testing**:
   - Usar modo test de Stripe inicialmente
   - Verificar RLS policies antes de producción
   - Probar todos los flujos de usuario

4. **Backups**:
   - Supabase hace backups automáticos
   - Exportar datos periódicamente para seguridad adicional
