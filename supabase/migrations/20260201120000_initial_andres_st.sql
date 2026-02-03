-- =====================================================
-- PROGRAMAMOS CORE - Schema de Base de Datos
-- Dashboard Maestro NOC para andres.st
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS proyectos_maestros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_cliente VARCHAR(255) NOT NULL,
    nombre_proyecto VARCHAR(255) NOT NULL,
    api_key_unica VARCHAR(64) UNIQUE NOT NULL,
    url_dominio VARCHAR(500) NOT NULL,
    status_servidor VARCHAR(20) DEFAULT 'inactive' CHECK (status_servidor IN ('active', 'inactive', 'maintenance', 'error')),
    descripcion TEXT,
    logo_url VARCHAR(500),
    color_marca VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_proyectos_api_key ON proyectos_maestros(api_key_unica);
CREATE INDEX IF NOT EXISTS idx_proyectos_status ON proyectos_maestros(status_servidor);
CREATE INDEX IF NOT EXISTS idx_proyectos_last_activity ON proyectos_maestros(last_activity_at DESC);

CREATE TABLE IF NOT EXISTS actividad_centralizada (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proyecto_id UUID NOT NULL REFERENCES proyectos_maestros(id) ON DELETE CASCADE,
    usuario_id VARCHAR(255),
    usuario_nombre VARCHAR(255) NOT NULL,
    usuario_email VARCHAR(255),
    modulo_visitado VARCHAR(255) NOT NULL,
    accion_realizada VARCHAR(255) NOT NULL,
    metadata JSONB,
    es_error BOOLEAN DEFAULT FALSE,
    error_mensaje TEXT,
    error_stack TEXT,
    ip_address INET,
    user_agent TEXT,
    duracion_ms INTEGER,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_actividad_proyecto ON actividad_centralizada(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_actividad_timestamp ON actividad_centralizada(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_actividad_modulo ON actividad_centralizada(modulo_visitado);
CREATE INDEX IF NOT EXISTS idx_actividad_error ON actividad_centralizada(es_error) WHERE es_error = TRUE;
CREATE INDEX IF NOT EXISTS idx_actividad_proyecto_timestamp ON actividad_centralizada(proyecto_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_actividad_dashboard ON actividad_centralizada(proyecto_id, timestamp DESC, es_error);

CREATE OR REPLACE FUNCTION update_proyecto_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE proyectos_maestros 
    SET last_activity_at = NEW.timestamp,
        status_servidor = CASE 
            WHEN NEW.es_error = TRUE THEN 'error'
            ELSE 'active'
        END,
        updated_at = NOW()
    WHERE id = NEW.proyecto_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_last_activity ON actividad_centralizada;
CREATE TRIGGER trigger_update_last_activity
    AFTER INSERT ON actividad_centralizada
    FOR EACH ROW
    EXECUTE FUNCTION update_proyecto_last_activity();

CREATE OR REPLACE FUNCTION get_top_modules(
    p_proyecto_id UUID,
    p_hours INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 3
)
RETURNS TABLE (
    modulo VARCHAR(255),
    total_usos BIGINT,
    ultimo_uso TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ac.modulo_visitado as modulo,
        COUNT(*) as total_usos,
        MAX(ac.timestamp) as ultimo_uso
    FROM actividad_centralizada ac
    WHERE ac.proyecto_id = p_proyecto_id
        AND ac.timestamp > NOW() - (p_hours || ' hours')::INTERVAL
        AND ac.es_error = FALSE
    GROUP BY ac.modulo_visitado
    ORDER BY total_usos DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_dashboard_summary()
RETURNS TABLE (
    proyecto_id UUID,
    nombre_cliente VARCHAR(255),
    nombre_proyecto VARCHAR(255),
    url_dominio VARCHAR(500),
    status_servidor VARCHAR(20),
    color_marca VARCHAR(7),
    logo_url VARCHAR(500),
    last_activity_at TIMESTAMPTZ,
    actividad_ultima_hora BIGINT,
    errores_ultima_hora BIGINT,
    usuarios_activos BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pm.id as proyecto_id,
        pm.nombre_cliente,
        pm.nombre_proyecto,
        pm.url_dominio,
        pm.status_servidor,
        pm.color_marca,
        pm.logo_url,
        pm.last_activity_at,
        COALESCE(stats.actividad_total, 0) as actividad_ultima_hora,
        COALESCE(stats.errores_total, 0) as errores_ultima_hora,
        COALESCE(stats.usuarios_unicos, 0) as usuarios_activos
    FROM proyectos_maestros pm
    LEFT JOIN LATERAL (
        SELECT 
            COUNT(*) as actividad_total,
            COUNT(*) FILTER (WHERE ac.es_error = TRUE) as errores_total,
            COUNT(DISTINCT ac.usuario_nombre) as usuarios_unicos
        FROM actividad_centralizada ac
        WHERE ac.proyecto_id = pm.id
            AND ac.timestamp > NOW() - INTERVAL '1 hour'
    ) stats ON TRUE
    ORDER BY pm.last_activity_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE proyectos_maestros ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividad_centralizada ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read for authenticated users" ON proyectos_maestros;
CREATE POLICY "Allow read for authenticated users" ON proyectos_maestros FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow read activities for authenticated users" ON actividad_centralizada;
CREATE POLICY "Allow read activities for authenticated users" ON actividad_centralizada FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert activities from service" ON actividad_centralizada;
CREATE POLICY "Allow insert activities from service" ON actividad_centralizada FOR INSERT WITH CHECK (true);

-- =====================================================
-- HELP / TICKETS
-- =====================================================

CREATE SEQUENCE IF NOT EXISTS ticket_numero_seq START 100;

CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero INTEGER NOT NULL DEFAULT nextval('ticket_numero_seq'),
    proyecto_id UUID REFERENCES proyectos_maestros(id) ON DELETE SET NULL,
    proyecto_nombre VARCHAR(100) NOT NULL,
    modulo VARCHAR(100) DEFAULT 'general',
    tienda VARCHAR(255),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'creado' CHECK (estado IN ('creado', 'replicando', 'ajustando', 'probando', 'desplegando', 'resuelto')),
    creado_por_nombre VARCHAR(255) NOT NULL,
    creado_por_email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    UNIQUE(numero)
);

CREATE INDEX IF NOT EXISTS idx_tickets_proyecto ON tickets(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);

CREATE TABLE IF NOT EXISTS ticket_comentarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    autor_nombre VARCHAR(255) NOT NULL,
    es_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comentarios_ticket ON ticket_comentarios(ticket_id);

CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ticket_updated ON tickets;
CREATE TRIGGER trigger_ticket_updated
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_ticket_timestamp();

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comentarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read tickets" ON tickets;
CREATE POLICY "Allow read tickets" ON tickets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert tickets" ON tickets;
CREATE POLICY "Allow insert tickets" ON tickets FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update tickets" ON tickets;
CREATE POLICY "Allow update tickets" ON tickets FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow read comments" ON ticket_comentarios;
CREATE POLICY "Allow read comments" ON ticket_comentarios FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert comments" ON ticket_comentarios;
CREATE POLICY "Allow insert comments" ON ticket_comentarios FOR INSERT WITH CHECK (true);

-- =====================================================
-- STORE MODULE (English names)
-- =====================================================

ALTER TABLE proyectos_maestros
  ADD COLUMN IF NOT EXISTS owner_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS owner_email VARCHAR(255);

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

CREATE TABLE IF NOT EXISTS ticket_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_items_ticket ON ticket_items(ticket_id);

ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read platform_users" ON platform_users;
CREATE POLICY "Allow read platform_users" ON platform_users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert platform_users from service" ON platform_users;
CREATE POLICY "Allow insert platform_users from service" ON platform_users FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update platform_users from service" ON platform_users;
CREATE POLICY "Allow update platform_users from service" ON platform_users FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow read ticket_items" ON ticket_items;
CREATE POLICY "Allow read ticket_items" ON ticket_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert ticket_items" ON ticket_items;
CREATE POLICY "Allow insert ticket_items" ON ticket_items FOR INSERT WITH CHECK (true);
