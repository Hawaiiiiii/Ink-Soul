-- Ink & Soul - Asunaah · La Restauradora
-- Esquema de base de datos Supabase
-- Fecha: 2025-11-06
-- Versión: 1.0.0

-- ===========================================
-- HABILITAR EXTENSIONES NECESARIAS
-- ===========================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLAS PRINCIPALES
-- ===========================================

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    instagram_handle TEXT,
    preferred_styles JSONB DEFAULT '[]',
    allergies TEXT,
    medical_conditions TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos/tatuajes disponibles
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    style TEXT NOT NULL,
    size_category TEXT NOT NULL, -- 'pequeño', 'mediano', 'grande', 'custom'
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    complexity_level INTEGER CHECK (complexity_level BETWEEN 1 AND 5) DEFAULT 3,
    images JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    available_sizes JSONB DEFAULT '[]',
    color_options JSONB DEFAULT '[]',
    is_custom_design BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de citas/appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    reference_photos JSONB DEFAULT '[]',
    placement_description TEXT,
    size_specifications TEXT,
    color_preferences TEXT,
    consultation_fee DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT false,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de órdenes/pedidos
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_address JSONB,
    billing_address JSONB,
    stripe_payment_intent_id TEXT,
    stripe_checkout_session_id TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de elementos de órdenes (order items)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    product_options JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ===========================================

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_style ON products(style);
CREATE INDEX IF NOT EXISTS idx_products_size_category ON products(size_category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(base_price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Índices para appointments
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

-- Índices para orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_checkout_session_id);

-- Índices para order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ===========================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ===========================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at automático
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FUNCIONES DE UTILIDAD
-- ===========================================

-- Función para verificar conflictos de citas
CREATE OR REPLACE FUNCTION check_appointment_conflict(
    p_appointment_date DATE,
    p_appointment_time TIME,
    p_duration_minutes INTEGER,
    p_exclude_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    new_start_time TIMESTAMP;
    new_end_time TIMESTAMP;
    conflict_count INTEGER;
BEGIN
    -- Calcular ventanas de tiempo
    start_time := p_appointment_date::timestamp + p_appointment_time;
    end_time := start_time + (p_duration_minutes * interval '1 minute');
    
    -- Verificar conflictos existentes
    SELECT COUNT(*) INTO conflict_count
    FROM appointments
    WHERE status NOT IN ('cancelled', 'no_show')
    AND (
        -- Superposición temporal
        (appointment_date = p_appointment_date AND
         appointment_time < end_time::time AND
         (appointment_time + (duration_minutes * interval '1 minute')) > p_appointment_time)
        -- Excluir la cita actual si se proporciona ID
        OR (p_exclude_id IS NOT NULL AND id = p_exclude_id)
    );
    
    RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- VISTAS ÚTILES
-- ===========================================

-- Vista para información completa de citas
CREATE OR REPLACE VIEW appointment_details AS
SELECT 
    a.*,
    p.full_name,
    p.email,
    p.phone,
    prod.name as product_name,
    prod.style as product_style,
    prod.base_price as product_base_price
FROM appointments a
LEFT JOIN profiles p ON a.user_id = p.id
LEFT JOIN products prod ON a.product_id = prod.id;

-- Vista para órdenes con detalles del usuario
CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.*,
    p.full_name,
    p.email,
    COUNT(oi.id) as total_items
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, p.full_name, p.email;

-- ===========================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- ===========================================

COMMENT ON TABLE profiles IS 'Perfiles de usuarios con información personal y preferencias';
COMMENT ON TABLE products IS 'Catálogo de tatuajes disponibles con estilos, precios y especificaciones';
COMMENT ON TABLE appointments IS 'Citas programadas para tatuajes con detalles y estado';
COMMENT ON TABLE orders IS 'Órdenes de compra para productos y servicios';
COMMENT ON TABLE order_items IS 'Elementos individuales de las órdenes';

COMMENT ON FUNCTION check_appointment_conflict(DATE, TIME, INTEGER, UUID) IS 'Verifica si hay conflictos de citas en un horario específico';

-- ===========================================
-- POLÍTICAS RLS (Row Level Security)
-- ===========================================

-- Se aplican en el archivo policies.sql separado para mejor organización
-- RLS habilitado por defecto para todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;