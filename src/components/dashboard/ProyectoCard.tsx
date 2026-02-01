'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ProyectoConEstadisticas } from '@/lib/hooks/useProyectos';

interface ProyectoCardProps {
  proyecto: ProyectoConEstadisticas;
}

const IconArrow = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export function ProyectoCard({ proyecto }: ProyectoCardProps) {
  const lastActivityText = proyecto.last_activity_at
    ? formatDistanceToNow(new Date(proyecto.last_activity_at), { addSuffix: true, locale: es })
    : 'Sin actividad';

  const statusColor = {
    active: 'bg-emerald-500',
    inactive: 'bg-[var(--text-muted)]',
    error: 'bg-red-500'
  };

  return (
    <Link 
      href={`/backstage/proyecto/${proyecto.id}`}
      className="block p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text-muted)] transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center font-semibold">
            {proyecto.nombre_proyecto.charAt(0)}
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
            <span className="text-xs text-red-500 font-medium">
              {proyecto.errores_ultima_hora} error{proyecto.errores_ultima_hora > 1 ? 'es' : ''}
            </span>
          )}
          <span className="text-xs text-[var(--text-muted)]">{lastActivityText}</span>
          <span className="text-[var(--text-muted)]">
            <IconArrow />
          </span>
        </div>
      </div>
    </Link>
  );
}
