'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ActividadCentralizada } from '@/types/database';
import { MOCK_ACTIVIDADES } from '@/lib/mock-data';

interface ActividadConProyecto extends ActividadCentralizada {
  proyectos_maestros?: { nombre_proyecto: string; color_marca: string | null };
}

function isSupabaseConfigured() {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function ActivityFeed() {
  const [actividades, setActividades] = useState<ActividadConProyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      if (!isSupabaseConfigured()) {
        setActividades(MOCK_ACTIVIDADES as ActividadConProyecto[]);
        setLoading(false);
        return;
      }
      const supabase = getSupabaseClient();
      if (!supabase) {
        setActividades(MOCK_ACTIVIDADES as ActividadConProyecto[]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('actividad_centralizada')
        .select('*, proyectos_maestros(nombre_proyecto, color_marca)')
        .order('timestamp', { ascending: false })
        .limit(15);
      setActividades((data as ActividadConProyecto[]) || MOCK_ACTIVIDADES);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--border)] p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-[var(--bg-secondary)] rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <span className="font-medium text-sm">Actividad</span>
        <span className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-ok)' }}></span>
          live
        </span>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {actividades.map((a) => (
          <div key={a.id} className={`px-4 py-3 border-b border-[var(--border)] last:border-0 ${a.es_error ? 'bg-[var(--status-error)]/10' : ''}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{a.usuario_nombre}</span>
              {a.es_error && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--status-error)', color: 'white', opacity: 0.9 }}>error</span>}
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              {a.accion_realizada} en {a.modulo_visitado}
            </p>
            {a.es_error && a.error_mensaje && (
              <p className="text-xs mt-1 truncate" style={{ color: 'var(--status-error)' }}>{a.error_mensaje}</p>
            )}
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {a.proyectos_maestros?.nombre_proyecto} · {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true, locale: es })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
