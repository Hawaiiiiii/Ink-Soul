# Módulo Flash Tattoo - Documentación Completa

## Descripción General

El módulo Flash Tattoo es un sistema bilingüe (español/inglés) completo para gestionar eventos Flash de tatuajes en Ink & Soul Tattoo Studio. Permite promocionar diseños exclusivos en fechas temáticas específicas, con banners rotativos automáticos en la página principal y gestión completa de eventos activos y pasados.

---

## Estructura del Módulo

### Base de Datos

**Tabla: `flash_events`**

```sql
CREATE TABLE flash_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title_es VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  rules_es TEXT NOT NULL,
  rules_en TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  hero_image VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE flash_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES flash_events(id) ON DELETE CASCADE,
  title_es VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  description_es TEXT,
  description_en TEXT,
  image_url VARCHAR(500) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Componentes Frontend

#### Componentes de Visualización
- **`HomeFlashBanner`**: Banner rotativo automático (5 segundos) en página principal
- **`FlashEventCard`**: Tarjeta de evento para listados
- **`FlashDesignCard`**: Tarjeta de diseño individual
- **`FlashDesignModal`**: Modal de detalle de diseño con opción de reserva

#### Páginas
- **`FlashEventsPage`** (`/flash`): Listado de eventos activos/próximos
- **`FlashEventDetailPage`** (`/flash/:slug`): Detalle de evento con galería de diseños
- **`FlashPastEventsPage`** (`/flash/pasados`): Archivo de eventos finalizados

---

## Eventos Predefinidos

### 1. **Halloween 2025: Oscuridad y Misterio**
- **Slug**: `halloween-2025`
- **Fechas**: 15 Oct 2025 - 31 Oct 2025
- **Temática**: Calaveras, brujas, calabazas, fantasmas, símbolos góticos
- **Descripción ES**: Flash exclusivo de Halloween 2025 con diseños oscuros y misteriosos. Calaveras, brujas, calabazas y símbolos góticos para celebrar la noche más terrorífica del año.
- **Descripción EN**: Exclusive Halloween 2025 Flash with dark and mysterious designs. Skulls, witches, pumpkins, and gothic symbols to celebrate the most terrifying night of the year.

### 2. **Christmas Anime Flash 2025**
- **Slug**: `christmas-anime-2025`
- **Fechas**: 1 Dic 2025 - 25 Dic 2025
- **Temática**: Personajes anime navideños, símbolos festivos japoneses
- **Descripción ES**: Fusión única de Navidad y cultura anime. Personajes icónicos del manga y anime con temática navideña para los amantes de la cultura japonesa.
- **Descripción EN**: Unique fusion of Christmas and anime culture. Iconic manga and anime characters with Christmas theme for Japanese culture lovers.

### 3. **San Valentín 2026: Amor y Pasión**
- **Slug**: `san-valentin-2026`
- **Fechas**: 1 Feb 2026 - 14 Feb 2026
- **Temática**: Corazones, rosas, símbolos románticos
- **Descripción ES**: Flash especial de San Valentín 2026 con diseños románticos y pasionales. Corazones, rosas y símbolos de amor para celebrar el día de los enamorados.
- **Descripción EN**: Special Valentine's Day 2026 Flash with romantic and passionate designs. Hearts, roses, and love symbols to celebrate lovers' day.

### 4. **Primavera Bizarre 2026**
- **Slug**: `primavera-bizarre-2026`
- **Fechas**: 15 Mar 2026 - 31 Mar 2026
- **Temática**: Flores surrealistas, mariposas extrañas, naturaleza psicodélica
- **Descripción ES**: Celebra la primavera con un toque bizarre y surrealista. Flores mutantes, mariposas extrañas y elementos naturales con estética psicodélica única.
- **Descripción EN**: Celebrate spring with a bizarre and surrealist touch. Mutant flowers, strange butterflies, and natural elements with unique psychedelic aesthetics.

### 5. **Granada Souvenirs: Memoria Local**
- **Slug**: `granada-souvenirs`
- **Fechas**: 1 Abr 2026 - 30 Abr 2026
- **Temática**: Alhambra, granada (fruta), símbolos locales
- **Descripción ES**: Colección permanente inspirada en la belleza de Granada. Elementos de la Alhambra, la granada como símbolo, y la esencia de nuestra ciudad convertidos en arte corporal.
- **Descripción EN**: Permanent collection inspired by Granada's beauty. Alhambra elements, pomegranate as symbol, and the essence of our city converted into body art.

### 6. **Feria y Olé 2026: Tradición Andaluza**
- **Slug**: `feria-ole-2026`
- **Fechas**: 1 May 2026 - 20 May 2026
- **Temática**: Flamenca, abanicos, faroles, motivos flamencos
- **Descripción ES**: Flash especial de Feria con todo el sabor andaluz. Flamencas, abanicos, faroles y motivos flamencos para celebrar la cultura más auténtica de Andalucía.
- **Descripción EN**: Special Feria Flash with all the Andalusian flavor. Flamenco dancers, fans, lanterns, and flamenco motifs to celebrate the most authentic culture of Andalusia.

### 7. **Japanese Manga Flash: Arte Japonés**
- **Slug**: `japanese-manga-flash`
- **Fechas**: 15 Jun 2026 - 30 Jun 2026
- **Temática**: Personajes manga, kanji, ondas japonesas
- **Descripción ES**: Evento especial dedicado al arte del manga japonés. Personajes icónicos, kanji tradicionales y elementos de la cultura visual japonesa en diseños exclusivos.
- **Descripción EN**: Special event dedicated to Japanese manga art. Iconic characters, traditional kanji, and elements of Japanese visual culture in exclusive designs.

---

## Bloques de Reglas Estándar

Todos los eventos incluyen automáticamente estos bloques de reglas en ambos idiomas:

### Español
```
📅 Reserva tu cita
Las plazas son limitadas. Contacta con nosotros para reservar tu diseño favorito antes de que se agote.

