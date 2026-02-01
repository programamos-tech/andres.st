/**
 * Programamos Telemetry Client (JavaScript Version)
 * 
 * Script para enviar telemetría desde proyectos cliente al Dashboard Maestro andres.st
 * 
 * Copia este archivo a tu proyecto y configura tu API key
 */

class TelemetryClient {
  constructor(config) {
    this.config = {
      apiKey: config.apiKey,
      endpoint: config.endpoint || 'https://andres.st/api/v1/telemetry',
      enabled: config.enabled !== false,
      debug: config.debug || false,
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 5000
    };
    
    this.queue = [];
    this.flushTimer = null;

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
        const error = event.reason instanceof Error 
          ? event.reason 
          : new Error(String(event.reason));
        this.trackError({
          usuario_nombre: 'Sistema',
          modulo_visitado: 'Global',
          error
        });
      });
    }
  }

  log(...args) {
    if (this.config.debug) {
      console.log('[Telemetry]', ...args);
    }
  }

  startAutoFlush() {
    if (this.flushTimer) return;
    
    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  /**
   * Registra un evento de actividad
   * @param {Object} event
   * @param {string} event.usuario_nombre - Nombre del usuario
   * @param {string} [event.usuario_email] - Email del usuario
   * @param {string} event.modulo_visitado - Módulo donde ocurrió la acción
   * @param {string} event.accion_realizada - Descripción de la acción
   * @param {Object} [event.metadata] - Datos adicionales
   */
  track(event) {
    if (!this.config.enabled) return;

    const queuedEvent = {
      ...event,
      es_error: false,
      timestamp: new Date().toISOString()
    };

    this.queue.push(queuedEvent);
    this.log('Evento encolado:', event.modulo_visitado, event.accion_realizada);

    if (this.queue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Registra un error
   * @param {Object} event
   * @param {string} event.usuario_nombre
   * @param {string} event.modulo_visitado
   * @param {Error} event.error
   */
  trackError(event) {
    if (!this.config.enabled) return;

    const queuedEvent = {
      usuario_id: event.usuario_id,
      usuario_nombre: event.usuario_nombre,
      usuario_email: event.usuario_email,
      modulo_visitado: event.modulo_visitado,
      accion_realizada: event.accion_realizada || 'Error capturado',
      metadata: event.metadata,
      es_error: true,
      error_mensaje: event.error?.message || 'Error desconocido',
      error_stack: event.error?.stack,
      timestamp: new Date().toISOString()
    };

    this.queue.push(queuedEvent);
    this.log('Error encolado:', event.error?.message);

    // Los errores se envían inmediatamente
    this.flush();
  }

  /**
   * Alias para trackError
   */
  error(event) {
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

/**
 * Crea un hook simple para React
 * @param {TelemetryClient} client
 */
function createUseTelemetry(client) {
  return function useTelemetry(userConfig) {
    const track = (modulo, accion, metadata) => {
      client.track({
        ...userConfig,
        modulo_visitado: modulo,
        accion_realizada: accion,
        metadata
      });
    };

    const error = (modulo, accion, err, metadata) => {
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

// Export para diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TelemetryClient, createUseTelemetry };
}

if (typeof window !== 'undefined') {
  window.TelemetryClient = TelemetryClient;
  window.createUseTelemetry = createUseTelemetry;
}

// ==========================================
// EJEMPLO DE USO
// ==========================================

/*
// Inicializar
const telemetry = new TelemetryClient({
  apiKey: 'tu_api_key_unica',
  endpoint: 'https://andres.st/api/v1/telemetry',
  enabled: true,
  debug: true
});

// Tracking básico
telemetry.track({
  usuario_nombre: 'Juan Pérez',
  usuario_email: 'juan@ejemplo.com',
  modulo_visitado: 'Dashboard',
  accion_realizada: 'Inició sesión'
});

// Reportar error
try {
  throw new Error('Algo salió mal');
} catch (e) {
  telemetry.trackError({
    usuario_nombre: 'Juan Pérez',
    modulo_visitado: 'Checkout',
    error: e
  });
}

// Con React
const useTelemetry = createUseTelemetry(telemetry);

function MiComponente() {
  const { track, error } = useTelemetry({
    usuario_nombre: 'Usuario actual'
  });

  useEffect(() => {
    track('Dashboard', 'Componente montado');
  }, []);

  return <div>Hola</div>;
}
*/
