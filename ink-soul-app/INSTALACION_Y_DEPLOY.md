# Ink & Soul — Asunaah · La Restauradora
## Guía de Instalación y Deployment

### 📋 Descripción del Proyecto

Portafolio web completo para tatuaje devocional contemporáneo con:
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS
- **Backend:** Supabase (Auth + Database + Storage + Edge Functions)
- **Pagos:** Stripe Checkout integrado
- **Diseño:** Minimalista, sacramental (paleta carbón, dorado, burdeos)
- **Características:** Portfolio filtrado, sistema de citas, tienda online, eventos flash

### 🚀 Instalación Rápida

#### Prerrequisitos
```bash
# Node.js 18+ y npm
node --version  # Debe ser v18 o superior
npm --version

# Git
git --version
```

#### Paso 1: Extraer y Instalar Dependencias
```bash
# Extraer el ZIP y navegar al directorio
cd ink-soul-app

# Instalar dependencias
npm install

# O usando pnpm si lo prefieres
pnpm install
```

#### Paso 2: Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:
```env
# Supabase Configuration (YA CONFIGURADO - no cambiar)
VITE_SUPABASE_URL=https://enitsirdzrsqtgjksctk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaXRzaXJkenJzcXRnamtzY3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5Mzg5ODksImV4cCI6MjA3NzUxNDk4OX0.YaEXS02Dhwi0JhTAjYKAIvNBI3xlANVwmRONaIGzlsQ

# Stripe Configuration (REQUIERE TU CLAVE PÚBLICA)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_de_stripe

# Para producción también necesitarás tu clave secreta en el servidor
# STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_de_stripe

# App Configuration
VITE_APP_NAME=Ink & Soul
VITE_APP_URL=http://localhost:5173
```

#### Paso 3: Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### 🏗️ Build para Producción

#### Build Estándar
```bash
npm run build
```

#### Build de Producción Optimizado
```bash
npm run build:prod
```

Los archivos compilados estarán en el directorio `dist/`.

### 🚀 Deployment Opciones

#### Opción 1: GitHub Pages (Recomendado)

1. **Habilitar GitHub Pages:**
   - Ir a Settings > Pages del repositorio
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)

2. **Configurar GitHub Actions** (opcional):
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **Deploy manual:**
   ```bash
   npm run build
   # Subir contenido de dist/ a la rama gh-pages
   ```

#### Opción 2: Vercel (Recomendado para Features Avanzadas)

1. **Conectar repositorio:**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Login y deploy
   vercel login
   vercel --prod
   ```

2. **Configuración automática:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Opción 3: Netlify

1. **Drag & Drop:**
   - Hacer build: `npm run build`
   - Arrastar carpeta `dist/` a netlify.com/drop

2. **Deploy con CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### 🗄️ Configuración de Base de Datos

#### Supabase Tables (Ya Configuradas)

El proyecto incluye migraciones en `supabase/migrations/`:

1. **Tabla de usuarios:** `profiles`
2. **Tabla de citas:** `appointments`
3. **Tabla de productos:** `products`
4. **Tabla de órdenes:** `orders`
5. **Tabla de eventos:** `flash_events`
6. **Carrito de compras:** `cart_items`

#### Ejecutar Migraciones
```bash
# Si necesitas aplicar migraciones manualmente
supabase db push
```

### 💳 Configuración de Stripe

#### 1. Crear Cuenta Stripe
- Ir a https://stripe.com
- Crear cuenta de prueba/desarrollo

#### 2. Obtener Claves API
- Dashboard > Developers > API keys
- **Publishable key:** Empieza con `pk_test_`
- **Secret key:** Empieza con `sk_test_`

#### 3. Configurar Webhooks (Para producción)
- Webhooks > Add endpoint
- URL: `https://tu-dominio.com/api/stripe-webhook`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

#### 4. Configurar Productos en Stripe Dashboard
```
Producto 1: "Diseño Personalizado"
- Precio: $150.00 USD
- Type: One-time

Producto 2: "Consulta Artística" 
- Precio: $50.00 USD
- Type: One-time

Producto 3: "Arte Digital"
- Precio: $75.00 USD
- Type: One-time
```

### 🔧 Configuración Avanzada

#### Variables de Entorno Completas
```env
# Aplicación
VITE_APP_NAME=Ink & Soul - Asunaah La Restauradora
VITE_APP_DESCRIPTION=Portafolio de tatuaje devocional contemporáneo
VITE_APP_URL=https://tu-dominio.com

# Supabase
VITE_SUPABASE_URL=https://enitsirdzrsqtgjksctk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Analytics (opcional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX

# Social Media (opcional)
VITE_INSTAGRAM_URL=https://instagram.com/inkandsoulart
VITE_FACEBOOK_URL=https://facebook.com/inkandsoulstudio
```

### 🧪 Testing

#### Ejecutar Tests
```bash
npm run test        # Si están configurados
npm run test:e2e    # Si hay tests E2E
```

#### Linting y Formateo
```bash
npm run lint        # ESLint
npm run format      # Prettier (si configurado)
```

### 🐛 Troubleshooting

#### Problema: "Module not found"
```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install
```

#### Problema: Error de TypeScript
```bash
# Reinstalar types
npm install @types/react @types/react-dom --save-dev
```

#### Problema: Build fails
```bash
# Verificar Node.js version
node --version  # Debe ser 18+

# Verificar variables de entorno
echo $VITE_STRIPE_PUBLISHABLE_KEY
```

#### Problema: Supabase connection
```bash
# Verificar conectividad
curl https://enitsirdzrsqtgjksctk.supabase.co/rest/v1/
# Debe devolver JSON o error 401 (no 404)
```

### 📱 Funcionalidades Principales

#### ✅ Implementado y Funcional
- [x] Portfolio con filtros por categoría
- [x] Sistema de reservas de citas
- [x] Tienda online con Stripe
- [x] Carrito de compras
- [x] Eventos flash (promociones)
- [x] Panel de administración
- [x] Autenticación de usuarios
- [x] Responsive design
- [x] Multiidioma (ES/EN)
- [x] PWA ready
- [x] SEO optimizado

#### 🔄 En Roadmap
- [ ] Chat en vivo
- [ ] Sistema de reseñas
- [ ] Blog integrado
- [ ] Reservas con calendario
- [ ] Notificaciones push
- [ ] App móvil nativa

### 📞 Soporte

#### Documentación Técnica
- `docs/` - Documentación completa del proyecto
- `README.md` - Información general
- `CONTRIBUTING.md` - Guías de contribución

#### Contacto
- **Email:** contact@inkandsoul.com
- **Issues:** GitHub Issues para bugs
- **Discussions:** GitHub Discussions para preguntas

### 📄 Licencia

MIT License - Ver archivo `LICENSE` para detalles completos.

---

**¡Disfruta tu nuevo portafolio digital!** 🎨✨

*Ink & Soul — Donde el arte devocional encuentra su hogar digital.*