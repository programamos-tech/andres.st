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

/**
 * GET /api/tickets/[id]
 * Devuelve un ticket por id (UUID). Para el historial se usa created_at + estado actual.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const supabase = getSupabase();
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('id, numero, proyecto_nombre, modulo, tienda, titulo, descripcion, estado, creado_por_nombre, created_at, updated_at, resolved_at')
      .eq('id', id)
      .single();

    if (error || !ticket) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
    }

    const historial = [{ estado: ticket.estado as string, fecha: ticket.updated_at }];

    return NextResponse.json({
      id: ticket.id,
      numero: ticket.numero,
      proyecto_nombre: ticket.proyecto_nombre,
      modulo: ticket.modulo ?? 'general',
      tienda: ticket.tienda ?? '',
      titulo: ticket.titulo,
      descripcion: ticket.descripcion,
      estado: ticket.estado,
      prioridad: 'media',
      creado_por_nombre: ticket.creado_por_nombre,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
      historial,
    });
  } catch (e) {
    console.error('[api/tickets/[id] GET]', e);
    return NextResponse.json({ error: 'Error obteniendo el ticket' }, { status: 500 });
  }
}
