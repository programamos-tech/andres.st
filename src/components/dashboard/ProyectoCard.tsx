'use client';

import Link from 'next/link';
import type { ProyectoConEstadisticas } from '@/lib/hooks/useProyectos';

export interface ApiHealthStatus {
  status: 'active' | 'inactive';
  latency_ms?: number | null;
}

interface ProyectoCardProps {
  proyecto: ProyectoConEstadisticas;
  apiHealth?: ApiHealthStatus | null;
}

const IconArrow = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconApiOk = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconApiDown = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconActivity = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export function ProyectoCard({ proyecto, apiHealth }: ProyectoCardProps) {
  const statusColor = {
    active: 'bg-[var(--status-ok)]',
    inactive: 'bg-[var(--text-muted)]',
    error: 'bg-[var(--status-error)]'
  };

  const logoFromApi = proyecto.logo_url?.trim() || null;
  const isZonat = proyecto.nombre_cliente === 'ZonaT' || proyecto.nombre_proyecto?.toLowerCase().includes('zonat');
  const logoUrl = logoFromApi || (isZonat ? '/zonat.png' : null);

  return (
    <Link
      href={`/backstage/proyecto/${proyecto.id}`}
      className="block p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text-muted)] transition-colors h-full"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center font-semibold overflow-hidden shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="w-full h-full object-cover object-center" />
            ) : (
              proyecto.nombre_proyecto.charAt(0)
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{proyecto.nombre_proyecto}</h3>
              <span className={`w-2 h-2 rounded-full shrink-0 ${statusColor[proyecto.status_visual]}`} title={proyecto.status_visual} />
            </div>
            <p className="text-sm text-[var(--text-muted)] truncate">{proyecto.nombre_cliente}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {proyecto.errores_ultima_hora > 0 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: 'var(--status-error)' }}>
              {proyecto.errores_ultima_hora}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${apiHealth?.status === 'active' ? 'text-[var(--status-ok)]' : apiHealth ? 'text-[var(--status-error)]' : 'text-[var(--text-muted)]'}`}>
            {apiHealth?.status === 'active' && <IconApiOk />}
            {apiHealth?.status === 'inactive' && <IconApiDown />}
            {apiHealth?.status === 'active' ? (apiHealth.latency_ms != null ? `${apiHealth.latency_ms}ms` : 'OK') : apiHealth?.status === 'inactive' ? 'Caída' : '—'}
          </span>
          <span className="text-[var(--text-muted)]"><IconArrow /></span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <IconUsers />
          <span className="text-xs">
            <span className="font-semibold text-[var(--text)]">{proyecto.usuarios_activos}</span> usuarios activos (1h)
          </span>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <IconActivity />
          <span className="text-xs">
            <span className="font-semibold text-[var(--text)]">{proyecto.actividad_ultima_hora}</span> actividad (1h)
          </span>
        </div>
      </div>

      {proyecto.top_modulos && proyecto.top_modulos.length > 0 && (
        <div className="mt-2 pt-2 border-t border-[var(--border)]">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Módulos más usados</p>
          <div className="flex flex-wrap gap-1">
            {proyecto.top_modulos.slice(0, 3).map((m) => (
              <span key={m.modulo} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                {m.modulo} · {m.total_usos}
              </span>
            ))}
          </div>
        </div>
      )}
    </Link>
  );
}
