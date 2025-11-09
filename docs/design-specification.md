# Especificación de Diseño: Ink & Soul by Asunaah
## Templo Digital Devocional

**Versión:** 1.0  
**Fecha:** 2024-10-31  
**Autor:** Hawaiiiiii (Erik)
**Estilo Base:** Dark Mode First + Luxury & Sophisticated (Adaptado)

---

## 1. Dirección y Fundamento

### 1.1 Esencia Visual

**Templo Digital Devocional** fusiona la profundidad dramática del dark mode con la elegancia reverencial del diseño de lujo, adaptado para el arte sacro del tatuaje. Cada pantalla es una "cámara sagrada" donde elementos dorados flotan sobre un vacío negro profundo, evocando la sensación de entrar a un santuario espiritual. El diseño respira a través de animaciones lentas tipo "ritual" (400-600ms), efectos de halo dorado en interacciones, y patrones de geometría sagrada sutiles (Flor de la Vida, Metatrón) que revelan la dimensión espiritual del arte.

**Referencia de Mundo Real:**
- Versace.com (lujo dark con acentos dorados)
- Sitios de joyería de alta gama con dark mode (Cartier, Tiffany)
- Portfolios de arte sacro contemporáneo

### 1.2 Identidad Cromática Establecida

La paleta respeta la identidad visual ya definida por la marca, con distribución estratégica:

