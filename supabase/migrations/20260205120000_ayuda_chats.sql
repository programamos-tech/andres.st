-- Chats de ayuda (Andrebot) para persistir la conversación y poder "volver al chat"
CREATE TABLE IF NOT EXISTS ayuda_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creado_por_email VARCHAR(255) NOT NULL,
  creado_por_nombre VARCHAR(255),
  proyecto_id UUID REFERENCES proyectos_maestros(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ayuda_chats_email ON ayuda_chats(creado_por_email);
CREATE INDEX IF NOT EXISTS idx_ayuda_chats_updated ON ayuda_chats(updated_at DESC);

-- Mensajes de cada chat (user/bot con metadata para acciones, ticketId, etc.)
CREATE TABLE IF NOT EXISTS ayuda_chat_mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES ayuda_chats(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'bot')),
  content TEXT NOT NULL,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ayuda_chat_mensajes_chat ON ayuda_chat_mensajes(chat_id);
CREATE INDEX IF NOT EXISTS idx_ayuda_chat_mensajes_created ON ayuda_chat_mensajes(chat_id, created_at);

-- RLS
ALTER TABLE ayuda_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayuda_chat_mensajes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all ayuda_chats" ON ayuda_chats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all ayuda_chat_mensajes" ON ayuda_chat_mensajes FOR ALL USING (true) WITH CHECK (true);
