'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  creado: 'bg-[var(--text-muted)]',
  replicando: 'bg-[var(--status-warn)]',
  ajustando: 'bg-[var(--accent)]',
  probando: 'bg-[var(--status-ok)]',
  desplegando: 'bg-[var(--accent)]',
  resuelto: 'bg-[var(--status-ok)]'
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
  const router = useRouter();
  const { proyectos, loading, refetch, isDemo } = useProyectos(15000);
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createForm, setCreateForm] = useState({
    nombre_cliente: '',
    nombre_proyecto: '',
    url_dominio: '',
    descripcion: '',
  });

  const activos = proyectos.filter(p => p.status_visual === 'active').length;
  const errores = proyectos.filter(p => p.status_visual === 'error').length;

  const [healthByProjectId, setHealthByProjectId] = useState<Record<string, { status: 'active' | 'inactive'; latency_ms?: number | null }>>({});

  const projectIds = proyectos.map((p) => p.id).sort().join(',');
  useEffect(() => {
    if (proyectos.length === 0) return;
    const controller = new AbortController();
    Promise.all(
      proyectos.map(async (p) => {
        try {
          const res = await fetch(`/api/backstage/projects/${p.id}/health`, { signal: controller.signal });
          const data = await res.json().catch(() => ({}));
          return { id: p.id, status: data.status ?? 'inactive', latency_ms: data.latency_ms ?? null };
        } catch {
          return { id: p.id, status: 'inactive' as const, latency_ms: null };
        }
      })
    ).then((results) => {
      const map: Record<string, { status: 'active' | 'inactive'; latency_ms?: number | null }> = {};
      results.forEach((r) => { map[r.id] = { status: r.status, latency_ms: r.latency_ms }; });
      setHealthByProjectId(map);
    });
    return () => controller.abort();
  }, [projectIds]);

  const ticketsActivos = MOCK_TICKETS.filter(t => t.estado !== 'resuelto');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);
    try {
      const res = await fetch('/api/backstage/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_cliente: createForm.nombre_cliente.trim(),
          nombre_proyecto: createForm.nombre_proyecto.trim(),
          url_dominio: createForm.url_dominio.trim(),
          descripcion: createForm.descripcion.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCreateError(data.error ?? 'Error al crear el proyecto');
        setCreateLoading(false);
        return;
      }
      setCreateOpen(false);
      setCreateForm({ nombre_cliente: '', nombre_proyecto: '', url_dominio: '', descripcion: '' });
      await refetch();
      if (data.id) router.push(`/backstage/proyecto/${data.id}`);
    } catch {
      setCreateError('Error al crear el proyecto');
    } finally {
      setCreateLoading(false);
    }
  };

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
                  <ProyectoCard key={p.id} proyecto={p} apiHealth={healthByProjectId[p.id]} />
                ))}
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-[var(--text-muted)]/60 hover:border-[var(--text-muted)] hover:bg-[var(--bg)]/50 transition-colors text-[var(--text-muted)] hover:text-[var(--text)] min-h-[120px]"
                >
                  <IconPlus />
                  <span className="text-sm">Crear proyecto</span>
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Actividad</h2>
              <ActivityFeed />
            </div>
          </div>
        )}

        {/* Modal Crear proyecto */}
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !createLoading && setCreateOpen(false)}>
            <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--bg)] shadow-lg p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Crear proyecto</h3>
              <form onSubmit={handleCreateProject} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-0.5">A quien facturar</label>
                  <input
                    type="text"
                    value={createForm.nombre_cliente}
                    onChange={e => setCreateForm(f => ({ ...f, nombre_cliente: e.target.value }))}
                    placeholder="Razón social"
                    className="modal-input w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-0.5">Nombre del proyecto</label>
                  <input
                    type="text"
                    value={createForm.nombre_proyecto}
                    onChange={e => setCreateForm(f => ({ ...f, nombre_proyecto: e.target.value }))}
                    placeholder="Sistema o app"
                    className="modal-input w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-0.5">URL del dominio</label>
                  <input
                    type="url"
                    value={createForm.url_dominio}
                    onChange={e => setCreateForm(f => ({ ...f, url_dominio: e.target.value }))}
                    placeholder="https://..."
                    className="modal-input w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-0.5">Descripción</label>
                  <textarea
                    value={createForm.descripcion}
                    onChange={e => setCreateForm(f => ({ ...f, descripcion: e.target.value }))}
                    placeholder="Breve"
                    rows={2}
                    className="modal-input w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                  />
                </div>
                {createError && (
                  <p className="text-sm" style={{ color: 'var(--status-error)' }}>{createError}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !createLoading && setCreateOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {createLoading ? 'Creando...' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
    </BackstageGuard>
  );
}
