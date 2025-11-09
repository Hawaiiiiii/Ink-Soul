-- Migration: create_notifications_table
-- Created at: 1762251888

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('consulta', 'cita', 'compra')),
  asunto TEXT NOT NULL,
  contenido TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  enviado_a TEXT[] NOT NULL,
  datos_extra JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_notificaciones_tipo ON notificaciones(tipo);
CREATE INDEX IF NOT EXISTS idx_notificaciones_fecha ON notificaciones(fecha DESC);

-- Políticas RLS (Row Level Security)
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden leer notificaciones
CREATE POLICY "Usuarios autenticados pueden leer notificaciones"
  ON notificaciones
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo service_role puede insertar notificaciones (desde Edge Functions)
CREATE POLICY "Service role puede insertar notificaciones"
  ON notificaciones
  FOR INSERT
  TO service_role
  WITH CHECK (true);;