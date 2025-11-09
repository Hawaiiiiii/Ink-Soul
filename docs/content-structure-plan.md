# Plan de Estructura de Contenido - Ink & Soul by Asunaah

## 1. Inventario de Materiales

**Archivos Visuales:**
- `user_input_files/328DA9C2-D48A-49B5-966C-EAA99DCFBF63.png` - Mockup web con logo "IS", paleta, portfolio (Jesús, Mandala, Buda)
- `user_input_files/5c566762-e26f-4a60-a3f8-67773a1c379e.jpeg` - Retrato Asunaah con iluminación dramática, fondo burdeos
- `user_input_files/031d8acf-d9b0-4659-938b-9be4e038f878.jpeg` - Retrato profesional con suéter crema, fondo oscuro
- `user_input_files/18c0efc9-5786-4b28-8200-cdf2227f7723.jpeg` - Asunaah en París con Torre Eiffel
- `user_input_files/9871b5bd-a200-4313-98db-d76c12a7af2b.jpeg` - Selfie con luz natural, teléfono naranja
- `user_input_files/85BC295A-26BE-4C66-8CF2-A2A233667F44.png` - Recurso adicional de branding
- `user_input_files/B435F045-4B41-4C84-8B2E-F1EB908027A8.png` - Recurso adicional de branding
- `user_input_files/D1A4CEC2-EFF7-46ED-BA12-C2B52F09FA5F.png` - Recurso adicional de branding
- `user_input_files/f9195231-3b74-484e-915c-1b93d6e9909b.jpeg` - Recurso adicional de branding

**Elementos Identificados:**
- Logo circular "IS" con geometría sagrada
- Paleta: Negro carbón, dorado envejecido, burdeos, índigo
- Tipografías: Playfair Display, Inter
- Ejemplos de tatuajes: Jesús (devocional), Mandala (geometría), Buda (espiritual)
- Fotografías profesionales de la artista con estética misteriosa/elegante
- Certificado de autenticidad visual (estética de documento premium)

## 2. Estructura del Sitio Web

**Tipo:** MPA (Multi-Page Application)

**Razonamiento:** 
- 6 páginas distintas con propósitos únicos (Home, About, Portfolio, Appointments, Shop, Contact)
- Cada página requiere experiencia diferenciada (galería inmersiva vs formulario de citas vs tienda)
- Contenido rico: galería de portfolio, biografía de artista, productos de shop, sistema de reservas
- Optimización SEO para cada sección (páginas indexables independientes)
- Audiencia diversa: clientes nuevos (Home), curiosos (Portfolio), compradores (Shop), interesados en agendar (Appointments)

## 3. Desglose de Páginas/Secciones

### Página 1: Home (`/` o `/home`)
**Propósito:** Impacto inmediato, establecer atmósfera sacra, conversión a portfolio o citas

**Mapeo de Contenido:**

| Sección | Patrón de Componente | Contenido a Extraer | Asset Visual (Solo Contenido) |
|---------|---------------------|---------------------|-------------------------------|
| Hero Devocional | Hero Pattern | Título: "Ink & Soul by Asunaah"<br>Eslogan: "Fineline · Sacred & Symbolic Tattooing"<br>CTA: "Ver Portfolio" + "Agendar Cita" | `328DA9C2-D48A-49B5-966C-EAA99DCFBF63.png` (logo "IS") |
| Manifiesto | 2-column asymmetric (60/40) | Texto: "Arte que deja huella en el alma. Tatuaje devocional contemporáneo que fusiona fineline con símbolos sagrados y geometría espiritual." | - |
| Featured Works | Card Grid (3 tatuajes destacados) | Nombres: "Cristo Redentor", "Mandala Flor de la Vida", "Buda en Meditación"<br>Categorías: Devocional, Geometría, Espiritual | `328DA9C2-D48A-49B5-966C-EAA99DCFBF63.png` (extractos de portfolio) |
| Especialidades | Icon + Text Grid (3 cols) | - Fineline Precision<br>- Sacred Symbolism<br>- Custom Devotional Designs | - |
| CTA Final | Centered CTA Section | "Comienza tu viaje espiritual"<br>Botón: "Agendar Consulta" | - |

