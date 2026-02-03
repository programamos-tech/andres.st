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
 * GET /api/backstage/projects/[id]/health/history?limit=20
 * Devuelve el historial de comprobaciones de salud del proyecto (cada vez que alguien abrió el panel).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)), 100);
    const supabase = getSupabase();

    const { data: project } = await supabase
      .from('proyectos_maestros')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('project_health_checks')
      .select('id, checked_at, status, latency_ms')
      .eq('project_id', id)
      .order('checked_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch health history';
    console.error('[backstage/projects/[id]/health/history GET]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
