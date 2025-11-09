# INSTRUCCIONES RÁPIDAS: De Demo a Producción
# Ejecutar cuando tengas las credenciales de Supabase y Stripe

## 📋 REQUISITOS PREVIOS

Necesitas tener:
- [ ] SUPABASE_URL (ej: https://abcdefgh.supabase.co)
- [ ] SUPABASE_ANON_KEY (ej: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
- [ ] SUPABASE_SERVICE_ROLE_KEY (para edge functions)
- [ ] STRIPE_PUBLISHABLE_KEY (ej: pk_test_...)
- [ ] STRIPE_SECRET_KEY (ej: sk_test_...)

---

## ⚡ SETUP RÁPIDO (5 pasos)

### PASO 1: Configurar Base de Datos en Supabase

```bash
# Ve a: https://app.supabase.com/project/TU_PROJECT/sql/new
# Copia y pega COMPLETO el contenido de estos archivos:

# 1. Primero ejecutar schema:
cat /workspace/supabase_database_schema_complete.sql

# 2. Luego ejecutar productos:
cat /workspace/supabase_complete_products_setup.sql
```

Verificar en SQL Editor:
```sql
SELECT COUNT(*) FROM products; -- Debe retornar 15
SELECT * FROM products ORDER BY category, name;
```

---

### PASO 2: Deploy Edge Functions

```bash
# Instalar Supabase CLI (si no lo tienes)
brew install supabase/tap/supabase  # macOS
# o
scoop install supabase  # Windows

# Autenticar y vincular
cd /workspace
supabase login
supabase link --project-ref TU_PROJECT_REF

# Deploy functions
supabase functions deploy create-payment-intent
supabase functions deploy submit-appointment  
supabase functions deploy send-contact-message

# Configurar secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_XXXXXXXX
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Verificar
supabase secrets list
```

---

### PASO 3: Actualizar Frontend

**A. Crear archivo de entorno**
```bash
cd /workspace/ink-soul-app
cp .env.example .env.local
```

**B. Editar `.env.local`** con tus credenciales:
```env
VITE_SUPABASE_URL=https://TU_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXX
VITE_APP_ENV=production
```

**C. Actualizar `src/lib/supabase.ts`**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const isDemoMode = false  // ← CAMBIAR A FALSE
```

**D. Usar versión de producción de ShopPage**
```bash
cp src/pages/ShopPage_PRODUCTION_READY.tsx src/pages/ShopPage.tsx
```

---

### PASO 4: Build de Producción

```bash
cd /workspace/ink-soul-app

# Instalar dependencias (si no están)
pnpm install

# Build
pnpm run build

# Verificar que no haya errores
echo "Build completado: dist/"
```

---

### PASO 5: Deploy a Producción

```bash
# Opción A: Usando herramienta de deploy (recomendado)
# [Ejecutar desde la interfaz de deploy]

# Opción B: Manual
# Subir carpeta dist/ a tu servidor de hosting
```

---

## ✅ TESTING POST-DEPLOY

### Test 1: Productos desde Supabase
```bash
# Abrir navegador en modo incógnito
# Ir a: https://TU_SITIO.com/shop
# Abrir DevTools Console
# Verificar que NO aparezca: "Loading from JSON"
# Verificar que aparezca: 15 productos
```

### Test 2: Payment Intent
```bash
curl -X POST https://TU_PROJECT.supabase.co/functions/v1/create-payment-intent \
  -H "Authorization: Bearer TU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 45.00,
    "currency": "eur",
    "cartItems": [{
      "product_id": "test",
      "product_name": "Test Product",
      "quantity": 1,
      "price": 45.00
    }],
    "customerEmail": "test@example.com"
  }'

# Debe retornar: {"data":{"clientSecret":"pi_...", "orderId":"...", ...}}
```

### Test 3: Compra Completa
1. Ir a la tienda
2. Click en "Comprar" en cualquier producto
3. Debe aparecer formulario de pago (no alert de demo)
4. Usar tarjeta test de Stripe: `4242 4242 4242 4242`
5. Verificar en Supabase Dashboard → Table Editor → orders
6. Debe aparecer nueva orden con status "pending"

---

## 🐛 TROUBLESHOOTING

### Error: "Failed to fetch products"
```bash
# Verificar en Supabase Dashboard:
# 1. SQL Editor → SELECT * FROM products;
# 2. RLS Policies están activas
# 3. ANON_KEY es correcta
```

### Error: "Stripe API error"
```bash
# Verificar:
supabase secrets list
# Debe mostrar STRIPE_SECRET_KEY

# Revisar logs:
supabase functions logs create-payment-intent
```

### Error: "CORS"
```bash
# Las Edge Functions ya tienen CORS configurado
# Si persiste, verificar que la URL sea correcta
```

---

## 📊 MONITOREO POST-PRODUCCIÓN

### Logs de Edge Functions
```bash
supabase functions logs create-payment-intent --tail
supabase functions logs submit-appointment --tail
```

### Revisar Órdenes
```sql
-- En Supabase SQL Editor
SELECT 
  id,
  total_amount,
  status,
  customer_email,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;
```

### Revisar Products Stock
```sql
SELECT 
  name,
  category,
  stock,
  price
FROM products
WHERE stock < 10
ORDER BY stock ASC;
```

---

## 🚀 OPCIONAL: Mejoras Futuras

1. **Stripe Checkout Page**
   - Implementar checkout completo con Stripe Elements
   - Añadir formulario de dirección de envío
   - Confirmar pago automáticamente

2. **Email Notifications**
   - Confirmar orden por email
   - Notificar al admin de nuevas órdenes

3. **Admin Dashboard**
   - Panel para gestionar productos
   - Ver órdenes y estadísticas
   - Actualizar stock

4. **Webhooks de Stripe**
   - Escuchar eventos de pago
   - Actualizar estado de orden automáticamente
   - Manejo de reembolsos

---

## 📞 SOPORTE

Si encuentras problemas:
1. Revisar logs de Supabase Functions
2. Verificar configuración de RLS
3. Contactar:
   - Email: ink&soul@gmail.com
   - WhatsApp: +34605239673

---

**TIEMPO TOTAL ESTIMADO**: 20-30 minutos

**PREREQUISITO**: Tener todas las credenciales a mano

**RESULTADO**: Tienda online 100% funcional con pagos reales
