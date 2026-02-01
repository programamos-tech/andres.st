'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { BRAND } from '@/lib/constants';
import type { Ticket } from '@/types/database';

// Tipos
type Vista = 'home' | 'modulo' | 'respuesta' | 'ticket_flow' | 'ticket_creado';

interface Pregunta {
  id: string;
  texto: string;
  respuesta: string;
}

interface Modulo {
  id: string;
  nombre: string;
  preguntas: Pregunta[];
}

// Base de conocimiento estructurada por módulos
const MODULOS: Modulo[] = [
  {
    id: 'ventas',
    nombre: 'Ventas',
    preguntas: [
      {
        id: 'crear_venta',
        texto: '¿Cómo hago una venta?',
        respuesta: `Para crear una nueva venta:

1. Ve a Ventas > Nueva Venta
2. Selecciona el cliente (o usa Cliente Final)
3. Busca productos por Referencia o Nombre
4. Agrega productos al carrito
5. Selecciona método de pago: Efectivo, Transferencia o Mixto
6. Confirma la venta
7. Imprime la factura si es necesario

Si un producto no tiene stock, el sistema muestra una alerta y no permite agregarlo.`
      },
      {
        id: 'anular_venta',
        texto: '¿Cómo anulo una venta?',
        respuesta: `Para anular una venta:

1. Ve al módulo Ventas
2. Busca la factura
3. Click en "Anular" (botón rojo)
4. Ingresa el motivo (obligatorio)
5. Confirma

¿Qué pasa al anular?
• El dinero se revierte al flujo correspondiente
• Las unidades regresan al stock automáticamente
• Queda registrado en Actividades

Permisos: Vendedor y Super Admin pueden anular.
No hay límite de tiempo para anular.`
      },
      {
        id: 'metodos_pago',
        texto: '¿Qué métodos de pago hay?',
        respuesta: `Métodos de pago disponibles:

• Efectivo: Ingresa al flujo de caja física
• Transferencia: Se registra como dinero electrónico
• Mixto: Puedes dividir el pago (ej: $50.000 efectivo + $30.000 transferencia)

Cada pago se suma automáticamente a su tarjeta en el Dashboard.`
      },
      {
        id: 'reimprimir',
        texto: '¿Cómo reimprimo una factura?',
        respuesta: `Para reimprimir una factura:

1. Ve al módulo Ventas
2. Busca la factura por número o cliente
3. Click en la venta para ver el detalle
4. Click en "Imprimir"

Puedes reimprimir cualquier factura del historial, no hay límite.`
      }
    ]
  },
  {
    id: 'inventario',
    nombre: 'Inventario',
    preguntas: [
      {
        id: 'ver_stock',
        texto: '¿Dónde veo el stock?',
        respuesta: `Para ver el stock:

1. Ve al módulo Productos
2. El Stock Total aparece en la parte superior
3. Cada producto muestra su stock individual
4. Los indicadores de color muestran el estado: Disponible, Bajo, Agotado

Click en un producto para ver su detalle completo con métricas de rotación.`
      },
      {
        id: 'ajustar_stock',
        texto: '¿Cómo ajusto el stock?',
        respuesta: `Para ajustar el stock de un producto:

1. Ve al módulo Productos
2. Busca el producto
3. Click en "Ajustar Stock"
4. Ingresa la nueva cantidad
5. Confirma

IMPORTANTE: Solo el Super Admin puede ajustar stock manualmente.
El ajuste queda registrado en el módulo de Actividades.`
      },
      {
        id: 'agregar_producto',
        texto: '¿Cómo agrego un producto?',
        respuesta: `Para agregar un nuevo producto:

1. Ve al módulo Productos
2. Click en "Nuevo Producto"
3. Llena los campos obligatorios:
   • Referencia (código único)
   • Nombre
   • Precio Sin IVA
   • Costo Sin IVA
4. Campos opcionales: Categoría, Marca
5. El sistema calcula el IVA (19%) automáticamente
6. Guarda`
      },
      {
        id: 'producto_no_aparece',
        texto: 'No encuentro un producto',
        respuesta: `Si no encuentras un producto:

1. Busca por Referencia exacta (código)
2. Busca por Nombre (parcial funciona)
3. Verifica que el producto esté creado
4. Revisa si está en otra categoría

NOTA: El sistema NO soporta escáner de código de barras actualmente.
La búsqueda es solo por Referencia y Nombre.`
      }
    ]
  },
  {
    id: 'clientes',
    nombre: 'Clientes',
    preguntas: [
      {
        id: 'registrar_cliente',
        texto: '¿Cómo registro un cliente?',
        respuesta: `Para registrar un cliente:

1. Ve al módulo Clientes
2. Click en "Nuevo Cliente"
3. Campos obligatorios:
   • Documento de identidad
   • Nombre
   • Teléfono
4. Campos opcionales: correo, dirección, WhatsApp
5. Guarda

No es obligatorio registrar cliente para vender. Puedes usar "Cliente Final".`
      },
      {
        id: 'historial_cliente',
        texto: '¿Cómo veo las compras de un cliente?',
        respuesta: `Para ver el historial de un cliente:

1. Ve al módulo Clientes
2. Busca el cliente por nombre o documento
3. Click en el cliente

Verás:
• Total gastado (LTV)
• Ticket promedio
• Última compra
• Top 5 productos comprados
• Historial de facturas con detalle`
      },
      {
        id: 'cliente_obligatorio',
        texto: '¿Es obligatorio registrar cliente?',
        respuesta: `No es obligatorio registrar cliente para vender.

Puedes usar "Cliente Final" para ventas rápidas donde no necesitas trazabilidad.

Sin embargo, se recomienda registrar clientes para:
• Historial de compras
• Sistema de puntos
• Análisis de comportamiento
• Gestión de créditos/fiados`
      }
    ]
  },
  {
    id: 'dashboard',
    nombre: 'Dashboard',
    preguntas: [
      {
        id: 'total_ingresos',
        texto: '¿Qué significa Total Ingresos?',
        respuesta: `Total Ingresos muestra:

• Monto total bruto de ventas
• Número de ventas realizadas
• Desglose de Base (valor sin IVA)
• IVA recaudado

Este valor se actualiza en tiempo real con cada venta completada.`
      },
      {
        id: 'ganancia_bruta',
        texto: '¿Qué es la Ganancia Bruta?',
        respuesta: `Ganancia Bruta calcula tu beneficio real:

• Muestra la utilidad neta (sin IVA)
• Indica el IVA recaudado para la DIAN
• Se calcula: Precio de venta - Costo del producto

Es diferente a Total Ingresos porque descuenta el costo de los productos.`
      },
      {
        id: 'inversion_stock',
        texto: '¿Qué es Inversión en Stock?',
        respuesta: `Inversión en Stock muestra:

El valor total del dinero invertido en productos que tienes actualmente en inventario.

Se calcula multiplicando el costo (con IVA) de cada producto por su cantidad en stock.

Es útil para saber cuánto capital tienes "congelado" en mercancía.`
      }
    ]
  },
  {
    id: 'garantias',
    nombre: 'Garantías',
    preguntas: [
      {
        id: 'registrar_garantia',
        texto: '¿Cómo registro una garantía?',
        respuesta: `Para registrar una garantía:

1. Ve al módulo Garantías
2. Click en "Nueva Garantía"
3. Selecciona el Producto Defectuoso (el que devuelve el cliente)
4. Selecciona el Producto de Reemplazo (el que le entregas)
5. Selecciona o escribe el nombre del cliente
6. Agrega notas sobre la falla (opcional)
7. Guarda

El sistema registra el defectuoso y descuenta del stock el reemplazo.`
      }
    ]
  },
  {
    id: 'roles',
    nombre: 'Usuarios y Permisos',
    preguntas: [
      {
        id: 'permisos_vendedor',
        texto: '¿Qué puede hacer un Vendedor?',
        respuesta: `El rol Vendedor puede:

• Crear ventas
• Anular ventas
• Ver clientes
• Registrar clientes
• Ver productos (sin ajustar stock)

No puede:
• Ajustar stock manualmente
• Gestionar usuarios
• Acceder a configuración crítica`
      },
      {
        id: 'desactivar_usuario',
        texto: '¿Cómo desactivo un usuario?',
        respuesta: `Para desactivar un usuario sin borrar sus datos:

1. Ve al módulo Roles
2. Busca el usuario
3. Click en Editar
4. Usa el switch "Usuario Activo" para desactivarlo
5. Guarda

El usuario no podrá ingresar pero su historial se mantiene.`
      }
    ]
  }
];

