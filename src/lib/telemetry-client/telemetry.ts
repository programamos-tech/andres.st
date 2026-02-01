/**
 * Programamos Telemetry Client
 * 
 * Script para enviar telemetría desde proyectos cliente al Dashboard Maestro andres.st
 * 
 * Copia este archivo a tu proyecto y configura tu API key
 */

interface TelemetryConfig {
  apiKey: string;
  endpoint?: string;
  enabled?: boolean;
  debug?: boolean;
  batchSize?: number;
  flushInterval?: number;
}

interface TrackEvent {
  usuario_id?: string;
  usuario_nombre: string;
  usuario_email?: string;
  modulo_visitado: string;
  accion_realizada: string;
  metadata?: Record<string, unknown>;
  duracion_ms?: number;
}

interface ErrorEvent extends Omit<TrackEvent, 'accion_realizada'> {
  accion_realizada?: string;
  error: Error;
}

interface QueuedEvent extends TrackEvent {
  es_error: boolean;
  error_mensaje?: string;
  error_stack?: string;
  timestamp: string;
}

class TelemetryClient {
  private config: Required<TelemetryConfig>;
  private queue: QueuedEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor(config: TelemetryConfig) {
    this.config = {
      apiKey: config.apiKey,
      endpoint: config.endpoint || 'https://andres.st/api/v1/telemetry',
      enabled: config.enabled ?? true,
      debug: config.debug ?? false,
      batchSize: config.batchSize ?? 10,
      flushInterval: config.flushInterval ?? 5000
    };

    // Iniciar flush automático
    if (this.config.enabled && typeof window !== 'undefined') {
      this.startAutoFlush();
      
      // Flush al cerrar la página
      window.addEventListener('beforeunload', () => this.flush());
      
      // Capturar errores globales
      window.addEventListener('error', (event) => {
        this.trackError({
          usuario_nombre: 'Sistema',
          modulo_visitado: 'Global',
          error: event.error || new Error(event.message)
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.trackError({
          usuario_nombre: 'Sistema',
          modulo_visitado: 'Global',
          error: event.reason instanceof Error ? event.reason : new Error(String(event.reason))
        });
      });
    }
  }

  private log(...args: unknown[]) {
    if (this.config.debug) {
      console.log('[Telemetry]', ...args);
    }
  }

  private startAutoFlush() {
    if (this.flushTimer) return;
    
    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  /**
   * Registra un evento de actividad
   */
  track(event: TrackEvent) {
    if (!this.config.enabled) return;

    const queuedEvent: QueuedEvent = {
      ...event,
      es_error: false,
      timestamp: new Date().toISOString()
    };

    this.queue.push(queuedEvent);
    this.log('Evento encolado:', event.modulo_visitado, event.accion_realizada);

    // Flush si alcanzamos el batch size
    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Registra un error
   */
  trackError(event: ErrorEvent) {
    if (!this.config.enabled) return;

    const queuedEvent: QueuedEvent = {
      usuario_id: event.usuario_id,
      usuario_nombre: event.usuario_nombre,
      usuario_email: event.usuario_email,
      modulo_visitado: event.modulo_visitado,
      accion_realizada: event.accion_realizada || 'Error capturado',
      metadata: event.metadata,
      duracion_ms: event.duracion_ms,
      es_error: true,
      error_mensaje: event.error.message,
      error_stack: event.error.stack,
      timestamp: new Date().toISOString()
    };

    this.queue.push(queuedEvent);
    this.log('Error encolado:', event.error.message);

    // Los errores se envían inmediatamente
    this.flush();
  }

  /**
   * Alias para trackError con sintaxis más simple
   */
  error(event: ErrorEvent) {
    this.trackError(event);
  }

  /**
   * Envía todos los eventos encolados
   */
  async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    this.log(`Enviando ${events.length} eventos...`);

    // Enviar cada evento (podríamos optimizar con batch endpoint en el futuro)
    const promises = events.map(event => 
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: this.config.apiKey,
          ...event
        })
      }).catch(err => {
        this.log('Error enviando evento:', err);
        // Re-encolar el evento si falló
        this.queue.push(event);
      })
    );

    await Promise.allSettled(promises);
  }

  /**
   * Detiene el flush automático
   */
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush();
  }
}

// ==========================================
// HOOK DE REACT
// ==========================================

interface UseTelemetryConfig {
  usuario_id?: string;
  usuario_nombre: string;
  usuario_email?: string;
}

/**
 * Hook de React para tracking de telemetría
 * 
 * @example
 * const { track, error } = useTelemetry({
 *   usuario_nombre: user.name,
 *   usuario_email: user.email
 * });
 * 
 * // En un efecto o handler
 * track('Dashboard', 'Vista cargada');
 * 
 * // Para errores
 * try {
 *   await hacerAlgo();
 * } catch (e) {
 *   error('Checkout', 'Error procesando pago', e);
 * }
 */
function createUseTelemetry(client: TelemetryClient) {
  return function useTelemetry(userConfig: UseTelemetryConfig) {
    const track = (
      modulo: string, 
      accion: string, 
      metadata?: Record<string, unknown>
    ) => {
      client.track({
        ...userConfig,
        modulo_visitado: modulo,
        accion_realizada: accion,
        metadata
      });
    };

    const error = (
      modulo: string, 
      accion: string, 
      err: Error,
      metadata?: Record<string, unknown>
    ) => {
      client.trackError({
        ...userConfig,
        modulo_visitado: modulo,
        accion_realizada: accion,
        error: err,
        metadata
      });
    };

    return { track, error };
  };
}

// ==========================================
// EXPORTS
// ==========================================

export { TelemetryClient, createUseTelemetry };
export type { TelemetryConfig, TrackEvent, ErrorEvent, UseTelemetryConfig };

// ==========================================
// EJEMPLO DE CONFIGURACIÓN
// ==========================================

/*
// En tu archivo de configuración principal (ej: lib/telemetry.ts)

import { TelemetryClient, createUseTelemetry } from './telemetry-client';

export const telemetry = new TelemetryClient({
  apiKey: process.env.NEXT_PUBLIC_PROGRAMAMOS_API_KEY || 'tu_api_key',
  endpoint: 'https://andres.st/api/v1/telemetry',
  enabled: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development'
});

export const useTelemetry = createUseTelemetry(telemetry);

// En tus componentes
import { useTelemetry } from '@/lib/telemetry';

function MiComponente() {
  const user = useUser(); // Tu hook de usuario
  const { track, error } = useTelemetry({
    usuario_nombre: user?.name || 'Anónimo',
    usuario_email: user?.email
  });

  useEffect(() => {
    track('Dashboard', 'Página cargada');
  }, []);

  return <div>Mi componente</div>;
}
*/
