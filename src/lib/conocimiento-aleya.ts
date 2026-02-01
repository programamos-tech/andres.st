// Base de conocimiento de AleyaShop para AndreBot
// Generado desde el .md del proyecto

export interface SeccionConocimiento {
  id: string;
  titulo: string;
  keywords: string[];
  contenido: string;
}

export const CONOCIMIENTO_ALEYA: SeccionConocimiento[] = [
  // DASHBOARD
  {
    id: 'dashboard_general',
    titulo: 'Dashboard - Vista General',
    keywords: ['dashboard', 'inicio', 'métricas', 'resumen', 'estadísticas', 'cards', 'tarjetas'],
    contenido: `El Dashboard principal muestra un resumen ejecutivo con métricas en tiempo real:

• Total Ingresos: Monto bruto, número de ventas, desglose de Base (sin IVA) e IVA recaudado.
• Efectivo: Total recaudado en efectivo y su porcentaje del total.
• Transferencia: Monto recibido por medios electrónicos y su porcentaje.
• Facturas Anuladas: Contador de ventas canceladas.
• Ganancia Bruta: Beneficio real (sin IVA) y el IVA destinado a la DIAN.
• Inversión en Stock: Valor total del dinero invertido en productos actualmente en inventario.`
  },
  {
    id: 'dashboard_ingresos',
    titulo: 'Dashboard - Total Ingresos',
    keywords: ['total ingresos', 'ingresos', 'ventas totales', 'cuánto vendí', 'monto total'],
    contenido: `La tarjeta de Total Ingresos muestra:

• Monto total bruto de ventas
• Número de ventas realizadas
• Desglose de Base (valor sin IVA)
• IVA recaudado

Este valor se actualiza en tiempo real con cada venta completada.`
  },
  {
    id: 'dashboard_ganancia',
    titulo: 'Dashboard - Ganancia Bruta',
    keywords: ['ganancia', 'utilidad', 'beneficio', 'margen', 'cuánto gané'],
    contenido: `La Ganancia Bruta calcula tu beneficio real:

• Muestra la utilidad neta (sin IVA)
• Indica el IVA recaudado que va para la DIAN
• Se calcula automáticamente: Precio de venta - Costo del producto

Es diferente a Total Ingresos porque descuenta el costo de los productos.`
  },

  // PRODUCTOS E INVENTARIO
  {
    id: 'productos_general',
    titulo: 'Productos - Vista General',
    keywords: ['productos', 'inventario', 'stock', 'ver productos', 'lista productos'],
    contenido: `El módulo de Productos permite administrar tu inventario:

• Stock Total: Se muestra en la parte superior
• Estados de Stock: Cada producto tiene indicador visual (Disponible, Agotado, etc.)
• Acciones Rápidas: Editar, Ajustar Stock, Eliminar

Para ver el detalle de un producto, haz click sobre él en la lista.`
  },
  {
    id: 'productos_agregar',
    titulo: 'Productos - Agregar Nuevo',
    keywords: ['agregar producto', 'nuevo producto', 'crear producto', 'registrar producto'],
    contenido: `Para agregar un nuevo producto:

1. Ve al módulo Productos
2. Click en "Nuevo Producto"
3. Llena los campos:
   • Referencia (obligatorio): Código único
   • Nombre (obligatorio)
   • Categoría (opcional)
   • Marca (opcional)
   • Precio Sin IVA
   • Costo Sin IVA
4. El sistema calcula automáticamente el IVA (19%)
5. Guarda el producto`
  },
  {
    id: 'productos_ajustar_stock',
    titulo: 'Productos - Ajustar Stock',
    keywords: ['ajustar stock', 'modificar stock', 'cambiar cantidad', 'stock manual', 'corregir stock'],
    contenido: `Para ajustar el stock de un producto:

1. Ve al módulo Productos
2. Busca el producto
3. Click en "Ajustar Stock"
4. Ingresa la nueva cantidad
5. Confirma el ajuste

IMPORTANTE: Solo el Super Admin puede ajustar stock manualmente. El ajuste queda registrado en el módulo de Actividades.`
  },
  {
    id: 'productos_detalle',
    titulo: 'Productos - Detalle y Métricas',
    keywords: ['detalle producto', 'ver producto', 'métricas producto', 'rotación', 'unidades vendidas'],
    contenido: `Al entrar a un producto específico puedes ver:

Identificación:
• Referencia, Nombre, Categoría, Marca

Precios (Venta):
• Precio Sin IVA, IVA (19%), Precio Con IVA

Costos (Compra):
• Costo Sin IVA, IVA de compra, Costo Con IVA

Métricas de Rotación:
• Unidades Vendidas (histórico)
• Ingresos generados
• Ganancia y % de margen
• Promedio diario de ventas
• Gráfica de rotación en el tiempo`
  },

  // CLIENTES
  {
    id: 'clientes_general',
    titulo: 'Clientes - Vista General',
    keywords: ['clientes', 'ver clientes', 'lista clientes', 'buscar cliente'],
    contenido: `El módulo de Clientes permite administrar tu base de datos:

• Búsqueda rápida por nombre o documento
• Cada cliente muestra: documento, nombre, correo, teléfono, estado
• Tipo de cliente: Cliente o Cliente Final

Para ver el detalle de un cliente, haz click sobre él en la lista.`
  },
  {
    id: 'clientes_registrar',
    titulo: 'Clientes - Registrar Nuevo',
    keywords: ['registrar cliente', 'nuevo cliente', 'crear cliente', 'agregar cliente'],
    contenido: `Para registrar un nuevo cliente:

1. Ve al módulo Clientes
2. Click en "Nuevo Cliente"
3. Campos obligatorios:
   • Documento de identidad
   • Nombre
   • Teléfono
4. Campos opcionales: correo, dirección, WhatsApp
5. Guarda

NOTA: No es obligatorio registrar cliente para vender. Puedes usar "Cliente Final" para ventas rápidas.`
  },
  {
    id: 'clientes_historial',
    titulo: 'Clientes - Historial y Métricas',
    keywords: ['historial cliente', 'compras cliente', 'cuánto compró', 'ticket promedio', 'puntos'],
    contenido: `Al entrar al perfil de un cliente puedes ver:

Métricas de Frecuencia:
• Compras Totales (número de facturas)
• Canales: Domicilio vs Tienda

Métricas Financieras:
• Total Gastado (LTV)
• Ticket Promedio
• Última Compra

Sistema de Puntos:
• Puntos acumulados (esquina superior derecha)

Comportamiento:
• Gráfica de evolución del ticket
• Top 5 productos más comprados
• Historial de últimas compras con detalle`
  },

  // VENTAS
  {
    id: 'ventas_general',
    titulo: 'Ventas - Vista General',
    keywords: ['ventas', 'ver ventas', 'historial ventas', 'facturas'],
    contenido: `El módulo de Ventas muestra:

• Ventas directas hoy: Total del día en la cabecera
• Búsqueda por número de factura o nombre de cliente
• Filtro por estado (Completada, Anulada)
• Botón "Nueva Venta" para crear una

Cada venta se puede expandir para ver el detalle completo.`
  },
  {
    id: 'ventas_nueva',
    titulo: 'Ventas - Crear Nueva Venta',
    keywords: ['nueva venta', 'crear venta', 'hacer venta', 'vender', 'facturar'],
    contenido: `Para crear una nueva venta:

1. Ve a Ventas > Nueva Venta
2. Selecciona el cliente (o usa Cliente Final)
3. Busca productos por Referencia o Nombre
4. Agrega productos al carrito
5. Selecciona método de pago:
   • Efectivo
   • Transferencia
   • Mixto (parte efectivo, parte transferencia)
6. Confirma la venta
7. Imprime la factura si es necesario

NOTA: Si un producto no tiene stock, el sistema muestra una alerta y no permite agregarlo.`
  },
  {
    id: 'ventas_anular',
    titulo: 'Ventas - Anular Venta',
    keywords: ['anular venta', 'cancelar venta', 'revertir venta', 'devolver venta', 'anulación'],
    contenido: `Para anular una venta:

1. Ve al módulo Ventas
2. Busca la factura
3. Click en "Anular" (botón rojo)
4. Ingresa el motivo de anulación (obligatorio)
5. Confirma

¿Qué pasa al anular?
• El dinero se revierte al flujo correspondiente (efectivo o transferencia)
• Las unidades regresan al stock automáticamente
• Queda registrado en Actividades

Permisos: Vendedor y Super Admin pueden anular
Límite de tiempo: No hay límite`
  },
  {
    id: 'ventas_metodos_pago',
    titulo: 'Ventas - Métodos de Pago',
    keywords: ['método pago', 'efectivo', 'transferencia', 'mixto', 'pago combinado', 'cómo pagar'],
    contenido: `Métodos de pago disponibles:

1. Efectivo: Ingresa al flujo de caja física
2. Transferencia: Se registra como dinero electrónico
3. Mixto: Puedes dividir el pago (ej: $50.000 efectivo + $30.000 transferencia)

Cada pago se suma automáticamente a su tarjeta correspondiente en el Dashboard.`
  },
  {
    id: 'ventas_factura',
    titulo: 'Ventas - Factura e Impresión',
    keywords: ['factura', 'imprimir', 'reimprimir', 'comprobante', 'recibo'],
    contenido: `Sobre las facturas:

• Se generan automáticamente al completar una venta
• Incluyen: número correlativo, cliente, productos, desglose de IVA, total
• Botón "Imprimir" disponible en el detalle de cada venta
• Puedes reimprimir cualquier factura desde el historial

Para reimprimir: Ve a Ventas > Busca la factura > Click en "Imprimir"`
  },

  // GARANTÍAS
  {
    id: 'garantias_general',
    titulo: 'Garantías - Cómo Funciona',
    keywords: ['garantía', 'garantías', 'reclamo', 'defectuoso', 'cambio producto'],
    contenido: `El módulo de Garantías gestiona el intercambio de productos defectuosos:

Flujo de garantía:
1. Producto Defectuoso (Entrada): Busca y selecciona el producto que el cliente devuelve
2. Producto de Reemplazo (Salida): Selecciona el producto que entregas al cliente
3. Cliente: Selecciona de la base de datos o escribe el nombre
4. Notas: Describe el estado o motivo de la falla (opcional)

El sistema automáticamente:
• Registra el producto defectuoso
• Descuenta del stock el producto de reemplazo`
  },

  // ROLES Y USUARIOS
  {
    id: 'roles_general',
    titulo: 'Roles - Vista General',
    keywords: ['roles', 'usuarios', 'permisos', 'acceso', 'quién puede'],
    contenido: `El sistema tiene estos roles:

Super Admin:
• Control total del sistema
• Único que puede ajustar stock y gestionar usuarios
• Acceso a configuración crítica

Vendedor:
• Rol operativo para atención y ventas
• Puede crear ventas y anular
• No puede ajustar stock ni gestionar usuarios

Cada usuario muestra: nombre, correo, estado, rol y último acceso.`
  },
  {
    id: 'roles_permisos',
    titulo: 'Roles - Permisos por Módulo',
    keywords: ['permisos', 'acceso módulo', 'qué puede hacer', 'restricciones'],
    contenido: `Los permisos se configuran por módulo:

• Dashboard: Ver métricas y gráficas
• Productos: Gestión de inventario y precios
• Clientes: Base de datos de compradores
• Ventas: Facturación y anulaciones
• Garantías: Reclamos y cambios
• Roles: Gestión de usuarios (solo Super Admin)
• Actividades: Log de auditoría

Para cambiar permisos: Roles > Editar usuario > Activar/desactivar cada módulo`
  },
  {
    id: 'roles_desactivar',
    titulo: 'Roles - Desactivar Usuario',
    keywords: ['desactivar usuario', 'bloquear usuario', 'quitar acceso', 'usuario inactivo'],
    contenido: `Para desactivar un usuario sin borrar sus datos:

1. Ve al módulo Roles
2. Busca el usuario
3. Click en Editar
4. Usa el switch "Usuario Activo" para desactivarlo
5. Guarda

El usuario no podrá ingresar pero su historial se mantiene para auditoría.`
  },

  // ACTIVIDADES
  {
    id: 'actividades_general',
    titulo: 'Actividades - Auditoría',
    keywords: ['actividades', 'log', 'auditoría', 'historial', 'quién hizo', 'registro'],
    contenido: `El módulo de Actividades es el registro maestro del sistema:

Cada registro incluye:
• ID único
• Tipo de movimiento (Venta, Ajuste, Cliente Creado, etc.)
• Acción ejecutada
• Descripción detallada
• Usuario responsable
• Fecha y hora exacta

Funciones:
• Filtrar por módulo específico
• Buscar registros
• Ver detalles expandidos con el icono de "ojo"
• Actualizar en tiempo real`
  },

  // ERRORES COMUNES
  {
    id: 'error_sin_stock',
    titulo: 'Error - Producto sin Stock',
    keywords: ['sin stock', 'no tiene stock', 'agotado', 'no puedo vender'],
    contenido: `Si ves el mensaje "No tiene stock":

El producto está agotado y no se puede agregar a la venta.

Soluciones:
1. Verifica el stock real en el módulo Productos
2. Si hay error, pide al Super Admin que ajuste el stock
3. Si realmente está agotado, espera el reabastecimiento

El sistema bloquea la venta de productos sin stock para evitar problemas de inventario.`
  },
  {
    id: 'error_no_encuentra',
    titulo: 'Error - No Encuentra Producto',
    keywords: ['no encuentra', 'no aparece', 'buscar producto', 'dónde está'],
    contenido: `Si no encuentras un producto:

1. Busca por Referencia exacta (código del producto)
2. Busca por Nombre (parcial funciona)
3. Verifica que el producto esté creado en el sistema
4. Revisa si está en otra categoría

NOTA: El sistema NO soporta escáner de código de barras actualmente. La búsqueda es solo por Referencia y Nombre.`
  }
];

// Función para buscar en el conocimiento
export function buscarEnConocimiento(pregunta: string): SeccionConocimiento | null {
  const preguntaLower = pregunta.toLowerCase();
  
  let mejorMatch: SeccionConocimiento | null = null;
  let mejorPuntaje = 0;
  
  for (const seccion of CONOCIMIENTO_ALEYA) {
    let puntaje = 0;
    
    for (const keyword of seccion.keywords) {
      if (preguntaLower.includes(keyword.toLowerCase())) {
        // Dar más peso a keywords más largas (más específicas)
        puntaje += keyword.length;
      }
    }
    
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejorMatch = seccion;
    }
  }
  
  // Solo retornar si hay un match razonable
  return mejorPuntaje >= 4 ? mejorMatch : null;
}
