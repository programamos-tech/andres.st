'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BRAND } from '@/lib/constants';
import { MOCK_TICKETS, MOCK_COMENTARIOS } from '@/lib/mock-tickets';
import type { Ticket, TicketEstado } from '@/types/database';

const estadoLabels: Record<TicketEstado, string> = {
  creado: 'Creado',
  replicando: 'Replicando',
  ajustando: 'Ajustando',
  probando: 'Probando',
  desplegando: 'Desplegando',
  resuelto: 'Resuelto',
};

const estadoColors: Record<TicketEstado, string> = {
  creado: 'bg-amber-500/10 text-amber-500',
  replicando: 'bg-blue-500/10 text-blue-500',
  ajustando: 'bg-violet-500/10 text-violet-500',
  probando: 'bg-sky-500/10 text-sky-500',
  desplegando: 'bg-emerald-500/10 text-emerald-500',
  resuelto: 'bg-emerald-500/10 text-emerald-500',
};

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  
  const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
  const comentarios = MOCK_COMENTARIOS.filter(c => c.ticket_id === ticketId);
  
  const [nuevoComentario, setNuevoComentario] = useState('');

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Ticket no encontrado</h1>
          <Link href="/ayuda" className="text-[var(--text-muted)] hover:text-[var(--text)]">
            Volver a Ayuda
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/ayuda" className="text-sm font-medium">
              Ayuda
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Back */}
        <Link 
          href="/ayuda" 
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>

        {/* Ticket header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold">{ticket.titulo}</h1>
            <span className={`text-sm px-3 py-1 rounded-full ${estadoColors[ticket.estado]}`}>
              {estadoLabels[ticket.estado]}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <span>{ticket.creado_por_nombre}</span>
            <span>·</span>
            <span>{ticket.proyecto_nombre || '—'}</span>
            <span>·</span>
            <span>{format(new Date(ticket.created_at), "d 'de' MMMM, HH:mm", { locale: es })}</span>
          </div>
        </div>

        {/* Descripción */}
        <div className="p-6 rounded-xl border border-[var(--border)] mb-8">
          <p className="whitespace-pre-wrap">{ticket.descripcion}</p>
        </div>

        {/* Comentarios */}
        <div className="mb-8">
          <h2 className="font-semibold mb-4">Conversación</h2>
          
          {comentarios.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm">
              Todavía no hay respuestas. Te escribo pronto.
            </p>
          ) : (
            <div className="space-y-4">
              {comentarios.map((comentario) => (
                <div 
                  key={comentario.id}
                  className={`p-4 rounded-xl ${
                    comentario.es_admin 
                      ? 'bg-[var(--bg-secondary)] border border-[var(--border)]' 
                      : 'border border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{comentario.autor_nombre}</span>
                    {comentario.es_admin && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--text)] text-[var(--bg)]">
                        Admin
                      </span>
                    )}
                    <span className="text-xs text-[var(--text-muted)]">
                      {formatDistanceToNow(new Date(comentario.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <p className="text-sm">{comentario.mensaje}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nuevo comentario */}
        {ticket.estado !== 'resuelto' && (
          <div>
            <h2 className="font-semibold mb-4">Agregar comentario</h2>
            <div className="space-y-4">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--text-muted)] resize-none"
                placeholder="Escribe algo..."
              />
              <button className="btn btn-primary text-sm">
                Enviar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
