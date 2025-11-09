-- Ink & Soul - Asunaah · La Restauradora
-- Datos de prueba para desarrollo y testing
-- Fecha: 2025-11-06
-- Versión: 1.0.0

-- ===========================================
-- DATOS DE PRUEBA PARA PRODUCTS
-- ===========================================

-- Insertar productos de ejemplo para testing
INSERT INTO products (id, name, description, style, size_category, base_price, duration_minutes, complexity_level, images, tags, available_sizes, color_options, is_custom_design) VALUES

-- Tatuajes tradicionales
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Rosa Negra Clásica', 'Rosa tradicional en estilo old school con contornos gruesos y colores saturados', 'tradicional', 'mediano', 150.00, 120, 3, '["https://example.com/rose1.jpg", "https://example.com/rose2.jpg"]', '["rosa", "tradicional", "old-school"]', '["pequeño", "mediano", "grande"]', '["negro", "rojo", "verde"]', false),

('b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Águila Americana', 'Águila en vuelo con alas extendidas, estilo tradicional americano', 'tradicional', 'grande', 300.00, 240, 4, '["https://example.com/eagle1.jpg", "https://example.com/eagle2.jpg"]', '["águila", "tradicional", "americano"]', '["mediano", "grande", "custom"]', '["negro", "colorido"]', false),

('c3d4e5f6-g7h8-9012-cdef-345678901234', 'Ancla Marinera', 'Ancla clásica con cuerda y detalles náuticos', 'tradicional', 'pequeño', 80.00, 60, 2, '["https://example.com/anchor1.jpg"]', '["ancla", "marino", "tradicional"]', '["pequeño", "mediano"]', '["negro", "azul"]', false),

-- Tatuajes realistas
('d4e5f6g7-h8i9-0123-defg-456789012345', 'Retrato Realista', 'Retrato hiperrealista con sombreado y transiciones suaves', 'realista', 'grande', 500.00, 480, 5, '["https://example.com/portrait1.jpg", "https://example.com/portrait2.jpg"]', '["retrato", "realista", "blackwork"]', '["mediano", "grande", "custom"]', '["negro", "grises"]', false),

('e5f6g7h8-i9j0-1234-efgh-567890123456', 'Lobo Silueta', 'Silueta de lobo aullando a la luna llena', 'realista', 'mediano', 250.00, 180, 3, '["https://example.com/wolf1.jpg"]', '["lobo", "silueta", "natural"]', '["pequeño", "mediano", "grande"]', '["negro", "grises"]', false),

-- Tatuajes geométricos
('f6g7h8i9-j0k1-2345-fghi-678901234567', 'Mandala Circular', 'Diseño geométrico con patrones simétricos y detalles intrincados', 'geométrico', 'mediano', 200.00, 150, 4, '["https://example.com/mandala1.jpg", "https://example.com/mandala2.jpg"]', '["mandala", "geométrico", "simétrico"]', '["pequeño", "mediano", "grande"]', '["negro", "colorido"]', false),

('g7h8i9j0-k1l2-3456-ghij-789012345678', 'Líneas Abstractas', 'Patrón geométrico moderno con líneas entrecruzadas', 'geométrico', 'pequeño', 100.00, 90, 2, '["https://example.com/lines1.jpg"]', '["geométrico", "moderno", "líneas"]', '["pequeño", "mediano"]', '["negro", "azul"]', false),

-- Tatuajes acuarela
('h8i9j0k1-l2m3-4567-hijk-890123456789', 'Mariposa Acuarela', 'Mariposa con técnica de acuarela y salpicaduras de color', 'acuarela', 'mediano', 180.00, 120, 3, '["https://example.com/butterfly1.jpg", "https://example.com/butterfly2.jpg"]', '["mariposa", "acuarela", "color"]', '["pequeño", "mediano", "grande"]', '["multicolor", "pastel"]', false),

('i9j0k1l2-m3n4-5678-ijkl-901234567890', 'Flor Silvestre', 'Flores con técnica de acuarela y hojas susurrantes', 'acuarela', 'mediano', 160.00, 100, 3, '["https://example.com/flowers1.jpg"]', '["flores", "acuarela", "natural"]', '["pequeño", "mediano", "grande"]', '["multicolor", "vibrante"]', false),

-- Tatuajes neo-tradicional
('j0k1l2m3-n4o5-6789-jklm-012345678901', 'Jaguar Neo-Tribal', 'Diseño contemporáneo con elementos tribales y fluidos', 'neo-tradicional', 'grande', 350.00, 300, 4, '["https://example.com/jaguar1.jpg", "https://example.com/jaguar2.jpg"]', '["jaguar", "neo-tradicional", "tribal"]', '["mediano", "grande", "custom"]', '["negro", "dorado"]', false),

