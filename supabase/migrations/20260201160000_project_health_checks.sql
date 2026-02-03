-- Historial de comprobaciones de salud (cada vez que alguien abre el panel Estado)
CREATE TABLE IF NOT EXISTS project_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES proyectos_maestros(id) ON DELETE CASCADE,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive')),
  latency_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_project_health_checks_project_checked
  ON project_health_checks(project_id, checked_at DESC);

COMMENT ON TABLE project_health_checks IS 'Historial de comprobaciones en vivo del servidor del cliente (cada vez que se abre el panel Estado).';
