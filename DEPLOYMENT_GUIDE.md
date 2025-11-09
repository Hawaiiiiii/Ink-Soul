# Guía de Despliegue - Ink & Soul by Asunaah

## 📋 Pre-requisitos

### Credenciales Necesarias

1. **Supabase**
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (para Edge Functions)
   - Project ID

2. **Stripe**
   - STRIPE_SECRET_KEY (para Edge Functions)
   - STRIPE_PUBLISHABLE_KEY (para Frontend)

3. **Google Maps** (Ya disponible)
   - GOOGLE_MAPS_API_KEY: AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk

## 🗄️ Configuración de Base de Datos

### 1. Crear Tablas en Supabase

Las tablas ya están definidas. Ejecutar en el orden indicado:

```sql
-- 1. appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    project_type TEXT,
    description TEXT,
    body_zone TEXT,
    preferred_date DATE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    description_en TEXT,
    price DECIMAL NOT NULL,
    category TEXT,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    is_limited_edition BOOLEAN DEFAULT FALSE,
    edition_number TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_payment_intent_id TEXT UNIQUE,
    status TEXT DEFAULT 'pending',
    total_amount DECIMAL NOT NULL,
    currency TEXT DEFAULT 'eur',
    shipping_address JSONB,
    billing_address JSONB,
    customer_email TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. order_items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID,
    product_id UUID,
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL NOT NULL,
    product_name TEXT,
    product_image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. contact_messages
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Configurar Políticas RLS

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para appointments
CREATE POLICY "Allow public read appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Allow insert appointments" ON appointments FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Políticas para products
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow insert products" ON products FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Políticas para orders
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow insert orders" ON orders FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Políticas para order_items
CREATE POLICY "Allow public read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Allow insert order_items" ON order_items FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Políticas para contact_messages
CREATE POLICY "Allow public read contact_messages" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));
```

### 3. Insertar Productos de Ejemplo

```sql
INSERT INTO products (name, name_en, description, description_en, price, category, image_url, stock, is_limited_edition, edition_number) VALUES
('Print "Corazón Sagrado"', 'Sacred Heart Print', 'Impresión de alta calidad en papel arte 300gsm', 'High quality art print on 300gsm paper', 45.00, 'prints', '/images/328DA9C2-D48A-49B5-966C-EAA99DCFBF63.png', 20, true, 'I/XX'),
('Sudadera Negra "IS"', 'Black Hoodie "IS"', 'Sudadera premium con logo dorado bordado', 'Premium hoodie with embroidered gold logo', 65.00, 'merchandise', '/images/85BC295A-26BE-4C66-8CF2-A2A233667F44.png', 15, false, null),
('Set Cuidado Post-Tatuaje', 'Tattoo Aftercare Set', 'Kit completo de cuidado para tu tatuaje', 'Complete care kit for your tattoo', 25.00, 'aftercare', '/images/B435F045-4B41-4C84-8B2E-F1EB908027A8.png', 50, false, null),
('Print "Mandala Espiritual"', 'Spiritual Mandala Print', 'Diseño exclusivo de geometría sagrada', 'Exclusive sacred geometry design', 50.00, 'prints', '/images/D1A4CEC2-EFF7-46ED-BA12-C2B52F09FA5F.png', 10, true, 'II/X');
```

## 🚀 Despliegue de Edge Functions

Las Edge Functions están en `/workspace/supabase/functions/`. Se deben configurar las variables de entorno en Supabase:

1. Ir a Supabase Dashboard > Project Settings > Edge Functions
2. Agregar secrets:
   - `STRIPE_SECRET_KEY`
   - (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY ya están disponibles automáticamente)

3. Desplegar funciones:
```bash
# Desde el directorio raíz
supabase functions deploy submit-appointment
supabase functions deploy send-contact-message
supabase functions deploy create-payment-intent
```

## 🎨 Configuración del Frontend

### 1. Actualizar Credenciales en el Código

Editar `/workspace/ink-soul-app/src/lib/supabase.ts`:
```typescript
const supabaseUrl = "https://YOUR_PROJECT.supabase.co"
const supabaseAnonKey = "YOUR_ANON_KEY"
```

Editar `/workspace/ink-soul-app/src/pages/ShopPage.tsx`:
```typescript
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY')
```

### 2. Build del Proyecto

```bash
cd /workspace/ink-soul-app
pnpm install
pnpm build
```

### 3. Deployment

El directorio `dist/` se puede desplegar en:
- **Vercel**: `vercel deploy`
- **Netlify**: Arrastrar carpeta `dist/` o `netlify deploy`
- **Supabase Storage**: Hosting estático

## 🧪 Testing

### 1. Probar Edge Functions

```bash
# Test submit-appointment
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/submit-appointment \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test","email":"test@test.com"}'

# Test send-contact-message
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/send-contact-message \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test message"}'
```

### 2. Probar Frontend Localmente

```bash
cd /workspace/ink-soul-app
pnpm dev
```

Visitar: `http://localhost:5173`

## 📝 Checklist de Deployment

- [ ] Base de datos Supabase creada y configurada
- [ ] RLS políticas aplicadas
- [ ] Productos de ejemplo insertados
- [ ] Edge Functions desplegadas
- [ ] Variables de entorno configuradas en Supabase
- [ ] Credenciales actualizadas en frontend (supabase.ts, ShopPage.tsx)
- [ ] Build del frontend exitoso
- [ ] Frontend desplegado
- [ ] Tests de Edge Functions ejecutados
- [ ] Navegación entre páginas funciona
- [ ] Formularios de contacto y citas funcionan
- [ ] Productos se muestran correctamente en Shop
- [ ] Cambio de idioma ES/EN funciona
- [ ] Diseño responsive verificado en mobile/tablet/desktop

## 🐛 Troubleshooting

### Error: "new row violates row-level security policy"
- **Solución**: Verificar que las políticas RLS incluyen `auth.role() IN ('anon', 'service_role')`

### Error: Stripe payment fails
- **Solución**: Verificar que `STRIPE_SECRET_KEY` está configurada en Edge Functions secrets

### Error: Images not loading
- **Solución**: Las imágenes están en `public/images/`, verificar rutas relativas `/images/...`

### Error: Cannot read properties of undefined
- **Solución**: Verificar que Supabase URL y Anon Key están correctamente configurados

## 📞 Soporte

Para dudas sobre el deployment:
- Documentación Supabase: https://supabase.com/docs
- Documentación Stripe: https://stripe.com/docs
- React Router: https://reactrouter.com/

---

**Versión**: 1.0  
**Fecha**: 2025-10-31  
**Autor**: Hawaiiiiii (Erik)
