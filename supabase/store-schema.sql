-- =====================================================
-- STORE MODULE - Schema (English names)
-- Owner fields, platform users, ticket items
-- Run after schema.sql and tickets-schema.sql
-- =====================================================

-- Add owner fields to proyectos_maestros (for billing / "facturar a")
ALTER TABLE proyectos_maestros
  ADD COLUMN IF NOT EXISTS owner_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS owner_email VARCHAR(255);

COMMENT ON COLUMN proyectos_maestros.owner_name IS 'Business owner name for billing';
COMMENT ON COLUMN proyectos_maestros.owner_email IS 'Business owner email for invoicing';

-- =====================================================
-- TABLE: platform_users
-- Users per client platform (synced from client APIs e.g. Zonat)
-- =====================================================
CREATE TABLE IF NOT EXISTS platform_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES proyectos_maestros(id) ON DELETE CASCADE,
  external_id VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  store_id VARCHAR(255),
  is_owner BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, email)
);

CREATE INDEX IF NOT EXISTS idx_platform_users_project ON platform_users(project_id);
CREATE INDEX IF NOT EXISTS idx_platform_users_email ON platform_users(email);

-- =====================================================
-- TABLE: ticket_items
-- Items (store product IDs) per ticket
-- =====================================================
CREATE TABLE IF NOT EXISTS ticket_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_items_ticket ON ticket_items(ticket_id);

-- RLS
ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read platform_users" ON platform_users FOR SELECT USING (true);
CREATE POLICY "Allow insert platform_users from service" ON platform_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update platform_users from service" ON platform_users FOR UPDATE USING (true);

CREATE POLICY "Allow read ticket_items" ON ticket_items FOR SELECT USING (true);
CREATE POLICY "Allow insert ticket_items" ON ticket_items FOR INSERT WITH CHECK (true);
