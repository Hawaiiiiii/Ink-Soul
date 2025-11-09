-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
  price DECIMAL NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('prints', 'merchandise', 'aftercare')),
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_limited_edition BOOLEAN DEFAULT FALSE,
  edition_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas para products
DROP POLICY IF EXISTS "Allow public read products" ON products;
CREATE POLICY "Allow public read products" ON products 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert products via service_role" ON products;
CREATE POLICY "Allow insert products via service_role" ON products 
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow update products service_role" ON products;
CREATE POLICY "Allow update products service_role" ON products 
  FOR UPDATE USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow delete products service_role" ON products;
CREATE POLICY "Allow delete products service_role" ON products 
  FOR DELETE USING (auth.role() = 'service_role');

-- Insertar todos los productos (5 originales + 10 nuevos)
INSERT INTO products (name, name_en, description, description_en, price, category, image_url, stock, is_limited_edition, edition_number) VALUES
-- Productos Originales
(
  'Print "Corazón Sagrado"',
  'Sacred Heart Print',
  'Impresión de alta calidad en papel arte 300gsm. Diseño exclusivo de corazón devocional con detalles dorados.',
  'High quality art print on 300gsm art paper. Exclusive devotional heart design with golden details.',
  45.00,
  'prints',
  '/images/328DA9C2-D48A-49B5-966C-EAA99DCFBF63.png',
  20,
  true,
  'I/XX'
),
(
  'Sudadera Negra "IS"',
  'Black Hoodie "IS"',
  'Sudadera premium 100% algodón con logo "Ink & Soul" bordado en hilo dorado. Ribete dorado en capucha.',
  'Premium 100% cotton hoodie with embroidered "Ink & Soul" logo in golden thread. Golden trim on hood.',
  65.00,
  'merchandise',
  '/images/85BC295A-26BE-4C66-8CF2-A2A233667F44.png',
  15,
  false,
  null
),
(
  'Set Cuidado Post-Tatuaje',
  'Tattoo Aftercare Set',
  'Kit completo profesional: crema cicatrizante, jabón neutro pH 5.5, film protector. Incluye instrucciones detalladas.',
  'Complete professional kit: healing cream, neutral pH 5.5 soap, protective film. Includes detailed instructions.',
  25.00,
  'aftercare',
  '/images/B435F045-4B41-4C84-8B2E-F1EB908027A8.png',
  50,
  false,
  null
),
(
  'Print "Mandala Espiritual"',
  'Spiritual Mandala Print',
  'Diseño exclusivo de geometría sagrada inspirado en la Flor de la Vida. Edición limitada firmada.',
  'Exclusive sacred geometry design inspired by the Flower of Life. Limited edition signed print.',
  50.00,
  'prints',
  '/images/D1A4CEC2-EFF7-46ED-BA12-C2B52F09FA5F.png',
  10,
  true,
  'II/X'
),
(
  'Camiseta "Fineline Art"',
  'Fineline Art T-Shirt',
  'Camiseta unisex negra con diseño fineline exclusivo estampado en alta calidad.',
  'Unisex black t-shirt with exclusive fineline design in high quality print.',
  30.00,
  'merchandise',
  '/images/328DA9C2-D48A-49B5-966C-EAA99DCFBF63.png',
  25,
  false,
  null
),

-- Nuevos Productos (10)
(
  'Vesica Divina Dorada: Arte de la Creación',
  'Golden Vesica Divina: Art of Creation',
  'Arte mural de geometría sagrada en dorado sobre fondo negro, inspirado en la Vesica Piscis. Impresión premium en papel museo.',
  'Sacred geometry wall art in golden on black background, inspired by Vesica Piscis. Premium museum paper print.',
  120.00,
  'prints',
  '/images/IMG_0139.png',
  5,
  true,
  'I/V'
),
(
  'Runa de Restauración - Impresión Esotérica',
  'Restoration Rune - Esoteric Print',
  'Diseño circular de geometría sagrada con líneas doradas y tonos burdeos. Impresión de alta calidad en papel arte 300gsm.',
  'Circular sacred geometry design with golden lines and burgundy tones. High quality art print on 300gsm paper.',
  55.00,
  'prints',
  '/images/IMG_0140.png',
  12,
  false,
  null
),
(
  'Hoodie Legado Dorado',
  'Golden Legacy Hoodie',
  'Sudadera negra con capucha, logotipo AMR bordado en hilo dorado. Diseño exclusivo de alta calidad.',
  'Black hoodie with AMR logo embroidered in golden thread. Exclusive high-quality design.',
  79.99,
  'merchandise',
  '/images/IMG_0141.png',
  20,
  false,
  null
),
(
  'Tote Emblema ASUNAH',
  'ASUNAH Emblem Tote',
  'Bolsa de tela negra con emblema ASUNAH dorado metálico. Perfecta para llevar tus esenciales con estilo.',
  'Black fabric tote bag with metallic golden ASUNAH emblem. Perfect for carrying your essentials in style.',
  39.99,
  'merchandise',
  '/images/IMG_0142.png',
  30,
  false,
  null
),
(
  'La Restauradora - Devotional Ointment',
  'The Restorer - Devotional Ointment',
  'Ungüento devocional en tarro de vidrio ámbar para cuidado de tatuajes. Fórmula sagrada con ingredientes naturales.',
  'Devotional ointment in amber glass jar for tattoo care. Sacred formula with natural ingredients.',
  39.99,
  'aftercare',
  '/images/IMG_0143.png',
  25,
  false,
  null
),
(
  'Ritual Protective Balm Sacred Skincare',
  'Ritual Protective Balm Sacred Skincare',
  'Bálsamo protector negro mate con sello dorado, película protectora. Protección ritual para tu piel.',
  'Matte black protective balm with golden seal, protective film. Ritual protection for your skin.',
  34.99,
  'aftercare',
  '/images/IMG_0144.png',
  30,
  false,
  null
),
(
  'Sudadera Hoodie ASUNAAH - La Restauradora',
  'ASUNAAH Hoodie - The Restorer',
  'Sudadera negra con diseño de geometría sagrada dorada. Arte devocional que refleja el poder de la restauración.',
  'Black hoodie with golden sacred geometry design. Devotional art reflecting the power of restoration.',
  69.99,
  'merchandise',
  '/images/IMG_0145.png',
  18,
  false,
  null
),
(
  'Sudadera ASUNAAH Geometría Cósmica',
  'ASUNAAH Cosmic Geometry Hoodie',
  'Sudadera blanca con diseño esotérico y símbolos sagrados. Geometría cósmica en cada detalle.',
  'White hoodie with esoteric design and sacred symbols. Cosmic geometry in every detail.',
  69.99,
  'merchandise',
  '/images/IMG_0146.png',
  18,
  false,
  null
),
(
  'Camiseta Asurash - La Redención',
  'Asurash T-Shirt - Redemption',
  'Camiseta negra con diseño geométrico dorado y mensaje místico. Arte sagrado que conecta con lo divino.',
  'Black t-shirt with golden geometric design and mystical message. Sacred art that connects with the divine.',
  39.99,
  'merchandise',
  '/images/IMG_0147.png',
  25,
  false,
  null
),
(
  'Taza Ritual Térmica Sacred Ember',
  'Sacred Ember Thermal Ritual Mug',
  'Set de 3 tumblers térmicos Sacred Coffee en colores negro, burdeos y crema. Mantén tu ritual de café sagrado.',
  'Set of 3 Sacred Coffee thermal tumblers in black, burgundy and cream. Keep your sacred coffee ritual.',
  45.99,
  'merchandise',
  '/images/IMG_0148.png',
  15,
  false,
  null
);
