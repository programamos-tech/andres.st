import { NextResponse } from 'next/server';
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
 * GET /api/backstage/ayuda/chats
 * Lista todos los chats de Andrebot (para Backstage), ordenados por actividad reciente.
 */
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data: chats, error } = await supabase
      .from('ayuda_chats')
      .select('id, creado_por_email, creado_por_nombre, proyecto_id, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(200);

    if (error) {
      if (error.message?.includes('ayuda_chats') || error.message?.includes('schema cache')) {
        return NextResponse.json({ chats: [] });
      }
      console.error('[backstage/ayuda/chats GET]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = (chats ?? []).map((c: { id: string; creado_por_email: string; creado_por_nombre: string | null; proyecto_id: string | null; created_at: string; updated_at: string }) => ({
      id: c.id,
      creado_por_email: c.creado_por_email,
      creado_por_nombre: c.creado_por_nombre ?? null,
      proyecto_id: c.proyecto_id ?? null,
      created_at: c.created_at,
      updated_at: c.updated_at,
    }));

    return NextResponse.json({ chats: list });
  } catch (e) {
    console.error('[backstage/ayuda/chats GET]', e);
    return NextResponse.json({ error: 'Error listando chats' }, { status: 500 });
  }
}
