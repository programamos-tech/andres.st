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

export interface TicketComentario {
  id: string;
  ticket_id: string;
  mensaje: string;
  autor_nombre: string;
  es_admin: boolean;
  created_at: string;
}

/**
 * GET /api/tickets/[id]/comments
 * Lista comentarios del ticket ordenados por fecha (más antiguos primero).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('ticket_comentarios')
      .select('id, ticket_id, mensaje, autor_nombre, es_admin, created_at')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[api/tickets/[id]/comments GET]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comentarios: (data ?? []) as TicketComentario[] });
  } catch (e) {
    console.error('[api/tickets/[id]/comments GET]', e);
    return NextResponse.json({ error: 'Error obteniendo comentarios' }, { status: 500 });
  }
}

/**
 * POST /api/tickets/[id]/comments
 * Crea un comentario. Body: { mensaje, autor_nombre, es_admin }.
 * - Backstage: es_admin true, autor_nombre ej. "Equipo"
 * - Usuario: es_admin false, autor_nombre ej. nombre del solicitante
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim() : '';
    const autor_nombre = typeof body.autor_nombre === 'string' ? body.autor_nombre.trim() : '';
    const es_admin = body.es_admin === true;

    if (!mensaje) return NextResponse.json({ error: 'mensaje requerido' }, { status: 400 });
    if (!autor_nombre) return NextResponse.json({ error: 'autor_nombre requerido' }, { status: 400 });

    const supabase = getSupabase();

    // Comprobar que el ticket existe
    const { data: ticket } = await supabase.from('tickets').select('id').eq('id', id).single();
    if (!ticket) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });

    const { data, error } = await supabase
      .from('ticket_comentarios')
      .insert({ ticket_id: id, mensaje, autor_nombre, es_admin })
      .select('id, ticket_id, mensaje, autor_nombre, es_admin, created_at')
      .single();

    if (error) {
      console.error('[api/tickets/[id]/comments POST]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data as TicketComentario);
  } catch (e) {
    console.error('[api/tickets/[id]/comments POST]', e);
    return NextResponse.json({ error: 'Error creando comentario' }, { status: 500 });
  }
}
