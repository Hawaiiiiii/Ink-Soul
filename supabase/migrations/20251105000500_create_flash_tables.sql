-- Migration: Create Flash Tattoo Tables
-- Date: 2025-11-05
-- Description: Sistema completo de flash tattoo para campañas estacionales

-- Tabla de eventos flash (Halloween, Navidad, etc.)
CREATE TABLE IF NOT EXISTS flash_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  description_en TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  banner_image TEXT,
  rules_markdown TEXT,
  rules_markdown_en TEXT,
  deposit_amount INTEGER DEFAULT 2000, -- 20€ en centavos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de diseños flash disponibles por evento
CREATE TABLE IF NOT EXISTS flash_designs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES flash_events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_en TEXT,
  image_url TEXT NOT NULL,
  color_image_url TEXT, -- Imagen a color (opcional)
  base_price INTEGER NOT NULL, -- Precio base en centavos
  color_extra INTEGER DEFAULT 0, -- Extra por color en centavos
  stock INTEGER DEFAULT 1,
  zones TEXT[] DEFAULT ARRAY['forearm','arm','ankle','calf'],
  sizes TEXT[] DEFAULT ARRAY['S','M','L'],
  duration_minutes INTEGER[] DEFAULT ARRAY[20,30,40], -- Por tamaño S, M, L
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de slots de tiempo disponibles
CREATE TABLE IF NOT EXISTS flash_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES flash_events(id) ON DELETE CASCADE,
  design_id UUID REFERENCES flash_designs(id) ON DELETE SET NULL,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  taken BOOLEAN DEFAULT false,
  booking_id UUID, -- Referencia a flash_bookings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_slot UNIQUE (slot_date, start_time)
);

-- Tabla de reservas de flash tattoo
CREATE TABLE IF NOT EXISTS flash_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES flash_events(id) ON DELETE CASCADE,
  design_id UUID NOT NULL REFERENCES flash_designs(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES flash_slots(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  size TEXT NOT NULL CHECK (size IN ('S', 'M', 'L')),
  zone TEXT NOT NULL,
  with_color BOOLEAN DEFAULT false,
  price_total INTEGER NOT NULL, -- Precio final en centavos
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_flash_events_slug ON flash_events(slug);
CREATE INDEX IF NOT EXISTS idx_flash_events_active ON flash_events(is_active);
CREATE INDEX IF NOT EXISTS idx_flash_designs_event ON flash_designs(event_id);
CREATE INDEX IF NOT EXISTS idx_flash_slots_event ON flash_slots(event_id);
CREATE INDEX IF NOT EXISTS idx_flash_slots_date ON flash_slots(slot_date);
CREATE INDEX IF NOT EXISTS idx_flash_slots_available ON flash_slots(taken) WHERE NOT taken;
CREATE INDEX IF NOT EXISTS idx_flash_bookings_event ON flash_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_flash_bookings_status ON flash_bookings(status);
CREATE INDEX IF NOT EXISTS idx_flash_bookings_email ON flash_bookings(client_email);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_flash_events_updated_at
    BEFORE UPDATE ON flash_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flash_designs_updated_at
    BEFORE UPDATE ON flash_designs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flash_bookings_updated_at
    BEFORE UPDATE ON flash_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies

-- Habilitar RLS en todas las tablas
ALTER TABLE flash_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_bookings ENABLE ROW LEVEL SECURITY;

-- Políticas para flash_events: lectura pública de eventos activos
CREATE POLICY "Eventos activos son públicos"
  ON flash_events FOR SELECT
  USING (is_active = true);

CREATE POLICY "Todos los eventos para admin"
  ON flash_events FOR ALL
  USING (auth.role() = 'service_role');

-- Políticas para flash_designs: lectura pública de diseños disponibles
CREATE POLICY "Diseños de eventos activos son públicos"
  ON flash_designs FOR SELECT
  USING (
    is_available = true
    AND EXISTS (
      SELECT 1 FROM flash_events
      WHERE flash_events.id = flash_designs.event_id
      AND flash_events.is_active = true
    )
  );

CREATE POLICY "Todos los diseños para admin"
  ON flash_designs FOR ALL
  USING (auth.role() = 'service_role');

-- Políticas para flash_slots: lectura pública de slots disponibles
CREATE POLICY "Slots disponibles son públicos"
  ON flash_slots FOR SELECT
  USING (
    NOT taken
    AND EXISTS (
      SELECT 1 FROM flash_events
      WHERE flash_events.id = flash_slots.event_id
      AND flash_events.is_active = true
    )
  );

CREATE POLICY "Todos los slots para admin"
  ON flash_slots FOR ALL
  USING (auth.role() = 'service_role');

-- Políticas para flash_bookings: solo admin puede gestionar
CREATE POLICY "Solo admin puede ver bookings"
  ON flash_bookings FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Solo admin puede modificar bookings"
  ON flash_bookings FOR ALL
  USING (auth.role() = 'service_role');

-- Comentarios en tablas para documentación
COMMENT ON TABLE flash_events IS 'Eventos flash (Halloween, Navidad, etc.) con fechas y configuración';
COMMENT ON TABLE flash_designs IS 'Diseños de tatuajes disponibles para cada evento flash';
COMMENT ON TABLE flash_slots IS 'Slots de tiempo disponibles para reservas';
COMMENT ON TABLE flash_bookings IS 'Reservas confirmadas de flash tattoos con información del cliente y pago';

COMMENT ON COLUMN flash_designs.duration_minutes IS 'Array de duraciones [S, M, L] en minutos';
COMMENT ON COLUMN flash_designs.zones IS 'Array de zonas corporales permitidas para este diseño';
COMMENT ON COLUMN flash_designs.sizes IS 'Array de tamaños disponibles: S, M, L';
COMMENT ON COLUMN flash_bookings.price_total IS 'Precio final en centavos (incluye base + extras)';
COMMENT ON COLUMN flash_events.deposit_amount IS 'Depósito requerido en centavos (default 20€ = 2000)';
