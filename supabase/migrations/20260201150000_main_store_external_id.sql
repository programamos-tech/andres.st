-- Tienda principal del cliente (external_id en project_stores = main store id del cliente, e.g. Zonat 00000000-0000-0000-0000-000000000001)
ALTER TABLE proyectos_maestros
  ADD COLUMN IF NOT EXISTS main_store_external_id VARCHAR(64);

COMMENT ON COLUMN proyectos_maestros.main_store_external_id IS 'External ID of the client main store (for logo); e.g. Zonat main store UUID';
