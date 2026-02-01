'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BRAND } from '@/lib/constants';
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

const ESTADOS: { id: TicketEstado; label: string }[] = [
  { id: 'creado', label: 'Creado' },
  { id: 'replicando', label: 'Replicando' },
  { id: 'ajustando', label: 'Ajustando' },
  { id: 'probando', label: 'Probando' },
  { id: 'desplegando', label: 'Desplegando' },
  { id: 'resuelto', label: 'Resuelto' }
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

const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

  useEffect(() => {
    // Simular carga de ticket (en producción vendría de Supabase)
    setTimeout(() => {
      if (ticketId.startsWith('tk_')) {
        setTicket({
          id: ticketId,
          proyecto_nombre: 'ZonaT',
          modulo: 'ventas',
          tienda: 'Zona T Centro',
          titulo: 'El sistema se cierra al exportar PDF',
          descripcion: 'Cuando intento exportar un reporte en PDF, el sistema se queda cargando y luego se cierra sin mostrar ningún error.',
          estado: 'replicando',
          prioridad: 'alta',
          creado_por_nombre: 'María García',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          historial: [
            { estado: 'creado', fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
            { estado: 'replicando', fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString(), nota: 'Revisando el problema' }
          ]
        });
      }
      setLoading(false);
    }, 500);
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
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold text-[var(--text)]">{BRAND.username}</Link>
          <span className="text-sm text-[var(--text-muted)]">Ticket</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Back */}
        <Link 
          href="/ayuda" 
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors"
        >
          <IconBack />
          <span>Volver al chat</span>
        </Link>

        {/* Ticket ID y acciones */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-mono text-[var(--text-muted)]">{ticket.id}</span>
          <button
            onClick={copiarLink}
            className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <IconCopy />
            <span>{copiado ? 'Copiado' : 'Copiar link'}</span>
          </button>
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
              <h1 className="text-lg font-semibold text-[var(--text)] mb-3">{ticket.titulo}</h1>
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
                  
                  return (
                    <div key={estado.id} className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 transition-colors ${
                        completado 
                          ? 'bg-[var(--text)] border-[var(--text)] text-[var(--bg)]' 
                          : 'border-[var(--border)] text-[var(--text-muted)]'
                      }`}>
                        {completado ? <IconCheck /> : index + 1}
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

            {/* Descripción */}
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
                Descripción
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
