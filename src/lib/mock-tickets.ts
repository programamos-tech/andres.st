import type { Ticket, TicketComentario } from '@/types/database';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    numero: 1,
    proyecto_id: '1',
    proyecto_nombre: 'ZonaT',
    modulo: 'ventas',
    tienda: 'Zona T Centro',
    titulo: 'Error al generar factura',
    descripcion: 'Cuando intento generar una factura con más de 10 productos, el sistema se queda cargando y no responde.',
    estado: 'replicando',
    creado_por_nombre: 'María García',
    creado_por_email: 'maria@zonat.com',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolved_at: null
  },
  {
    id: '2',
    numero: 2,
    proyecto_id: '2',
    proyecto_nombre: 'Aleya',
    modulo: 'reportes',
    tienda: 'Principal',
    titulo: 'Agregar filtro por fecha en reportes',
    descripcion: 'Sería muy útil poder filtrar los reportes de ventas por rango de fechas personalizado.',
    estado: 'ajustando',
    creado_por_nombre: 'Carlos Mendez',
    creado_por_email: 'carlos@aleya.com',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    resolved_at: null
  },
  {
    id: '3',
    numero: 3,
    proyecto_id: '1',
    proyecto_nombre: 'ZonaT',
    modulo: 'configuración',
    tienda: 'Zona T Centro',
    titulo: 'Actualizar logo de la empresa',
    descripcion: 'Necesitamos cambiar el logo que aparece en los recibos.',
    estado: 'resuelto',
    creado_por_nombre: 'Pedro Martínez',
    creado_por_email: 'pedro@zonat.com',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const MOCK_COMENTARIOS: TicketComentario[] = [
  {
    id: '1',
    ticket_id: '1',
    mensaje: 'Gracias por reportar. Estoy revisando el problema.',
    autor_nombre: 'Andrés Russ',
    es_admin: true,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    ticket_id: '2',
    mensaje: 'Ya empecé a trabajar en esto. Te aviso cuando esté listo.',
    autor_nombre: 'Andrés Russ',
    es_admin: true,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
];
