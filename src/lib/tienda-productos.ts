export type TipoProducto = 'funcionalidad' | 'integracion' | 'sistema';
export type PreviewTipo = 'reporte' | 'dashboard' | 'exportar' | 'alerta' | 'historial' | 'email' | 'whatsapp' | 'pago' | 'contabilidad' | 'pos' | 'local' | 'garantias' | 'ventas';

export interface Producto {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoProducto;
  precio?: string;
  detalle: string;
  incluye: string[];
  preview: PreviewTipo;
}

export const PRODUCTOS: Producto[] = [
  { id: 'rep-ventas', titulo: 'Reporte de ventas por período', descripcion: 'Reportes por fecha, producto y cliente. Exportable a Excel o PDF.', tipo: 'funcionalidad', precio: 'Cotización', preview: 'reporte', detalle: 'Consultá ventas por rango de fechas, por producto o por cliente. Filtros, totales y opción de exportar a Excel o PDF para compartir con tu contador o equipo.', incluye: ['Filtros por fecha, producto y cliente', 'Totales y subtotales', 'Exportación a Excel y PDF', 'Gráfico opcional de tendencia'] },
  { id: 'dashboard', titulo: 'Dashboard con gráficos', descripcion: 'Panel con gráficos de ventas, inventario y tendencias en tiempo real.', tipo: 'funcionalidad', precio: 'Cotización', preview: 'dashboard', detalle: 'Un panel central con los indicadores que vos elijas: ventas del día, del mes, productos más vendidos, stock bajo, tendencias. Todo en una sola pantalla.', incluye: ['Gráficos de ventas e inventario', 'KPIs configurables', 'Actualización en tiempo real', 'Vista para escritorio y móvil'] },
  { id: 'exportar', titulo: 'Exportar a Excel / PDF', descripcion: 'Exportación de listados, reportes y facturas a Excel o PDF.', tipo: 'funcionalidad', precio: 'Cotización', preview: 'exportar', detalle: 'Exportá cualquier listado o reporte del sistema a Excel (para seguir editando) o a PDF (para imprimir o enviar). Incluye facturas, listas de productos, movimientos de stock, etc.', incluye: ['Exportación a Excel (.xlsx)', 'Exportación a PDF', 'Configuración de columnas visibles', 'Aplicable a reportes y facturas'] },
  { id: 'alertas-stock', titulo: 'Alertas de stock bajo', descripcion: 'Avisos cuando un producto llega al mínimo configurado.', tipo: 'funcionalidad', precio: 'Cotización', preview: 'alerta', detalle: 'Configurás un mínimo por producto o por categoría. Cuando el stock llega a ese nivel, el sistema te avisa (en pantalla, por correo o por WhatsApp, según cómo lo armemos).', incluye: ['Umbral configurable por producto', 'Avisos en el sistema', 'Opción de notificación por correo o WhatsApp', 'Listado de productos en alerta'] },
  { id: 'historial-cliente', titulo: 'Historial de cliente', descripcion: 'Historial de compras, garantías y notas por cliente.', tipo: 'funcionalidad', precio: 'Cotización', preview: 'historial', detalle: 'Al abrir un cliente, ves todo su historial: ventas, garantías activas, notas internas y fechas. Ideal para atención al cliente y seguimiento.', incluye: ['Historial de compras', 'Garantías vinculadas', 'Notas internas', 'Búsqueda por cliente'] },
  { id: 'notif-email', titulo: 'Notificaciones por correo', descripcion: 'Envío automático de correos (ventas, recordatorios, alertas).', tipo: 'funcionalidad', precio: 'Cotización', preview: 'email', detalle: 'El sistema envía correos automáticos: factura al cliente, resumen diario a tu correo, alertas de stock, recordatorios que definamos. Todo configurable.', incluye: ['Envío de facturas por correo', 'Resúmenes diarios o semanales', 'Alertas configurables', 'Plantillas editables'] },
  { id: 'whatsapp', titulo: 'Integración WhatsApp', descripcion: 'Alertas, notificaciones y mensajes automáticos por WhatsApp.', tipo: 'integracion', precio: 'Cotización', preview: 'whatsapp', detalle: 'Conectamos tu sistema con WhatsApp para enviar mensajes automáticos: confirmación de venta, alertas de stock, recordatorios a clientes. También podés enviar mensajes manuales desde el sistema.', incluye: ['Mensajes automáticos configurables', 'Alertas al administrador', 'Notificaciones al cliente', 'Envío manual desde el sistema'] },
  { id: 'correo', titulo: 'Correo electrónico', descripcion: 'Envío de facturas, reportes y notificaciones por email.', tipo: 'integracion', precio: 'Cotización', preview: 'email', detalle: 'Configuramos el envío de correos desde tu sistema: facturas a clientes, reportes programados a tu correo, notificaciones de ventas o movimientos. Sin depender de tu cliente de correo.', incluye: ['Envío desde el sistema', 'Facturas y reportes por correo', 'Programación de envíos', 'Registro de envíos'] },
  { id: 'pasarela-pago', titulo: 'Pasarela de pago', descripcion: 'Cobros con tarjeta o en línea integrados a tu sistema.', tipo: 'integracion', precio: 'Cotización', preview: 'pago', detalle: 'Integración con pasarela de pago (tarjeta, en línea) para que cobres desde tu sistema sin usar otro dispositivo. El pago se registra en la venta y queda trazado.', incluye: ['Cobro con tarjeta desde el sistema', 'Pagos en línea (link)', 'Registro automático en la venta', 'Conciliación con reportes'] },
  { id: 'contabilidad', titulo: 'Integración contabilidad', descripcion: 'Exportar ventas y movimientos para tu contador o software contable.', tipo: 'integracion', precio: 'Cotización', preview: 'contabilidad', detalle: 'Exportación en formato que tu contador o software contable use: movimientos de ventas, compras, inventario. Evitás cargar todo a mano.', incluye: ['Exportación periódica (diaria/mensual)', 'Formato compatible con tu contador', 'Movimientos de ventas e inventario', 'Documentación de soporte'] },
  { id: 'sistema-tienda', titulo: 'Sistema para abrir una tienda', descripcion: 'POS, inventario, clientes, ventas y reportes. Todo lo que necesitás para abrir tu tienda.', tipo: 'sistema', precio: 'Cotización', preview: 'pos', detalle: 'Sistema completo para operar una tienda: punto de venta (POS), inventario con códigos y categorías, clientes, ventas con múltiples formas de pago, reportes de ventas y stock. Listo para usar el día uno.', incluye: ['Punto de venta (POS)', 'Inventario y categorías', 'Clientes e historial', 'Ventas (efectivo, transferencia, tarjeta)', 'Reportes de ventas y stock', 'Soporte y evolución'] },
  { id: 'admin-local', titulo: 'Sistema para administrar un local', descripcion: 'Gestión de turnos, cajas, inventario y reportes para tu local.', tipo: 'sistema', precio: 'Cotización', preview: 'local', detalle: 'Para locales con turnos o cajas: apertura y cierre de caja, inventario por local, reportes por turno, control de ingresos y egresos. Todo en un solo sistema.', incluye: ['Apertura y cierre de caja', 'Turnos y cajas', 'Inventario por local', 'Reportes por turno y por período'] },
  { id: 'garantias', titulo: 'Sistema de gestión de garantías', descripcion: 'Registro de garantías, seguimiento y vencimientos por producto o cliente.', tipo: 'sistema', precio: 'Cotización', preview: 'garantias', detalle: 'Registrá garantías por venta o por producto. El sistema te avisa cuándo vencen, lleva el historial por cliente y permite cerrar garantías con nota. Ideal para tiendas de electrónica o productos con garantía.', incluye: ['Registro de garantías por venta/producto', 'Alertas de vencimiento', 'Historial por cliente', 'Cierre con nota y estado'] },
  { id: 'ventas-facturacion', titulo: 'Sistema de ventas y facturación', descripcion: 'Ventas, facturación electrónica, clientes y reportes. Listo para operar.', tipo: 'sistema', precio: 'Cotización', preview: 'ventas', detalle: 'Sistema de ventas con facturación electrónica (si aplica en tu país), clientes, productos, reportes de ventas y opción de integración con contabilidad. Para negocios que necesitan facturar y llevar el día a día.', incluye: ['Ventas y cotizaciones', 'Facturación electrónica (si aplica)', 'Clientes y productos', 'Reportes y exportación', 'Integración contable opcional'] },
];

export const TIPOS: { id: TipoProducto; label: string }[] = [
  { id: 'funcionalidad', label: 'Funcionalidades' },
  { id: 'integracion', label: 'Integraciones' },
  { id: 'sistema', label: 'Sistemas completos' },
];

export function getProductoById(id: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.id === id);
}

const STORAGE_KEY = 'tienda-solicitudes';

export function getSolicitudesFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSolicitudToStorage(id: string): void {
  const list = getSolicitudesFromStorage();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

export function removeSolicitudFromStorage(id: string): void {
  const list = getSolicitudesFromStorage().filter((x) => x !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
