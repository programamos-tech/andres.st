/** Datos para el cotizador: sistemas base, módulos, soporte, pago y servicios */

export type SistemaBaseId = 'basico' | 'profesional' | 'empresarial';
export type FormaPagoId = 'contado' | 'financiado_sin_interes' | 'financiado_con_soporte';
export type PlanSoporteId = 'ninguno' | 'basico' | 'profesional' | 'empresarial';

export interface SistemaBase {
  id: SistemaBaseId;
  nombre: string;
  precio: number;
  tiempoSemanas: string;
  para: string;
  destacado?: boolean;
  incluye: string[];
}

export interface Modulo {
  id: string;
  nombre: string;
  precio: number;
  tiempo: string;
  descripcion: string;
}

export interface PlanSoporte {
  id: PlanSoporteId;
  nombre: string;
  precioMensual: number;
  incluye: string[];
  destacado?: boolean;
}

export interface FormaPago {
  id: FormaPagoId;
  nombre: string;
  descuentoPorcentaje?: number; // ej 10 para contado
  recargoPorcentaje?: number;   // ej 15 financiado con soporte
  descripcion: string;
}

export interface ServicioAdicional {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  esMensual?: boolean;
  esAnual?: boolean;
  esPorHora?: boolean;
}

export interface TipoNegocio {
  id: string;
  nombre: string;
}

export const SISTEMAS_BASE: SistemaBase[] = [
  {
    id: 'basico',
    nombre: 'Básico',
    precio: 4_500_000,
    tiempoSemanas: '2-3 sem',
    para: 'Tiendas pequeñas, 1-3 empleados',
    incluye: [
      'Ventas POS',
      'Inventario básico',
      'Gestión de clientes',
      'Reportes esenciales',
      '3 usuarios',
      '15 días soporte',
      '1 capacitación',
    ],
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    precio: 8_000_000,
    tiempoSemanas: '4-5 sem',
    para: 'Ferreterías, distribuidoras pequeñas, veterinarias (5-15 empleados)',
    destacado: true,
    incluye: [
      'Todo lo básico +',
      'Multi-usuario (10)',
      'Garantías',
      'Reportes avanzados',
      'Dashboard ejecutivo',
      'Alertas automáticas',
      '30 días soporte',
      '2 capacitaciones',
    ],
  },
  {
    id: 'empresarial',
    nombre: 'Empresarial',
    precio: 15_000_000,
    tiempoSemanas: '6-8 sem',
    para: 'Cadenas, distribuidoras grandes, ecommerce (15+ empleados)',
    incluye: [
      'Todo lo profesional +',
      'Créditos y cartera',
      'Multi-sede',
      'Usuarios ilimitados',
      'Roles y permisos',
      'Integraciones API',
      '60 días soporte',
      '3 capacitaciones',
    ],
  },
];

export const MODULOS: Modulo[] = [
  { id: 'dashboard', nombre: 'Dashboard Ejecutivo', precio: 1_500_000, tiempo: '3-5 días', descripcion: 'Métricas en tiempo real' },
  { id: 'garantias', nombre: 'Gestión de Garantías', precio: 1_800_000, tiempo: '5-7 días', descripcion: 'Control total de garantías' },
  { id: 'creditos', nombre: 'Créditos y Cartera', precio: 2_500_000, tiempo: '7-10 días', descripcion: 'Cuentas por cobrar' },
  { id: 'alertas', nombre: 'Alertas Inteligentes', precio: 1_200_000, tiempo: '2-3 días', descripcion: 'Notificaciones automáticas' },
  { id: 'multisede', nombre: 'Multi-sede', precio: 3_500_000, tiempo: '10-14 días', descripcion: 'Varias sedes centralizadas' },
  { id: 'facturacion_dian', nombre: 'Facturación Electrónica DIAN', precio: 3_800_000, tiempo: '7-10 días', descripcion: 'Cumplimiento DIAN' },
  { id: 'whatsapp', nombre: 'Integración WhatsApp', precio: 1_800_000, tiempo: '3-5 días', descripcion: 'Pedidos y notificaciones' },
  { id: 'app_movil', nombre: 'App Móvil (iOS + Android)', precio: 6_000_000, tiempo: '6-8 sem', descripcion: 'Versión móvil del sistema' },
  { id: 'tienda_online', nombre: 'Tienda Online (Ecommerce)', precio: 4_500_000, tiempo: '4-6 sem', descripcion: 'Ventas en línea' },
  { id: 'reportes_personalizados', nombre: 'Reportes Personalizados', precio: 800_000, tiempo: '1-2 días c/u', descripcion: 'Por reporte específico' },
  { id: 'api_externa', nombre: 'Integración API Externa', precio: 2_000_000, tiempo: 'Variable', descripcion: 'Según API (Siigo, Alegra, etc.)' },
];

