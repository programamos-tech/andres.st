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

function messageFromRow(row: { role: string; content: string; meta?: unknown }) {
  const meta = (row.meta as Record<string, unknown>) || {};
  return {
    role: row.role as 'user' | 'bot',
    text: row.content,
    action: meta.action as string | undefined,
    storeLogo: meta.storeLogo as string | undefined,
    storeName: meta.storeName as string | undefined,
    ticketId: meta.ticketId as string | undefined,
    ticketsExistentes: meta.ticketsExistentes as { id: string; estadoLabel: string }[] | undefined,
    imageUrl: meta.imageUrl as string | undefined,
  };
}

/**
 * GET /api/ayuda/chats/[id]
 * Devuelve el chat con todos sus mensajes (para restaurar al volver).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const supabase = getSupabase();
    const { data: chat, error: chatError } = await supabase
      .from('ayuda_chats')
      .select('id, creado_por_email, creado_por_nombre, proyecto_id')
      .eq('id', id)
      .single();

    if (chatError || !chat) {
      if (chatError?.message?.includes('ayuda_chats') || chatError?.message?.includes('schema cache')) {
        return NextResponse.json({ error: 'Chat no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Chat no encontrado' }, { status: 404 });
    }

    const { data: rows, error: msgError } = await supabase
      .from('ayuda_chat_mensajes')
      .select('role, content, meta')
      .eq('chat_id', id)
      .order('created_at', { ascending: true });

    if (msgError) {
      console.error('[ayuda/chats/[id] GET] messages', msgError);
      return NextResponse.json({
        id: chat.id,
        creado_por_email: chat.creado_por_email,
        creado_por_nombre: chat.creado_por_nombre,
        proyecto_id: chat.proyecto_id,
        messages: [],
      });
    }

    const messages = (rows || []).map(messageFromRow);
    return NextResponse.json({
      id: chat.id,
      creado_por_email: chat.creado_por_email,
      creado_por_nombre: chat.creado_por_nombre,
      proyecto_id: chat.proyecto_id,
      messages,
    });
  } catch (e) {
    console.error('[ayuda/chats/[id] GET]', e);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('ayuda_chats') || msg.includes('schema cache')) {
      return NextResponse.json({ error: 'Chat no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error obteniendo el chat' }, { status: 500 });
  }
}
