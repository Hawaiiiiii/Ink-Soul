-- Insertar productos de ejemplo para la tienda
INSERT INTO products (name, name_en, description, description_en, price, category, image_url, stock, is_limited_edition, edition_number) VALUES
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
  'Print "Geometría Devocional"',
  'Devotional Geometry Print',
  'Fusión de símbolos cristianos con geometría sagrada. Papel museo 250gsm.',
  'Fusion of Christian symbols with sacred geometry. Museum paper 250gsm.',
  48.00,
  'prints',
  '/images/f9195231-3b74-484e-915c-1b93d6e9909b.jpeg',
  12,
  true,
  'III/XV'
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
);
