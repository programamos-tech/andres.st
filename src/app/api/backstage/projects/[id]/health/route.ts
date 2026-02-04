import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const HEALTH_TIMEOUT_MS = 3000;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * GET /api/backstage/projects/[id]/health
 * Comprueba en vivo si el servidor del cliente responde y guarda el resultado en historial.
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
      .select('client_api_url, client_api_key')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    let status: 'active' | 'inactive' = 'inactive';
    let latency_ms: number | null = null;
    let reason: string | undefined;

    const baseUrl = (data.client_api_url as string)?.trim();
    if (!baseUrl) {
      reason = 'no_url';
    } else {
      const url = baseUrl.replace(/\/$/, '');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
      const start = Date.now();
      let res: Response;
      try {
        res = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });
      } catch (err) {
        clearTimeout(timeout);
        const msg = err instanceof Error ? err.message : String(err);
        reason = msg.includes('abort') ? 'timeout' : 'connection_failed';
      }
      clearTimeout(timeout);
      latency_ms = Date.now() - start;
      if (baseUrl && latency_ms !== null && !reason) {
        const res2 = res!;
        if (res2.status >= 200 && res2.status < 400) {
          status = 'active';
        } else {
          reason = 'bad_response';
        }
      }
    }

    void supabase
      .from('project_health_checks')
      .insert({ project_id: id, status, latency_ms })
      .then(() => {}, (err) => console.error('[health] insert history failed', err));

    return NextResponse.json({
      status,
      ...(reason && { reason }),
      latency_ms,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Health check failed';
    console.error('[backstage/projects/[id]/health GET]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
