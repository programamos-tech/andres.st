'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface TicketComentario {
  id: string;
  ticket_id: string;
  mensaje: string;
  autor_nombre: string;
  es_admin: boolean;
  created_at: string;
}

interface TicketChatProps {
  ticketId: string;
  /** Nombre por defecto al escribir (backstage: "Equipo", usuario: ticket.creado_por_nombre) */
  defaultAutorNombre: string;
  /** true = comentarios desde backstage */
  esAdmin: boolean;
  /** Si false, no se muestra el formulario (solo lectura) */
  puedeEnviar?: boolean;
  className?: string;
}

export function TicketChat({
  ticketId,
  defaultAutorNombre,
  esAdmin,
  puedeEnviar = true,
  className = '',
}: TicketChatProps) {
  const [comentarios, setComentarios] = useState<TicketComentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComentarios = useCallback((silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    fetch(`/api/tickets/${ticketId}/comments`)
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Error cargando comentarios')))
      .then((data: { comentarios: TicketComentario[] }) => {
        setComentarios(data.comentarios ?? []);
      })
      .catch((e) => {
        if (!silent) {
          setError(e.message ?? 'No se pudieron cargar los comentarios');
          setComentarios([]);
        }
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, [ticketId]);

  useEffect(() => {
    fetchComentarios();
  }, [fetchComentarios]);

  // Actualización automática cada 5 s cuando la pestaña está visible
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      intervalId = setInterval(() => fetchComentarios(true), 5000);
    };
    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') startPolling();
      else stopPolling();
    };

    if (document.visibilityState === 'visible') startPolling();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      stopPolling();
    };
  }, [fetchComentarios]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const texto = mensaje.trim();
    if (!texto || enviando) return;
    setEnviando(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: texto,
          autor_nombre: defaultAutorNombre,
          es_admin: esAdmin,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? 'Error al enviar');
      }
      setMensaje('');
      fetchComentarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={className}>
      <h2 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">
        Chat del ticket
      </h2>

      {error && (
        <p className="text-sm text-[var(--status-error)] mb-3" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="text-sm text-[var(--text-muted)] py-4">Cargando comentarios...</div>
      ) : (
        <div className="space-y-4 mb-4 max-h-[320px] overflow-y-auto pr-1">
          {comentarios.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] py-2">
              Aún no hay comentarios. Escribí un mensaje para iniciar la conversación.
            </p>
          ) : (
            comentarios.map((c) => (
              <div
                key={c.id}
                className={`rounded-lg px-3 py-2.5 border ${
                  c.es_admin
                    ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5 ml-0 mr-4'
                    : 'border-[var(--border)] bg-[var(--bg-secondary)]/50 mr-0 ml-4'
                }`}
              >
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {c.es_admin ? 'equipo de andres.st' : c.autor_nombre}
                  </span>
                  {c.es_admin && (
                    <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)]">
                      Equipo
                    </span>
                  )}
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {format(new Date(c.created_at), 'd MMM, HH:mm', { locale: es })}
                  </span>
                </div>
                <p className="text-sm text-[var(--text)] whitespace-pre-wrap leading-relaxed">
                  {c.mensaje}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {puedeEnviar && (
        <form onSubmit={enviar} className="flex flex-col gap-2">
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribí tu mensaje..."
            rows={3}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y min-h-[72px]"
            disabled={enviando}
          />
          <button
            type="submit"
            disabled={!mensaje.trim() || enviando}
            className="self-end px-4 py-2 text-sm font-medium rounded-lg bg-[var(--text)] text-[var(--bg)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      )}
    </div>
  );
}
