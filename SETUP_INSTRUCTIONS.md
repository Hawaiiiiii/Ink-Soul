# Instrucciones de Configuración Rápida

## 🎯 Pasos Inmediatos (Antes de Deployment)

### 1. Obtener Credenciales Necesarias

#### Supabase
1. Ir a https://supabase.com
2. Crear proyecto (o usar uno existente)
3. Obtener:
   - `SUPABASE_URL`: https://YOUR_PROJECT.supabase.co
   - `SUPABASE_ANON_KEY`: Settings > API > Project API keys > anon (public)
   - `SUPABASE_SERVICE_ROLE_KEY`: Settings > API > Project API keys > service_role (secret)

#### Stripe
1. Ir a https://dashboard.stripe.com
2. Modo Test activado
3. Obtener:
   - `STRIPE_SECRET_KEY`: Developers > API keys > Secret key (sk_test_...)
   - `STRIPE_PUBLISHABLE_KEY`: Developers > API keys > Publishable key (pk_test_...)

### 2. Configurar Base de Datos Supabase

#### Crear Tablas
1. Ir a Supabase Dashboard > SQL Editor
2. Copiar y ejecutar el contenido de la sección "Crear Tablas" en `DEPLOYMENT_GUIDE.md`
3. Ejecutar también las políticas RLS
4. Insertar productos de ejemplo (opcional pero recomendado)

### 3. Desplegar Edge Functions

#### Método A: Supabase CLI (Recomendado)
```bash
# Instalar Supabase CLI si no está instalado
npm install -g supabase

# Login
supabase login

# Link al proyecto
cd /workspace
supabase link --project-ref YOUR_PROJECT_REF

# Configurar secrets
supabase secrets set STRIPE_SECRET_KEY="sk_test_..."

# Desplegar funciones
supabase functions deploy submit-appointment
supabase functions deploy send-contact-message
supabase functions deploy create-payment-intent
```

#### Método B: Manual (Dashboard)
1. Copiar contenido de cada función desde `/workspace/supabase/functions/*/index.ts`
2. En Supabase Dashboard > Edge Functions > New Function
3. Pegar código y configurar
4. Configurar secrets en Settings > Edge Functions > Secrets

### 4. Actualizar Credenciales en Frontend

#### Editar `/workspace/ink-soul-app/src/lib/supabase.ts`
```typescript
const supabaseUrl = "https://xyzcompany.supabase.co"  // ← TU URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // ← TU ANON KEY
```

#### Editar `/workspace/ink-soul-app/src/pages/ShopPage.tsx`
Línea 10:
```typescript
const stripePromise = loadStripe('pk_test_51...your_key')  // ← TU PUBLISHABLE KEY
```

### 5. Build y Deploy

```bash
cd /workspace/ink-soul-app

# Build production
pnpm build

# El directorio dist/ ahora contiene tu aplicación lista para deployment
```

#### Opciones de Deployment:

**Opción A: Vercel (Recomendado)**
```bash
npm i -g vercel
vercel deploy
```

**Opción B: Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**Opción C: Manual**
- Subir carpeta `dist/` a cualquier hosting estático (Firebase, Cloudflare Pages, etc.)

### 6. Verificar Deployment

1. Visitar la URL de tu aplicación
2. Probar navegación entre páginas
3. Cambiar idioma ES/EN
4. Enviar formulario de contacto de prueba
5. Revisar que los productos se muestren en Shop (si insertaste datos de ejemplo)

## ⚠️ Importante: Pendientes

### Credenciales Faltantes
- ✅ Google Maps API Key: Ya disponible
- ❌ Supabase: Necesita autorización del coordinador
- ❌ Stripe: Necesita keys del usuario

### Después del Primer Deployment
1. Configurar dominio personalizado (inkandsoul.com o similar)
2. Actualizar enlaces de WhatsApp con número real (actualmente +34123456789)
3. Actualizar email de contacto (actualmente contact@inkandsoul.com)
4. Agregar imágenes reales de tatuajes al portfolio
5. Configurar Google Maps con ubicación real del estudio

## 🔧 Testing Local (Antes de Deploy)

```bash
cd /workspace/ink-soul-app

# Modo desarrollo
pnpm dev

# Abrir http://localhost:5173 y probar:
# - Navegación entre páginas
# - Cambio de idioma
# - Responsive design (DevTools)
# - Formularios (no enviarán datos sin backend configurado)
```

## 📝 Checklist Pre-Deploy

- [ ] Credenciales Supabase obtenidas y configuradas
- [ ] Credenciales Stripe obtenidas y configuradas
- [ ] Tablas de base de datos creadas
- [ ] Políticas RLS aplicadas
- [ ] Edge Functions desplegadas
- [ ] Secrets configuradas en Supabase (STRIPE_SECRET_KEY)
- [ ] Frontend actualizado con credenciales (supabase.ts, ShopPage.tsx)
- [ ] Build exitoso (pnpm build)
- [ ] Test local completado (pnpm dev)
- [ ] Deployment realizado
- [ ] Pruebas en producción completadas

## 🆘 Ayuda

Si encuentras problemas, consulta:
1. `DEPLOYMENT_GUIDE.md` - Troubleshooting detallado
2. `README.md` - Documentación completa del proyecto
3. Logs de Edge Functions en Supabase Dashboard
4. Console del navegador (F12) para errores de frontend

## 📧 Contacto del Proyecto

Para dudas técnicas específicas de este proyecto, referirse a la documentación interna.

---

**Última actualización**: 2025-10-31  
**Versión**: 1.0
