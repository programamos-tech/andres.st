import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CLIENT_API_KEY_HEADER = 'x-andres-api-key';
const PER_PROJECT_LIMIT = 40;
const TOTAL_FEED_LIMIT = 80;
const CLIENT_FETCH_TIMEOUT_MS = 8000;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface ActivityFeedItem {
  id: string;
  usuario_nombre: string;
  modulo_visitado: string;
  accion_realizada: string;
  timestamp: string;
  es_error: boolean;
  error_mensaje: string | null;
  proyecto_id: string;
  nombre_proyecto: string;
  logo_url: string | null;
  base_url: string | null;
  store_name: string | null;
  store_logo_url: string | null;
}

/** Activity shape returned by client apps (GET /api/andres/actividades) */
interface ClientActivity {
  id: string;
  user_id?: string | null;
  user_name?: string | null;
  action: string;
  module: string;
  details?: Record<string, unknown>;
  store_id?: string | null;
  created_at: string;
}

function activityLabel(action: string, module: string, details: Record<string, unknown>): string {
  const desc = details?.description;
  if (typeof desc === 'string' && desc.trim()) return desc;
  const actionLower = action.toLowerCase();
  const moduleLower = module.toLowerCase();
  if (actionLower === 'login' && (moduleLower === 'auth' || moduleLower === 'login')) return 'Inició sesión';
  if (actionLower === 'sale_create' || actionLower === 'sale_create_draft') return 'Registró una venta';
  if (actionLower === 'sale_cancel') return 'Anuló una venta';
  if (actionLower === 'sale_finalize') return 'Finalizó una venta (borrador)';
  if (actionLower === 'product_create') return 'Creó un producto';
  if (actionLower === 'product_edit') return 'Editó un producto';
  if (actionLower === 'product_delete') return 'Eliminó un producto';
  if (actionLower === 'client_create') return 'Creó un cliente';
  if (actionLower === 'client_edit') return 'Editó un cliente';
  if (actionLower === 'client_delete') return 'Eliminó un cliente';
  if (actionLower.includes('transfer')) return 'Realizó una transferencia de stock';
  if (actionLower.includes('category')) return moduleLower.includes('create') ? 'Creó una categoría' : moduleLower.includes('edit') ? 'Editó una categoría' : 'Eliminó una categoría';
  if (actionLower.includes('payment') || actionLower.includes('pago')) return 'Registró un pago';
  if (actionLower.includes('credit') || actionLower.includes('credito')) return 'Trabajó con un crédito';
  if (actionLower.includes('warranty') || actionLower.includes('garantia')) return 'Registró una garantía';
  return `${action} · ${module}`;
}

/** Traduce módulo al español para la UI (evitar "sales" -> "ventas") */
function moduleDisplayName(module: string): string {
  if (!module || typeof module !== 'string') return module;
  const m = module.toLowerCase();
  if (m === 'sales') return 'ventas';
  if (m === 'auth' || m === 'login') return 'auth';
  return module;
}

/**
 * GET /api/backstage/activity-feed
 * Returns activity from the SAME source as project detail: each configured
 * project's client API (GET /api/andres/actividades). Merges and sorts by date.
 */
