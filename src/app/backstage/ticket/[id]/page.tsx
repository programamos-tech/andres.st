'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BackstageGuard } from '@/components/auth/BackstageGuard';
import { BackstageSubNav } from '@/components/dashboard/BackstageSubNav';
import { TicketChat } from '@/components/ticket/TicketChat';
import type { TicketEstado } from '@/types/database';

interface TicketData {
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
  prioridad?: string;
  creado_por_nombre: string;
  creado_por_email?: string | null;
  created_at: string;
  updated_at: string;
  historial: { estado: TicketEstado; fecha: string }[];
}

function extraerImagenDeDescripcion(descripcion: string): string | null {
  const match = descripcion.match(/Imagen\s*(?:del error|\(referencia\))\s*:\s*(https?:\/\/[^\s]+)/i);
  return match ? match[1].trim() : null;
}

function descripcionSinLineaDeImagen(descripcion: string): string {
  return descripcion
    .replace(/\n*Imagen\s*(?:del error|\(referencia\))\s*:\s*https?:\/\/[^\s]+/gi, '')
    .replace(/\n\n\n+/g, '\n\n')
    .trim();
}

function descripcionABloques(descripcion: string): { label: string; value: string }[] {
  const sinImagen = descripcionSinLineaDeImagen(descripcion);
  const bloques = sinImagen.split(/\n\n+/);
  return bloques
    .map((bloque) => {
      const idx = bloque.indexOf(': ');
      if (idx === -1) return { label: '', value: bloque.trim() };
      let label = bloque.slice(0, idx).trim();
      if (/^Pasos$/i.test(label)) label = 'Descripción';
      const value = bloque.slice(idx + 2).trim();
      return { label, value };
    })
    .filter((b) => b.value.length > 0);
}

const IconCreado = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconReplicando = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const IconAjustando = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconProbando = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const IconDesplegando = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const IconResuelto = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconBack = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconClock = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const ESTADOS: { id: TicketEstado; label: string; Icon: React.FC }[] = [
  { id: 'creado', label: 'Creado', Icon: IconCreado },
  { id: 'replicando', label: 'Replicando', Icon: IconReplicando },
  { id: 'ajustando', label: 'Ajustando', Icon: IconAjustando },
  { id: 'probando', label: 'Probando', Icon: IconProbando },
  { id: 'desplegando', label: 'Desplegando', Icon: IconDesplegando },
  { id: 'resuelto', label: 'Resuelto', Icon: IconResuelto },
];

const PRIORIDAD_LABEL: Record<string, string> = {
  urgente: 'Urgente',
  alto_espera: 'Alto (puede esperar)',
  alto_maromas: 'Alto (maromas)',
  medio: 'Medio',
};

const PRIORIDAD_STYLES: Record<string, string> = {
  urgente: 'bg-red-600 text-white border-red-700 shadow-sm',
  alto_espera: 'bg-amber-500 text-white border-amber-600 shadow-sm',
  alto_maromas: 'bg-orange-500 text-white border-orange-600 shadow-sm',
  medio: 'bg-[var(--text-muted)]/20 text-[var(--text)] border-[var(--border)]',
};

