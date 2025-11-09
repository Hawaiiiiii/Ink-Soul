-- Ink & Soul - Asunaah · La Restauradora
-- Políticas RLS (Row Level Security) para Supabase
-- Fecha: 2025-11-06
-- Versión: 1.0.0

-- ===========================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ===========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- POLÍTICAS PARA TABLA PROFILES
-- ===========================================

-- Los usuarios solo pueden ver y editar su propio perfil
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden insertar su propio perfil" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Política especial para acceso administrativo (rol 'owner')
CREATE POLICY "Administradores pueden gestionar todos los perfiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- ===========================================
-- POLÍTICAS PARA TABLA PRODUCTS
-- ===========================================

-- Cualquier usuario autenticado puede ver productos activos
CREATE POLICY "Usuarios autenticados pueden ver productos activos" ON products
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Solo administradores pueden gestionar productos
CREATE POLICY "Solo administradores pueden gestionar productos" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- ===========================================
-- POLÍTICAS PARA TABLA APPOINTMENTS
-- ===========================================

-- Los usuarios solo pueden ver sus propias citas
CREATE POLICY "Los usuarios pueden ver sus propias citas" ON appointments
    FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios solo pueden crear citas para sí mismos
CREATE POLICY "Los usuarios pueden crear sus propias citas" ON appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propias citas
CREATE POLICY "Los usuarios pueden actualizar sus propias citas" ON appointments
    FOR UPDATE USING (auth.uid() = user_id);

-- Solo administradores pueden eliminar citas
CREATE POLICY "Solo administradores pueden eliminar citas" ON appointments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- Política especial para Edge Functions (service role)
CREATE POLICY "Service role puede gestionar todas las citas" ON appointments
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ===========================================
-- POLÍTICAS PARA TABLA ORDERS
-- ===========================================

-- Los usuarios solo pueden ver sus propias órdenes
CREATE POLICY "Los usuarios pueden ver sus propias órdenes" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios solo pueden crear órdenes para sí mismos
CREATE POLICY "Los usuarios pueden crear sus propias órdenes" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propias órdenes (estado limitado)
CREATE POLICY "Los usuarios pueden actualizar sus propias órdenes" ON orders
    FOR UPDATE USING (
        auth.uid() = user_id 
        AND status IN ('pending', 'confirmed', 'cancelled')
    );

-- Solo administradores pueden eliminar órdenes
CREATE POLICY "Solo administradores pueden eliminar órdenes" ON orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- Política especial para Edge Functions
CREATE POLICY "Service role puede gestionar todas las órdenes" ON orders
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ===========================================
-- POLÍTICAS PARA TABLA ORDER_ITEMS
-- ===========================================

-- Los usuarios solo pueden ver elementos de sus propias órdenes
CREATE POLICY "Los usuarios pueden ver elementos de sus órdenes" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Los usuarios solo pueden crear elementos en sus propias órdenes
CREATE POLICY "Los usuarios pueden crear elementos en sus órdenes" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Los usuarios solo pueden actualizar elementos de sus propias órdenes
CREATE POLICY "Los usuarios pueden actualizar elementos de sus órdenes" ON order_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Los usuarios solo pueden eliminar elementos de sus propias órdenes
CREATE POLICY "Los usuarios pueden eliminar elementos de sus órdenes" ON order_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Política especial para Edge Functions
CREATE POLICY "Service role puede gestionar todos los elementos de órdenes" ON order_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ===========================================
-- POLÍTICAS PARA VISTAS
-- ===========================================

-- Las vistas heredan las políticas de las tablas base
-- Las políticas ya definidas para las tablas se aplican automáticamente

-- ===========================================
-- POLÍTICAS PARA FUNCIONES
-- ===========================================

-- Función de verificación de conflictos accesible a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden verificar conflictos de citas" ON appointments
    FOR SELECT USING (
        auth.role() = 'authenticated' 
        AND auth.uid() = user_id
    );

-- ===========================================
-- POLÍTICAS DE BACKUP Y AUDITORÍA
-- ===========================================

-- Para auditoría, permitir que los administradores vean todas las acciones
-- (esto se puede implementar con triggers en una tabla de auditoría)

-- ===========================================
-- NOTAS IMPORTANTES DE SEGURIDAD
-- ===========================================

/*
SOBRE LAS POLÍTICAS RLS:

1. SEGREGACIÓN POR USUARIO:
   - Cada usuario solo puede acceder a sus propios datos (profiles, appointments, orders)
   - Los datos sensibles como información médica y contactos de emergencia están protegidos

2. ACCESO ADMINISTRATIVO:
   - Solo usuarios con role='owner' pueden realizar operaciones administrativas
   - Esto incluye gestión de productos, eliminación de citas/órdenes

3. EDGE FUNCTIONS:
   - Las funciones serverless tienen acceso completo via service_role
   - Esto es necesario para operaciones como crear checkout sessions y webhooks

4. FUNCIONES DE UTILIDAD:
   - check_appointment_conflict está disponible para usuarios autenticados
   - Las vistas mantienen la seguridad de las tablas base

5. PROTECCIÓN DE DATOS:
   - RLS previene acceso no autorizado incluso si se conocen IDs
   - Todas las consultas están filtradas por user_id = auth.uid()

6. CONSIDERACIONES DE PERFORMANCE:
   - Los índices optimizan las consultas filtradas por user_id
   - Las políticas usan joins eficientes en lugar de subconsultas costosas

7. TESTING DE SEGURIDAD:
   - Verificar que usuarios no pueden acceder a datos de otros usuarios
   - Confirmar que solo los administradores pueden eliminar registros
   - Probar que las Edge Functions tienen acceso completo cuando es necesario
*/