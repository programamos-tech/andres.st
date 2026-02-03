import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function generateApiKey(): string {
  return 'pm_' + randomBytes(24).toString('hex');
}

/**
 * POST /api/backstage/projects
 * Body: { nombre_cliente, nombre_proyecto, url_dominio, client_api_key?, descripcion?, color_marca? }
 * If url_dominio is set, client_api_url is set to it. Optional client_api_key for sync.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const nombre_cliente = typeof body.nombre_cliente === 'string' ? body.nombre_cliente.trim() : '';
    const nombre_proyecto = typeof body.nombre_proyecto === 'string' ? body.nombre_proyecto.trim() : '';
    const url_dominio = typeof body.url_dominio === 'string' ? body.url_dominio.trim() : '';
    const client_api_key = typeof body.client_api_key === 'string' ? body.client_api_key.trim() || null : null;
    const descripcion = typeof body.descripcion === 'string' ? body.descripcion.trim() || null : null;
    const color_marca = typeof body.color_marca === 'string' ? body.color_marca.trim() || null : null;

    if (!nombre_cliente || !nombre_proyecto || !url_dominio) {
      return NextResponse.json(
        { error: 'nombre_cliente, nombre_proyecto and url_dominio are required.' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const api_key_unica = generateApiKey();

    const insert: Record<string, unknown> = {
      nombre_cliente,
      nombre_proyecto,
      api_key_unica,
      url_dominio,
      status_servidor: 'inactive',
      descripcion,
      color_marca,
    };
    if (url_dominio) insert.client_api_url = url_dominio;
    if (client_api_key) insert.client_api_key = client_api_key;

    const { data, error } = await supabase
      .from('proyectos_maestros')
      .insert(insert)
      .select('id, nombre_cliente, nombre_proyecto, url_dominio, api_key_unica')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create project';
    console.error('[backstage/projects POST]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