('k1l2m3n4-o5p6-7890-klmn-123456789012', 'Diseño Personalizado', 'Tatuaje completamente personalizado según especificaciones del cliente', 'personalizado', 'custom', 0.00, 480, 5, '["https://example.com/custom1.jpg", "https://example.com/custom2.jpg"]', '["personalizado", "custom", "diseño"]', '["custom"]', '["todos"]', true);

-- ===========================================
-- DATOS DE PRUEBA PARA PROFILES (USUARIOS)
-- ===========================================

-- NOTA: Estos perfiles no tienen usuarios reales en auth.users
-- Solo para testing de frontend con datos mock
-- En producción real, estos perfiles se crean automáticamente con auth.users

INSERT INTO profiles (id, email, full_name, phone, instagram_handle, preferred_styles, allergies, medical_conditions, emergency_contact_name, emergency_contact_phone, role) VALUES

('u1-23456789-0123-4567-8901-234567890123', 'ana.garcia@email.com', 'Ana García', '+34 600 123 456', '@anagarcia_art', '["tradicional", "acuarela"]', 'Ninguna conocida', 'Ninguna', 'Carlos García', '+34 600 654 321', 'user'),

('u2-34567890-1234-5678-9012-345678901234', 'miguel.lopez@email.com', 'Miguel López', '+34 600 234 567', '@miguellopez', '["realista", "geométrico"]', 'Ninguna conocida', 'Ninguna', 'María López', '+34 600 765 432', 'user'),

('u3-45678901-2345-6789-0123-456789012345', 'carmen.rodriguez@email.com', 'Carmen Rodríguez', '+34 600 345 678', '@carmen_ink', '["neo-tradicional", "personalizado"]', 'Alergia al látex', 'Asma', 'Pedro Rodríguez', '+34 600 876 543', 'user'),

('u4-56789012-3456-7890-1234-567890123456', 'david.martinez@email.com', 'David Martínez', '+34 600 456 789', '@davidmartinez', '["tradicional", "neo-tradicional"]', 'Ninguna conocida', 'Ninguna', 'Laura Martínez', '+34 600 987 654', 'user'),

('owner-00000000-0000-0000-0000-000000000000', 'asunaah@inkandsoul.com', 'Asunaah - La Restauradora', '+34 600 000 000', '@inkandsoul_asunaah', '["todas"]', 'Ninguna conocida', 'Ninguna', 'N/A', 'N/A', 'owner');

-- ===========================================
-- DATOS DE PRUEBA PARA APPOINTMENTS
-- ===========================================

INSERT INTO appointments (id, user_id, product_id, appointment_date, appointment_time, duration_minutes, status, notes, placement_description, size_specifications, total_price, created_at) VALUES

('a1-11111111-1111-1111-1111-111111111111', 'u1-23456789-0123-4567-8901-234567890123', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-11-15', '14:00:00', 120, 'confirmed', 'Primera cita para tatuaje de rosa en el antebrazo', 'Antebrazo derecho', 'Mediano - 8cm x 6cm', 150.00, NOW() - INTERVAL '5 days'),

('a2-22222222-2222-2222-2222-222222222222', 'u2-34567890-1234-5678-9012-345678901234', 'd4e5f6g7-h8i9-0123-defg-456789012345', '2025-11-20', '10:00:00', 480, 'pending', 'Cita de consulta para retrato realista', 'Espalda', 'Grande - 30cm x 40cm', 500.00, NOW() - INTERVAL '2 days'),

('a3-33333333-3333-3333-3333-333333333333', 'u3-45678901-2345-6789-0123-456789012345', 'f6g7h8i9-j0k1-2345-fghi-678901234567', '2025-11-22', '16:00:00', 150, 'confirmed', 'Mandala circular en la costilla', 'Costilla derecha', 'Mediano - 12cm diámetro', 200.00, NOW() - INTERVAL '1 day'),

('a4-44444444-4444-4444-4444-444444444444', 'u4-56789012-3456-7890-1234-567890123456', 'h8i9j0k1-l2m3-4567-hijk-890123456789', '2025-11-25', '11:00:00', 120, 'pending', 'Mariposa acuarela para el hombro', 'Hombro izquierdo', 'Mediano - 10cm x 8cm', 180.00, NOW()),

('a5-55555555-5555-5555-5555-555555555555', 'u1-23456789-0123-4567-8901-234567890123', 'j0k1l2m3-n4o5-6789-jklm-012345678901', '2025-12-01', '15:00:00', 300, 'pending', 'Consulta para diseño personalizado de jaguar', 'Muslo izquierdo', 'Grande - 20cm x 25cm', 350.00, NOW());

-- ===========================================
-- DATOS DE PRUEBA PARA ORDERS
-- ===========================================

INSERT INTO orders (id, user_id, status, total_amount, payment_status, shipping_address, billing_address, created_at) VALUES

('o1-11111111-1111-1111-1111-111111111111', 'u1-23456789-0123-4567-8901-234567890123', 'shipped', 75.50, 'succeeded', '{"street": "Calle Mayor 123", "city": "Madrid", "postal_code": "28001", "country": "España"}', '{"street": "Calle Mayor 123", "city": "Madrid", "postal_code": "28001", "country": "España"}', NOW() - INTERVAL '10 days'),

('o2-22222222-2222-2222-2222-222222222222', 'u2-34567890-1234-5678-9012-345678901234', 'confirmed', 125.00, 'succeeded', '{"street": "Avenida Libertad 45", "city": "Barcelona", "postal_code": "08001", "country": "España"}', '{"street": "Avenida Libertad 45", "city": "Barcelona", "postal_code": "08001", "country": "España"}', NOW() - INTERVAL '3 days'),

('o3-33333333-3333-3333-3333-333333333333', 'u3-45678901-2345-6789-0123-456789012345', 'preparing', 89.99, 'processing', '{"street": "Plaza Central 67", "city": "Valencia", "postal_code": "46001", "country": "España"}', '{"street": "Plaza Central 67", "city": "Valencia", "postal_code": "46001", "country": "España"}', NOW() - INTERVAL '1 day');

-- ===========================================
-- DATOS DE PRUEBA PARA ORDER_ITEMS
-- ===========================================

INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, product_options) VALUES

