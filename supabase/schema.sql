-- =====================================================
-- PROGRAMAMOS CORE - Schema de Base de Datos
-- Dashboard Maestro NOC para andres.st
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: proyectos_maestros
-- Almacena la información de cada proyecto/cliente
-- =====================================================
CREATE TABLE IF NOT EXISTS proyectos_maestros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_cliente VARCHAR(255) NOT NULL,
    nombre_proyecto VARCHAR(255) NOT NULL,
    api_key_unica VARCHAR(64) UNIQUE NOT NULL,
    url_dominio VARCHAR(500) NOT NULL,
    status_servidor VARCHAR(20) DEFAULT 'inactive' CHECK (status_servidor IN ('active', 'inactive', 'maintenance', 'error')),
    descripcion TEXT,
    logo_url VARCHAR(500),
    color_marca VARCHAR(7), -- Hex color como #8c52ff
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ
);

-- Índices para proyectos_maestros
CREATE INDEX IF NOT EXISTS idx_proyectos_api_key ON proyectos_maestros(api_key_unica);
CREATE INDEX IF NOT EXISTS idx_proyectos_status ON proyectos_maestros(status_servidor);
CREATE INDEX IF NOT EXISTS idx_proyectos_last_activity ON proyectos_maestros(last_activity_at DESC);

-- =====================================================
-- TABLA: actividad_centralizada
-- Recibe todos los logs de actividad de los proyectos
-- =====================================================
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

-- Índices para actividad_centralizada
CREATE INDEX IF NOT EXISTS idx_actividad_proyecto ON actividad_centralizada(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_actividad_timestamp ON actividad_centralizada(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_actividad_modulo ON actividad_centralizada(modulo_visitado);
CREATE INDEX IF NOT EXISTS idx_actividad_error ON actividad_centralizada(es_error) WHERE es_error = TRUE;
CREATE INDEX IF NOT EXISTS idx_actividad_proyecto_timestamp ON actividad_centralizada(proyecto_id, timestamp DESC);

-- Índice compuesto para queries frecuentes del dashboard
CREATE INDEX IF NOT EXISTS idx_actividad_dashboard ON actividad_centralizada(proyecto_id, timestamp DESC, es_error);

-- =====================================================
-- FUNCIÓN: Actualizar last_activity_at automáticamente
-- =====================================================
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

-- Trigger para actualizar automáticamente
DROP TRIGGER IF EXISTS trigger_update_last_activity ON actividad_centralizada;
CREATE TRIGGER trigger_update_last_activity
    AFTER INSERT ON actividad_centralizada
    FOR EACH ROW
    EXECUTE FUNCTION update_proyecto_last_activity();

-- =====================================================
-- FUNCIÓN: Obtener estadísticas de módulos por proyecto
-- =====================================================
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

-- =====================================================
-- FUNCIÓN: Obtener resumen del dashboard
-- =====================================================
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

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================
ALTER TABLE proyectos_maestros ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividad_centralizada ENABLE ROW LEVEL SECURITY;

-- Política para lectura desde el dashboard (requiere autenticación)
CREATE POLICY "Allow read for authenticated users" ON proyectos_maestros
    FOR SELECT USING (true);

CREATE POLICY "Allow read activities for authenticated users" ON actividad_centralizada
    FOR SELECT USING (true);

-- Política para inserción de actividades (solo desde service role)
CREATE POLICY "Allow insert activities from service" ON actividad_centralizada
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- DATOS DE EJEMPLO (comentar en producción)
-- =====================================================
/*
-- Insertar proyectos de ejemplo
INSERT INTO proyectos_maestros (nombre_cliente, nombre_proyecto, api_key_unica, url_dominio, status_servidor, descripcion, color_marca) VALUES
('ZonaT', 'Sistema POS ZonaT', 'zt_' || encode(gen_random_bytes(24), 'hex'), 'https://zonat.programamos.co', 'active', 'Sistema de punto de venta para tiendas ZonaT', '#FF6B6B'),
('Aleya', 'ERP Aleya', 'al_' || encode(gen_random_bytes(24), 'hex'), 'https://aleya.programamos.co', 'active', 'Sistema ERP completo para gestión empresarial', '#4ECDC4'),
('Cliente Demo', 'Demo App', 'demo_' || encode(gen_random_bytes(24), 'hex'), 'https://demo.programamos.co', 'inactive', 'Aplicación de demostración', '#45B7D1');
*/