export const PLANES_SOPORTE: PlanSoporte[] = [
  { id: 'ninguno', nombre: 'No por ahora', precioMensual: 0, incluye: [] },
  {
    id: 'basico',
    nombre: 'Básico',
    precioMensual: 300_000,
    incluye: [
      'Soporte WhatsApp (<24h)',
      'Corrección de bugs',
      'Updates de seguridad',
      'Backup semanal',
      'Andrebot 24/7',
    ],
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    precioMensual: 500_000,
    destacado: true,
    incluye: [
      'Todo lo básico +',
      'Respuesta prioritaria (<12h)',
      '1 mejora/ajuste mensual',
      'Backup diario',
      'Soporte vía llamada',
    ],
  },
  {
    id: 'empresarial',
    nombre: 'Empresarial',
    precioMensual: 750_000,
    incluye: [
      'Todo lo profesional +',
      'Respuesta ultra-rápida (<4h)',
      'Monitoreo 24/7',
      '2 mejoras mensuales',
      'Soporte 7 días/semana',
      'Acceso directo WhatsApp a Andrés',
    ],
  },
];

export const FORMAS_PAGO: FormaPago[] = [
  { id: 'contado', nombre: 'Contado (Recomendado)', descuentoPorcentaje: 10, descripcion: 'Pago único al iniciar' },
  { id: 'financiado_sin_interes', nombre: 'Financiado sin intereses', descripcion: '40% al iniciar, 30% a mitad, 30% al entregar' },
  { id: 'financiado_con_soporte', nombre: 'Financiado con soporte', recargoPorcentaje: 15, descripcion: '30% al iniciar, 6 cuotas mensuales (incluye plan soporte profesional)' },
];

export const SERVICIOS_ADICIONALES: ServicioAdicional[] = [
  { id: 'capacitacion', nombre: 'Capacitación adicional', precio: 400_000, descripcion: '2-3 horas presencial' },
  { id: 'migracion', nombre: 'Migración de datos', precio: 1_500_000, descripcion: 'Desde Excel/otro sistema' },
  { id: 'hosting', nombre: 'Hosting (mensual)', precio: 150_000, descripcion: 'Servidor en la nube', esMensual: true },
  { id: 'dominio_ssl', nombre: 'Dominio + SSL (anual)', precio: 200_000, descripcion: 'tuempresa.com + HTTPS', esAnual: true },
  { id: 'consultoria', nombre: 'Consultoría estratégica', precio: 800_000, descripcion: 'Sesión de 2 horas' },
  { id: 'soporte_urgencia', nombre: 'Soporte de urgencia (1 vez)', precio: 200_000, descripcion: 'Sin plan de soporte', esPorHora: true },
];

export const TIPOS_NEGOCIO: TipoNegocio[] = [
  { id: 'tienda_ropa', nombre: 'Tienda de ropa' },
  { id: 'ferreteria', nombre: 'Ferretería' },
  { id: 'distribuidora', nombre: 'Distribuidora' },
  { id: 'veterinaria', nombre: 'Veterinaria / Clínica' },
  { id: 'restaurante', nombre: 'Restaurante / Cafetería' },
  { id: 'concesionario', nombre: 'Concesionario de motos' },
  { id: 'otro', nombre: 'Otro' },
];

/** Calcula subtotal, descuento/recargo y total */
export function calcularCotizacion(p: {
  sistema: SistemaBase;
  modulosIds: string[];
  formaPago: FormaPago;
  serviciosIds: string[];
  mesesHosting?: number;
}): {
  subtotalSistema: number;
  subtotalModulos: number;
  subtotalServicios: number;
  subtotal: number;
  descuento: number;
  recargo: number;
  total: number;
  desgloseModulos: { id: string; nombre: string; precio: number }[];
  desgloseServicios: { id: string; nombre: string; precio: number; label?: string }[];
} {
  const subtotalSistema = p.sistema.precio;
  const desgloseModulos = p.modulosIds
    .map((id) => MODULOS.find((m) => m.id === id))
    .filter(Boolean) as Modulo[];
  const subtotalModulos = desgloseModulos.reduce((s, m) => s + m.precio, 0);

  const desgloseServicios: { id: string; nombre: string; precio: number; label?: string }[] = [];
  let subtotalServicios = 0;
  for (const id of p.serviciosIds) {
    const s = SERVICIOS_ADICIONALES.find((x) => x.id === id);
    if (!s) continue;
    if (s.id === 'hosting' && p.mesesHosting) {
      const total = s.precio * p.mesesHosting;
      desgloseServicios.push({ id: s.id, nombre: s.nombre, precio: total, label: `${p.mesesHosting} meses` });
      subtotalServicios += total;
    } else if (s.id === 'dominio_ssl') {
      desgloseServicios.push({ id: s.id, nombre: s.nombre, precio: s.precio, label: 'anual' });
      subtotalServicios += s.precio;
    } else {
      desgloseServicios.push({ id: s.id, nombre: s.nombre, precio: s.precio });
      subtotalServicios += s.precio;
    }
  }

  const subtotal = subtotalSistema + subtotalModulos + subtotalServicios;
  let descuento = 0;
  let recargo = 0;
  if (p.formaPago.descuentoPorcentaje) {
    descuento = Math.round((subtotal * p.formaPago.descuentoPorcentaje) / 100);
  }
  if (p.formaPago.recargoPorcentaje) {
    recargo = Math.round((subtotal * p.formaPago.recargoPorcentaje!) / 100);
  }
  const total = subtotal - descuento + recargo;

  return {
    subtotalSistema,
    subtotalModulos,
    subtotalServicios,
    subtotal,
    descuento,
    recargo,
    total,
    desgloseModulos: desgloseModulos.map((m) => ({ id: m.id, nombre: m.nombre, precio: m.precio })),
    desgloseServicios,
  };
}

export function formatPeso(n: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}
