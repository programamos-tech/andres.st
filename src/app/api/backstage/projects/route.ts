import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
import type { ActividadCentralizada } from '@/types/database';

const CLIENT_API_KEY_HEADER = 'x-andres-api-key';
const CLIENT_ACTIVITIES_LIMIT = 150;
const CLIENT_FETCH_TIMEOUT_MS = 8000;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Actividad que devuelve la API de cada app (GET /api/andres/actividades) - misma fuente que el feed. */
interface ClientActivity {
  id: string;
  user_name?: string | null;
  created_at: string;
  module?: string;
}

/** Obtiene usuarios_activos y actividad_ultima_hora desde la API del proyecto (misma fuente que el feed de Actividad). */
async function getStatsFromClientApi(
  clientApiUrl: string,
  clientApiKey: string
): Promise<{ usuarios_activos: number; actividad_ultima_hora: number; top_modulos: { modulo: string; total_usos: number }[] } | null> {
  const baseUrl = clientApiUrl.replace(/\/$/, '');
  const url = `${baseUrl}/api/andres/actividades?limit=${CLIENT_ACTIVITIES_LIMIT}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CLIENT_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { [CLIENT_API_KEY_HEADER]: clientApiKey },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const list = Array.isArray(data.activities) ? data.activities : [];
    const hace1Hora = new Date(Date.now() - 60 * 60 * 1000);
    const inLastHour = list.filter((a: ClientActivity) => new Date(a.created_at || 0) >= hace1Hora);
    const usuariosUnicos = new Set(inLastHour.map((a: ClientActivity) => a.user_name ?? 'Usuario').filter(Boolean)).size;
    const modulosCount: Record<string, number> = {};
    inLastHour.forEach((a: ClientActivity) => {
      const m = (a.module ?? 'general').toString();
      modulosCount[m] = (modulosCount[m] || 0) + 1;
    });
    const top_modulos = Object.entries(modulosCount)
      .map(([modulo, total_usos]) => ({ modulo, total_usos }))
      .sort((a, b) => b.total_usos - a.total_usos)
      .slice(0, 3);
    return {
      usuarios_activos: usuariosUnicos,
      actividad_ultima_hora: inLastHour.length,
      top_modulos,
    };
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

/** GET /api/backstage/projects - Lista proyectos con estadísticas. Usa la API de cada app (misma fuente que el feed) para usuarios activos y actividad (1h). */
export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: proyectosData, error: proyectosError } = await supabase
      .from('proyectos_maestros')
      .select('*')
      .order('last_activity_at', { ascending: false, nullsFirst: false });

    if (proyectosError) throw proyectosError;

    if (!proyectosData || proyectosData.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    const ahora = new Date();
    const hace1Hora = new Date(ahora.getTime() - 60 * 60 * 1000);
    const hace5Min = new Date(ahora.getTime() - 5 * 60 * 1000);

    const projectsWithStats = await Promise.all(
      proyectosData.map(async (proyecto: Record<string, unknown>) => {
        const id = proyecto.id as string;
        const clientApiUrl = proyecto.client_api_url as string | null | undefined;
        const clientApiKey = proyecto.client_api_key as string | null | undefined;

        let actividad_ultima_hora: number;
        let usuarios_activos: number;
        let top_modulos: { modulo: string; total_usos: number }[];

        const clientStats =
          clientApiUrl && clientApiKey
            ? await getStatsFromClientApi(clientApiUrl, clientApiKey)
            : null;

        if (clientStats) {
          actividad_ultima_hora = clientStats.actividad_ultima_hora;
          usuarios_activos = clientStats.usuarios_activos;
          top_modulos = clientStats.top_modulos;
        } else {
          const { data: actividad } = await supabase
            .from('actividad_centralizada')
            .select('*')
            .eq('proyecto_id', id)
            .gte('timestamp', hace1Hora.toISOString())
            .order('timestamp', { ascending: false });

          const actividades = (actividad || []) as ActividadCentralizada[];
          actividad_ultima_hora = actividades.length;
          usuarios_activos = new Set(actividades.map((a) => a.usuario_nombre)).size;

          const modulosCount: Record<string, number> = {};
          actividades.forEach((a) => {
            if (!a.es_error) {
              modulosCount[a.modulo_visitado] = (modulosCount[a.modulo_visitado] || 0) + 1;
            }
          });
          top_modulos = Object.entries(modulosCount)
            .map(([modulo, total_usos]) => ({ modulo, total_usos }))
            .sort((a, b) => b.total_usos - a.total_usos)
            .slice(0, 3);
        }

        const { data: ultimoError } = await supabase
          .from('actividad_centralizada')
          .select('*')
          .eq('proyecto_id', id)
          .eq('es_error', true)
          .order('timestamp', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { data: actividadForErrors } = await supabase
          .from('actividad_centralizada')
          .select('timestamp, es_error')
          .eq('proyecto_id', id)
          .gte('timestamp', hace1Hora.toISOString());
        const actividadesForErrors = (actividadForErrors || []) as { timestamp: string; es_error: boolean }[];
        const errores_ultima_hora = actividadesForErrors.filter((a) => a.es_error).length;

        let status_visual: 'active' | 'inactive' | 'error' = 'inactive';
        const lastActivityAt = proyecto.last_activity_at as string | null | undefined;
        if (lastActivityAt) {
          const lastActivity = new Date(lastActivityAt);
          if (lastActivity >= hace5Min) {
            status_visual = 'active';
          }
        }
        if (errores_ultima_hora > 0 && actividadesForErrors.length > 0) {
          const ultimoErrorTime = new Date(
            actividadesForErrors.find((a) => a.es_error)?.timestamp ?? 0
          );
          if (ultimoErrorTime >= hace5Min) status_visual = 'error';
        }

        return {
          ...proyecto,
          actividad_ultima_hora,
          errores_ultima_hora,
          usuarios_activos,
          ultimo_error: ultimoError ?? null,
          top_modulos,
          status_visual,
        };
      })
    );

    return NextResponse.json({ projects: projectsWithStats });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch projects';
    console.error('[backstage/projects GET]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
