'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MOCK_ACTIVIDADES } from '@/lib/mock-data';

function ActivityAvatar({ logoUrl, initialLetter }: { logoUrl: string | null; initialLetter: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const useLetter = !logoUrl || imgFailed;
  return (
    <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center">
      {useLetter ? (
        <span className="text-xs font-semibold text-[var(--text-muted)]">{initialLetter}</span>
      ) : (
        <img
          src={logoUrl}
          alt=""
          className="w-full h-full object-cover object-center"
          onError={() => setImgFailed(true)}
        />
      )}
    </div>
  );
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

interface ActividadConProyecto {
  id: string;
  proyecto_id?: string;
  usuario_nombre: string;
  modulo_visitado: string;
  accion_realizada: string;
  timestamp: string;
  es_error: boolean;
  error_mensaje?: string | null;
  proyectos_maestros?: { nombre_proyecto: string };
}

/** Mapa proyecto_id -> logo_url para usar cuando la API del cliente no trae logo (fallback desde configuración backstage) */
export interface ActivityFeedProps {
  projectLogos?: Record<string, string | null>;
  /** Si true, el feed usa toda la altura del contenedor (para 2 columnas sin scroll de página) */
  fillHeight?: boolean;
}

export function ActivityFeed({ projectLogos, fillHeight }: ActivityFeedProps = {}) {
  const [actividades, setActividades] = useState<ActivityFeedItem[]>([]);
  const [projectLogosFromApi, setProjectLogosFromApi] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await fetch('/api/backstage/activity-feed');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object' && Array.isArray(data.feed)) {
            setActividades(data.feed.length > 0 ? data.feed : mockToFeedItems(MOCK_ACTIVIDADES as ActividadConProyecto[]));
            setProjectLogosFromApi(typeof data.project_logos === 'object' && data.project_logos ? data.project_logos : {});
          } else {
            const list = Array.isArray(data) ? data : [];
            setActividades(list.length > 0 ? list : mockToFeedItems(MOCK_ACTIVIDADES as ActividadConProyecto[]));
          }
        } else {
          setActividades(mockToFeedItems(MOCK_ACTIVIDADES as ActividadConProyecto[]));
        }
      } catch {
        setActividades(mockToFeedItems(MOCK_ACTIVIDADES as ActividadConProyecto[]));
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className={`p-4 flex flex-col ${fillHeight ? 'h-full' : 'rounded-xl border border-[var(--border)]'}`}>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-[var(--bg-secondary)] rounded-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--border)] ml-3 shrink-0" />
              <div className="flex-1 h-4 bg-[var(--border)] rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden flex flex-col ${fillHeight ? 'h-full' : 'rounded-xl border border-[var(--border)]'}`}>
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between shrink-0">
        <span className="font-medium text-sm">Actividad</span>
        <span className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-ok)' }}></span>
          live
        </span>
      </div>
      <div className={fillHeight ? 'flex-1 min-h-0 overflow-y-auto' : 'max-h-[400px] overflow-y-auto'}>
        {actividades.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
            Sin actividad reciente. Las acciones de tus proyectos aparecerán aquí.
          </div>
        ) : (
          <div>
            {actividades.every((a) => !a.proyecto_id) && (
              <p className="px-4 py-2 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)]/80 border-b border-[var(--border)]">
                Ejemplos de cómo se verá el feed cuando tus proyectos envíen actividad.
              </p>
            )}
            {actividades.map((a) => {
              // Prioridad: logo del proyecto (el que subiste en configuración) → logo de la tienda
              const projectLogo = a.logo_url || (a.proyecto_id && (projectLogosFromApi[a.proyecto_id] ?? projectLogos?.[a.proyecto_id])) || null;
              const logoUrl = projectLogo || a.store_logo_url || null;
              const contextLine = a.nombre_proyecto;
              const initialLetter = (a.store_name || a.nombre_proyecto).charAt(0).toUpperCase();
              const rowClass = `flex items-start gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 ${a.proyecto_id ? 'hover:bg-[var(--bg-secondary)]/50 transition-colors' : ''} ${a.es_error ? 'bg-[var(--status-error)]/10' : ''}`;
              const content = (
                <>
                  <ActivityAvatar logoUrl={logoUrl} initialLetter={initialLetter} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text)] line-clamp-2" title={a.accion_realizada + (a.modulo_visitado ? ` en ${a.modulo_visitado}` : '')}>
                      {a.accion_realizada}{a.modulo_visitado ? ` en ${a.modulo_visitado}` : ''}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {a.usuario_nombre}
                      {a.es_error && (
                        <>
                          {' · '}
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--status-error)', color: 'white', opacity: 0.9 }}>
                            error
                          </span>
                        </>
                      )}
                    </p>
                    {a.es_error && a.error_mensaje && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--status-error)' }}>
                        {a.error_mensaje}
                      </p>
                    )}
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {contextLine} · {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </>
              );
              return a.proyecto_id ? (
                <Link key={a.id} href={`/backstage/proyecto/${a.proyecto_id}`} className={rowClass}>
                  {content}
                </Link>
              ) : (
                <div key={a.id} className={rowClass}>
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function mockToFeedItems(mock: ActividadConProyecto[]): ActivityFeedItem[] {
  return mock.slice(0, 15).map((a) => ({
    id: a.id,
    usuario_nombre: a.usuario_nombre,
    modulo_visitado: a.modulo_visitado,
    accion_realizada: a.accion_realizada,
    timestamp: a.timestamp,
    es_error: a.es_error,
    error_mensaje: a.error_mensaje ?? null,
    proyecto_id: '', // demo: no link so "Ejemplos" banner shows
    nombre_proyecto: a.proyectos_maestros?.nombre_proyecto ?? 'Proyecto',
    logo_url: null,
    base_url: null,
    store_name: null,
    store_logo_url: null,
  }));
}
