'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { BRAND } from '@/lib/constants';
import { MOCK_TICKETS } from '@/lib/mock-tickets';
import type { Ticket, TicketEstado } from '@/types/database';

const ESTADO_LABELS: Record<TicketEstado, { label: string; icon: string; color: string }> = {
  creado: { label: 'Creado', icon: '📝', color: 'bg-slate-500' },
  replicando: { label: 'Replicando', icon: '🔍', color: 'bg-amber-500' },
  ajustando: { label: 'Ajustando', icon: '🔧', color: 'bg-blue-500' },
  probando: { label: 'Probando', icon: '🧪', color: 'bg-purple-500' },
  desplegando: { label: 'Desplegando', icon: '🚀', color: 'bg-cyan-500' },
  resuelto: { label: 'Resuelto', icon: '✅', color: 'bg-emerald-500' }
};

export default function TicketsPage() {
  const [tickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [filtro, setFiltro] = useState<'all' | 'activos' | 'resueltos'>('all');

  const ticketsFiltrados = tickets.filter(t => {
    if (filtro === 'all') return true;
    if (filtro === 'activos') return t.estado !== 'resuelto';
    if (filtro === 'resueltos') return t.estado === 'resuelto';
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="px-6 py-6 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold">{BRAND.username}</Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Home
            </Link>
            <Link href="/ayuda" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Chat
            </Link>
            <span className="text-sm font-medium">Mis Tickets</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Mis Tickets</h1>
          <p className="text-[var(--text-muted)]">
            Sigue el estado de tus solicitudes
          </p>
        </div>

        {/* Leyenda de estados */}
        <div className="mb-8 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
          <p className="text-sm font-medium mb-3">Flujo de trabajo:</p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(ESTADO_LABELS).map(([estado, info], index) => (
              <div key={estado} className="flex items-center gap-2">
                {index > 0 && <span className="text-[var(--text-muted)]">→</span>}
                <span className={`text-xs px-2 py-1 rounded-full text-white ${info.color}`}>
                  {info.icon} {info.label}
                </span>
              </div>
            ))}
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
            Activos ({tickets.filter(t => t.estado !== 'resuelto').length})
          </button>
          <button
            onClick={() => setFiltro('resueltos')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filtro === 'resueltos' 
                ? 'bg-[var(--text)] text-[var(--bg)]' 
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            Resueltos ({tickets.filter(t => t.estado === 'resuelto').length})
          </button>
        </div>

        {/* Lista de tickets */}
        <div className="space-y-3">
          {ticketsFiltrados.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <p>No hay tickets</p>
            </div>
          ) : (
            ticketsFiltrados.map((ticket) => {
              const estadoInfo = ESTADO_LABELS[ticket.estado];
              const estados = Object.keys(ESTADO_LABELS);
              const progreso = ((estados.indexOf(ticket.estado) + 1) / estados.length) * 100;
              
              return (
                <div
                  key={ticket.id}
                  className="p-4 rounded-xl border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-[var(--text-muted)]">
                          #{ticket.numero.toString().padStart(3, '0')}
                        </span>
                        <h3 className="font-medium truncate">{ticket.titulo}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span className="uppercase">{ticket.proyecto_nombre}</span>
                        <span>·</span>
                        <span>{ticket.modulo}</span>
                        <span>·</span>
                        <span>{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true, locale: es })}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full text-white whitespace-nowrap ${estadoInfo.color}`}>
                      {estadoInfo.icon} {estadoInfo.label}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${estadoInfo.color}`}
                      style={{ width: `${progreso}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
