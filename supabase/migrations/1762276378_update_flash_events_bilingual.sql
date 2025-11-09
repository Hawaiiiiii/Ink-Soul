-- Migration: update_flash_events_bilingual
-- Created at: 1762276378


-- Actualizar tabla flash_events para soporte bilingüe completo
-- Eliminar campos antiguos y agregar versiones bilingües
ALTER TABLE flash_events 
  DROP COLUMN IF EXISTS title CASCADE,
  DROP COLUMN IF EXISTS description CASCADE,
  DROP COLUMN IF EXISTS rules_markdown CASCADE,
  DROP COLUMN IF EXISTS title_en CASCADE,
  DROP COLUMN IF EXISTS description_en CASCADE,
  DROP COLUMN IF EXISTS rules_markdown_en CASCADE;

-- Agregar campos bilingües
ALTER TABLE flash_events 
  ADD COLUMN title_es TEXT NOT NULL DEFAULT '',
  ADD COLUMN title_en TEXT NOT NULL DEFAULT '',
  ADD COLUMN description_es TEXT,
  ADD COLUMN description_en TEXT,
  ADD COLUMN rules_es TEXT,
  ADD COLUMN rules_en TEXT,
  ADD COLUMN hero_image TEXT;

-- Actualizar campos de fecha para mejor control
ALTER TABLE flash_events 
  RENAME COLUMN start_date TO start_at;
  
ALTER TABLE flash_events 
  RENAME COLUMN end_date TO end_at;

COMMENT ON TABLE flash_events IS 'Eventos flash con soporte bilingüe completo (ES/EN)';
;