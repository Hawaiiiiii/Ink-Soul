# Tareas Pendientes - Requieren Credenciales

## 🔴 BLOQUEADORES CRÍTICOS

### 1. Autorización Supabase (URGENTE)
**Estado**: ⏳ Esperando acción del coordinador

**Acción requerida**:
- El coordinador debe ejecutar: `ask_for_supabase_auth`
- Esto proporcionará: `supabase_access_token` y `supabase_project_id`

**Impacto**: Sin esto, NO se pueden crear tablas ni desplegar Edge Functions.

---

### 2. Credenciales Stripe (URGENTE)
**Estado**: ⏳ Esperando usuario

**Claves necesarias** (modo test, gratuitas):
```
STRIPE_SECRET_KEY: sk_test_51xxxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY: pk_test_51xxxxxxxxxxxxxxxxxxxxx
```

**Cómo obtenerlas**:
1. Ir a https://dashboard.stripe.com
2. Activar toggle "Modo de prueba" (arriba a la derecha)
3. Menú: **Developers** > **API keys**
4. Copiar ambas claves

**Impacto**: Sin esto, la tienda online NO funcionará.

---

## 📋 SECUENCIA DE DEPLOYMENT (Una vez tengamos credenciales)

### Paso 1: Crear Tablas en Supabase
```bash
# Ejecutar automáticamente con batch_create_tables
# (5 tablas: appointments, products, orders, order_items, contact_messages)
```

### Paso 2: Aplicar Políticas RLS
```bash
# Ejecutar: supabase_rls_policies.sql
# Archivo listo en: /workspace/supabase_rls_policies.sql
```

### Paso 3: Insertar Productos de Ejemplo
```bash
# Ejecutar: supabase_sample_products.sql
# Archivo listo en: /workspace/supabase_sample_products.sql
# 6 productos: 3 prints, 2 merchandise, 1 aftercare
```

### Paso 4: Configurar Secrets en Supabase
```bash
# En Supabase Dashboard > Edge Functions > Secrets
# Agregar: STRIPE_SECRET_KEY = sk_test_...
```

### Paso 5: Desplegar Edge Functions
```bash
# Usar: batch_deploy_edge_functions
# - submit-appointment
# - send-contact-message
# - create-payment-intent
```

### Paso 6: Actualizar Frontend con Credenciales
```typescript
// Archivos a modificar:
// 1. /workspace/ink-soul-app/src/lib/supabase.ts
const supabaseUrl = "https://xxxxx.supabase.co"  // ← ACTUALIZAR
const supabaseAnonKey = "eyJhbG..."  // ← ACTUALIZAR

// 2. /workspace/ink-soul-app/src/pages/ShopPage.tsx
const stripePromise = loadStripe('pk_test_...')  // ← ACTUALIZAR
```

### Paso 7: Build y Deploy Frontend
```bash
cd /workspace/ink-soul-app
pnpm build
# Desplegar dist/ a Vercel/Netlify
```

### Paso 8: Testing End-to-End
```bash
# Usar: test_website
# Verificar:
# - Navegación entre páginas
# - Cambio de idioma ES/EN
# - Formulario de citas
# - Formulario de contacto
# - Visualización de productos en Shop
# - Responsive design
```

---

## 📊 Progreso Actual

### ✅ Completado (80%)
- [x] Diseño completo y especificaciones
- [x] 6 páginas React funcionales
- [x] Sistema bilingüe ES/EN
- [x] Componentes de UI (Navigation, Footer, Button, Hero)
- [x] 3 Edge Functions escritas
- [x] Scripts SQL preparados (RLS + productos)
- [x] Tailwind configurado con design tokens
- [x] 9 imágenes en public/images/
- [x] Build de frontend exitoso

### ⏳ Bloqueado (20%)
- [ ] Tablas de Supabase creadas (bloqueado: necesita autorización)
- [ ] Edge Functions desplegadas (bloqueado: necesita autorización)
- [ ] Frontend actualizado con credenciales (bloqueado: necesita Supabase + Stripe keys)
- [ ] Deployment a producción (bloqueado: necesita credenciales)
- [ ] Testing funcional (bloqueado: necesita deployment)

---

## ⏱️ Tiempo Estimado (Una vez tengamos credenciales)

- Crear tablas + RLS: 5 minutos
- Desplegar Edge Functions: 5 minutos
- Actualizar credenciales en frontend: 2 minutos
- Build + Deploy: 10 minutos
- Testing completo: 15 minutos

**Total: ~40 minutos para completar 100%**

---

## 🆘 ¿Qué hacer ahora?

**Usuario debe**:
1. Obtener claves Stripe de https://dashboard.stripe.com (modo test)
2. Proporcionar las 2 claves cuando se soliciten

**Coordinador debe**:
1. Ejecutar `ask_for_supabase_auth` para obtener autorización
2. Proporcionar `supabase_access_token` y `supabase_project_id`

**Una vez tengamos estas credenciales, puedo completar todo el deployment automáticamente.**

---

Última actualización: 2025-10-31 22:30
Estado: ESPERANDO CREDENCIALES
