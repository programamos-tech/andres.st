'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';
import { PRODUCTOS } from '@/lib/tienda-productos';
import type { Producto } from '@/lib/tienda-productos';

const TICKET_STORAGE_PREFIX = 'ticket-data-';

function generarTicketId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'tk_';
  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function guardarTicketEnStorage(ticket: {
  id: string;
  proyecto_nombre: string;
  modulo: string;
  tienda: string;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  creado_por_nombre: string;
  created_at: string;
  updated_at: string;
  historial: { estado: string; fecha: string; nota?: string }[];
}) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TICKET_STORAGE_PREFIX + ticket.id, JSON.stringify(ticket));
  } catch {
    // ignore
  }
}

export interface AndrebotChatProps {
  /** IDs de productos en el carrito (solicitudes) */
  solicitudes: string[];
  onClose?: () => void;
  /** Nombre del usuario si ya lo tenemos (ej. desde sesión) */
  nombreInicial?: string;
}

type Message = { role: 'user' | 'bot'; text: string };
type Step = 'proyecto' | 'nombre' | 'creado';

export function AndrebotChat({ solicitudes, onClose, nombreInicial }: AndrebotChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<Step>('proyecto');
  const [proyecto, setProyecto] = useState('');
  const [nombre, setNombre] = useState(nombreInicial || '');
  const [inputValue, setInputValue] = useState('');
  const [ticketLink, setTicketLink] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const productosSolicitados = solicitudes
    .map((id) => PRODUCTOS.find((p) => p.id === id))
    .filter((p): p is Producto => !!p);

  useEffect(() => {
    if (productosSolicitados.length === 0) return;
    const lista = productosSolicitados
      .map(
        (p) =>
          `• ${p.titulo} (${p.tipo === 'funcionalidad' ? 'Funcionalidad' : p.tipo === 'integracion' ? 'Integración' : 'Sistema completo'})`
      )
      .join('\n');
    const textoInicial =
      `Hola, veo que querés solicitar estos módulos del catálogo:\n\n${lista}\n\n¿De qué proyecto venís?`;
    setMessages([{ role: 'bot', text: textoInicial }]);
  }, []); // solo al montar; solicitudes ya están

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const enviar = () => {
    const texto = inputValue.trim();
    if (!texto) return;

    setInputValue('');

    if (step === 'proyecto') {
      setProyecto(texto);
      setMessages((m) => [...m, { role: 'user', text: texto }, { role: 'bot', text: '¿Cuál es tu nombre?' }]);
      setStep('nombre');
      return;
    }

    if (step === 'nombre') {
      setNombre(texto);
      setMessages((m) => [...m, { role: 'user', text: texto }]);

      const ticketId = generarTicketId();
      const titulo =
        productosSolicitados.length === 1
          ? `Solicitud: ${productosSolicitados[0].titulo}`
          : `Solicitud catálogo: ${productosSolicitados.length} módulos`;
      const descripcion = productosSolicitados
        .map(
          (p) =>
            `- ${p.titulo} (${p.tipo === 'funcionalidad' ? 'Funcionalidad' : p.tipo === 'integracion' ? 'Integración' : 'Sistema completo'})`
        )
        .join('\n');
      const now = new Date().toISOString();
      const ticket = {
        id: ticketId,
        proyecto_nombre: proyecto,
        modulo: 'Catálogo',
        tienda: '',
        titulo,
        descripcion,
        estado: 'creado',
        prioridad: 'media',
        creado_por_nombre: texto,
        created_at: now,
        updated_at: now,
        historial: [{ estado: 'creado', fecha: now }]
      };
      guardarTicketEnStorage(ticket);

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${baseUrl}/ticket/${ticketId}`;
      setTicketLink(link);
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: `Listo, creé tu ticket. Podés seguir el estado acá:\n\n${link}`
        }
      ]);
      setStep('creado');
    }
  };

  if (productosSolicitados.length === 0) {
    return (
      <div className="flex flex-col h-full p-4">
        <p className="text-sm text-[var(--text-muted)]">No hay solicitudes para enviar. Agregá módulos al carrito.</p>
        {onClose && (
          <button type="button" onClick={onClose} className="mt-4 text-sm text-[var(--brand-cafe)] hover:underline">
            Volver al catálogo
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--border)] bg-[var(--brand-crema)]/30 shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
          <Image src={BRAND.avatar} alt={BRAND.name} width={40} height={40} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[var(--text)] truncate">Andrebot</p>
          <p className="text-xs text-[var(--text-muted)] truncate">Te recibo y creo tu ticket</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg-secondary)] transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Mensajes */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) =>
          msg.role === 'bot' ? (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border)] shrink-0">
                <Image src={BRAND.avatar} alt="" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)]">
                <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{msg.text}</p>
                {step === 'creado' && i === messages.length - 1 && ticketLink && (
                  <Link
                    href={ticketLink}
                    className="inline-flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-[var(--text)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Ver estado del ticket
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 bg-[var(--brand-cafe)]/20 border border-[var(--brand-cafe)]/40">
                <p className="text-sm text-[var(--text)]">{msg.text}</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Input */}
      {step !== 'creado' && (
        <div className="p-4 border-t border-[var(--border)] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={step === 'proyecto' ? 'Ej: Mi Tienda, ZonaT...' : 'Tu nombre'}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--text-muted)]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-4 py-2.5 rounded-xl bg-[var(--brand-cafe)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
