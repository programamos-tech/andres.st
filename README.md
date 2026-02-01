# andres.st - Programamos Core

Dashboard Maestro NOC para administrar proyectos de desarrollo de software a la medida.

## Descripción

Centro de control que centraliza la visibilidad de todos los proyectos de clientes en un solo lugar:
- **Monitoreo en tiempo real** de actividad de usuarios
- **Detección proactiva de errores** antes de que los clientes reporten
- **Análisis de uso** de módulos por proyecto
- **Estado de servidores** con indicadores visuales

## Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **Base de Datos:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Estilos:** Tailwind CSS v4
- **Fuente:** Alegreya

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/programamos/andres.st.git
cd andres.st

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

## Configuración de Supabase

1. Crear un proyecto en [Supabase](https://supabase.com)
2. Ejecutar el schema SQL en `supabase/schema.sql`
3. Copiar las credenciales a `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

## Estructura del Proyecto

```
andres.st/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── core/
│   │   │   └── page.tsx          # Dashboard principal
│   │   └── api/
│   │       └── v1/
│   │           └── telemetry/
│   │               └── route.ts  # API de ingesta
│   ├── components/
│   │   └── dashboard/            # Componentes del dashboard
│   ├── lib/
│   │   ├── supabase/            # Cliente de Supabase
│   │   ├── hooks/               # React hooks
│   │   └── telemetry-client/    # Scripts para clientes
│   └── types/                   # TypeScript types
├── supabase/
│   └── schema.sql               # Schema de base de datos
└── public/
```

## API de Telemetría

### Endpoint

```
POST /api/v1/telemetry
```

### Payload

```json
{
  "api_key": "tu_api_key_unica",
  "usuario_nombre": "Juan Pérez",
  "usuario_email": "juan@ejemplo.com",
  "modulo_visitado": "Dashboard",
  "accion_realizada": "Ver reportes",
  "metadata": { "filtro": "mensual" },
  "es_error": false,
  "error_mensaje": null,
  "duracion_ms": 1500
}
```

### Respuesta

```json
{
  "success": true,
  "message": "Activity logged successfully",
  "activity_id": "uuid",
  "proyecto": "Nombre del proyecto"
}
```

## Integración en Proyectos Cliente

### Opción 1: Script JavaScript/TypeScript

Copia `src/lib/telemetry-client/telemetry.ts` a tu proyecto:

```typescript
import { TelemetryClient } from './telemetry';

const telemetry = new TelemetryClient({
  apiKey: 'tu_api_key',
  enabled: process.env.NODE_ENV === 'production'
});

telemetry.track({
  usuario_nombre: 'Juan',
  modulo_visitado: 'Ventas',
  accion_realizada: 'Crear factura'
});
```

### Opción 2: Trigger de Supabase

Ver `src/lib/telemetry-client/supabase-trigger.sql`

## Paleta de Colores

- **Background:** `#f4f4ee`
- **Texto:** `#323232`
- **Acento:** `#8c52ff`
- **Success:** `#22c55e`
- **Error:** `#ef4444`

## Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## Roadmap

- [ ] Autenticación de usuarios admin
- [ ] Panel de gestión de proyectos
- [ ] Sistema de tickets de soporte
- [ ] Portal de clientes para comprar funcionalidades
- [ ] Notificaciones push de errores
- [ ] Dashboard de métricas avanzadas

## Licencia

Privado - © 2026 Programamos