export default function BackstageTicketPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingEstado, setUpdatingEstado] = useState<string | null>(null);
  const [updatingPrioridad, setUpdatingPrioridad] = useState(false);

  const fetchTicket = () => {
    fetch(`/api/tickets/${ticketId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: TicketData | null) => {
        setTicket(data);
      })
      .catch(() => setTicket(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const cambiarEstado = async (nuevoEstado: TicketEstado) => {
    if (!ticket || updatingEstado) return;
    setUpdatingEstado(nuevoEstado);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) fetchTicket();
    } finally {
      setUpdatingEstado(null);
    }
  };

  const cambiarPrioridad = async (prioridad: string) => {
    if (!ticket || updatingPrioridad) return;
    setUpdatingPrioridad(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prioridad }),
      });
      if (res.ok) fetchTicket();
    } finally {
      setUpdatingPrioridad(false);
    }
  };

  if (loading) {
    return (
      <BackstageGuard>
        <div className="min-h-screen bg-[var(--bg-secondary)]">
          <BackstageSubNav showStats={false} />
          <main className="max-w-6xl mx-auto px-6 py-8">
            <div className="animate-pulse h-64 rounded-xl bg-[var(--bg)] border border-[var(--border)]" />
          </main>
        </div>
      </BackstageGuard>
    );
  }

  if (!ticket) {
    return (
      <BackstageGuard>
        <div className="min-h-screen bg-[var(--bg-secondary)]">
          <BackstageSubNav showStats={false} />
          <main className="max-w-6xl mx-auto px-6 py-8">
            <p className="text-[var(--text-muted)]">Ticket no encontrado.</p>
            <Link href="/backstage" className="text-sm text-[var(--text)] hover:underline mt-2 inline-block">
              Volver al dashboard
            </Link>
          </main>
        </div>
      </BackstageGuard>
    );
  }

  const estadoActualIndex = ESTADOS.findIndex((e) => e.id === ticket.estado);
  const progreso = ((estadoActualIndex + 1) / ESTADOS.length) * 100;
  const imagenAdjuntaUrl = extraerImagenDeDescripcion(ticket.descripcion);

  return (
    <BackstageGuard>
      <div className="min-h-screen bg-[var(--bg-secondary)]">
        <BackstageSubNav showStats={false} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <Link
              href="/backstage"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              <IconBack />
              <span>Volver al dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-base font-mono font-semibold text-[var(--text)]">
                {ticket.supportId ?? `#${ticket.numero ?? ''}`}
              </span>
              <a
                href={`/ticket/${ticket.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Ver como usuario
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] overflow-hidden flex flex-col lg:flex-row bg-[var(--bg)]">
            <aside className="lg:w-72 xl:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-[var(--bg-secondary)]/50">
              <div className="p-4 lg:p-5">
                {ticket.proyecto_logo_url ? (
                  <div className="w-14 h-14 rounded-full border border-[var(--border)] overflow-hidden bg-[var(--bg)] shrink-0 mb-4">
                    <img src={ticket.proyecto_logo_url} alt={ticket.proyecto_nombre} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center shrink-0 text-lg font-semibold uppercase text-[var(--text-muted)] mb-4">
                    {(ticket.proyecto_nombre || 'PI').trim().slice(0, 2)}
                  </div>
                )}
                <dl className="space-y-4">
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Proyecto</dt>
                    <dd className="text-base font-semibold text-[var(--text)] uppercase tracking-wide">{ticket.proyecto_nombre || 'Por identificar'}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Módulo</dt>
                    <dd className="text-sm font-medium text-[var(--text)]">{ticket.modulo}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Urgencia</dt>
                    <dd>
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded border ${PRIORIDAD_STYLES[ticket.prioridad || 'medio'] || PRIORIDAD_STYLES.medio}`}>
                        {PRIORIDAD_LABEL[ticket.prioridad || 'medio'] || ticket.prioridad || 'Medio'}
                      </span>
                    </dd>
                  </div>
                  {ticket.tienda && (
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Tienda</dt>
                      <dd className="text-sm text-[var(--text)]">{ticket.tienda}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Solicitado por</dt>
                    <dd className="text-sm font-medium text-[var(--text)]">{ticket.creado_por_nombre}</dd>
                  </div>
                  {ticket.creado_por_email && (
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)] mb-0.5">Correo</dt>
                      <dd className="text-sm">
                        <a href={`mailto:${ticket.creado_por_email}`} className="text-[var(--text)] font-medium hover:underline break-all">{ticket.creado_por_email}</a>
                      </dd>
                    </div>
                  )}
                </dl>
                <h2 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mt-6 mb-3 pb-2 border-b border-[var(--border)]">Historial</h2>
                <div className="space-y-3">
                  {ticket.historial.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-[var(--text-muted)] shrink-0 mt-0.5"><IconClock /></span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--text)]">{ESTADOS.find((e) => e.id === item.estado)?.label}</p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{format(new Date(item.fecha), 'd MMM, HH:mm', { locale: es })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0 flex flex-col">
              <div className="p-4 sm:p-5 lg:p-6 border-b border-[var(--border)]">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold text-[var(--text)] leading-tight">
                    {ticket.titulo.replace(/\s*·\s*Por identificar\s*$/i, (match) => {
                      const proy = ticket.proyecto_nombre?.trim();
                      if (proy && !/^por\s+identificar$/i.test(proy)) return ` · ${proy}`;
                      return match;
                    })}
                  </h1>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${PRIORIDAD_STYLES[ticket.prioridad || 'medio'] || PRIORIDAD_STYLES.medio}`}
                    title="Urgencia del ticket"
                  >
                    Urgencia: {PRIORIDAD_LABEL[ticket.prioridad || 'medio'] || ticket.prioridad || 'Medio'}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-2">Cambiar urgencia:</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(['medio', 'alto_maromas', 'alto_espera', 'urgente'] as const).map((p) => {
                    const isActive = (ticket.prioridad || 'medio') === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => cambiarPrioridad(p)}
                        disabled={updatingPrioridad}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${isActive ? 'ring-2 ring-offset-1 ring-[var(--accent)]' : ''} ${PRIORIDAD_STYLES[p]} disabled:opacity-60`}
                      >
                        {PRIORIDAD_LABEL[p]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Barra de estados: clicable para backstage */}
              <div className="p-4 sm:p-5 lg:p-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]/30">
                <p className="text-xs text-[var(--text-muted)] mb-3">Hacé clic en un estado para actualizarlo. El usuario verá el cambio en su vista.</p>
                <div className="flex items-center justify-between gap-1 mb-3">
                  {ESTADOS.map((estado, index) => {
                    const completado = index <= estadoActualIndex;
                    const activo = index === estadoActualIndex;
                    const EstadoIcon = estado.Icon;
                    const isUpdating = updatingEstado === estado.id;
                    return (
                      <button
                        key={estado.id}
                        type="button"
                        onClick={() => cambiarEstado(estado.id)}
                        disabled={!!updatingEstado}
                        className="flex flex-col items-center flex-1 min-w-0 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 ${
                            completado ? 'bg-[var(--text)] border-[var(--text)] text-[var(--bg)]' : 'border-[var(--border)] text-[var(--text-muted)]'
                          } hover:ring-2 hover:ring-[var(--accent)]`}
                        >
                          {isUpdating ? <span className="text-[10px]">...</span> : <EstadoIcon />}
                        </div>
                        <span className={`text-[10px] sm:text-xs mt-1.5 text-center truncate w-full ${activo ? 'text-[var(--text)] font-medium' : 'text-[var(--text-muted)]'}`}>
                          {estado.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* Línea de progreso: puntos centrados bajo cada estado (misma columna que el texto) */}
                <div className="relative flex items-center w-full min-h-[10px]">
                  <div
                    className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 flex z-0"
                    aria-hidden
                  >
                    <div
                      className="h-full rounded-full bg-[var(--text)] transition-all duration-300"
                      style={{ width: `${(estadoActualIndex / Math.max(ESTADOS.length - 1, 1)) * 100}%` }}
                    />
                    <div className="flex-1 h-full rounded-full bg-[var(--border)]" />
                  </div>
                  {ESTADOS.map((estado, index) => {
                    const alcanzado = estadoActualIndex >= index;
                    return (
                      <div
                        key={estado.id}
                        className="flex-1 flex justify-center min-w-0 relative z-10"
                      >
                        <div
                          className={`shrink-0 w-2 h-2 rounded-full transition-colors duration-300 ${alcanzado ? 'bg-[var(--text)]' : 'bg-[var(--border)]'}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 sm:p-5 lg:p-6 flex-1 min-h-0">
                <h2 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">Resumen de la conversación (chat con Andrebot)</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                  {imagenAdjuntaUrl && (
                    <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                      <a href={imagenAdjuntaUrl} target="_blank" rel="noopener noreferrer" className="block">
                        <img src={imagenAdjuntaUrl} alt="Imagen adjunta" className="w-full h-auto max-h-64 object-contain object-left-top" />
                      </a>
                    </div>
                  )}
                  <div className="min-w-0 space-y-4">
                    {descripcionABloques(ticket.descripcion).map((bloque, index) => (
                      <div key={index}>
                        {bloque.label ? (
                          <>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-0.5">{bloque.label}</p>
                            <p className={`text-[var(--text)] whitespace-pre-wrap leading-relaxed ${index === 0 ? 'text-base font-semibold' : 'text-sm'}`}>{bloque.value}</p>
                          </>
                        ) : (
                          <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{bloque.value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <TicketChat
                    ticketId={ticket.id}
                    defaultAutorNombre="equipo de andres.st"
                    esAdmin={true}
                    puedeEnviar={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BackstageGuard>
  );
}