💰 Precios especiales
Todos los diseños Flash tienen precios reducidos exclusivos del evento. Los precios mostrados son finales.

⚡ Diseño único
Cada diseño Flash se tatúa un número limitado de veces para garantizar exclusividad.

📍 En nuestro estudio
Todos los tatuajes se realizan en Ink & Soul Tattoo Studio, Granada.
```

### English
```
📅 Book your appointment
Places are limited. Contact us to reserve your favorite design before it runs out.

💰 Special prices
All Flash designs have exclusive reduced prices for the event. Prices shown are final.

⚡ Unique design
Each Flash design is tattooed a limited number of times to guarantee exclusivity.

📍 At our studio
All tattoos are done at Ink & Soul Tattoo Studio, Granada.
```

---

## Rutas Disponibles

### Rutas Públicas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `HomePage` | Incluye `HomeFlashBanner` (banner rotativo automático) |
| `/flash` | `FlashEventsPage` | Lista eventos activos y próximos (ordenados por `start_at`) |
| `/flash/pasados` | `FlashPastEventsPage` | Archivo de eventos finalizados (ordenados por `start_at` DESC) |
| `/flash/:slug` | `FlashEventDetailPage` | Detalle de evento con galería de diseños |

### Navegación

**Banner en Home** → Clic en evento → `/flash/:slug` (Detalle del evento)

**Página Flash** → "Ver eventos pasados" → `/flash/pasados`

**Eventos Pasados** → "Ver eventos activos" → `/flash`

---

## Funcionalidades Principales

### 1. Banner Rotativo en Home
- **Ubicación**: Entre Hero y Manifiesto en `HomePage`
- **Rotación**: Automática cada 5 segundos
- **Filtrado**: Solo eventos activos o próximos (donde `now() <= end_at`)
- **Contenido**: Título, fecha inicio, CTA "Ver detalles"
- **Comportamiento**: Navegación manual con flechas + auto-rotación

### 2. Listado de Eventos Activos
- **Página**: `/flash`
- **Filtro SQL**: `WHERE end_at >= now()`
- **Orden**: Cronológico ascendente por `start_at`
- **Estado**: Muestra "Activo" o fecha de inicio si es futuro
- **Cards**: Imagen hero, título bilingüe, fechas, descripción corta

### 3. Archivo de Eventos Pasados
- **Página**: `/flash/pasados`
- **Filtro SQL**: `WHERE end_at < now()`
- **Orden**: Cronológico descendente por `start_at` (más recientes primero)
- **Badge**: "Finalizado/Finished" visible en cada card
- **Propósito**: Portafolio histórico de eventos Flash

### 4. Detalle de Evento
- **Página**: `/flash/:slug`
- **Contenido**: 
  - Hero con imagen del evento
  - Fechas del evento
  - Descripción completa bilingüe
  - Bloque de reglas estándar
  - Galería de diseños Flash disponibles
- **Interacción**: Modal de diseño individual con opción "Reservar cita"

---

## Sistema Bilingüe

### Hook de Idioma
```typescript
import { useLanguage } from '../contexts/LanguageContext'

const { language, t } = useLanguage()
```

### Acceso a Contenido
```typescript
// Títulos
const title = language === 'es' ? event.title_es : event.title_en

// Descripciones
const description = language === 'es' ? event.description_es : event.description_en

