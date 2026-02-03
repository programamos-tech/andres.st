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
 * GET /api/backstage/projects/[id]/stores
 * Returns project_stores (microtiendas) for the project.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('project_stores')
      .select('id, external_id, name, logo_url')
      .eq('project_id', id)
      .order('name');

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch stores';
    console.error('[backstage/projects/[id]/stores]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
