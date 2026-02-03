-- Micro-stores per project (synced from client API, e.g. Zonat stores + logo)
CREATE TABLE IF NOT EXISTS project_stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES proyectos_maestros(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, external_id)
);

CREATE INDEX IF NOT EXISTS idx_project_stores_project ON project_stores(project_id);

ALTER TABLE project_stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read project_stores" ON project_stores;
CREATE POLICY "Allow read project_stores" ON project_stores FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert project_stores from service" ON project_stores;
CREATE POLICY "Allow insert project_stores from service" ON project_stores FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update project_stores from service" ON project_stores;
CREATE POLICY "Allow update project_stores from service" ON project_stores FOR UPDATE USING (true);