-- Items para orden 1
('o1-11111111-1111-1111-1111-111111111111', 'c3d4e5f6-g7h8-9012-cdef-345678901234', 1, 80.00, 80.00, '{"size": "pequeño", "color": "negro"}'),

-- Items para orden 2
('o2-22222222-2222-2222-2222-222222222222', 'f6g7h8i9-j0k1-2345-fghi-678901234567', 1, 200.00, 200.00, '{"size": "mediano", "color": "colorido"}'),
('o2-22222222-2222-2222-2222-222222222222', 'g7h8i9j0-k1l2-3456-ghij-789012345678', 1, 100.00, 100.00, '{"size": "pequeño", "color": "azul"}'),

-- Items para orden 3
('o3-33333333-3333-3333-3333-333333333333', 'h8i9j0k1-l2m3-4567-hijk-890123456789', 1, 180.00, 180.00, '{"size": "mediano", "color": "multicolor"}');

-- ===========================================
-- SECUENCIAS PARA AUTOINCREMENTO (SI ES NECESARIO)
-- ===========================================

-- Las tablas ya usan UUID como primary key
-- No es necesario crear secuencias para IDs

-- ===========================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ===========================================

-- Mostrar resumen de datos insertados
SELECT 
    'products' as tabla, 
    COUNT(*) as registros_insertados 
FROM products
UNION ALL
SELECT 
    'profiles' as tabla, 
    COUNT(*) as registros_insertados 
FROM profiles
UNION ALL
SELECT 
    'appointments' as tabla, 
    COUNT(*) as registros_insertados 
FROM appointments
UNION ALL
SELECT 
    'orders' as tabla, 
    COUNT(*) as registros_insertados 
FROM orders
UNION ALL
SELECT 
    'order_items' as tabla, 
    COUNT(*) as registros_insertados 
FROM order_items;

-- ===========================================
-- NOTAS IMPORTANTES
-- ===========================================

/*
DATOS DE PRUEBA - NOTAS:

1. PRODUCTOS:
   - 11 productos variados que cubren todos los estilos
   - Incluye un diseño personalizado para testing
   - Precios realistas y duraciones apropiadas

2. PERFILES:
   - 5 perfiles de usuario + 1 perfil de owner
   - No tienen usuarios reales en auth.users (solo para frontend testing)
   - En producción se crean automáticamente via triggers

3. CITAS:
   - 5 citas con diferentes estados y fechas futuras
   - Una cita completada para mostrar historial
   - Duraciones y precios consistentes con productos

4. ÓRDENES:
   - 3 órdenes con diferentes estados
   - Direcciones de envío de ejemplo en ciudades españolas
   - Estados de pago variados para testing

5. ELEMENTOS DE ÓRDENES:
   - Items correspondientes a las órdenes
   - Opciones de producto en formato JSON

6. PARA TESTING LOCAL:
   - Usar estos datos para probar frontend
   - Los usuarios necesitan autenticarse con Supabase Auth
   - Los IDs pueden usarse para crear casos de prueba específicos

7. PARA PRODUCCIÓN:
   - Limpiar estos datos antes del launch
   - Crear productos reales con imágenes propias
   - Establecer precios definitivos
*/