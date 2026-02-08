/** Datos para el cotizador: sistemas base, módulos, soporte, pago y servicios */

export type SistemaBaseId = 'basico' | 'profesional' | 'empresarial';
export type FormaPagoId = 'contado' | 'financiado_sin_interes' | 'financiado_con_soporte';
export type PlanSoporteId = 'ninguno' | 'basico' | 'profesional' | 'empresarial';

export interface SistemaBase {
  id: SistemaBaseId;
  nombre: string;
  precio: number;
  /** Si es true, se muestra "Desde $X" (ej. Plan Empresarial) */
  precioDesde?: boolean;
  tiempoSemanas: string;
  para: string;
  destacado?: boolean;
  incluye: string[];
}

export interface Modulo {
  id: string;
  nombre: string;
  precio: number;
  /** Si es true, se muestra "Desde $X" (ej. Landing page) */
  precioDesde?: boolean;
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
  /** Si es true, se muestra "Desde $X" */
  precioDesde?: boolean;
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
    nombre: 'Plan Esencial',
    precio: 3_500_000,
    tiempoSemanas: '2-3 sem',
    para: 'Consultorios médicos, especialistas independientes, tiendas locales, gimnasios.',
    incluye: [
      'Gestión de citas y agenda digital',
      'Fichas técnicas, historiales clínicos o perfiles de clientes',
      'Base de datos segura en la nube (Supabase)',
    ],
  },
  {
    id: 'profesional',
    nombre: 'Plan Profesional',
    precio: 5_500_000,
    tiempoSemanas: '4-5 sem',
    para: 'Tiendas con puntos de venta, firmas de abogados, agencias inmobiliarias.',
    destacado: true,
    incluye: [
      'Portal de Clientes (pedidos, estados, facturas)',
      'Multi-usuario con roles (dueño, administrador, operativo)',
      'Control de inventario avanzado y ventas en tiempo real',
    ],
  },
  {
    id: 'empresarial',
    nombre: 'Plan Empresarial',
    precio: 8_000_000,
    precioDesde: true,
    tiempoSemanas: '6-8 sem',
    para: 'Empresas de logística, carga internacional, corporativos con múltiples sedes.',
    incluye: [
      'Automatización de flujos (Workflows)',
      'Integración APIs externas (rastreo, pagos, mensajería)',
      'Seguridad de grado empresarial y auditoría de movimientos',
    ],
  },
];

export const MODULOS: Modulo[] = [
  { id: 'facturacion_interna', nombre: 'Facturación Interna', precio: 450_000, tiempo: '3-5 días', descripcion: 'Recibos, órdenes de servicio y control de caja' },
  { id: 'facturacion_electronica', nombre: 'Facturación Electrónica', precio: 900_000, tiempo: '7-10 días', descripcion: 'Conexión con la DIAN (requiere proveedor)' },
  { id: 'whatsapp', nombre: 'Integración WhatsApp', precio: 400_000, tiempo: '3-5 días', descripcion: 'Notificaciones automáticas al cliente' },
  { id: 'dashboard', nombre: 'Dashboard Ejecutivo', precio: 500_000, tiempo: '3-5 días', descripcion: 'Gráficas de ventas y métricas para el dueño' },
  { id: 'alertas', nombre: 'Alertas Inteligentes', precio: 300_000, tiempo: '2-3 días', descripcion: 'Avisos de stock bajo, citas o vencimientos' },
  { id: 'historial_cliente', nombre: 'Historial de Cliente', precio: 400_000, tiempo: '2-4 días', descripcion: 'Notas de evolución o trazabilidad de compras' },
  { id: 'reportes_exportables', nombre: 'Reportes Exportables', precio: 200_000, tiempo: '1-2 días', descripcion: 'Descarga de datos en Excel y PDF' },
  { id: 'garantias', nombre: 'Gestión de Garantías', precio: 600_000, tiempo: '5-7 días', descripcion: 'Control por seriales y estados de reparación' },
  { id: 'multisede', nombre: 'Multi-sede', precio: 1_500_000, tiempo: '10-14 días', descripcion: 'Sincronización de datos entre ciudades' },
  { id: 'creditos', nombre: 'Créditos y Cartera', precio: 800_000, tiempo: '7-10 días', descripcion: 'Gestión de abonos y cuentas por cobrar' },
  { id: 'api_externa', nombre: 'Integración API externa', precio: 800_000, precioDesde: true, tiempo: 'Variable', descripcion: 'Según API (Siigo, Alegra, etc.). Precio desde, según complejidad.' },
  { id: 'tienda_online', nombre: 'Tienda en línea', precio: 2_500_000, tiempo: '4-6 sem', descripcion: 'Ecommerce con panel administrativo' },
  { id: 'landing_page', nombre: 'Landing page', precio: 1_200_000, precioDesde: true, tiempo: '1-2 sem', descripcion: 'Página de aterrizaje a medida' },
  { id: 'hotmart', nombre: 'Integración Hotmart (u otra plataforma)', precio: 750_000, tiempo: '5-7 días', descripcion: 'Ventas de productos digitales o cursos' },
];

