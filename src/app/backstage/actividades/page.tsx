'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { BackstageSubNav } from '@/components/dashboard/BackstageSubNav';
import { BackstageGuard } from '@/components/auth/BackstageGuard';
import { useProyectos } from '@/lib/hooks/useProyectos';

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

function ActivityLogo({ logoUrl, nombreProyecto }: { logoUrl: string | null; nombreProyecto: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initial = (nombreProyecto || 'P').charAt(0).toUpperCase();
  if (!logoUrl || imgFailed) {
    return (
      <div className="w-8 h-8 rounded-full shrink-0 bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center">
        <span className="text-xs font-semibold text-[var(--text-muted)]">{initial}</span>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)]">
      <img
        src={logoUrl}
        alt=""
        className="w-full h-full object-cover object-center"
        onError={() => setImgFailed(true)}
      />
    </div>
  );
}

export default function ActividadesPage() {
  const { proyectos, loading: loadingProyectos } = useProyectos(30000);
  const [actividades, setActividades] = useState<ActivityFeedItem[]>([]);
  const [projectLogos, setProjectLogos] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'all' | 'errores'>('all');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/backstage/activity-feed')
      .then((res) => res.json())
      .then((data: { feed?: ActivityFeedItem[]; project_logos?: Record<string, string | null> } | ActivityFeedItem[]) => {
        if (cancelled) return;
        if (data && typeof data === 'object' && Array.isArray((data as { feed?: ActivityFeedItem[] }).feed)) {
          const payload = data as { feed: ActivityFeedItem[]; project_logos?: Record<string, string | null> };
          setActividades(payload.feed);
          setProjectLogos(payload.project_logos ?? {});
        } else if (Array.isArray(data)) {
          setActividades(data);
        }
      })
      .catch(() => {
        if (!cancelled) setActividades([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const actividadesFiltradas = filtro === 'errores' ? actividades.filter((a) => a.es_error) : actividades;
  const erroresCount = actividades.filter((a) => a.es_error).length;
  const activos = proyectos.filter((p) => p.status_visual === 'active').length;
  const erroresProyectos = proyectos.filter((p) => p.status_visual === 'error').length;

  return (
    <BackstageGuard>
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        <BackstageSubNav
          totalProyectos={proyectos.length}
          proyectosActivos={activos}
          proyectosConErrores={erroresProyectos}
          onRefresh={() => window.location.reload()}
          isDemo={!proyectos.length && !loadingProyectos}
          showStats={true}
        />

        <main className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-[var(--text)]">Actividades</h1>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltro('all')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filtro === 'all' ? 'bg-[var(--text)] text-[var(--bg)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                Todas ({actividades.length})
              </button>
              <button
                onClick={() => setFiltro('errores')}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filtro === 'errores'
                    ? 'bg-[var(--status-error)] text-white'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                Errores ({erroresCount})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full mt-2 bg-[var(--border)]" />
                    <div className="flex-1 h-4 bg-[var(--border)] rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : actividadesFiltradas.length === 0 ? (
            <div className="p-8 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-center text-[var(--text-muted)]">
              {filtro === 'errores'
                ? 'No hay actividades con error.'
                : 'Sin actividad reciente. Las acciones de todos tus proyectos aparecerán aquí en una sola lista.'}
            </div>
          ) : (
            <div className="space-y-2">
              {actividadesFiltradas.map((act) => {
                const logoUrl = act.logo_url || (act.proyecto_id ? projectLogos[act.proyecto_id] : null) || null;
                const card = (
                  <div
                    className={`p-4 rounded-xl bg-[var(--bg)] border transition-colors flex items-start gap-4 ${
                      act.es_error ? 'border-[var(--status-error)]/30' : 'border-[var(--border)]'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${act.es_error ? 'bg-[var(--status-error)]' : 'bg-[var(--text-muted)]'}`} />
                    <ActivityLogo logoUrl={logoUrl} nombreProyecto={act.nombre_proyecto} />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${act.es_error ? '' : 'text-[var(--text)]'}`}
                        style={act.es_error ? { color: 'var(--status-error)' } : undefined}
                      >
                        {act.accion_realizada}
                      </p>
                      <p className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                        <span className="uppercase font-medium">{act.nombre_proyecto}</span>
                        <span>·</span>
                        <span>{act.modulo_visitado}</span>
                        <span>·</span>
                        <span>{act.usuario_nombre}</span>
                      </p>
                      {act.es_error && act.error_mensaje && (
                        <p className="text-xs mt-1 truncate" style={{ color: 'var(--status-error)' }}>
                          {act.error_mensaje}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-muted)] whitespace-nowrap shrink-0">
                      {formatDistanceToNow(new Date(act.timestamp), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                );
                return act.proyecto_id ? (
                  <Link key={act.id} href={`/backstage/proyecto/${act.proyecto_id}`} className="block hover:opacity-95 transition-opacity">
                    {card}
                  </Link>
                ) : (
                  <div key={act.id}>{card}</div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </BackstageGuard>
  );
}
