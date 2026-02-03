import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CLIENT_API_KEY_HEADER = 'x-andres-api-key';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * GET /api/backstage/projects/[id]/activities?store_id=external_id&limit=50
 * Fetches activities (logs) from the client app for the given store (external_id).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('store_id')?.trim() || null;
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10), 1), 200);

    const supabase = getSupabase();
    const { data: project, error: projectError } = await supabase
      .from('proyectos_maestros')
      .select('id, client_api_url, client_api_key')
      .eq('id', projectId)
      .maybeSingle();

    if (projectError) throw projectError;
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const clientApiUrl = (project as { client_api_url: string | null }).client_api_url;
    const clientApiKey = (project as { client_api_key: string | null }).client_api_key;

    if (!clientApiUrl || !clientApiKey) {
      return NextResponse.json(
        { error: 'Client API not configured for this project' },
        { status: 400 }
      );
    }

    const baseUrl = clientApiUrl.replace(/\/$/, '');
    const activitiesUrl = new URL(`${baseUrl}/api/andres/actividades`);
    activitiesUrl.searchParams.set('limit', String(limit));
    if (storeId) activitiesUrl.searchParams.set('store_id', storeId);

    const ACTIVITIES_TIMEOUT_MS = 8000;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), ACTIVITIES_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(activitiesUrl.toString(), {
        headers: { [CLIENT_API_KEY_HEADER]: clientApiKey },
        cache: 'no-store',
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('abort')) {
        return NextResponse.json([], { status: 200 });
      }
      throw err;
    }
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: res.status === 401 ? 'Invalid API key' : text || 'Failed to fetch activities' },
        { status: res.status === 401 ? 401 : 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data.activities ?? []);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch activities';
    console.error('[backstage/projects/[id]/activities]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