---

### Página 2: About (`/about`)
**Propósito:** Conectar con la artista, credibilidad, historia personal

**Mapeo de Contenido:**

| Sección | Patrón de Componente | Contenido a Extraer | Asset Visual (Solo Contenido) |
|---------|---------------------|---------------------|-------------------------------|
| Hero About | Hero Pattern (altura media 400px) | Título: "La Artista"<br>Subtítulo: "Asunaah - Tattoo Artist & Spiritual Guide" | - |
| Biografía | 50/50 Split (imagen + texto) | Texto: "Especialista en tatuaje devocional contemporáneo. Fusiono técnica fineline con símbolos sagrados para crear piezas únicas que trascienden lo estético y conectan con el alma del portador."<br>Años de experiencia, filosofía de trabajo | `5c566762-e26f-4a60-a3f8-67773a1c379e.jpeg` (retrato dramático) |
| Proceso Creativo | Timeline Pattern | Pasos: 1) Consulta Espiritual, 2) Diseño Personalizado, 3) Ritual de Tatuaje, 4) Cuidado Post-Sagrado | - |
| Certificaciones | Badge Grid | Texto: Certificaciones, entrenamientos, años activa | - |
| Galería Personal | Image Gallery (2-3 fotos) | Fotos de la artista en estudio, proceso de trabajo | `031d8acf-d9b0-4659-938b-9be4e038f878.jpeg`, `18c0efc9-5786-4b28-8200-cdf2227f7723.jpeg` |

---

### Página 3: Portfolio (`/portfolio`)
**Propósito:** Galería inmersiva de trabajos, categorización por temática

**Mapeo de Contenido:**

| Sección | Patrón de Componente | Contenido a Extraer | Asset Visual (Solo Contenido) |
|---------|---------------------|---------------------|-------------------------------|
| Hero Portfolio | Hero Pattern (mínimo) | Título: "Trabajos Sacros"<br>Filtros: Todos / Devocional / Geometría / Espiritual / Simbólico | - |
| Galería Masonry | Masonry Grid (col-width 320px, gap 24px) | Proyectos: Cristo, Mandala, Buda, Geometría Sagrada, Símbolos Místicos<br>Cada proyecto: Título + Categoría + Tamaño | `328DA9C2-D48A-49B5-966C-EAA99DCFBF63.png` (ejemplos de portfolio) |
| Lightbox Modal | Modal Pattern | Imagen ampliada + descripción + duración de sesión | - |

**Nota:** Las imágenes de tatuajes reales deberán ser proporcionadas por el cliente o generadas durante desarrollo.

---

### Página 4: Appointments (`/appointments`)
**Propósito:** Sistema de reservas, calendario disponibilidad, formulario de consulta

**Mapeo de Contenido:**

| Sección | Patrón de Componente | Contenido a Extraer | Asset Visual (Solo Contenido) |
|---------|---------------------|---------------------|-------------------------------|
| Hero Appointments | Hero Pattern (altura media) | Título: "Agenda tu Sesión"<br>Subtítulo: "Comienza tu viaje espiritual con una consulta personalizada" | - |
| Formulario Consulta | Form Layout (single col 600px) | Campos: Nombre, Email, Teléfono, Tipo de Proyecto (select), Descripción del Diseño (textarea), Zona del Cuerpo, Fecha Preferida | - |
| Calendario | Calendar Widget | Disponibilidad: Mostrar días libres/ocupados (Abril 2024 como referencia del mockup) | `328DA9C2-D48A-49B5-966C-EAA99DCFBF63.png` (ejemplo de calendario) |
| Políticas | Accordion/Text Block | - Depósito requerido<br>- Política de cancelación<br>- Preparación para sesión<br>- Cuidado post-tatuaje | - |
| Ubicación | Map + Contact Info | Dirección del estudio (placeholder)<br>Horarios de atención | - |

