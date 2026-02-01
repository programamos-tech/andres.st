'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { BRAND } from '@/lib/constants';
import { BackstageGuard } from '@/components/auth/BackstageGuard';
import type { TicketEstado } from '@/types/database';

interface TicketAdmin {
  id: string;
  numero: number;
  proyecto_nombre: string;
  modulo: string;
  tienda: string;
  titulo: string;
  descripcion: string;
  estado: TicketEstado;
  prioridad: string;
  creado_por_nombre: string;
  created_at: string;
  updated_at: string;
}

// Mock data para demo
const MOCK_TICKETS: TicketAdmin[] = [
  {
    id: 'tk_hdzqt2hmkrwk',
    numero: 101,
    proyecto_nombre: 'ZonaT',
    modulo: 'ventas',
    tienda: 'Zona T Centro',
    titulo: 'El sistema se cierra al exportar PDF',
    descripcion: 'Cuando intento exportar un reporte en PDF, el sistema se queda cargando y luego se cierra sin mostrar ningún error.',
    estado: 'replicando',
    prioridad: 'alta',
    creado_por_nombre: 'María García',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'tk_abc123xyz789',
    numero: 102,
    proyecto_nombre: 'Aleya',
    modulo: 'inventario',
    tienda: 'Principal',
    titulo: 'No puedo ajustar el stock',
    descripcion: 'Intento ajustar el stock de un producto pero el botón no hace nada.',
    estado: 'creado',
    prioridad: 'media',
    creado_por_nombre: 'Carlos Mendez',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'tk_def456uvw012',
    numero: 103,
    proyecto_nombre: 'ZonaT',
    modulo: 'clientes',
    tienda: 'Zona T Norte',
    titulo: 'Cliente duplicado',
    descripcion: 'Registré un cliente dos veces por error y ahora aparece duplicado.',
    estado: 'resuelto',
    prioridad: 'baja',
    creado_por_nombre: 'Ana López',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const ESTADOS: { id: TicketEstado; label: string }[] = [
  { id: 'creado', label: 'Creado' },
  { id: 'replicando', label: 'Replicando' },
  { id: 'ajustando', label: 'Ajustando' },
  { id: 'probando', label: 'Probando' },
  { id: 'desplegando', label: 'Desplegando' },
  { id: 'resuelto', label: 'Resuelto' }
];

const PRIORIDAD_COLORS: Record<string, string> = {
  super_alta: 'text-red-500',
  alta: 'text-amber-500',
  media: 'text-blue-500',
  baja: 'text-[var(--text-muted)]'
};

// Iconos
const IconBack = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function BackstageTicketsPage() {
  const [tickets, setTickets] = useState<TicketAdmin[]>(MOCK_TICKETS);
  const [filtro, setFiltro] = useState<'all' | 'activos' | 'resueltos'>('all');
  const [ticketSeleccionado, setTicketSeleccionado] = useState<TicketAdmin | null>(null);

  const ticketsFiltrados = tickets.filter(t => {
    if (filtro === 'all') return true;
    if (filtro === 'activos') return t.estado !== 'resuelto';
    if (filtro === 'resueltos') return t.estado === 'resuelto';
    return true;
  });

  const cambiarEstado = (ticketId: string, nuevoEstado: TicketEstado) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, estado: nuevoEstado, updated_at: new Date().toISOString() } : t
    ));
    if (ticketSeleccionado?.id === ticketId) {
      setTicketSeleccionado(prev => prev ? { ...prev, estado: nuevoEstado } : null);
    }
  };

  const ticketsActivos = tickets.filter(t => t.estado !== 'resuelto').length;

  return (
    <BackstageGuard>
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/backstage" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              <IconBack />
            </Link>
            <span className="font-semibold text-[var(--text)]">{BRAND.username}</span>
          </div>
          <span className="text-sm text-[var(--text-muted)]">Backstage / Tickets</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)] mb-1">Tickets</h1>
            <p className="text-sm text-[var(--text-muted)]">
              {ticketsActivos} {ticketsActivos === 1 ? 'ticket activo' : 'tickets activos'}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setFiltro('all')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filtro === 'all' 
                ? 'bg-[var(--text)] text-[var(--bg)]' 
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Todos ({tickets.length})
          </button>
          <button
            onClick={() => setFiltro('activos')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filtro === 'activos' 
                ? 'bg-[var(--text)] text-[var(--bg)]' 
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Activos ({ticketsActivos})
          </button>
          <button
            onClick={() => setFiltro('resueltos')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filtro === 'resueltos' 
                ? 'bg-[var(--text)] text-[var(--bg)]' 
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Resueltos ({tickets.length - ticketsActivos})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de tickets */}
          <div className="space-y-3">
            {ticketsFiltrados.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p>No hay tickets</p>
              </div>
            ) : (
              ticketsFiltrados.map((ticket) => {
                const estadoIndex = ESTADOS.findIndex(e => e.id === ticket.estado);
                const isSelected = ticketSeleccionado?.id === ticket.id;
                
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setTicketSeleccionado(ticket)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      isSelected 
                        ? 'border-[var(--text)] bg-[var(--bg-secondary)]' 
                        : 'border-[var(--border)] hover:border-[var(--text-muted)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-[var(--text-muted)]">#{ticket.numero}</span>
                          <span className={`text-xs ${PRIORIDAD_COLORS[ticket.prioridad] || ''}`}>
                            {ticket.prioridad === 'super_alta' && '●●●'}
                            {ticket.prioridad === 'alta' && '●●'}
                            {ticket.prioridad === 'media' && '●'}
                          </span>
                        </div>
                        <h3 className="font-medium text-[var(--text)] truncate">{ticket.titulo}</h3>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                        {ESTADOS[estadoIndex]?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <span className="uppercase">{ticket.proyecto_nombre}</span>
                      <span>·</span>
                      <span>{ticket.creado_por_nombre}</span>
                      <span>·</span>
                      <span>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: es })}</span>
                    </div>
                    
                    {/* Mini progress */}
                    <div className="mt-3 h-1 bg-[var(--border)] rounded-full overflow-hidden">
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

          {/* Detalle del ticket */}
          <div className="lg:sticky lg:top-8">
            {ticketSeleccionado ? (
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-2">
                    <span className="font-mono">{ticketSeleccionado.id}</span>
                    <span>·</span>
                    <span>#{ticketSeleccionado.numero}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--text)] mb-2">{ticketSeleccionado.titulo}</h2>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                    <span className="uppercase">{ticketSeleccionado.proyecto_nombre}</span>
                    <span>·</span>
                    <span>{ticketSeleccionado.modulo}</span>
                    {ticketSeleccionado.tienda && (
                      <>
                        <span>·</span>
                        <span>{ticketSeleccionado.tienda}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Estados - Cambiar estado */}
                <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-3">Estado</p>
                  <div className="flex flex-wrap gap-2">
                    {ESTADOS.map((estado, index) => {
                      const estadoActualIndex = ESTADOS.findIndex(e => e.id === ticketSeleccionado.estado);
                      const isActive = ticketSeleccionado.estado === estado.id;
                      const isPast = index < estadoActualIndex;
                      
                      return (
                        <button
                          key={estado.id}
                          onClick={() => cambiarEstado(ticketSeleccionado.id, estado.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
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

                {/* Descripción */}
                <div className="p-6 border-b border-[var(--border)]">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-3">Descripción</p>
                  <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{ticketSeleccionado.descripcion}</p>
                </div>

                {/* Info del cliente */}
                <div className="p-6">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-3">Reportado por</p>
                  <p className="text-sm text-[var(--text)]">{ticketSeleccionado.creado_por_nombre}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {formatDistanceToNow(new Date(ticketSeleccionado.created_at), { addSuffix: true, locale: es })}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center">
                <p className="text-[var(--text-muted)]">Selecciona un ticket para ver el detalle</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </BackstageGuard>
  );
}
