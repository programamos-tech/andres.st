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
 * POST /api/ayuda/chats/[id]/messages
 * Agrega mensajes al chat. Body: { messages: [{ role, text, action?, storeLogo?, storeName?, ticketId?, ticketsExistentes?, imageUrl? }] }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (messages.length === 0) return NextResponse.json({ ok: true }, { status: 200 });

    const supabase = getSupabase();
    const rows = messages.map((m: { role: string; text: string; action?: string; storeLogo?: string; storeName?: string; ticketId?: string; ticketsExistentes?: unknown; imageUrl?: string }) => {
      const meta: Record<string, unknown> = {};
      if (m.action) meta.action = m.action;
      if (m.storeLogo) meta.storeLogo = m.storeLogo;
      if (m.storeName) meta.storeName = m.storeName;
      if (m.ticketId) meta.ticketId = m.ticketId;
      if (m.ticketsExistentes && typeof m.ticketsExistentes === 'object') meta.ticketsExistentes = m.ticketsExistentes;
      if (m.imageUrl) meta.imageUrl = m.imageUrl;
      return {
        chat_id: id,
        role: m.role === 'bot' ? 'bot' : 'user',
        content: typeof m.text === 'string' ? m.text : '',
        meta,
      };
    });

    const { error } = await supabase.from('ayuda_chat_mensajes').insert(rows);
    if (error) {
      if (error.message?.includes('ayuda_chat') || error.message?.includes('schema cache')) {
        return NextResponse.json({ ok: true }, { status: 200 });
      }
      console.error('[ayuda/chats/[id]/messages POST]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from('ayuda_chats').update({ updated_at: new Date().toISOString() }).eq('id', id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[ayuda/chats/[id]/messages POST]', e);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('ayuda_chat') || msg.includes('schema cache')) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    return NextResponse.json({ error: 'Error guardando mensajes' }, { status: 500 });
  }
}
