'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { BackstageGuard } from '@/components/auth/BackstageGuard';
import { BackstageSubNav } from '@/components/dashboard/BackstageSubNav';
import type { TicketEstado } from '@/types/database';

export type TicketPrioridad = 'medio' | 'alto_maromas' | 'alto_espera' | 'urgente';

/** Item de la lista (API backstage/tickets) */
interface TicketListItem {
  id: string;
  numero: number;
  supportId?: string;
  titulo: string;
  proyecto_nombre: string;
  estado: TicketEstado;
  estadoLabel?: string;
  prioridad?: TicketPrioridad | string;
  creado_por_nombre?: string;
  created_at: string;
}

/** Detalle completo (API tickets/[id]) */
interface TicketDetail {
  id: string;
  numero?: number;
  supportId?: string;
  proyecto_nombre: string;
  proyecto_logo_url?: string | null;
  modulo: string;
  tienda: string;
  titulo: string;
  descripcion: string;
  estado: TicketEstado;
  prioridad?: TicketPrioridad | string;
  creado_por_nombre: string;
  creado_por_email?: string | null;
  created_at: string;
  updated_at: string;
  historial: { estado: TicketEstado; fecha: string }[];
}

const ESTADOS: { id: TicketEstado; label: string }[] = [
  { id: 'creado', label: 'Creado' },
  { id: 'replicando', label: 'Replicando' },
  { id: 'ajustando', label: 'Ajustando' },
  { id: 'probando', label: 'Probando' },
  { id: 'desplegando', label: 'Desplegando' },
  { id: 'resuelto', label: 'Resuelto' },
];

const ESTADO_COLORS: Record<TicketEstado, string> = {
  creado: 'bg-[var(--text-muted)]',
  replicando: 'bg-[var(--status-warn)]',
  ajustando: 'bg-[var(--accent)]',
  probando: 'bg-[var(--status-ok)]',
  desplegando: 'bg-[var(--accent)]',
  resuelto: 'bg-[var(--status-ok)]',
};

const PRIORIDAD_LABEL: Record<string, string> = {
  urgente: 'Urgente',
  alto_espera: 'Alto (puede esperar)',
  alto_maromas: 'Alto (maromas)',
  medio: 'Medio',
};

const PRIORIDAD_BADGE_CLASS: Record<string, string> = {
  urgente: 'bg-red-600 text-white border-red-700 font-semibold',
  alto_espera: 'bg-amber-500 text-white border-amber-600 font-semibold',
  alto_maromas: 'bg-orange-500 text-white border-orange-600 font-semibold',
  medio: 'bg-[var(--text-muted)]/25 text-[var(--text)] border-[var(--border)]',
};

const IconCheck = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconArrow = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

/** Extrae la URL de imagen del resumen (Imagen del error: url o Imagen (referencia): url). */
function extraerImagenDeDescripcion(descripcion: string): string | null {
  const match = descripcion.match(/Imagen\s*(?:del error|\(referencia\))\s*:\s*(https?:\/\/[^\s]+)/i);
  return match ? match[1].trim() : null;
}

/** Quita la línea de la imagen del texto para no mostrar la URL en la descripción. */
function descripcionSinLineaDeImagen(descripcion: string): string {
  return descripcion
    .replace(/\n*Imagen\s*(?:del error|\(referencia\))\s*:\s*https?:\/\/[^\s]+/gi, '')
    .replace(/\n\n\n+/g, '\n\n')
    .trim();
}

