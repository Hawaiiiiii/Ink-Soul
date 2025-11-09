-- Habilitar RLS en todas las tablas
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para appointments
CREATE POLICY "Allow public read appointments" ON appointments 
  FOR SELECT USING (true);

CREATE POLICY "Allow insert appointments via anon or service_role" ON appointments 
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update appointments service_role" ON appointments 
  FOR UPDATE USING (auth.role() = 'service_role');

-- Políticas para products
CREATE POLICY "Allow public read products" ON products 
  FOR SELECT USING (true);

CREATE POLICY "Allow insert products via service_role" ON products 
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow update products service_role" ON products 
  FOR UPDATE USING (auth.role() = 'service_role');

-- Políticas para orders
CREATE POLICY "Allow public read orders" ON orders 
  FOR SELECT USING (true);

CREATE POLICY "Allow insert orders via anon or service_role" ON orders 
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow update orders service_role" ON orders 
  FOR UPDATE USING (auth.role() = 'service_role');

-- Políticas para order_items
CREATE POLICY "Allow public read order_items" ON order_items 
  FOR SELECT USING (true);

CREATE POLICY "Allow insert order_items via anon or service_role" ON order_items 
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Políticas para contact_messages
CREATE POLICY "Allow public read contact_messages" ON contact_messages 
  FOR SELECT USING (true);

CREATE POLICY "Allow insert contact_messages via anon or service_role" ON contact_messages 
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));
