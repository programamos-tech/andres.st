# Programamos Telemetry Client

Script reutilizable para enviar telemetría desde los proyectos de clientes al Dashboard Maestro de andres.st.

## Instalación

Copia el archivo `telemetry.ts` (o `telemetry.js` si no usas TypeScript) a tu proyecto cliente.

## Configuración

```typescript
import { TelemetryClient } from './telemetry';

// Inicializar con tu API key única
const telemetry = new TelemetryClient({
  apiKey: 'tu_api_key_unica',
  endpoint: 'https://andres.st/api/v1/telemetry',
  // Opcional: desactivar en desarrollo
  enabled: process.env.NODE_ENV === 'production'
});
```

## Uso

### Enviar evento de actividad

```typescript
// Cuando un usuario navega a un módulo
telemetry.track({
  usuario_nombre: 'Juan Pérez',
  usuario_email: 'juan@ejemplo.com',
  modulo_visitado: 'Inventario',
  accion_realizada: 'Ver listado de productos'
});
```

### Reportar errores automáticamente

```typescript
try {
  // Tu código que puede fallar
  await riskyOperation();
} catch (error) {
  telemetry.error({
    usuario_nombre: 'Juan Pérez',
    modulo_visitado: 'Checkout',
    accion_realizada: 'Procesar pago',
    error: error as Error
  });
}
```

### Hook de React

```tsx
import { useTelemetry } from './telemetry';

function MiComponente() {
  const { track, error } = useTelemetry({
    usuario_nombre: user.name,
    usuario_email: user.email
  });

  useEffect(() => {
    track('Dashboard', 'Vista cargada');
  }, []);

  const handleClick = async () => {
    try {
      await hacerAlgo();
      track('Dashboard', 'Acción completada');
    } catch (e) {
      error('Dashboard', 'Error en acción', e as Error);
    }
  };

  return <button onClick={handleClick}>Hacer algo</button>;
}
```

### Trigger de Supabase (para proyectos con Supabase)

Si tu proyecto cliente usa Supabase, puedes configurar un trigger que envíe automáticamente cada log a andres.st:

```sql
-- Ver archivo supabase-trigger.sql
```
