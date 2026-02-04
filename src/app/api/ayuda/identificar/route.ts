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
 * GET /api/ayuda/identificar?email=xxx
 * Busca si el email existe en platform_users (sincronizados desde la API del proyecto).
 * Devuelve { found, nombre?, proyecto_nombre?, logo_url? } para mostrar saludo y logo en el chat.
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    const trimmed = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!trimmed) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    const supabase = getSupabase();

    const { data: users, error: usersError } = await supabase
      .from('platform_users')
      .select('id, name, email, project_id')
      .ilike('email', trimmed)
      .limit(1);

    if (usersError) {
      console.error('[ayuda/identificar] platform_users', usersError);
      return NextResponse.json({ found: false }, { status: 200 });
    }

    const user = users?.[0];
    if (!user?.project_id) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    const { data: project, error: projectError } = await supabase
      .from('proyectos_maestros')
      .select('id, nombre_proyecto, logo_url')
      .eq('id', user.project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    const nombre = (user.name && user.name.trim()) || trimmed.split('@')[0] || 'Usuario';
    const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    return NextResponse.json({
      found: true,
      nombre: nombreCapitalizado,
      proyecto_id: (project.id as string) || null,
      proyecto_nombre: (project.nombre_proyecto as string) || 'Tu proyecto',
      logo_url: (project.logo_url as string) || null,
    });
  } catch (e) {
    console.error('[ayuda/identificar]', e);
    return NextResponse.json({ found: false }, { status: 200 });
  }
}