export const PLANES_SOPORTE: PlanSoporte[] = [
  { id: 'ninguno', nombre: 'No por ahora', precioMensual: 0, incluye: [] },
  {
    id: 'basico',
    nombre: 'Plan Esencial',
    precioMensual: 300_000,
    incluye: [
      'Hosting y base de datos incluidos',
      'Corrección de bugs',
      'Hasta 4 mejoras pequeñas/mes',
      'Monitoreo 24/7',
    ],
  },
  {
    id: 'profesional',
    nombre: 'Plan Profesional',
    precioMensual: 500_000,
    destacado: true,
    incluye: [
      'Todo lo Esencial +',
      'Respaldos diarios',
      'Soporte prioritario (<4 h)',
      '1 capacitación mensual',
    ],
  },
  {
    id: 'empresarial',
    nombre: 'Plan Empresarial',
    precioMensual: 700_000,
    incluye: [
      'Todo lo Profesional +',
      'Alta disponibilidad / multi-sede',
      'Reunión mensual de estrategia',
      'Reportes personalizados',
    ],
  },
];

export const FORMAS_PAGO: FormaPago[] = [
  { id: 'contado', nombre: 'Contado (Recomendado)', descuentoPorcentaje: 10, descripcion: 'Pago único al iniciar' },
  { id: 'financiado_sin_interes', nombre: 'Financiado sin intereses', descripcion: '40% al iniciar, 30% a mitad, 30% al entregar' },
  { id: 'financiado_con_soporte', nombre: 'Financiado con acompañamiento', recargoPorcentaje: 15, descripcion: '30% al iniciar, 6 cuotas mensuales (incluye Plan Profesional)' },
];

