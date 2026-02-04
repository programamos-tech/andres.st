import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const PRIORIDADES_VALIDAS = ['medio', 'alto_maromas', 'alto_espera', 'urgente'] as const;

type Body = {
  proyecto_nombre?: string;
  logo_url?: string | null;
  modulo?: string;
  tienda?: string;
  titulo: string;
  descripcion: string;
  creado_por_nombre: string;
  creado_por_email?: string | null;
  proyecto_id?: string | null;
  prioridad?: string;
};

/**
 * POST /api/tickets
 * Crea un ticket de soporte en la DB.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    const titulo = typeof body.titulo === 'string' ? body.titulo.trim().slice(0, 255) : '';
    const descripcion = typeof body.descripcion === 'string' ? body.descripcion.trim() : '';
    const creado_por_nombre = typeof body.creado_por_nombre === 'string' ? body.creado_por_nombre.trim().slice(0, 255) : 'Usuario';
    if (!titulo || !descripcion) {
      return NextResponse.json({ error: 'titulo y descripcion son obligatorios' }, { status: 400 });
    }

    const supabase = getSupabase();
    const proyecto_nombre = typeof body.proyecto_nombre === 'string' ? body.proyecto_nombre.trim().slice(0, 100) : 'Por identificar';
    const logo_url = typeof body.logo_url === 'string' && body.logo_url.trim() ? body.logo_url.trim().slice(0, 500) : null;
    const modulo = typeof body.modulo === 'string' ? body.modulo.trim().slice(0, 100) : 'general';
    const tienda = typeof body.tienda === 'string' ? body.tienda.trim().slice(0, 255) : null;
    const creado_por_email = typeof body.creado_por_email === 'string' ? body.creado_por_email.trim().slice(0, 255) || null : null;
    const proyecto_id = typeof body.proyecto_id === 'string' && body.proyecto_id ? body.proyecto_id : null;
    const prioridadRaw = typeof body.prioridad === 'string' ? body.prioridad.trim().toLowerCase() : '';
    const prioridad = PRIORIDADES_VALIDAS.includes(prioridadRaw as (typeof PRIORIDADES_VALIDAS)[number])
      ? prioridadRaw
      : 'medio';

    const payload = {
      proyecto_id: proyecto_id || null,
      proyecto_nombre,
      modulo,
      tienda: tienda || null,
      titulo,
      descripcion,
      estado: 'creado' as const,
      creado_por_nombre,
      creado_por_email,
      prioridad,
    };

    let result = await supabase
      .from('tickets')
      .insert(logo_url ? { ...payload, logo_url } : payload)
      .select('id, numero, estado, created_at, updated_at')
      .single();

    // Si la columna logo_url no existe (migración no aplicada), insertar sin logo_url (payload no la incluye)
    if (result.error && result.error.message?.includes('logo_url')) {
      result = await supabase
        .from('tickets')
        .insert(payload)
        .select('id, numero, estado, created_at, updated_at')
        .single();
    }
    // Si la columna prioridad no existe (migración no aplicada), insertar sin ella
    if (result.error && result.error.message?.includes('prioridad')) {
      console.warn('[api/tickets POST] La columna prioridad no existe. Ejecutá la migración: supabase/migrations/20260206120000_tickets_prioridad.sql');
      const { prioridad: _p, ...payloadSinPrioridad } = payload as typeof payload & { prioridad?: string };
      result = await supabase
        .from('tickets')
        .insert(payloadSinPrioridad)
        .select('id, numero, estado, created_at, updated_at')
        .single();
    }

    if (result.error) {
      console.error('[api/tickets POST]', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    const data = result.data;

    return NextResponse.json({
      id: data.id,
      numero: data.numero,
      estado: data.estado,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  } catch (e) {
    console.error('[api/tickets POST]', e);
    return NextResponse.json({ error: 'Error creando el ticket' }, { status: 500 });
  }
}
