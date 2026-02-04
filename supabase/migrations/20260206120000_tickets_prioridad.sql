-- Prioridad en tickets (desde Andrebot)
-- medio | alto_maromas | alto_espera | urgente
ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS prioridad VARCHAR(20) DEFAULT 'medio';

ALTER TABLE tickets
  DROP CONSTRAINT IF EXISTS tickets_prioridad_check;

ALTER TABLE tickets
  ADD CONSTRAINT tickets_prioridad_check
  CHECK (prioridad IN ('medio', 'alto_maromas', 'alto_espera', 'urgente'));

COMMENT ON COLUMN tickets.prioridad IS 'Urgencia elegida al crear el ticket: medio (puedo sobrevivir), alto_maromas (maromas para que funcione), alto_espera (no puedo hacer un flujo pero puede esperar horas), urgente (plataforma caída).';

CREATE INDEX IF NOT EXISTS idx_tickets_prioridad ON tickets(prioridad);