export const SERVICIOS_ADICIONALES: ServicioAdicional[] = [
  { id: 'capacitacion', nombre: 'Capacitación adicional', precio: 200_000, descripcion: 'Ideal para rotación de personal o nuevos módulos.' },
  { id: 'migracion', nombre: 'Migración de datos', precio: 250_000, precioDesde: true, descripcion: 'Para que dejen el papel o el Excel y se pasen a tu sistema.' },
  { id: 'hosting', nombre: 'Hosting (mensual)', precio: 150_000, descripcion: 'Solo para quienes no adquieren plan de acompañamiento.', esMensual: true },
  { id: 'dominio_ssl', nombre: 'Dominio + SSL (anual)', precio: 200_000, descripcion: 'Transparencia total con los costos externos.', esAnual: true },
  { id: 'consultoria', nombre: 'Consultoría estratégica', precio: 450_000, descripcion: 'Asesoría para digitalizar procesos complejos.' },
  { id: 'soporte_urgencia', nombre: 'Soporte de urgencia (1 vez)', precio: 120_000, descripcion: 'Tu seguro para proteger tu tiempo libre.', esPorHora: true },
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

export type DesgloseLinea = {
  id: string;
  nombre: string;
  precio: number;
  precioFinal: number;
  descuentoPorcentaje: number;
  precioDesde?: boolean;
  label?: string;
};

/** Calcula subtotal, descuento/recargo y total. Permite descuento por ítem (ej. 100% = "te lo regalo") y descuento global. */
export function calcularCotizacion(p: {
  sistema: SistemaBase;
  modulosIds: string[];
  formaPago: FormaPago;
  serviciosIds: string[];
  mesesHosting?: number;
  /** Descuento % por módulo (id -> 0-100). Ej. { capacitacion: 100 } = cortesía */
  modulosDescuento?: Record<string, number>;
  /** Descuento % por servicio (id -> 0-100) */
  serviciosDescuento?: Record<string, number>;
  /** Descuento global % sobre el subtotal (negociación) */
  descuentoPorcentajeOverride?: number;
}): {
  subtotalSistema: number;
  subtotalModulos: number;
  subtotalServicios: number;
  subtotal: number;
  descuento: number;
  descuentoPorcentaje: number;
  recargo: number;
  total: number;
  desgloseModulos: DesgloseLinea[];
  desgloseServicios: DesgloseLinea[];
} {
  const modulosDescuento = p.modulosDescuento ?? {};
  const serviciosDescuento = p.serviciosDescuento ?? {};

  const subtotalSistema = p.sistema.precio;
  const desgloseModulosRaw = p.modulosIds
    .map((id) => MODULOS.find((m) => m.id === id))
    .filter(Boolean) as Modulo[];
  const desgloseModulos: DesgloseLinea[] = desgloseModulosRaw.map((m) => {
    const pct = Math.min(100, Math.max(0, modulosDescuento[m.id] ?? 0));
    const precioFinal = Math.round(m.precio * (1 - pct / 100));
    return {
      id: m.id,
      nombre: m.nombre,
      precio: m.precio,
      precioFinal,
      descuentoPorcentaje: pct,
      precioDesde: m.precioDesde,
    };
  });
  const subtotalModulos = desgloseModulos.reduce((s, m) => s + m.precioFinal, 0);

  const desgloseServicios: DesgloseLinea[] = [];
  for (const id of p.serviciosIds) {
    const s = SERVICIOS_ADICIONALES.find((x) => x.id === id);
    if (!s) continue;
    const pct = Math.min(100, Math.max(0, serviciosDescuento[s.id] ?? 0));
    let precioOriginal = s.precio;
    if (s.id === 'hosting' && p.mesesHosting) {
      precioOriginal = s.precio * p.mesesHosting;
    }
    const precioFinal = Math.round(precioOriginal * (1 - pct / 100));
    desgloseServicios.push({
      id: s.id,
      nombre: s.nombre,
      precio: precioOriginal,
      precioFinal,
      descuentoPorcentaje: pct,
      precioDesde: s.precioDesde,
      label: s.id === 'hosting' && p.mesesHosting ? `${p.mesesHosting} meses` : s.id === 'dominio_ssl' ? 'anual' : undefined,
    });
  }
  const subtotalServicios = desgloseServicios.reduce((sum, s) => sum + s.precioFinal, 0);

  const subtotal = subtotalSistema + subtotalModulos + subtotalServicios;
  let descuento = 0;
  let recargo = 0;
  const descuentoPct = p.descuentoPorcentajeOverride ?? p.formaPago.descuentoPorcentaje ?? 0;
  if (descuentoPct > 0) {
    descuento = Math.round((subtotal * descuentoPct) / 100);
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
    descuentoPorcentaje: descuentoPct,
    recargo,
    total,
    desgloseModulos,
    desgloseServicios,
  };
}

export function formatPeso(n: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}
