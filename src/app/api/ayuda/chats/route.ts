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
 * POST /api/ayuda/chats
 * Crea un nuevo chat. Body: { email, nombre?, proyecto_id? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email) return NextResponse.json({ error: 'email requerido' }, { status: 400 });

    const nombre = typeof body.nombre === 'string' ? body.nombre.trim().slice(0, 255) : null;
    const proyecto_id = typeof body.proyecto_id === 'string' && body.proyecto_id ? body.proyecto_id : null;

    const supabase = getSupabase();
    const { data: chat, error } = await supabase
      .from('ayuda_chats')
      .insert({
        creado_por_email: email,
        creado_por_nombre: nombre,
        proyecto_id: proyecto_id || null,
      })
      .select('id')
      .single();

    if (error) {
      if (error.message?.includes('ayuda_chats') || error.message?.includes('schema cache')) {
        return NextResponse.json({ id: null }, { status: 200 });
      }
      console.error('[ayuda/chats POST]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ id: chat.id });
  } catch (e) {
    console.error('[ayuda/chats POST]', e);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('ayuda_chats') || msg.includes('schema cache')) {
      return NextResponse.json({ id: null }, { status: 200 });
    }
    return NextResponse.json({ error: 'Error creando el chat' }, { status: 500 });
  }
}

/**
 * GET /api/ayuda/chats?email=xxx
 * Devuelve el chat más reciente de ese correo con sus mensajes (para restaurar al volver).
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    const trimmed = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!trimmed) return NextResponse.json({ error: 'email requerido' }, { status: 400 });

    const supabase = getSupabase();
    const { data: chat, error: chatError } = await supabase
      .from('ayuda_chats')
      .select('id, creado_por_email, created_at')
      .ilike('creado_por_email', trimmed)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (chatError || !chat) {
      return NextResponse.json({ chat: null }, { status: 200 });
    }

    const { data: rows, error: msgError } = await supabase
      .from('ayuda_chat_mensajes')
      .select('role, content, meta')
      .eq('chat_id', chat.id)
      .order('created_at', { ascending: true });

    if (msgError) {
      console.error('[ayuda/chats GET] messages', msgError);
      return NextResponse.json({ chat: { id: chat.id, creado_por_email: chat.creado_por_email, messages: [] } }, { status: 200 });
    }

    const messages = (rows || []).map(messageFromRow);
    return NextResponse.json({
      chat: {
        id: chat.id,
        creado_por_email: chat.creado_por_email,
        messages,
      },
    });
  } catch (e) {
    console.error('[ayuda/chats GET]', e);
    return NextResponse.json({ chat: null }, { status: 200 });
  }
}
