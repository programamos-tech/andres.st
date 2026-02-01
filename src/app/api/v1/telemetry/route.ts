import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Tipos para la telemetría entrante
interface TelemetryPayload {
  api_key: string;
  usuario_id?: string;
  usuario_nombre: string;
  usuario_email?: string;
  modulo_visitado: string;
  accion_realizada: string;
  metadata?: Record<string, unknown>;
  es_error?: boolean;
  error_mensaje?: string;
  error_stack?: string;
  duracion_ms?: number;
  timestamp?: string;
}

// Validar el payload
function validatePayload(payload: unknown): payload is TelemetryPayload {
  if (!payload || typeof payload !== 'object') return false;
  const p = payload as Record<string, unknown>;
  
  return (
    typeof p.api_key === 'string' &&
    typeof p.usuario_nombre === 'string' &&
    typeof p.modulo_visitado === 'string' &&
    typeof p.accion_realizada === 'string'
  );
}

// Crear cliente de Supabase para el servidor
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    // Parsear el body
    const payload = await request.json();

    // Validar payload
    if (!validatePayload(payload)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payload. Required: api_key, usuario_nombre, modulo_visitado, accion_realizada' 
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // Buscar el proyecto por api_key
    const { data: proyecto, error: proyectoError } = await supabase
      .from('proyectos_maestros')
      .select('id, nombre_proyecto')
      .eq('api_key_unica', payload.api_key)
      .single();

    if (proyectoError || !proyecto) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Obtener información adicional del request
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                       request.headers.get('x-real-ip') || 
                       null;
    const user_agent = request.headers.get('user-agent') || null;

    // Insertar la actividad
    const { data: actividad, error: actividadError } = await supabase
      .from('actividad_centralizada')
      .insert({
        proyecto_id: proyecto.id,
        usuario_id: payload.usuario_id || null,
        usuario_nombre: payload.usuario_nombre,
        usuario_email: payload.usuario_email || null,
        modulo_visitado: payload.modulo_visitado,
        accion_realizada: payload.accion_realizada,
        metadata: payload.metadata || null,
        es_error: payload.es_error || false,
        error_mensaje: payload.error_mensaje || null,
        error_stack: payload.error_stack || null,
        ip_address: ip_address,
        user_agent: user_agent,
        duracion_ms: payload.duracion_ms || null,
        timestamp: payload.timestamp || new Date().toISOString()
      })
      .select('id')
      .single();

    if (actividadError) {
      console.error('Error inserting activity:', actividadError);
      return NextResponse.json(
        { success: false, error: 'Failed to log activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Activity logged successfully',
      activity_id: actividad?.id,
      proyecto: proyecto.nombre_proyecto
    });

  } catch (error) {
    console.error('Telemetry endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'andres.st Telemetry API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}