// Reglas
const rules = language === 'es' ? event.rules_es : event.rules_en
```

### Traducciones i18n
Las traducciones estáticas están en `src/lib/i18n.ts`:
```typescript
flash: {
  es: {
    title: 'Flash Tattoo',
    events: 'Eventos Flash',
    pastEvents: 'Eventos Pasados',
    viewPastEvents: 'Ver eventos pasados',
    // ...
  },
  en: {
    title: 'Flash Tattoo',
    events: 'Flash Events',
    pastEvents: 'Past Events',
    viewPastEvents: 'View past events',
    // ...
  }
}
```

---

## Guía de Administración

### Crear un Nuevo Evento Flash

#### 1. Insertar Evento en Base de Datos
```sql
INSERT INTO flash_events (
  slug, 
  title_es, 
  title_en,
  description_es,
  description_en,
  rules_es,
  rules_en,
  start_at,
  end_at,
  hero_image
) VALUES (
  'mi-evento-2026',
  'Mi Evento Flash 2026',
  'My Flash Event 2026',
  'Descripción completa del evento en español...',
  'Full event description in English...',
  '📅 Reserva tu cita\nLas plazas son limitadas...',
  '📅 Book your appointment\nPlaces are limited...',
  '2026-07-01 00:00:00+00',
  '2026-07-31 23:59:59+00',
  'https://example.com/hero-image.jpg'
);
```

#### 2. Agregar Diseños Flash
```sql
INSERT INTO flash_designs (
  event_id,
  title_es,
  title_en,
  description_es,
  description_en,
  image_url,
  price,
  is_available
) VALUES (
  (SELECT id FROM flash_events WHERE slug = 'mi-evento-2026'),
  'Diseño 1',
  'Design 1',
  'Descripción en español',
  'Description in English',
  'https://example.com/design1.jpg',
  80.00,
  true
);
```

### Actualizar Estado de Disponibilidad
```sql
-- Marcar diseño como no disponible
UPDATE flash_designs 
SET is_available = false 
WHERE id = 'uuid-del-diseño';

-- Marcar todos los diseños de un evento como no disponibles
UPDATE flash_designs 
SET is_available = false 
WHERE event_id = (SELECT id FROM flash_events WHERE slug = 'mi-evento-2026');
```

### Extender Fechas de un Evento
```sql
UPDATE flash_events 
SET end_at = '2026-08-15 23:59:59+00',
    updated_at = now()
WHERE slug = 'mi-evento-2026';
```

### Eliminar un Evento (y todos sus diseños)
```sql
-- Los diseños se eliminan automáticamente por CASCADE
DELETE FROM flash_events WHERE slug = 'mi-evento-2026';
```

---

## Integración con Sistema de Citas

El módulo Flash se integra con el sistema de citas mediante el componente `BookingModal`:

```typescript
import { BookingModal } from '../components/BookingModal'

<BookingModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  prefilledMessage={`Quiero reservar el diseño Flash: "${design.title_es}"`}
/>
```

Cuando un usuario hace clic en "Reservar cita" desde un diseño Flash, se abre el modal de citas con un mensaje prellenado indicando qué diseño desea.

---

## Consideraciones Técnicas

### Performance
- **Banner rotativo**: Usa `useEffect` con cleanup para evitar memory leaks
- **Imágenes**: Se recomienda usar formatos optimizados (WebP) con fallback
- **Lazy loading**: Las imágenes de diseños se cargan bajo demanda

### Responsive Design
- **Mobile**: Cards en columna única, banner con navegación táctil
- **Tablet**: Grid de 2 columnas para diseños
- **Desktop**: Grid de 3-4 columnas para galería de diseños

### SEO
- Cada evento tiene un slug único para URLs amigables
- Títulos bilingües para mejor indexación
- Meta descriptions dinámicas basadas en descripciones de eventos

### Accesibilidad
- Navegación por teclado en banner rotativo
- Alt text en todas las imágenes
- Contraste adecuado en badges de estado
- Semántica HTML correcta

---

## Mantenimiento y Mejoras Futuras

### Próximas Funcionalidades Sugeridas
1. **Panel de administración**: CRUD visual de eventos y diseños
2. **Notificaciones**: Alertas por email cuando se acerca un evento
3. **Sistema de favoritos**: Usuarios pueden guardar diseños favoritos
4. **Galería de realizados**: Fotos de diseños Flash tatuados
5. **Contador de disponibilidad**: Mostrar cuántas plazas quedan
6. **Filtros avanzados**: Por temática, precio, artista

### Actualizaciones Regulares
- Revisar eventos finalizados cada mes
- Actualizar imágenes hero con contenido de alta calidad
- Ajustar precios según demanda
- Agregar nuevos eventos temáticos con 1-2 meses de anticipación

---

## Contacto y Soporte

Para consultas técnicas sobre este módulo:
- **Desarrollador**: MiniMax Agent
- **Proyecto**: Ink & Soul Tattoo Studio
- **Fecha de implementación**: Noviembre 2025
- **Versión**: 1.0.0

---

## Changelog

### v1.0.0 (Noviembre 2025)
- ✅ Implementación inicial del módulo Flash bilingüe
- ✅ Base de datos con campos bilingües (title, description, rules)
- ✅ 7 eventos predefinidos para 2025-2026
- ✅ Banner rotativo automático en Home
- ✅ Página de eventos pasados (`/flash/pasados`)
- ✅ Sistema de reglas estándar automático
- ✅ Integración completa con sistema i18n
- ✅ Responsive design para todos los dispositivos
- ✅ Integración con sistema de citas existente