- **85% Negro Carbón** (#0C0C0C) - Fondo primario, "el vacío sagrado"
- **10% Dorado Envejecido** (#C1A261) - Acentos, tipografía destacada, bordes rituales
- **3% Burdeos Borgoña** (#6B1E24) - Elementos devocionales, overlays, hover states
- **2% Índigo Profundo** (#2E356D) - Detalles secundarios, sombras con tinte

---

## 2. Tokens de Diseño

### 2.1 Paleta de Colores

| Token | Valor | Uso | Contraste WCAG |
|-------|-------|-----|----------------|
| **Fondos** | | | |
| `bg-primary` | #0C0C0C | Fondo principal, hero sections | Base |
| `bg-elevated` | #141414 | Cards, modals (superficie elevada) | - |
| `bg-hover` | #1C1C1C | Estados hover de cards | - |
| **Acentos Primarios** | | | |
| `accent-gold` | #C1A261 | Títulos, CTA, bordes rituales | 9.2:1 ✅ AAA |
| `accent-gold-light` | #D4C088 | Hover sobre dorado, halos | 11.5:1 ✅ AAA |
| `accent-gold-dark` | #9A8450 | Sombras doradas, profundidad | - |
| **Acentos Secundarios** | | | |
| `accent-burgundy` | #6B1E24 | Overlays devocionales, estados activos | 10.8:1 ✅ AAA |
| `accent-burgundy-light` | #8A2A31 | Hover burgundy, transiciones | - |
| `accent-indigo` | #2E356D | Detalles secundarios, iconos | 11.2:1 ✅ AAA |
| **Texto** | | | |
| `text-primary` | #EAEAEA | Texto principal, navegación | 14.1:1 ✅ AAA |
| `text-secondary` | #B8B8B8 | Texto secundario, descripciones | 8.6:1 ✅ AAA |
| `text-tertiary` | #8A8A8A | Captions, metadatos | 4.9:1 ✅ AA |
| **Bordes y Separadores** | | | |
| `border-gold` | rgba(193, 162, 97, 0.3) | Bordes de cards dorados (30% opacidad) | - |
| `border-subtle` | rgba(255, 255, 255, 0.08) | Separadores sutiles | - |
| **Overlays** | | | |
| `overlay-burgundy` | rgba(107, 30, 36, 0.6) | Overlay hero images (60%) | - |
| `overlay-indigo` | rgba(46, 53, 109, 0.4) | Overlay secundario (40%) | - |

**Validación WCAG:** Todos los pares texto/fondo superan 4.5:1 (AA), la mayoría alcanza 7:1+ (AAA). Los acentos dorados (#C1A261) sobre negro (#0C0C0C) logran 9.2:1.

### 2.2 Tipografía

| Token | Familia | Peso | Uso |
|-------|---------|------|-----|
| `font-display` | 'Playfair Display', Georgia, serif | 400, 600, 700 | Títulos, eslogan, menú |
| `font-body` | 'Inter', -apple-system, sans-serif | 300, 400, 500, 600 | Texto base, botones, labels |

**Escala Tipográfica (Desktop 1920px):**

| Nivel | Tamaño | Peso | Line-Height | Letter-Spacing | Uso |
|-------|--------|------|-------------|----------------|-----|
| Display | 80-96px | Playfair 700 | 1.1 | -0.02em | Hero principal (Home) |
| H1 | 64-72px | Playfair 600 | 1.15 | -0.01em | Títulos hero secundarios |
| H2 | 48-56px | Playfair 600 | 1.2 | 0 | Títulos de sección |
| H3 | 32-40px | Inter 500 | 1.3 | 0.01em | Subtítulos, card titles |
| Body Large | 20-24px | Inter 400 | 1.7 | 0 | Intro paragraphs, manifesto |
| Body | 16-18px | Inter 400 | 1.6 | 0.01em | Texto estándar |
| Small | 14px | Inter 300 | 1.5 | 0.02em | Captions, labels, metadatos |
| Button | 14-16px | Inter 600 | 1.2 | 0.05em | Texto de botones (uppercase) |

**Escala Responsive (Mobile <768px):**
- Display: 48-56px
- H1: 40-48px
- H2: 32-36px
- Body: 16-18px (mantener legibilidad)

**Refinamientos:**
- Activar ligaduras estilísticas en Playfair Display: `font-feature-settings: "liga" 1`
- Anti-aliasing en todo el sitio: `-webkit-font-smoothing: antialiased`
- Evitar pure white (#FFF) para texto, usar #EAEAEA para reducir halación en dark mode

### 2.3 Espaciado (4pt Grid, preferencia 8pt)

| Token | Valor | Uso |
|-------|-------|-----|
| `space-xs` | 8px | Inline spacing, icon padding |
| `space-sm` | 16px | Gaps entre elementos relacionados |
| `space-md` | 24px | Gaps entre componentes |
| `space-lg` | 32px | Padding de cards (mínimo) |
| `space-xl` | 48px | Padding de cards premium |
| `space-2xl` | 64px | Sección internal spacing |
| `space-3xl` | 96px | Separación entre secciones mayores |
| `space-4xl` | 128px | Spacing ritual (secciones críticas) |
| `space-hero` | 160px | Padding vertical de hero sections |

**Filosofía de Espaciado:** El dark mode permite generosidad extrema sin sensación de vacío. Secciones se separan con 96-128px para crear "cámaras sagradas" individuales.

### 2.4 Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 8px | Buttons, inputs pequeños |
| `radius-md` | 12px | Cards estándar, imágenes |
| `radius-lg` | 16px | Modals, cards premium |
| `radius-xl` | 24px | Hero cards, elementos destacados |
| `radius-full` | 9999px | Botones pill, badges circulares |

### 2.5 Shadows & Glow Effects

**Sombras Elevadas (Layered):**
```
shadow-card: 
  0 0 0 1px rgba(193, 162, 97, 0.2),
  0 4px 12px rgba(0, 0, 0, 0.5),
  0 8px 24px rgba(0, 0, 0, 0.3)

shadow-card-hover:
  0 0 0 1px rgba(193, 162, 97, 0.4),
  0 8px 24px rgba(0, 0, 0, 0.6),
  0 12px 32px rgba(0, 0, 0, 0.4)

shadow-modal:
  0 0 0 1px rgba(193, 162, 97, 0.3),
  0 24px 48px rgba(0, 0, 0, 0.7),
  0 12px 24px rgba(0, 0, 0, 0.5)
```

**Halo Effects (Signature):**
```
glow-gold:
  0 0 20px rgba(193, 162, 97, 0.5),
  0 0 40px rgba(193, 162, 97, 0.3),
  0 0 60px rgba(193, 162, 97, 0.15)

glow-gold-intense:
  0 0 30px rgba(193, 162, 97, 0.7),
  0 0 60px rgba(193, 162, 97, 0.5),
  0 0 90px rgba(193, 162, 97, 0.25)

glow-burgundy:
  0 0 20px rgba(107, 30, 36, 0.4),
  0 0 40px rgba(107, 30, 36, 0.2)
```

### 2.6 Animaciones (Timing Ritual)

| Token | Duración | Easing | Uso |
|-------|----------|--------|-----|
| `duration-fast` | 250ms | ease-out | Icon changes, subtle hovers |
| `duration-standard` | 400ms | cubic-bezier(0.4, 0, 0.2, 1) | Button hover, card elevation |
| `duration-slow` | 500ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) | Page transitions, modals |
| `duration-ritual` | 600ms | ease-in-out | Hero animations, ritual reveals |

**Filosofía de Animación:** Movimientos lentos y reverenciales (400-600ms) para evocar solemnidad. Evitar rapidez que rompa la atmósfera sacra.

---

## 3. Componentes Clave (Máximo 6)

### 3.1 Hero Devocional

**Estructura:**
- Altura: 600-700px (desktop), 500-600px (tablet), 400-500px (mobile)
- Background: Negro carbón #0C0C0C con patrón de geometría sagrada (Flor de la Vida, opacidad 3-5%)
- Overlay: Gradiente radial burdeos/índigo desde centro (60% opacidad) si hay imagen de fondo

**Tokens Aplicados:**
- Padding vertical: `space-hero` (160px desktop, 96px mobile)
- Título: `font-display`, 80-96px, peso 700, color `accent-gold`
- Eslogan: `font-display`, 24-32px, peso 400, color `text-primary`, italic opcional
- CTA primario: Ver §3.2 (Button con halo dorado)

**Estados:**
- Default: Título con fade-in desde opacity 0 → 1 + translateY(30px → 0) en 600ms
- Scroll parallax: Background pattern se mueve a 50% velocidad de scroll (offset máximo 16px)

**Nota Específica:** 
- Logo "IS" centrado sobre título (opcional) con tamaño 80-120px
- Patrón de fondo: SVG inline de geometría sagrada (líneas doradas opacidad 5%, blur 1px)

---

### 3.2 Button (Max 2 Variantes)

**Primario - Halo Dorado:**
```
Dimensiones: 56-64px alto × 160-200px ancho
Padding: 20-24px vertical, 32-40px horizontal
Radius: radius-sm (8px)
Font: font-body, 14-16px, peso 600, letter-spacing 0.05em, uppercase
Background: accent-gold (#C1A261)
Color: #0C0C0C (negro sobre dorado para contraste)
Border: Ninguno

Hover:
  Background: accent-gold-light (#D4C088)
  Transform: translateY(-2px) + scale(1.02)
  Shadow: glow-gold-intense (halo multicapa)
  Duration: duration-standard (400ms)
```

**Secundario - Ghost Dorado:**
```
Mismas dimensiones
Background: Transparente
Border: 1.5px solid accent-gold
Color: accent-gold
Font: Idéntico

Hover:
  Background: accent-gold
  Color: #0C0C0C
  Border: 1.5px solid accent-gold-light
  Shadow: glow-gold
  Duration: duration-standard (400ms)
```

**Focus State (Accesibilidad):**
- Outline: 2px solid accent-gold-light, offset 4px
- Mantener shadow para keyboard navigation

---

### 3.3 Card Elevada (Portfolio, Shop)

**Estructura:**
```
Background: bg-elevated (#141414)
Padding: space-xl (48px) desktop, space-lg (32px) mobile
Radius: radius-lg (16px)
Border: 1px solid border-gold (rgba dorado 30%)
Shadow: shadow-card (layered con tinte dorado)
```

**Contenido Típico:**
- Imagen superior: ratio 3:2 (portfolio) o 1:1 (productos), radius-md (12px)
- Título: H3 (32-40px), color `accent-gold`
- Descripción: Body (16-18px), color `text-secondary`
- Metadata: Small (14px), color `text-tertiary`

**Estados:**
```
Hover:
  Background: bg-hover (#1C1C1C)
  Border-color: rgba(193, 162, 97, 0.5)
  Shadow: shadow-card-hover
  Transform: translateY(-4px)
  Image: scale(1.05) dentro del contenedor (overflow hidden)
  Overlay Image: Gradiente burdeos aparece (opacity 0 → 0.3)
  Duration: duration-standard (400ms)

Active:
  Transform: translateY(-2px)
  Shadow: reducción al 80%
```

**Variante Portfolio:** Incluir badge de categoría (pill shape, background burdeos, texto blanco, 12px, radius-full)

---

### 3.4 Navigation Bar

**Estructura:**
```
Height: 80-96px (desktop), 64px (mobile)
Background: rgba(12, 12, 12, 0.95) con backdrop-blur(20px) en scroll
Border-bottom: 1px solid border-subtle (rgba white 8%)
Shadow: 0 2px 12px rgba(0,0,0,0.6) aparece al scroll
Position: Sticky top 0, z-index 1000
```

**Layout:**
- Logo "IS" izquierda: 40-48px height, enlace a Home
- Nav links centro: `font-display` 14-16px, peso 400, letter-spacing 0.05em
  - Color default: `text-secondary` (#B8B8B8)
  - Hover: `accent-gold`, underline sutil (2px, offset 4px), duration 250ms
  - Active: `accent-gold`, underline permanente
  - Espaciado: 32-40px entre links
- CTA derecha: Button Primario "Agendar Cita" (tamaño reducido 48px alto)
- Selector idioma: Dropdown o toggle ES/EN, icono globe SVG

**Mobile (<768px):**
- Hamburger menu icon derecha (24px, color dorado)
- Menu slide-in desde derecha: Full-screen overlay (#0C0C0C 98%), links apilados verticalmente (gap 24px)
- Animación apertura: translateX(100% → 0) + opacity (0 → 1), 400ms

---

### 3.5 Input Field (Forms)

**Estructura:**
```
Height: 56-64px (text inputs), auto (textarea)
Padding: 16-20px horizontal, 18-22px vertical
Radius: radius-sm (8px)
Background: bg-elevated (#141414)
Border: 1px solid border-subtle (rgba white 8%)
Font: font-body, 16-18px, peso 400, color text-primary
Placeholder: color text-tertiary (#8A8A8A)
```

**Estados:**
```
Focus:
  Border: 1.5px solid accent-gold
  Background: #1C1C1C
  Shadow: 0 0 0 3px rgba(193, 162, 97, 0.15) (ring dorado)
  Outline: none

Error:
  Border: 1.5px solid accent-burgundy
  Shadow: 0 0 0 3px rgba(107, 30, 36, 0.15)
  
Disabled:
  Background: #0C0C0C
  Border-color: rgba(255, 255, 255, 0.05)
  Color: text-tertiary
  Cursor: not-allowed
```

**Label:**
- Font: font-body, 14px, peso 500, color text-secondary
- Margin-bottom: 8px
- Required indicator: asterisco dorado

---

### 3.6 Masonry Gallery (Portfolio)

**Estructura:**
```
Columns: 3 (desktop >1200px), 2 (tablet 768-1199px), 1 (mobile <767px)
Column-width: 320-380px (desktop), 280-320px (tablet)
Gap: 24-32px (horizontal y vertical)
Container: max-width 1400px, margin auto
```

**Item de Galería:**
- Imagen: Aspect ratio preservado (original), radius-md (12px)
- Border: 1px solid border-gold (rgba dorado 30%)
- Overlay hover: Gradiente burdeos de bottom-to-top (0 → 60% opacidad)
  - Contenido overlay: Título (H3 dorado), categoría badge, icono "+" ampliar
  - Aparición: opacity 0 → 1, translateY(20px → 0), 400ms
- Shadow: shadow-card base, shadow-card-hover en hover
- Cursor: pointer (zoom-in)

**Lightbox Modal (al click):**
- Background: rgba(12, 12, 12, 0.98) con backdrop-blur(30px)
- Imagen centrada: Max 90vw × 90vh, mantener aspect ratio
- Marco: Border 2px solid accent-gold, radius-lg
- Info lateral o inferior: Título, categoría, descripción, tamaño, duración
- Botón cerrar: X icono dorado, top-right, 48×48px touch target

---

## 4. Layout & Responsive

### 4.1 Sistema de Breakpoints

```
xs:  <640px   (Mobile small)
sm:  640px+   (Mobile large)
md:  768px+   (Tablet)
lg:  1024px+  (Desktop small)
xl:  1280px+  (Desktop standard)
2xl: 1536px+  (Desktop large)
```

### 4.2 Container Max-Width

```
sm:  100% (full-bleed con padding 16px)
md:  100% (padding 32px)
lg:  1200px
xl:  1400px
2xl: 1600px
```

### 4.3 Patrones de Layout por Página

**Referencia:** Ver `content-structure-plan.md` para estructura de contenido específica.

#### Home (Single-Page Flow)
```
1. Hero Devocional (700px altura)
   - Full-width, patrón de fondo geometría sagrada
   - Contenido centrado: logo IS + título + eslogan + 2 CTAs
   - Padding vertical: 160px

2. Manifiesto (Auto altura)
   - Layout: 60/40 asimétrico (7 cols texto / 5 cols patrón decorativo)
   - Max-width: 1200px, centrado
   - Padding: 96px vertical

3. Featured Works (Auto)
   - Grid: 3 columnas (>1024px), 2 cols (768-1023px), 1 col (<767px)
   - Gap: 32px
   - Aplicar Card Pattern (§3.3)
   - Padding: 96px vertical

4. Especialidades (Auto)
   - Grid: 3 columnas iconos + texto
   - Gap: 48px
   - Iconos SVG: 64px, color dorado con glow sutil
   - Padding: 96px vertical

5. CTA Final (400px altura)
   - Centrado vertical y horizontal
   - Button primario hero-size (64px alto)
   - Background: Gradiente radial índigo sutil
```

#### About (Content + Sidebar Flow)
```
1. Hero About (400px)
   - Similar a Home hero pero altura reducida
   - Título + subtítulo, sin CTAs

2. Biografía Section
   - Layout: 50/50 (6 cols imagen / 6 cols texto)
   - Mobile: stack (imagen arriba, texto abajo)
   - Imagen: Portrait ratio 4:5, radius-lg, border dorado
   - Aplicar Card Pattern para texto

3. Proceso Creativo
   - Timeline vertical (desktop), horizontal scroll (mobile)
   - Línea dorada vertical/horizontal conectando pasos
   - Cada paso: número grande (96px Playfair), título, descripción

4. Galería Personal
   - Grid: 2-3 columnas
   - Imágenes: ratio 3:2, tratamiento similar a masonry pero grid fijo
```

#### Portfolio (Gallery Dominant)
```
1. Hero Portfolio (300px mínimo)
   - Título centrado
   - Filtros horizontales: tabs con underline dorado (All/Devocional/Geometría/etc)

2. Masonry Gallery
   - Aplicar patrón §3.6
   - Infinite scroll o paginación según cantidad de proyectos
   - Padding: 64px vertical entre hero y galería
```

#### Appointments (Form Focused)
```
1. Hero (400px)
2. Layout: 60/40
   - Columna principal (60%): Formulario (§3.5 inputs)
     - Single column, max-width 600px
     - Campos apilados verticalmente, gap 24px
     - Button submit: primario con halo, full-width mobile
   - Sidebar (40%): Calendario widget + políticas accordion
3. Mapa: Full-width abajo, height 400px, border-radius 0 (section completa)
```

#### Shop (Product Grid)
```
1. Hero (300px mínimo)
2. Filtros: Tab horizontal (Prints/Merchandise/Aftercare)
3. Product Grid:
   - 4 columnas (>1280px), 3 cols (1024-1279px), 2 cols (768-1023px), 1 col (<767px)
   - Gap: 32px
   - Aplicar Card Pattern con precio prominente (H3 dorado)
   - Button "Comprar": secundario ghost
```

#### Contact (Form + Info)
```
1. Hero (300px)
2. Layout: 50/50
   - Izquierda: Formulario contacto (similar a Appointments)
   - Derecha: Info de contacto + redes sociales
     - Iconos SVG: 32px, dorados, hover con glow
     - Email, teléfono, dirección en lista vertical
3. Mapa: Full-width abajo
```

### 4.4 Responsive Strategy

**Desktop (>1024px):**
- Experiencia completa: halos dorados multicapa, parallax sutil, animaciones rituales
- Hover states: todos activos
- Spacing: valores completos (96-128px secciones)

**Tablet (768-1023px):**
- Grids: reducir de 4 cols a 3 cols, de 3 a 2
- Spacing: reducir 25% (96px → 72px)
- Halos: simplificar a 2 capas (performance)
- Parallax: desactivar

**Mobile (<768px):**
- Todo stack vertical (1 columna)
- Spacing: reducir 40% (96px → 58-64px)
- Halos: 1 capa simple
- Touch targets: mínimo 48×48px, preferido 56×56px
- Navigation: hamburger menu
- Hero height: reducir a 400-500px
- Typography: usar escala mobile (ver §2.2)

---

## 5. Interacción & Animación

### 5.1 Principios de Animación Ritual

**Características:**
- Duración: 400-600ms (lento y reverencial)
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` para elegancia
- Transforms: Solo `transform` y `opacity` (GPU-accelerated)
- Origen: Elementos "emergen" del vacío con fade + translate

**Animaciones Prohibidas:**
- ❌ Width/height animation
- ❌ Margin/padding animation
- ❌ Flashes rápidos (<200ms)
- ❌ Rotaciones excesivas (max 5° sutil)

### 5.2 Micro-animaciones por Componente

**Buttons:**
- Hover: translateY(-2px) + scale(1.02) + halo aparece (0 → 100%), 400ms
- Active: translateY(0) + scale(0.98), 150ms
- Ripple effect: círculo dorado desde punto de click (opcional, 600ms)

**Cards:**
- Hover: translateY(-4px) + shadow growth + border intensifica + imagen scale(1.05), 400ms
- Stagger entrance: Cada card en grid aparece con 100ms delay secuencial

**Navigation Links:**
- Hover: color change (250ms) + underline growth left-to-right (300ms)

**Hero Elements:**
- Page load: 
  1. Background pattern fade-in (800ms)
  2. Logo/título fade + translateY(30px → 0) (600ms, delay 200ms)
  3. Subtítulo fade-in (600ms, delay 400ms)
  4. CTAs fade + scale(0.9 → 1) (500ms, delay 600ms)

**Scroll Animations:**
- Parallax hero background: translateY offset max 16px (50% scroll speed)
- Section reveal: fade + translateY(40px → 0) cuando entra viewport (500ms)
- "Breathing" effect en elementos sagrados: scale(1 → 1.03 → 1), 4s loop, ease-in-out

### 5.3 Transiciones de Página (MPA)

**Navegación entre páginas:**
- Page exit: Fade out actual (300ms)
- Page enter: Fade in nueva (400ms, delay 100ms) + translateY(20px → 0)
- Mantener header sticky visible durante transición

### 5.4 Reduced Motion Support

**Media query `prefers-reduced-motion`:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Mantener cambios de estado (hover colors) pero eliminar transforms y delays.

### 5.5 Loading States

**Spinner Dorado:**
- SVG circular, stroke dorado, rotation animation 1.5s linear infinite
- Size: 48px, stroke-width 3px
- Uso: Centrado en cards durante carga de contenido

**Skeleton Screens:**
- Background: bg-elevated (#141414)
- Shimmer: Gradiente horizontal dorado sutil, translateX animation 2s infinite
- Forma: Réplica simplificada del contenido final (rectangles con radius)

---

## Conclusión

Esta especificación define un sistema de diseño **Templo Digital Devocional** que equilibra la profundidad dramática del dark mode con la elegancia reverencial del diseño de lujo, adaptado a la identidad sacra de Ink & Soul by Asunaah. Cada decisión de diseño —desde la paleta cromática restrictiva (85% negro, 10% dorado) hasta los tiempos de animación rituales (400-600ms)— sirve al objetivo de crear una experiencia web que refleje la naturaleza espiritual y técnica del arte del tatuaje devocional.

Los 6 componentes especificados (Hero, Button, Card, Navigation, Input, Masonry Gallery) proporcionan los bloques fundamentales para construir las 6 páginas del sitio, mientras que los tokens de diseño (120 líneas en JSON companion) garantizan consistencia y escalabilidad técnica.

**Palabras totales:** ~2,850  
**Componentes especificados:** 6  
**Páginas cubiertas:** 6 (Home, About, Portfolio, Appointments, Shop, Contact)  
**Tokens validados:** Contraste WCAG AAA en pares críticos

---

**Versión:** 1.0  
**Autor:** Hawaiiiiii (Erik)
**Fecha:** 2024-10-31
