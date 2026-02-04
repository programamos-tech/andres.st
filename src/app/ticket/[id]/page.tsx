'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BRAND } from '@/lib/constants';
import { HomeNav } from '@/components/HomeNav';
import type { TicketEstado } from '@/types/database';

interface TicketData {
  id: string;
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
  historial: { estado: TicketEstado; fecha: string; nota?: string }[];
}

// Iconos por estado para que el usuario vea en qué etapa está
const IconCreado = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconReplicando = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const IconAjustando = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconProbando = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);
const IconDesplegando = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);
const IconResuelto = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ESTADOS: { id: TicketEstado; label: string; Icon: React.FC }[] = [
  { id: 'creado', label: 'Creado', Icon: IconCreado },
  { id: 'replicando', label: 'Replicando', Icon: IconReplicando },
  { id: 'ajustando', label: 'Ajustando', Icon: IconAjustando },
  { id: 'probando', label: 'Probando', Icon: IconProbando },
  { id: 'desplegando', label: 'Desplegando', Icon: IconDesplegando },
  { id: 'resuelto', label: 'Resuelto', Icon: IconResuelto }
];

const RAZONES_CANCELAR = [
  { id: 'resuelto_solo', label: 'Ya lo resolví yo mismo' },
  { id: 'error_mio', label: 'Era un error mío' },
  { id: 'no_necesito', label: 'Ya no lo necesito' },
  { id: 'otro', label: 'Otro motivo' }
];

// Iconos
const IconBack = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconX = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconCopy = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export default function TicketPage() {
  const params = useParams();
  const ticketId = params.id as string;
  
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mostrarCancelar, setMostrarCancelar] = useState(false);
  const [cancelado, setCancelado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  useEffect(() => {
    let cancelled = false;

    // Ticket en la DB: buscar por UUID
    if (isUuid(ticketId)) {
      fetch(`/api/tickets/${ticketId}`)
        .then((res) => {
          if (cancelled) return null;
          if (!res.ok) return null;
          return res.json();
        })
        .then((data: TicketData | null) => {
          if (cancelled) return;
          if (data) setTicket(data);
          setLoading(false);
        })
        .catch(() => {
          if (!cancelled) setLoading(false);
        });
      return () => { cancelled = true; };
    }

    // Tickets antiguos (tk_xxx) en localStorage
    const storageKey = 'ticket-data-' + ticketId;
    if (typeof window !== 'undefined' && ticketId.startsWith('tk_')) {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const data = JSON.parse(stored) as TicketData;
          setTicket(data);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }
    }

    setLoading(false);
  }, [ticketId]);

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Fallback
    }
  };

  const cancelarTicket = (razonId: string) => {
    setCancelado(true);
    setMostrarCancelar(false);
    // En producción: actualizar en Supabase
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-[var(--text-muted)]">Cargando...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] px-6">
        <h1 className="text-xl font-semibold text-[var(--text)] mb-2">Ticket no encontrado</h1>
        <p className="text-[var(--text-muted)] mb-6 text-center">
          Este ticket no existe o el link es incorrecto.
        </p>
        <Link href="/ayuda" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
          Ir a Ayuda
        </Link>
      </div>
    );
  }

  const estadoActualIndex = ESTADOS.findIndex(e => e.id === ticket.estado);
  const progreso = ((estadoActualIndex + 1) / ESTADOS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <HomeNav />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        {/* Back */}
        <Link 
          href="/ayuda" 
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors"
        >
          <IconBack />
          <span>Volver al chat</span>
        </Link>

        {/* Copiar link para ver estado + ID */}
        <div className="mb-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
          <p className="text-xs text-[var(--text-muted)] mb-2">
            Copiá el link para ver en qué estado está cuando quieras.
          </p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs font-mono text-[var(--text-muted)] truncate">{ticket.id}</span>
            <button
              onClick={copiarLink}
              className="flex items-center gap-2 text-sm text-[var(--text)] hover:opacity-80 transition-opacity shrink-0"
            >
              <IconCopy />
              <span>{copiado ? '¡Copiado!' : 'Copiar link'}</span>
            </button>
          </div>
        </div>

        {/* Estado cancelado */}
        {cancelado && (
          <div className="mb-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
            <p className="text-sm text-[var(--text)]">
              Este ticket ha sido cancelado. Si necesitas ayuda nuevamente, crea un nuevo ticket.
            </p>
          </div>
        )}

        {/* Card principal */}
        {!cancelado && (
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)]">
              <h1 className="text-lg font-semibold text-[var(--text)] mb-2">{ticket.titulo}</h1>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Solicitado por: <span className="text-[var(--text)] font-medium">{ticket.creado_por_nombre}</span>
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                <span className="uppercase">{ticket.proyecto_nombre}</span>
                <span>·</span>
                <span>{ticket.modulo}</span>
                {ticket.tienda && (
                  <>
                    <span>·</span>
                    <span>{ticket.tienda}</span>
                  </>
                )}
              </div>
            </div>

            {/* Progreso */}
            <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="flex items-center justify-between mb-4">
                {ESTADOS.map((estado, index) => {
                  const completado = index <= estadoActualIndex;
                  const activo = index === estadoActualIndex;
                  const EstadoIcon = estado.Icon;
                  return (
                    <div key={estado.id} className="flex flex-col items-center flex-1">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                        completado 
                          ? 'bg-[var(--text)] border-[var(--text)] text-[var(--bg)]' 
                          : 'border-[var(--border)] text-[var(--text-muted)]'
                      }`}>
                        <EstadoIcon />
                      </div>
                      <span className={`text-[10px] mt-2 text-center ${
                        activo ? 'text-[var(--text)] font-medium' : 'text-[var(--text-muted)]'
                      }`}>
                        {estado.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--text)] transition-all duration-700"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>

            {/* Resumen de la conversación (chat con Andrebot) */}
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
                Resumen de la conversación (chat con Andrebot)
              </h2>
              <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{ticket.descripcion}</p>
            </div>

            {/* Historial */}
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
                Historial
              </h2>
              <div className="space-y-3">
                {ticket.historial.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center flex-shrink-0">
                      <IconClock />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text)]">
                        {ESTADOS.find(e => e.id === item.estado)?.label}
                      </p>
                      {item.nota && (
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.nota}</p>
                      )}
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {format(new Date(item.fecha), "d 'de' MMMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="p-6">
              {!mostrarCancelar ? (
                <button
                  onClick={() => setMostrarCancelar(true)}
                  className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <IconX />
                  <span>Cancelar solicitud</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-[var(--text)]">¿Por qué quieres cancelar?</p>
                  <div className="flex flex-wrap gap-2">
                    {RAZONES_CANCELAR.map((razon) => (
                      <button
                        key={razon.id}
                        onClick={() => cancelarTicket(razon.id)}
                        className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text)]"
                      >
                        {razon.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setMostrarCancelar(false)}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    No, mantener ticket
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            ¿Necesitas ayuda urgente? WhatsApp +57 300 206 1711
          </p>
        </div>
      </main>
    </div>
  );
}
