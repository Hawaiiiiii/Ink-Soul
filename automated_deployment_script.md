# Script de Deployment Automatizado

Este documento describe el flujo de deployment automatizado que se ejecutará una vez se proporcionen las credenciales.

## Variables de Entorno Requeridas

```bash
# Supabase (proporcionadas por coordinador)
SUPABASE_ACCESS_TOKEN="sbp_xxxxx"
SUPABASE_PROJECT_ID="xxxxx"
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_ANON_KEY="eyJhbG..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."

# Stripe (proporcionadas por usuario)
STRIPE_SECRET_KEY="sk_test_51xxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_51xxxxx"

# Google Maps (ya disponible)
GOOGLE_MAPS_API_KEY="AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk"
```

## Secuencia de Comandos

### 1. Crear Tablas (batch_create_tables)
```json
{
  "tables": [
    {
      "table_name": "appointments",
      "columns": "id UUID PRIMARY KEY DEFAULT gen_random_uuid(), customer_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, project_type TEXT, description TEXT, body_zone TEXT, preferred_date DATE, status TEXT DEFAULT 'pending', created_at TIMESTAMP DEFAULT NOW()",
      "description": "Tabla de citas para tatuajes"
    },
    {
      "table_name": "products",
      "columns": "id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, name_en TEXT NOT NULL, description TEXT, description_en TEXT, price DECIMAL NOT NULL, category TEXT, image_url TEXT, stock INTEGER DEFAULT 0, is_limited_edition BOOLEAN DEFAULT FALSE, edition_number TEXT, created_at TIMESTAMP DEFAULT NOW()",
      "description": "Catálogo de productos"
    },
    {
      "table_name": "orders",
      "columns": "id UUID PRIMARY KEY DEFAULT gen_random_uuid(), stripe_payment_intent_id TEXT UNIQUE, status TEXT DEFAULT 'pending', total_amount DECIMAL NOT NULL, currency TEXT DEFAULT 'eur', shipping_address JSONB, billing_address JSONB, customer_email TEXT, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()",
      "description": "Órdenes de compra"
    },
    {
      "table_name": "order_items",
      "columns": "id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_id UUID, product_id UUID, quantity INTEGER NOT NULL, price_at_time DECIMAL NOT NULL, product_name TEXT, product_image_url TEXT, created_at TIMESTAMP DEFAULT NOW()",
      "description": "Items de orden"
    },
    {
      "table_name": "contact_messages",
      "columns": "id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT, message TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW()",
      "description": "Mensajes de contacto"
    }
  ]
}
```

### 2. Aplicar Políticas RLS (apply_migration)
```sql
-- Ejecutar: /workspace/supabase_rls_policies.sql
-- Contenido: ALTER TABLE + CREATE POLICY para cada tabla
```

### 3. Insertar Productos (execute_sql)
```sql
-- Ejecutar: /workspace/supabase_sample_products.sql
-- Inserta 6 productos de ejemplo
```

### 4. Configurar Secrets de Edge Functions
```bash
# En Supabase Dashboard manualmente o vía CLI:
supabase secrets set STRIPE_SECRET_KEY="sk_test_..."
```

### 5. Desplegar Edge Functions (batch_deploy_edge_functions)
```json
{
  "functions": [
    {
      "slug": "submit-appointment",
      "file_path": "/workspace/supabase/functions/submit-appointment/index.ts",
      "type": "normal",
      "description": "Procesar solicitudes de citas de tatuaje"
    },
    {
      "slug": "send-contact-message",
      "file_path": "/workspace/supabase/functions/send-contact-message/index.ts",
      "type": "normal",
      "description": "Guardar mensajes de contacto"
    },
    {
      "slug": "create-payment-intent",
      "file_path": "/workspace/supabase/functions/create-payment-intent/index.ts",
      "type": "normal",
      "description": "Crear intención de pago con Stripe"
    }
  ]
}
```

### 6. Actualizar Credenciales en Frontend

**Archivo 1**: `/workspace/ink-soul-app/src/lib/supabase.ts`
```typescript
const supabaseUrl = "SUPABASE_URL_AQUI"
const supabaseAnonKey = "SUPABASE_ANON_KEY_AQUI"
```

**Archivo 2**: `/workspace/ink-soul-app/src/pages/ShopPage.tsx`
```typescript
const stripePromise = loadStripe('STRIPE_PUBLISHABLE_KEY_AQUI')
```

### 7. Build Frontend
```bash
cd /workspace/ink-soul-app
pnpm build
```

### 8. Desplegar (deploy)
```json
{
  "dist_dir": "/workspace/ink-soul-app/dist",
  "project_name": "ink-soul-by-asunaah",
  "project_type": "WebApps"
}
```

### 9. Testing (test_website)
```json
{
  "url": "DEPLOYMENT_URL",
  "instruction": "Test complete: 1) Navigate to all pages (Home, About, Portfolio, Appointments, Shop, Contact), 2) Change language ES/EN, 3) Test appointment form submission, 4) Test contact form submission, 5) Check products display in Shop, 6) Verify responsive design on mobile viewport"
}
```

## Checklist de Validación Post-Deployment

- [ ] Tablas creadas en Supabase (verificar en Dashboard)
- [ ] Políticas RLS activas (verificar en Table Editor)
- [ ] 6 productos insertados (SELECT * FROM products)
- [ ] Edge Functions desplegadas (verificar en Functions tab)
- [ ] Secrets configurados (STRIPE_SECRET_KEY)
- [ ] Frontend desplegado (URL accesible)
- [ ] Navegación entre páginas funciona
- [ ] Cambio de idioma ES/EN funciona
- [ ] Formulario de citas envía datos
- [ ] Formulario de contacto envía datos
- [ ] Productos se muestran en Shop
- [ ] Responsive design verificado

## Logs y Debugging

- **Edge Functions**: Supabase Dashboard > Edge Functions > Logs
- **Frontend**: Browser Console (F12)
- **Database**: Supabase Dashboard > Table Editor
- **API Calls**: Network tab en DevTools

---

**Estado**: Preparado para ejecución automática
**Fecha**: 2025-10-31
