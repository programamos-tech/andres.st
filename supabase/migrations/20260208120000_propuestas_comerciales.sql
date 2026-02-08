-- Propuestas comerciales (cotizaciones guardadas): control y re-descarga de PDF
CREATE TABLE IF NOT EXISTS propuestas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_cotizacion VARCHAR(32) NOT NULL,
  cliente_nombre TEXT NOT NULL,
  cliente_contacto TEXT,
  cliente_email TEXT,
  cliente_whatsapp TEXT,
  cliente_tipo_negocio TEXT,
  sistema_nombre TEXT NOT NULL,
  total_cop INTEGER NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'enviada' CHECK (estado IN ('enviada', 'vista', 'aceptada', 'rechazada', 'expirada')),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE propuestas IS 'Propuestas comerciales generadas; payload permite regenerar el PDF';
COMMENT ON COLUMN propuestas.payload IS 'Cuerpo completo del request para POST /api/cotizaciones/generar (regenerar PDF)';
COMMENT ON COLUMN propuestas.estado IS 'enviada | vista | aceptada | rechazada | expirada';

CREATE INDEX IF NOT EXISTS idx_propuestas_created_at ON propuestas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_propuestas_estado ON propuestas(estado);
CREATE INDEX IF NOT EXISTS idx_propuestas_cliente_nombre ON propuestas(cliente_nombre);

-- El acceso se hace desde la API con service role (bypasea RLS)
ALTER TABLE propuestas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for service role and API" ON propuestas;
CREATE POLICY "Allow all for service role and API"
  ON propuestas FOR ALL
  USING (true)
  WITH CHECK (true);
