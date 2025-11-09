-- Crear todas las tablas necesarias para la tienda online
-- EJECUTAR ESTE ARCHIVO COMPLETO EN SUPABASE SQL EDITOR

-- 1. Tabla de productos
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

-- 2. Tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  total_amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'eur',
  shipping_address JSONB,
  billing_address JSONB,
  customer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de items de orden
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL NOT NULL,
  product_name TEXT,
  product_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de citas
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT CHECK (project_type IN ('devocional', 'geometrico', 'espiritual', 'simbolico')),
  description TEXT,
  body_zone TEXT,
  preferred_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para products (lectura pública, escritura solo service_role)
DROP POLICY IF EXISTS "Allow public read products" ON products;
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert products via service_role" ON products;
CREATE POLICY "Allow insert products via service_role" ON products 
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow update products service_role" ON products;
CREATE POLICY "Allow update products service_role" ON products 
  FOR UPDATE USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow delete products service_role" ON products;
CREATE POLICY "Allow delete products service_role" ON products 
  FOR DELETE USING (auth.role() = 'service_role');

-- Políticas para orders
DROP POLICY IF EXISTS "Allow public read orders" ON orders;
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert orders via anon or service_role" ON orders;
CREATE POLICY "Allow insert orders via anon or service_role" ON orders 
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

DROP POLICY IF EXISTS "Allow update orders service_role" ON orders;
CREATE POLICY "Allow update orders service_role" ON orders 
  FOR UPDATE USING (auth.role() = 'service_role');

-- Políticas para order_items
DROP POLICY IF EXISTS "Allow public read order_items" ON order_items;
CREATE POLICY "Allow public read order_items" ON order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert order_items via anon or service_role" ON order_items;
CREATE POLICY "Allow insert order_items via anon or service_role" ON order_items 
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Políticas para appointments
DROP POLICY IF EXISTS "Allow public read appointments" ON appointments;
CREATE POLICY "Allow public read appointments" ON appointments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert appointments via anon or service_role" ON appointments;
CREATE POLICY "Allow insert appointments via anon or service_role" ON appointments 
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

DROP POLICY IF EXISTS "Allow update appointments service_role" ON appointments;
CREATE POLICY "Allow update appointments service_role" ON appointments 
  FOR UPDATE USING (auth.role() = 'service_role');

-- Políticas para contact_messages
DROP POLICY IF EXISTS "Allow public read contact_messages" ON contact_messages;
CREATE POLICY "Allow public read contact_messages" ON contact_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert contact_messages via anon or service_role" ON contact_messages;
CREATE POLICY "Allow insert contact_messages via anon or service_role" ON contact_messages 
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_preferred_date ON appointments(preferred_date);
