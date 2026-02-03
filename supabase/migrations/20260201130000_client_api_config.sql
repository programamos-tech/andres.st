-- Client app API config per project (store sync: URL + key)
ALTER TABLE proyectos_maestros
  ADD COLUMN IF NOT EXISTS client_api_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS client_api_key VARCHAR(255);

COMMENT ON COLUMN proyectos_maestros.client_api_url IS 'Client app API base URL for store/users sync';
COMMENT ON COLUMN proyectos_maestros.client_api_key IS 'API key to call client app (e.g. ANDRES_API_KEY in client)';
