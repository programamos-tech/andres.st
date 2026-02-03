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
 * GET /api/backstage/projects/[id]/users
 * Returns platform_users for the project with store name (from project_stores).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { data: users, error: usersError } = await supabase
      .from('platform_users')
      .select('id, external_id, email, name, store_id, is_owner')
      .eq('project_id', id)
      .order('email');

    if (usersError) throw usersError;

    const storeIds = [...new Set((users ?? []).map((u) => u.store_id).filter(Boolean))] as string[];
    let storeMap: Record<string, string> = {};

    if (storeIds.length > 0) {
      const { data: stores } = await supabase
        .from('project_stores')
        .select('external_id, name')
        .eq('project_id', id)
        .in('external_id', storeIds);
      storeMap = Object.fromEntries((stores ?? []).map((s) => [s.external_id, s.name ?? s.external_id]));
    }

    const list = (users ?? []).map((u) => ({
      id: u.id,
      external_id: u.external_id,
      email: u.email,
      name: u.name,
      store_id: u.store_id,
      store_name: u.store_id ? storeMap[u.store_id] ?? null : null,
      is_owner: u.is_owner,
    }));

    return NextResponse.json(list);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch users';
    console.error('[backstage/projects/[id]/users]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
