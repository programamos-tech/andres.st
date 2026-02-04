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

type Body = {
  proyecto_nombre?: string;
  modulo?: string;
  tienda?: string;
  titulo: string;
  descripcion: string;
  creado_por_nombre: string;
  creado_por_email?: string | null;
  proyecto_id?: string | null;
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
    const modulo = typeof body.modulo === 'string' ? body.modulo.trim().slice(0, 100) : 'general';
    const tienda = typeof body.tienda === 'string' ? body.tienda.trim().slice(0, 255) : null;
    const creado_por_email = typeof body.creado_por_email === 'string' ? body.creado_por_email.trim().slice(0, 255) || null : null;
    const proyecto_id = typeof body.proyecto_id === 'string' && body.proyecto_id ? body.proyecto_id : null;

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        proyecto_id: proyecto_id || null,
        proyecto_nombre,
        modulo,
        tienda: tienda || null,
        titulo,
        descripcion,
        estado: 'creado',
        creado_por_nombre,
        creado_por_email,
      })
      .select('id, numero, estado, created_at, updated_at')
      .single();

    if (error) {
      console.error('[api/tickets POST]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
