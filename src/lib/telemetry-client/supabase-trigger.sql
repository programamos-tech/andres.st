-- =====================================================
-- TRIGGER DE SUPABASE PARA ENVÍO AUTOMÁTICO DE LOGS
-- 
-- Copia este código en tu proyecto cliente de Supabase
-- para enviar automáticamente cada log a andres.st
-- =====================================================

-- Primero, habilita la extensión http si no está habilitada
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- =====================================================
-- OPCIÓN 1: Edge Function (Recomendado)
-- =====================================================
-- Crea una Edge Function en tu proyecto cliente:
-- Archivo: supabase/functions/send-telemetry/index.ts

/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const PROGRAMAMOS_API_KEY = Deno.env.get('PROGRAMAMOS_API_KEY')
const PROGRAMAMOS_ENDPOINT = 'https://andres.st/api/v1/telemetry'

interface LogPayload {
  type: 'INSERT'
  table: string
  record: {
    usuario_nombre: string
    usuario_email?: string
    modulo: string
    accion: string
    es_error?: boolean
    error_mensaje?: string
    created_at: string
  }
}

serve(async (req) => {
  try {
    const payload: LogPayload = await req.json()
    
    if (payload.type !== 'INSERT' || !payload.record) {
      return new Response('OK', { status: 200 })
    }

    const { record } = payload

    const response = await fetch(PROGRAMAMOS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: PROGRAMAMOS_API_KEY,
        usuario_nombre: record.usuario_nombre,
        usuario_email: record.usuario_email,
        modulo_visitado: record.modulo,
        accion_realizada: record.accion,
        es_error: record.es_error || false,
        error_mensaje: record.error_mensaje,
        timestamp: record.created_at
      })
    })

    const result = await response.json()
    console.log('Telemetry sent:', result)

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error sending telemetry:', error)
    return new Response('Error', { status: 500 })
  }
})
*/

-- Luego, crea un Database Webhook en Supabase Dashboard:
-- 1. Ve a Database > Webhooks
-- 2. Crea un nuevo webhook apuntando a tu Edge Function
-- 3. Selecciona la tabla de logs y el evento INSERT

-- =====================================================
-- OPCIÓN 2: Función PL/pgSQL con pg_net (Alternativa)
-- =====================================================
-- Nota: Requiere que pg_net esté habilitado en tu proyecto

-- Habilitar pg_net
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Función para enviar telemetría
CREATE OR REPLACE FUNCTION send_log_to_programamos()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  programamos_api_key text := 'TU_API_KEY_UNICA_AQUI'; -- Reemplazar con tu API key
  programamos_endpoint text := 'https://andres.st/api/v1/telemetry';
BEGIN
  -- Construir el payload
  payload := jsonb_build_object(
    'api_key', programamos_api_key,
    'usuario_nombre', COALESCE(NEW.usuario_nombre, NEW.user_name, 'Sistema'),
    'usuario_email', COALESCE(NEW.usuario_email, NEW.user_email, NULL),
    'modulo_visitado', COALESCE(NEW.modulo, NEW.module, NEW.page, 'General'),
    'accion_realizada', COALESCE(NEW.accion, NEW.action, NEW.description, 'Actividad'),
    'es_error', COALESCE(NEW.es_error, NEW.is_error, FALSE),
    'error_mensaje', COALESCE(NEW.error_mensaje, NEW.error_message, NULL),
    'timestamp', COALESCE(NEW.created_at, NOW())::text
  );

  -- Enviar request asíncrono con pg_net
  PERFORM net.http_post(
    url := programamos_endpoint,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger en tu tabla de logs
-- Adapta 'nombre_de_tu_tabla_de_logs' al nombre real de tu tabla
/*
CREATE TRIGGER trigger_send_to_programamos
AFTER INSERT ON nombre_de_tu_tabla_de_logs
FOR EACH ROW
EXECUTE FUNCTION send_log_to_programamos();
*/

-- =====================================================
-- EJEMPLO: Si tu tabla de logs se llama 'activity_logs'
-- =====================================================

/*
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_nombre VARCHAR(255),
  usuario_email VARCHAR(255),
  modulo VARCHAR(255),
  accion VARCHAR(255),
  es_error BOOLEAN DEFAULT FALSE,
  error_mensaje TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger
CREATE TRIGGER trigger_send_to_programamos
AFTER INSERT ON activity_logs
FOR EACH ROW
EXECUTE FUNCTION send_log_to_programamos();

-- Prueba insertando un log
INSERT INTO activity_logs (usuario_nombre, modulo, accion)
VALUES ('Usuario de prueba', 'Dashboard', 'Inició sesión');
*/

-- =====================================================
-- VERIFICAR QUE FUNCIONA
-- =====================================================
-- Después de configurar, inserta un log de prueba y verifica
-- en el Dashboard de andres.st que aparezca la actividad