export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: projects, error: projectsError } = await supabase
      .from('proyectos_maestros')
      .select('id, nombre_proyecto, logo_url, url_dominio, client_api_url, client_api_key, main_store_external_id')
      .not('client_api_url', 'is', null)
      .not('client_api_key', 'is', null);

    if (projectsError) throw projectsError;
    const projectList = (projects ?? []) as Array<{
      id: string;
      nombre_proyecto: string;
      logo_url: string | null;
      url_dominio: string | null;
      client_api_url: string | null;
      client_api_key: string | null;
      main_store_external_id: string | null;
    }>;
    const configured = projectList.filter((p) => p.client_api_url && p.client_api_key);
    if (configured.length === 0) {
      return NextResponse.json({ feed: [], project_logos: {} });
    }

    /** Logo del proyecto desde configuración (backstage). Si es URL absoluta se usa tal cual; si es relativa se resuelve con url_dominio. */
    const projectLogoResolved = (proj: (typeof configured)[0]): string | null => {
      const raw = proj.logo_url?.trim() || null;
      if (!raw) return null;
      if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
      const base = (proj.url_dominio || proj.client_api_url || '').toString().replace(/\/$/, '') || null;
      return base ? `${base}${raw.startsWith('/') ? '' : '/'}${raw}` : raw;
    };

    const projectLogosMap: Record<string, string | null> = {};
    for (const p of configured) {
      projectLogosMap[p.id] = projectLogoResolved(p);
    }

    const projectIds = configured.map((p) => p.id);
    const { data: storesRows } = await supabase
      .from('project_stores')
      .select('project_id, external_id, name, logo_url')
      .in('project_id', projectIds);
    const storesByProject = (storesRows ?? []).reduce(
      (acc, s: { project_id: string; external_id: string; name: string | null; logo_url: string | null }) => {
        if (!acc[s.project_id]) acc[s.project_id] = [];
        acc[s.project_id].push(s);
        return acc;
      },
      {} as Record<string, Array<{ external_id: string; name: string | null; logo_url: string | null }>>
    );

    const resolveUrl = (raw: string | null, base: string | null): string | null => {
      if (!raw || typeof raw !== 'string') return null;
      if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
      if (!base) return raw;
      return `${base}${raw.startsWith('/') ? '' : '/'}${raw}`;
    };

    const fetchProjectActivities = async (
      p: (typeof configured)[0]
    ): Promise<{ projectId: string; activities: ClientActivity[] }> => {
      const baseUrl = (p.client_api_url ?? '').replace(/\/$/, '');
      const url = `${baseUrl}/api/andres/actividades?limit=${PER_PROJECT_LIMIT}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), CLIENT_FETCH_TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          headers: { [CLIENT_API_KEY_HEADER]: p.client_api_key! },
          cache: 'no-store',
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!res.ok) return { projectId: p.id, activities: [] };
        const data = await res.json();
        const list = Array.isArray(data.activities) ? data.activities : [];
        return { projectId: p.id, activities: list };
      } catch {
        clearTimeout(timeout);
        return { projectId: p.id, activities: [] };
      }
    };

    const results = await Promise.allSettled(configured.map(fetchProjectActivities));
    const allByProject: Array<{ projectId: string; activities: ClientActivity[] }> = results
      .filter((r): r is PromiseFulfilledResult<{ projectId: string; activities: ClientActivity[] }> => r.status === 'fulfilled')
      .map((r) => r.value);

    const feedItems: ActivityFeedItem[] = [];
    for (const { projectId, activities } of allByProject) {
      const proj = configured.find((p) => p.id === projectId);
      if (!proj) continue;
      const base = (proj.client_api_url || proj.url_dominio || '').toString().replace(/\/$/, '') || null;
      const projectStores = storesByProject[projectId] ?? [];
      const projectLogoUrl = projectLogosMap[projectId] ?? null;

      for (const a of activities) {
        const storeId = a.store_id ?? null;
        const store = storeId ? projectStores.find((s) => s.external_id === storeId) : null;
        const storeName = store?.name ?? null;
        const storeLogoUrl = store?.logo_url ? resolveUrl(store.logo_url, base) : null;
        const label = activityLabel(a.action ?? '', a.module ?? '', a.details ?? {});
        const rawModule = a.module ?? '';
        feedItems.push({
          id: `${projectId}:${a.id}`,
          usuario_nombre: a.user_name ?? 'Usuario',
          modulo_visitado: moduleDisplayName(rawModule),
          accion_realizada: label,
          timestamp: a.created_at,
          es_error: false,
          error_mensaje: null,
          proyecto_id: projectId,
          nombre_proyecto: proj.nombre_proyecto ?? 'Proyecto',
          logo_url: projectLogoUrl,
          base_url: base,
          store_name: storeName,
          store_logo_url: storeLogoUrl,
        });
      }
    }

    feedItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const feed = feedItems.slice(0, TOTAL_FEED_LIMIT);
    return NextResponse.json({ feed, project_logos: projectLogosMap });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to fetch activity feed';
    console.error('[backstage/activity-feed]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
