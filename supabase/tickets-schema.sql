-- =====================================================
-- SISTEMA DE AYUDA / TICKETS
-- =====================================================

-- Secuencia para números de ticket
CREATE SEQUENCE IF NOT EXISTS ticket_numero_seq START 100;

-- Tabla de tickets
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero INTEGER NOT NULL DEFAULT nextval('ticket_numero_seq'),
    proyecto_id UUID REFERENCES proyectos_maestros(id) ON DELETE SET NULL,
    
    -- Contexto del ticket
    proyecto_nombre VARCHAR(100) NOT NULL,
    modulo VARCHAR(100) DEFAULT 'general',
    tienda VARCHAR(255),
    
    -- Info del ticket
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    
    -- Estado del flujo de trabajo
    -- creado → replicando → ajustando → probando → desplegando → resuelto
    estado VARCHAR(20) DEFAULT 'creado' CHECK (estado IN ('creado', 'replicando', 'ajustando', 'probando', 'desplegando', 'resuelto')),
    
    -- Quien lo creó
    creado_por_nombre VARCHAR(255) NOT NULL,
    creado_por_email VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    
    UNIQUE(numero)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tickets_proyecto ON tickets(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);

-- Tabla de comentarios/respuestas
CREATE TABLE IF NOT EXISTS ticket_comentarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    
    -- Contenido
    mensaje TEXT NOT NULL,
    
    -- Quien comenta
    autor_nombre VARCHAR(255) NOT NULL,
    es_admin BOOLEAN DEFAULT FALSE,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_comentarios_ticket ON ticket_comentarios(ticket_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trigger_ticket_updated ON tickets;
CREATE TRIGGER trigger_ticket_updated
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_ticket_timestamp();

-- RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comentarios ENABLE ROW LEVEL SECURITY;

-- Políticas (lectura pública por ahora, luego se puede restringir)
CREATE POLICY "Allow read tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Allow insert tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update tickets" ON tickets FOR UPDATE USING (true);

CREATE POLICY "Allow read comments" ON ticket_comentarios FOR SELECT USING (true);
CREATE POLICY "Allow insert comments" ON ticket_comentarios FOR INSERT WITH CHECK (true);
