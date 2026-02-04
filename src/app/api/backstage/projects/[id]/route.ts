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

export interface ProjectForBackstage {
  id: string;
  nombre_cliente: string;
  nombre_proyecto: string;
  url_dominio: string;
  logo_url: string | null;
  main_store_external_id: string | null;
  status_servidor: string;
  last_activity_at: string | null;
  owner_name: string | null;
  owner_email: string | null;
  client_api_url: string | null;
  client_api_configured: boolean;
}

/**
 * GET /api/backstage/projects/[id]
 * Returns project for backstage detail. Does not expose client_api_key value.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('proyectos_maestros')
      .select('id, nombre_cliente, nombre_proyecto, url_dominio, logo_url, main_store_external_id, status_servidor, last_activity_at, owner_name, owner_email, client_api_url, client_api_key')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const row = data as Record<string, unknown>;
    const out: ProjectForBackstage = {
      id: row.id as string,
      nombre_cliente: row.nombre_cliente as string,
      nombre_proyecto: row.nombre_proyecto as string,
      url_dominio: row.url_dominio as string,
      logo_url: (row.logo_url as string) ?? null,
      main_store_external_id: (row.main_store_external_id as string) ?? null,
      status_servidor: row.status_servidor as string,
      last_activity_at: (row.last_activity_at as string) ?? null,
      owner_name: (row.owner_name as string) ?? null,
      owner_email: (row.owner_email as string) ?? null,
      client_api_url: (row.client_api_url as string) ?? null,
      client_api_configured: !!(row.client_api_url && row.client_api_key),
    };

    return NextResponse.json(out);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch project';
    console.error('[backstage/projects/[id] GET]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/backstage/projects/[id]
 * Body: { nombre_cliente?: string, nombre_proyecto?: string, client_api_url?: string, client_api_key?: string, logo_url?: string | null }
 * Empty string for client_api_key means "do not change" (keep current).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const nombre_cliente = typeof body.nombre_cliente === 'string' ? body.nombre_cliente.trim() || null : undefined;
    const nombre_proyecto = typeof body.nombre_proyecto === 'string' ? body.nombre_proyecto.trim() || null : undefined;
    const client_api_url = typeof body.client_api_url === 'string' ? body.client_api_url.trim() || null : undefined;
    const client_api_key = typeof body.client_api_key === 'string' ? body.client_api_key : undefined;
    const logo_url = body.logo_url === null || (typeof body.logo_url === 'string' && body.logo_url.trim() === '')
      ? null
      : typeof body.logo_url === 'string'
        ? body.logo_url.trim() || null
        : undefined;

    const supabase = getSupabase();

    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (nombre_cliente !== undefined) payload.nombre_cliente = nombre_cliente;
    if (nombre_proyecto !== undefined) payload.nombre_proyecto = nombre_proyecto;
    if (client_api_url !== undefined) payload.client_api_url = client_api_url;
    // Only update key when a non-empty value is sent; empty string = do not change
    if (client_api_key !== undefined && client_api_key !== '') payload.client_api_key = client_api_key;
    if (logo_url !== undefined) payload.logo_url = logo_url;

    const { data, error } = await supabase
      .from('proyectos_maestros')
      .update(payload)
      .eq('id', id)
      .select('id, client_api_url')
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update project';
    console.error('[backstage/projects/[id] PATCH]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/backstage/projects/[id]
 * Deletes the project and all related data (health checks, activity, users, stores).
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { data: existing } = await supabase
      .from('proyectos_maestros')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await supabase.from('project_health_checks').delete().eq('project_id', id);
    await supabase.from('actividad_centralizada').delete().eq('proyecto_id', id);
    await supabase.from('platform_users').delete().eq('project_id', id);
    await supabase.from('project_stores').delete().eq('project_id', id);
    const { error } = await supabase.from('proyectos_maestros').delete().eq('id', id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to delete project';
    console.error('[backstage/projects/[id] DELETE]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
