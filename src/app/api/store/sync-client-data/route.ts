import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CLIENT_API_KEY_HEADER = 'x-andres-api-key';

type ClientStore = { id: string; name: string; logo_url?: string | null };
type ClientUser = {
  id: string;
  name: string;
  email: string;
  store_id: string | null;
  es_dueño: boolean;
};

type ClientResponse = {
  stores: ClientStore[];
  users: ClientUser[];
  app_logo_url?: string | null;
  main_store_id?: string | null;
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function fetchClientData(baseUrl: string, apiKey: string): Promise<ClientResponse> {
  const url = baseUrl.replace(/\/$/, '');
  const fullUrl = `${url}/api/andres/usuarios-tiendas`;
  let res: Response;
  try {
    res = await fetch(fullUrl, {
      headers: { [CLIENT_API_KEY_HEADER]: apiKey },
      cache: 'no-store',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'fetch failed';
    if (msg === 'fetch failed' || msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND')) {
      throw new Error(`No se pudo conectar con la app del cliente en ${url}. ¿Está corriendo? Comprueba la URL y que el servidor esté levantado.`);
    }
    throw new Error(msg);
  }

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 401) {
      throw new Error('API key incorrecta. Revisa que coincida con la configurada en la app del cliente.');
    }
    if (res.status === 404) {
      throw new Error(
        'La app del cliente devolvió 404. ¿Tiene la ruta /api/andres/usuarios-tiendas? Revisa la URL del proyecto (client_api_url) y que la app del cliente exponga ese endpoint.'
      );
    }
    const snippet = text.startsWith('<') ? '(respuesta HTML)' : text.slice(0, 200);
    throw new Error(`Error del cliente (${res.status}): ${snippet}`);
  }

  return res.json() as Promise<ClientResponse>;
}

/**
 * POST /api/store/sync-client-data
 * Body: { project_id: string, client_api_url?: string, client_api_key?: string }
 * Uses project's client_api_url and client_api_key from DB, or overrides from body if provided.
 * If override is used and sync succeeds, persists URL/key to the project.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const projectId = typeof body.project_id === 'string' ? body.project_id.trim() : null;
    const overrideUrl = typeof body.client_api_url === 'string' ? body.client_api_url.trim() || null : null;
    const overrideKey = typeof body.client_api_key === 'string' ? body.client_api_key : null;

    if (!projectId) {
      return NextResponse.json(
        { error: 'project_id is required in the request body.' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data: project, error: projectError } = await supabase
      .from('proyectos_maestros')
      .select('id, client_api_url, client_api_key')
      .eq('id', projectId)
      .maybeSingle();

    if (projectError) throw projectError;
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const dbUrl = (project as { client_api_url: string | null }).client_api_url;
    const dbKey = (project as { client_api_key: string | null }).client_api_key;
    const clientApiUrl = (overrideUrl && overrideUrl !== '') ? overrideUrl : (dbUrl ?? null);
    const clientApiKey = (overrideKey && overrideKey !== '') ? overrideKey : (dbKey ?? null);

    if (!clientApiUrl || !clientApiKey) {
      return NextResponse.json(
        { error: 'Configure Client API URL and API key for this project in Backstage first (or send them in the request body).' },
        { status: 400 }
      );
    }

    const clientData = await fetchClientData(clientApiUrl, clientApiKey);
    const baseUrl = clientApiUrl.replace(/\/$/, '');
    const appLogoRaw = clientData.app_logo_url ?? null;
    const appLogoUrl = appLogoRaw && appLogoRaw.startsWith('http') ? appLogoRaw : (appLogoRaw ? `${baseUrl}${appLogoRaw.startsWith('/') ? '' : '/'}${appLogoRaw}` : null);

    const stores = clientData.stores ?? [];
    const resolveLogoUrl = (raw: string | null | undefined): string | null => {
      if (!raw || typeof raw !== 'string') return null;
      if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
      return `${baseUrl}${raw.startsWith('/') ? '' : '/'}${raw}`;
    };
    const storeRows = stores.map((s) => ({
      project_id: projectId,
      external_id: s.id,
      name: s.name ?? null,
      logo_url: resolveLogoUrl(s.logo_url) ?? null,
      updated_at: new Date().toISOString(),
    }));
    if (storeRows.length > 0) {
      const { error: storesError } = await supabase.from('project_stores').upsert(storeRows, {
        onConflict: 'project_id,external_id',
        ignoreDuplicates: false,
      });
      if (storesError) throw storesError;
    }

    const users = clientData.users ?? [];
    const platformUsers = users.map((u) => ({
      project_id: projectId,
      external_id: u.id,
      email: u.email,
      name: u.name ?? null,
      store_id: u.store_id ?? null,
      is_owner: !!u.es_dueño,
      updated_at: new Date().toISOString(),
    }));

    if (platformUsers.length > 0) {
      const { error: upsertError } = await supabase.from('platform_users').upsert(platformUsers, {
        onConflict: 'project_id,email',
        ignoreDuplicates: false,
      });
      if (upsertError) throw upsertError;
    }

    const owner = users.find((u) => u.es_dueño);
    const projectUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (owner) {
      projectUpdate.owner_name = owner.name ?? null;
      projectUpdate.owner_email = owner.email ?? null;
    }
    if (appLogoUrl) projectUpdate.logo_url = appLogoUrl;
    const mainStoreExternalId = (clientData.main_store_id && String(clientData.main_store_id).trim()) || null;
    if (mainStoreExternalId) projectUpdate.main_store_external_id = mainStoreExternalId;
    if ((overrideUrl && overrideUrl !== '') || (overrideKey && overrideKey !== '')) {
      if (overrideUrl && overrideUrl !== '') projectUpdate.client_api_url = overrideUrl;
      if (overrideKey && overrideKey !== '') projectUpdate.client_api_key = overrideKey;
    }
    const { error: updateError } = await supabase
      .from('proyectos_maestros')
      .update(projectUpdate)
      .eq('id', projectId);
    if (updateError) {
      console.error('[sync-client-data] failed to update project', updateError);
    }

    return NextResponse.json({
      ok: true,
      project_id: projectId,
      users_synced: platformUsers.length,
      stores_synced: storeRows.length,
      owner_set: !!owner,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Sync failed';
    console.error('[sync-client-data]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