---

### Página 5: Shop (`/shop`)
**Propósito:** Venta de productos relacionados (prints, merchandise, aftercare)

**Mapeo de Contenido:**

| Sección | Patrón de Componente | Contenido a Extraer | Asset Visual (Solo Contenido) |
|---------|---------------------|---------------------|-------------------------------|
| Hero Shop | Hero Pattern (mínimo) | Título: "Tienda Sacra"<br>Subtítulo: "Arte devocional y productos de cuidado" | - |
| Grid Productos | Product Card Grid (3-4 cols) | Producto ejemplo: "Corazón Sagrado" (print/art)<br>Precio, descripción, botón "Comprar" | `328DA9C2-D48A-49B5-966C-EAA99DCFBF63.png` (ejemplo "Corazón Sagrado") |
| Categorías | Tab Filters | Tabs: Prints / Merchandise / Aftercare / Gift Cards | - |
| Producto Detail | Product Detail Layout | Imagen grande + galería thumbnails, descripción, precio, cantidad, add to cart | - |

**Nota:** El sistema de e-commerce completo (carrito, checkout, pagos) será integrado durante desarrollo.

---

### Página 6: Contact (`/contact`)
**Propósito:** Información de contacto, redes sociales, formulario de consultas generales

**Mapeo de Contenido:**

| Sección | Patrón de Componente | Contenido a Extraer | Asset Visual (Solo Contenido) |
|---------|---------------------|---------------------|-------------------------------|
| Hero Contact | Hero Pattern (mínimo) | Título: "Conéctate"<br>Subtítulo: "Resuelve tus dudas o agenda una consulta" | - |
| Formulario Contacto | Form Layout (single col) | Campos: Nombre, Email, Asunto, Mensaje | - |
| Información | 2-col Layout | Columna 1: Email, Teléfono, Dirección<br>Columna 2: Horarios, Instagram, WhatsApp | - |
| Redes Sociales | Social Link Grid | Instagram, WhatsApp, Email (con iconos SVG) | - |
| Mapa | Embedded Map | Ubicación del estudio (placeholder o real) | - |

---

### Componente Global: Footer (en todas las páginas)
**Contenido:**
- Copyright: "© 2024 Ink & Soul by Asunaah. Todos los derechos reservados."
- Enlaces rápidos: Home, About, Portfolio, Appointments, Shop, Contact
- Redes sociales: Instagram, WhatsApp, Email (iconos SVG)
- Selector de idioma: ES / EN
- Logo "IS" pequeño centrado o izquierda

---

### Componente Global: Navigation (en todas las páginas)
**Contenido:**
- Logo "IS" izquierda (enlace a Home)
- Menú: Home · About · Portfolio · Appointments · Shop · Contact
- CTA derecha: "Agendar Cita" (botón con halo dorado)
- Selector de idioma: ES / EN (top-right)

---

## 4. Análisis de Contenido

**Densidad de Información:** Media-Alta
- 6 páginas independientes con contenido especializado
- Portfolio con galería extensa (15-30 proyectos estimados)
- Shop con múltiples productos
- Formularios complejos (appointments, contact)
- Sistema de calendario integrado

**Balance de Contenido:**
- **Imágenes:** ~25-40 (portfolio dominante, fotos de artista, productos, logos)
- **Texto:** ~2000-3000 palabras totales (distribuidas en 6 páginas)
- **Componentes Interactivos:** Formularios (2), calendario (1), galería lightbox (1), filtros (2)
- **Tipo de Contenido:** Visual-focused con soporte textual (70% imágenes/30% texto)

**Características Especiales:**
- **Estética devocional:** Requiere tratamiento visual reverencial
- **Galería inmersiva:** Portfolio es centro de conversión
- **Multiidioma:** ES/EN en toda la experiencia
- **E-commerce integrado:** Sistema de tienda completo
- **Reservas:** Sistema de agendamiento con calendario

---

**Fecha de Creación:** 2024-10-31  
**Autor:** Hawaiiiiii (Erik)
