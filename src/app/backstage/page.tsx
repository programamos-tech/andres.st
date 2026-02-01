'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useProyectos } from '@/lib/hooks/useProyectos';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProyectoCard } from '@/components/dashboard/ProyectoCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { BackstageGuard } from '@/components/auth/BackstageGuard';
import type { TicketEstado } from '@/types/database';

interface TicketPreview {
  id: string;
  numero: number;
  titulo: string;
  proyecto_nombre: string;
  estado: TicketEstado;
  prioridad: string;
  created_at: string;
}

// Mock tickets (en producción vendría de Supabase)
const MOCK_TICKETS: TicketPreview[] = [
  {
    id: 'tk_hdzqt2hmkrwk',
    numero: 101,
    titulo: 'El sistema se cierra al exportar PDF',
    proyecto_nombre: 'ZonaT',
    estado: 'replicando',
    prioridad: 'alta',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tk_abc123xyz789',
    numero: 102,
    titulo: 'No puedo ajustar el stock',
    proyecto_nombre: 'Aleya',
    estado: 'creado',
    prioridad: 'media',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

const ESTADO_COLORS: Record<TicketEstado, string> = {
  creado: 'bg-slate-500',
  replicando: 'bg-amber-500',
  ajustando: 'bg-blue-500',
  probando: 'bg-purple-500',
  desplegando: 'bg-cyan-500',
  resuelto: 'bg-emerald-500'
};

// Iconos
const IconArrow = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default function BackstageDashboard() {
  const { proyectos, loading, refetch, isDemo } = useProyectos(15000);

  const activos = proyectos.filter(p => p.status_visual === 'active').length;
  const errores = proyectos.filter(p => p.status_visual === 'error').length;

  // Filtrar solo tickets activos (no resueltos)
  const ticketsActivos = MOCK_TICKETS.filter(t => t.estado !== 'resuelto');

  return (
    <BackstageGuard>
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <DashboardHeader 
        totalProyectos={proyectos.length}
        proyectosActivos={activos}
        proyectosConErrores={errores}
        onRefresh={refetch}
        isDemo={isDemo}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tickets activos */}
        {ticketsActivos.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[var(--text-muted)]">
                Tickets activos ({ticketsActivos.length})
              </h2>
              <Link 
                href="/backstage/tickets" 
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                Ver todos
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {ticketsActivos.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/backstage/tickets?selected=${ticket.id}`}
                  className="flex-shrink-0 w-72 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-mono text-[var(--text-muted)]">#{ticket.numero}</span>
                    <span className={`w-2 h-2 rounded-full ${ESTADO_COLORS[ticket.estado]}`}></span>
                  </div>
                  <p className="text-sm font-medium text-[var(--text)] truncate mb-1">{ticket.titulo}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)] uppercase">{ticket.proyecto_nombre}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                </Link>
              ))}
              
              {/* Card para ver todos */}
              <Link
                href="/backstage/tickets"
                className="flex-shrink-0 w-32 p-4 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--text-muted)] transition-colors flex flex-col items-center justify-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <IconPlus />
                <span className="text-xs">Ver más</span>
              </Link>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-[var(--bg)] border border-[var(--border)] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Proyectos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proyectos.map((p) => (
                  <ProyectoCard key={p.id} proyecto={p} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Actividad</h2>
              <ActivityFeed />
            </div>
          </div>
        )}
      </main>
    </div>
    </BackstageGuard>
  );
}
