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
 * GET /api/tickets/[id]
 * Devuelve un ticket por id (UUID). Para el historial se usa created_at + estado actual.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const supabase = getSupabase();
    const selectWithLogo = 'id, numero, proyecto_id, proyecto_nombre, logo_url, modulo, tienda, titulo, descripcion, estado, prioridad, creado_por_nombre, creado_por_email, created_at, updated_at, resolved_at';
    // Sin logo_url pero con prioridad (fallback cuando la columna logo_url no existe)
    const selectWithPrioridadSinLogo = 'id, numero, proyecto_id, proyecto_nombre, modulo, tienda, titulo, descripcion, estado, prioridad, creado_por_nombre, creado_por_email, created_at, updated_at, resolved_at';
    // Sin prioridad (fallback cuando la columna prioridad no existe)
    const selectSinPrioridad = 'id, numero, proyecto_id, proyecto_nombre, modulo, tienda, titulo, descripcion, estado, creado_por_nombre, creado_por_email, created_at, updated_at, resolved_at';

    let result = await supabase.from('tickets').select(selectWithLogo).eq('id', id).single();

    if (result.error && result.error.message?.includes('logo_url')) {
      result = await supabase.from('tickets').select(selectWithPrioridadSinLogo).eq('id', id).single();
    }
    if (result.error && result.error.message?.includes('prioridad')) {
      result = await supabase.from('tickets').select(selectSinPrioridad).eq('id', id).single();
    }

    if (result.error || !result.data) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
    }

    const ticket = result.data as Record<string, unknown> & { proyecto_id?: string | null };

    // Resolver proyecto: si el ticket tiene proyecto_id, traer nombre y logo de proyectos_maestros
    // (así aunque se guardó "Por identificar" o sin logo, mostramos el proyecto real)
    let proyecto_nombre = (typeof ticket.proyecto_nombre === 'string' && ticket.proyecto_nombre.trim())
      ? ticket.proyecto_nombre.trim()
      : '';
    let proyecto_logo_url: string | null = (ticket.logo_url as string)?.trim() || null;
    let proyecto_id_resuelto: string | null = ticket.proyecto_id as string | null;

    // Si tenemos proyecto_id, traer nombre y logo actuales de proyectos_maestros
    if (proyecto_id_resuelto) {
      const { data: proy } = await supabase
        .from('proyectos_maestros')
        .select('nombre_proyecto, logo_url')
        .eq('id', proyecto_id_resuelto)
        .single();
      if (proy) {
        const nombreProyecto = (proy.nombre_proyecto as string)?.trim();
        const logoProyecto = (proy.logo_url as string)?.trim();
        if (nombreProyecto) proyecto_nombre = nombreProyecto;
        if (logoProyecto) proyecto_logo_url = logoProyecto;
      }
    } else {
      // Sin proyecto_id: intentar resolver por creado_por_email (platform_users → proyecto)
      const email = (ticket.creado_por_email as string)?.trim();
      if (email) {
        const { data: users } = await supabase
          .from('platform_users')
          .select('project_id')
          .ilike('email', email)
          .limit(1);
        const pid = (users?.[0] as { project_id?: string } | undefined)?.project_id;
        if (pid) {
          const { data: proy } = await supabase
            .from('proyectos_maestros')
            .select('id, nombre_proyecto, logo_url')
            .eq('id', pid)
            .single();
          if (proy) {
            const nombreProyecto = (proy.nombre_proyecto as string)?.trim();
            const logoProyecto = (proy.logo_url as string)?.trim();
            if (nombreProyecto) proyecto_nombre = nombreProyecto;
            if (logoProyecto) proyecto_logo_url = logoProyecto;
          }
        }
      }
    }
    if (!proyecto_nombre) proyecto_nombre = 'Por identificar';

    const historial = [{ estado: ticket.estado as string, fecha: ticket.updated_at }];

    function inicialesProyecto(nombre: string | null | undefined): string {
      const n = (nombre || '').trim();
      if (!n) return 'S';
      const palabras = n.split(/\s+/).filter(Boolean);
      if (palabras.length >= 2) {
        return palabras
          .slice(0, 3)
          .map((p) => (p[0] || '').toUpperCase())
          .join('')
          .slice(0, 3);
      }
      return n.slice(0, 2).toUpperCase() || 'S';
    }
    const numero = (ticket.numero as number) ?? 0;
    const supportId = `${inicialesProyecto(proyecto_nombre)}-${String(numero % 100).padStart(2, '0')}`;

    return NextResponse.json({
      id: ticket.id,
      numero: ticket.numero,
      supportId,
      proyecto_nombre,
      proyecto_logo_url,
      modulo: ticket.modulo ?? 'general',
      tienda: ticket.tienda ?? '',
      titulo: ticket.titulo,
      descripcion: ticket.descripcion,
      estado: ticket.estado,
      prioridad: (ticket.prioridad as string) || 'medio',
      creado_por_nombre: ticket.creado_por_nombre,
      creado_por_email: ticket.creado_por_email ?? null,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
      historial,
    });
  } catch (e) {
    console.error('[api/tickets/[id] GET]', e);
    return NextResponse.json({ error: 'Error obteniendo el ticket' }, { status: 500 });
  }
}

const ESTADOS_VALIDOS = ['creado', 'replicando', 'ajustando', 'probando', 'desplegando', 'resuelto'] as const;
const PRIORIDADES_VALIDAS = ['medio', 'alto_maromas', 'alto_espera', 'urgente'] as const;

/**
 * PATCH /api/tickets/[id]
 * Actualiza estado y/o prioridad (backstage). Body: { estado?, prioridad? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const estado = typeof body.estado === 'string' ? body.estado.trim().toLowerCase() : '';
    const prioridadRaw = typeof body.prioridad === 'string' ? body.prioridad.trim().toLowerCase() : '';
    const prioridad = PRIORIDADES_VALIDAS.includes(prioridadRaw as (typeof PRIORIDADES_VALIDAS)[number]) ? prioridadRaw : '';

    const updates: Record<string, string> = {};
    if (ESTADOS_VALIDOS.includes(estado as (typeof ESTADOS_VALIDOS)[number])) updates.estado = estado;
    if (prioridad) updates.prioridad = prioridad;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Enviá estado y/o prioridad válidos' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select('id, estado, prioridad, updated_at')
      .single();

    if (error) {
      if (error.message?.includes('prioridad')) {
        const { prioridad: _p, ...rest } = updates;
        if (Object.keys(rest).length === 0) {
          return NextResponse.json({ error: 'Columna prioridad no existe. Ejecutá la migración.' }, { status: 400 });
        }
        const res = await supabase.from('tickets').update(rest).eq('id', id).select('id, estado, updated_at').single();
        if (res.error) {
          console.error('[api/tickets/[id] PATCH]', res.error);
          return NextResponse.json({ error: res.error.message }, { status: 500 });
        }
        return NextResponse.json({ id: res.data?.id, estado: res.data?.estado, updated_at: res.data?.updated_at });
      }
      console.error('[api/tickets/[id] PATCH]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });

    const result = data as { id: string; estado?: string; prioridad?: string; updated_at: string };
    return NextResponse.json({
      id: result.id,
      ...(result.estado != null && { estado: result.estado }),
      ...(result.prioridad != null && { prioridad: result.prioridad }),
      updated_at: result.updated_at,
    });
  } catch (e) {
    console.error('[api/tickets/[id] PATCH]', e);
    return NextResponse.json({ error: 'Error actualizando el ticket' }, { status: 500 });
  }
}
