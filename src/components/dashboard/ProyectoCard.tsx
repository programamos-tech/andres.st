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

export function ProyectoCard({ proyecto, apiHealth }: ProyectoCardProps) {
  const statusColor = {
    active: 'bg-[var(--status-ok)]',
    inactive: 'bg-[var(--text-muted)]',
    error: 'bg-[var(--status-error)]'
  };

  // Logo: primero el de la API (tras Sync); si no hay, fallback para ZonaT para que siempre se vea el logo en la card
  const logoFromApi = proyecto.logo_url?.trim() || null;
  const isZonat = proyecto.nombre_cliente === 'ZonaT' || proyecto.nombre_proyecto?.toLowerCase().includes('zonat');
  const logoUrl = logoFromApi || (isZonat ? '/zonat.png' : null);

  return (
    <Link 
      href={`/backstage/proyecto/${proyecto.id}`}
      className="block p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text-muted)] transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center font-semibold overflow-hidden shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`Logo ${proyecto.nombre_proyecto}`}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              proyecto.nombre_proyecto.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{proyecto.nombre_proyecto}</h3>
              <span className={`w-2 h-2 rounded-full ${statusColor[proyecto.status_visual]}`}></span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">{proyecto.nombre_cliente}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {proyecto.errores_ultima_hora > 0 && (
            <span className="text-xs font-medium" style={{ color: 'var(--status-error)' }}>
              {proyecto.errores_ultima_hora} error{proyecto.errores_ultima_hora > 1 ? 'es' : ''}
            </span>
          )}
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${apiHealth?.status === 'active' ? 'text-[var(--status-ok)]' : apiHealth ? 'text-[var(--status-error)]' : 'text-[var(--text-muted)]'}`}>
            {apiHealth?.status === 'active' && <IconApiOk />}
            {apiHealth?.status === 'inactive' && <IconApiDown />}
            {apiHealth?.status === 'active'
              ? `API arriba${apiHealth.latency_ms != null ? ` · ${apiHealth.latency_ms}ms` : ''}`
              : apiHealth?.status === 'inactive'
                ? 'API caída'
                : '—'}
          </span>
          <span className="text-[var(--text-muted)]">
            <IconArrow />
          </span>
        </div>
      </div>
    </Link>
  );
}