export default function BackstageTicketsPage() {
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'all' | 'activos' | 'resueltos'>('activos');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ticketDetalle, setTicketDetalle] = useState<TicketDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingEstado, setUpdatingEstado] = useState<string | null>(null);

  const fetchList = useCallback(() => {
    setLoading(true);
    fetch('/api/backstage/tickets')
      .then((res) => res.json())
      .then((data: { tickets?: TicketListItem[] }) => {
        setTickets(Array.isArray(data.tickets) ? data.tickets : []);
      })
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const fetchDetail = useCallback((id: string) => {
    setDetailLoading(true);
    setTicketDetalle(null);
    fetch(`/api/tickets/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: TicketDetail | null) => setTicketDetalle(data))
      .catch(() => setTicketDetalle(null))
      .finally(() => setDetailLoading(false));
  }, []);

  useEffect(() => {
    if (selectedId) fetchDetail(selectedId);
    else setTicketDetalle(null);
  }, [selectedId, fetchDetail]);

  const ticketsFiltrados = tickets.filter((t) => {
    if (filtro === 'all') return true;
    if (filtro === 'activos') return t.estado !== 'resuelto';
    if (filtro === 'resueltos') return t.estado === 'resuelto';
    return true;
  });

  const ticketsActivos = tickets.filter((t) => t.estado !== 'resuelto').length;
  const ticketsResueltos = tickets.length - ticketsActivos;

  const cambiarEstado = async (ticketId: string, nuevoEstado: TicketEstado) => {
    if (updatingEstado) return;
    setUpdatingEstado(nuevoEstado);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) {
        fetchList();
        if (ticketDetalle?.id === ticketId) fetchDetail(ticketId);
      }
    } finally {
      setUpdatingEstado(null);
    }
  };

  return (
    <BackstageGuard>
      <div className="min-h-screen bg-[var(--bg)]">
        <BackstageSubNav showStats={false} />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text)] mb-1">Tickets</h1>
              <p className="text-sm text-[var(--text-muted)]">
                Creados desde Andrebot · {ticketsActivos} activos{ticketsResueltos > 0 ? `, ${ticketsResueltos} resueltos` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setFiltro('all')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filtro === 'all' ? 'bg-[var(--text)] text-[var(--bg)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Todos ({tickets.length})
            </button>
            <button
              onClick={() => setFiltro('activos')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filtro === 'activos' ? 'bg-[var(--text)] text-[var(--bg)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Activos ({ticketsActivos})
            </button>
            <button
              onClick={() => setFiltro('resueltos')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filtro === 'resueltos' ? 'bg-[var(--text)] text-[var(--bg)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Resueltos ({ticketsResueltos})
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista en grid 2 columnas para menos scroll */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-20 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] animate-pulse" />
                  ))}
                </>
              ) : ticketsFiltrados.length === 0 ? (
                <div className="col-span-full text-center py-12 text-[var(--text-muted)] rounded-xl border border-dashed border-[var(--border)]">
                  <p className="mb-1">
                    {tickets.length === 0 ? 'Aún no hay tickets desde Andrebot.' : 'No hay tickets con este filtro.'}
                  </p>
                  <p className="text-xs">Los tickets se crean cuando un usuario pide ayuda en el chat de Andrebot.</p>
                </div>
              ) : (
                ticketsFiltrados.map((ticket) => {
                  const estadoIndex = ESTADOS.findIndex((e) => e.id === ticket.estado);
                  const isSelected = selectedId === ticket.id;
                  const label = ticket.estadoLabel ?? ESTADOS[estadoIndex]?.label ?? ticket.estado;

                  return (
                    <button
                      key={ticket.id}
                      type="button"
                      onClick={() => setSelectedId(ticket.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors ${
                        isSelected ? 'border-[var(--text)] bg-[var(--bg-secondary)] ring-1 ring-[var(--text)]' : 'border-[var(--border)] hover:border-[var(--text-muted)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-xs font-mono text-[var(--text-muted)]">
                              {ticket.supportId ?? `#${ticket.numero}`}
                            </span>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ESTADO_COLORS[ticket.estado]}`} title={label} />
                          </div>
                          <h3 className="text-sm font-medium text-[var(--text)] truncate leading-tight">{ticket.titulo}</h3>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)] whitespace-nowrap shrink-0">{label}</span>
                      </div>
                      {ticket.prioridad && (
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border mb-1 inline-block ${PRIORIDAD_BADGE_CLASS[ticket.prioridad] || PRIORIDAD_BADGE_CLASS.medio}`}>
                          {PRIORIDAD_LABEL[ticket.prioridad] || ticket.prioridad}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] truncate">
                        <span className="uppercase truncate">{ticket.proyecto_nombre}</span>
                        <span>·</span>
                        <span className="truncate">{ticket.creado_por_nombre ?? '—'}</span>
                        <span>·</span>
                        <span className="shrink-0">{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: es })}</span>
                      </div>
                      <div className="mt-2 h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--text)] transition-all"
                          style={{ width: `${((estadoIndex + 1) / ESTADOS.length) * 100}%` }}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="lg:sticky lg:top-8">
              {detailLoading ? (
                <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                  <div className="p-8 animate-pulse space-y-4">
                    <div className="h-5 bg-[var(--border)] rounded w-3/4" />
                    <div className="h-4 bg-[var(--border)] rounded w-1/2" />
                    <div className="h-20 bg-[var(--border)] rounded" />
                  </div>
                </div>
              ) : ticketDetalle ? (
                <div className="rounded-xl border border-[var(--border)] overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-[var(--border)]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {ticketDetalle.supportId ?? `#${ticketDetalle.numero}`}
                      </span>
                      <Link
                        href={`/backstage/ticket/${ticketDetalle.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
                      >
                        Ver detalle completo
                        <IconArrow />
                      </Link>
                    </div>
                    <h2 className="text-lg font-semibold text-[var(--text)] mb-2">{ticketDetalle.titulo}</h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                      <span className="uppercase">{ticketDetalle.proyecto_nombre}</span>
                      <span>·</span>
                      <span>{ticketDetalle.modulo}</span>
                      {ticketDetalle.tienda && (
                        <>
                          <span>·</span>
                          <span>{ticketDetalle.tienda}</span>
                        </>
                      )}
                      {(ticketDetalle.prioridad && ticketDetalle.prioridad !== 'medio') && (
                        <>
                          <span>·</span>
                          <span className="font-medium text-[var(--status-warn)]">
                            {PRIORIDAD_LABEL[ticketDetalle.prioridad] || ticketDetalle.prioridad}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-3">Estado</p>
                    <div className="flex flex-wrap gap-2">
                      {ESTADOS.map((estado, index) => {
                        const estadoActualIndex = ESTADOS.findIndex((e) => e.id === ticketDetalle.estado);
                        const isActive = ticketDetalle.estado === estado.id;
                        const isPast = index < estadoActualIndex;

                        return (
                          <button
                            key={estado.id}
                            type="button"
                            onClick={() => cambiarEstado(ticketDetalle.id, estado.id)}
                            disabled={!!updatingEstado}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-60 ${
                              isActive
                                ? 'bg-[var(--text)] text-[var(--bg)]'
                                : isPast
                                  ? 'bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]'
                                  : 'text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
                            }`}
                          >
                            {(isActive || isPast) && <IconCheck />}
                            {estado.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 border-b border-[var(--border)]">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-3">Descripción</p>
                    {(() => {
                      const imagenUrl = extraerImagenDeDescripcion(ticketDetalle.descripcion);
                      return (
                        <>
                          {imagenUrl && (
                            <div className="mb-4 rounded-lg border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)]">
                              <a href={imagenUrl} target="_blank" rel="noopener noreferrer" className="block">
                                <img
                                  src={imagenUrl}
                                  alt="Imagen del error"
                                  className="w-full h-auto max-h-56 object-contain object-left-top"
                                />
                              </a>
                              <p className="text-[10px] text-[var(--text-muted)] px-2 py-1.5">Imagen del error · clic para abrir en tamaño real</p>
                            </div>
                          )}
                          <p className="text-sm text-[var(--text)] whitespace-pre-wrap line-clamp-4">{descripcionSinLineaDeImagen(ticketDetalle.descripcion)}</p>
                        </>
                      );
                    })()}
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-3">Reportado por</p>
                    <p className="text-sm text-[var(--text)]">{ticketDetalle.creado_por_nombre}</p>
                    {ticketDetalle.creado_por_email && (
                      <a
                        href={`mailto:${ticketDetalle.creado_por_email}`}
                        className="text-xs text-[var(--accent)] hover:underline block mt-0.5"
                      >
                        {ticketDetalle.creado_por_email}
                      </a>
                    )}
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {formatDistanceToNow(new Date(ticketDetalle.created_at), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center">
                  <p className="text-[var(--text-muted)] mb-1">Selecciona un ticket para ver el detalle</p>
                  <p className="text-xs text-[var(--text-muted)]">O abrí el detalle completo para ver el chat y el historial.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BackstageGuard>
  );
}