const PRIORIDADES = [
  { id: 'super_alta', label: 'Super urgente' },
  { id: 'alta', label: 'Alta' },
  { id: 'media', label: 'Media' },
  { id: 'baja', label: 'Cuando puedas' }
];

// Iconos
const IconBack = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconTicket = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const IconArrow = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconWarning = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

function generarUUID(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'tk_';
  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export default function AyudaPage() {
  const searchParams = useSearchParams();
  const [vista, setVista] = useState<Vista>('home');
  const [moduloActivo, setModuloActivo] = useState<Modulo | null>(null);
  const [respuestaActiva, setRespuestaActiva] = useState<Pregunta | null>(null);
  const [ticketDescripcion, setTicketDescripcion] = useState('');
  const [ticketPrioridad, setTicketPrioridad] = useState('');
  const [ticketCreado, setTicketCreado] = useState<Ticket | null>(null);

  const contexto = {
    proyecto: searchParams.get('proyecto') || '',
    usuario: searchParams.get('usuario') || '',
    tienda: searchParams.get('tienda') || ''
  };
  
  const tieneContexto = contexto.proyecto && contexto.usuario;

  const seleccionarModulo = (modulo: Modulo) => {
    setModuloActivo(modulo);
    setVista('modulo');
  };

  const seleccionarPregunta = (pregunta: Pregunta) => {
    setRespuestaActiva(pregunta);
    setVista('respuesta');
  };

  const iniciarTicket = () => {
    setVista('ticket_flow');
  };

  const crearTicket = () => {
    const nuevoTicket: Ticket = {
      id: generarUUID(),
      numero: Math.floor(Math.random() * 900) + 100,
      proyecto_id: null,
      proyecto_nombre: contexto.proyecto || 'Sin proyecto',
      modulo: moduloActivo?.nombre || 'General',
      tienda: contexto.tienda || '',
      titulo: ticketDescripcion.slice(0, 80),
      descripcion: ticketDescripcion,
      estado: 'creado',
      creado_por_nombre: contexto.usuario || 'Usuario',
      creado_por_email: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resolved_at: null
    };
    setTicketCreado(nuevoTicket);
    setVista('ticket_creado');
  };

  const volver = () => {
    if (vista === 'modulo') {
      setVista('home');
      setModuloActivo(null);
    } else if (vista === 'respuesta') {
      setVista('modulo');
      setRespuestaActiva(null);
    } else if (vista === 'ticket_flow') {
      setVista('modulo');
    }
  };

  const reiniciar = () => {
    setVista('home');
    setModuloActivo(null);
    setRespuestaActiva(null);
    setTicketDescripcion('');
    setTicketPrioridad('');
    setTicketCreado(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold text-[var(--text)]">{BRAND.username}</Link>
          <span className="text-sm text-[var(--text-muted)]">Ayuda</span>
        </div>
      </nav>

      {/* Context banner */}
      {tieneContexto && (
        <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="max-w-2xl mx-auto flex items-center gap-3 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
            <span className="text-[var(--text-muted)]">
              <span className="text-[var(--text)]">{contexto.usuario}</span>
              <span className="mx-2">·</span>
              <span className="uppercase">{contexto.proyecto}</span>
            </span>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        
        {/* HOME - Selección de módulo */}
        {vista === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <div className="w-28 h-28 rounded-full overflow-hidden mb-6">
              <Image
                src={BRAND.avatar}
                alt={BRAND.name}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-xl font-semibold text-[var(--text)] mb-2">¿Sobre qué tienes la duda?</h1>
            <p className="text-sm text-[var(--text-muted)] mb-10">Selecciona el módulo</p>

            <div className="w-full max-w-md space-y-2">
              {MODULOS.map((modulo) => (
                <button
                  key={modulo.id}
                  onClick={() => seleccionarModulo(modulo)}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text)]"
                >
                  <span>{modulo.nombre}</span>
                  <IconArrow />
                </button>
              ))}
            </div>

            <p className="text-xs text-[var(--text-muted)] text-center mt-10">
              Soy AndreBot, te ayudo con tus dudas más rápidas.
            </p>
          </div>
        )}

        {/* MÓDULO - Preguntas del módulo */}
        {vista === 'modulo' && moduloActivo && (
          <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
            <button
              onClick={volver}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors"
            >
              <IconBack />
              <span>Volver</span>
            </button>

            <h2 className="text-lg font-semibold text-[var(--text)] mb-2">{moduloActivo.nombre}</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">¿Qué necesitas saber?</p>

            <div className="space-y-2">
              {moduloActivo.preguntas.map((pregunta) => (
                <button
                  key={pregunta.id}
                  onClick={() => seleccionarPregunta(pregunta)}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors text-left text-[var(--text)]"
                >
                  <span>{pregunta.texto}</span>
                  <IconArrow />
                </button>
              ))}
              
              {/* Opción para crear ticket */}
              <button
                onClick={iniciarTicket}
                className="w-full flex items-center justify-between px-4 py-4 rounded-xl border border-dashed border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors text-left text-[var(--text-muted)]"
              >
                <span>Mi pregunta no está aquí</span>
                <IconArrow />
              </button>
            </div>
          </div>
        )}

        {/* RESPUESTA */}
        {vista === 'respuesta' && respuestaActiva && (
          <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
            <button
              onClick={volver}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors"
            >
              <IconBack />
              <span>Volver</span>
            </button>

            <h2 className="text-lg font-semibold text-[var(--text)] mb-6">{respuestaActiva.texto}</h2>

            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <p className="text-sm text-[var(--text)] whitespace-pre-wrap leading-relaxed">
                {respuestaActiva.respuesta}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={reiniciar}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                Tengo otra duda
              </button>
              <button
                onClick={iniciarTicket}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                Esto no me ayudó
              </button>
            </div>
          </div>
        )}

        {/* TICKET FLOW */}
        {vista === 'ticket_flow' && (
          <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
            <button
              onClick={volver}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors"
            >
              <IconBack />
              <span>Volver</span>
            </button>

            <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Crear ticket</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">Cuéntame tu problema y le doy seguimiento</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">
                  Describe el problema con detalle
                </label>
                <textarea
                  value={ticketDescripcion}
                  onChange={(e) => setTicketDescripcion(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-muted)] text-sm resize-none"
                  placeholder="¿Qué estabas haciendo y qué pasó?"
                />
              </div>

              {ticketDescripcion.length > 10 && !ticketPrioridad && (
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">
                    ¿Qué tan urgente es?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRIORIDADES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setTicketPrioridad(p.id)}
                        className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text)]"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {ticketPrioridad && (
                <button
                  onClick={crearTicket}
                  className="w-full px-4 py-3 bg-[var(--text)] text-[var(--bg)] rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Crear ticket
                </button>
              )}
            </div>
          </div>
        )}

        {/* TICKET CREADO */}
        {vista === 'ticket_creado' && ticketCreado && (
          <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Ticket creado</h2>
              <p className="text-sm text-[var(--text-muted)]">Le daré seguimiento lo antes posible</p>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border)] space-y-4">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <IconTicket />
                <span className="text-xs font-mono">{ticketCreado.id}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="font-medium text-[var(--text)]">{ticketCreado.titulo}</p>
                <div className="text-xs text-[var(--text-muted)] space-y-1">
                  <p>Módulo: {ticketCreado.modulo}</p>
                  {ticketCreado.proyecto_nombre !== 'Sin proyecto' && (
                    <p>Proyecto: {ticketCreado.proyecto_nombre.toUpperCase()}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] space-y-3">
                <div className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                  <IconWarning />
                  <span>Guarda este link. Si lo pierdes, no podrás ver el estado.</span>
                </div>
                
                <Link
                  href={`/ticket/${ticketCreado.id}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[var(--text)] text-[var(--bg)] rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <span>Ver estado del ticket</span>
                  <IconArrow />
                </Link>
              </div>
            </div>

            <button
              onClick={reiniciar}
              className="w-full mt-6 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
