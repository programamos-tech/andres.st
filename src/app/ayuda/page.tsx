'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { BRAND } from '@/lib/constants';
import { HomeNav } from '@/components/HomeNav';
import type { Ticket } from '@/types/database';

// Tipos
type Vista = 'home' | 'chat' | 'ticket_flow' | 'ticket_creado';
type OpcionInicio = 'soporte' | 'cotizacion' | 'mis_servicios';
type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
  action?: 'ticket' | 'cotizar';
  storeLogo?: string;
  storeName?: string;
  /** Id del ticket creado en la DB; si existe, se muestra link "Ver estado del ticket" */
  ticketId?: string;
};

function esEmailValido(texto: string): boolean {
  const trimmed = texto.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 200;
}

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

// Todas las preguntas aplanadas para búsqueda tipo IA
const TODAS_LAS_PREGUNTAS = MODULOS.flatMap((m) =>
  m.preguntas.map((p) => ({ modulo: m.nombre, pregunta: p }))
);

function buscarRespuesta(userText: string): { text: string; action?: 'ticket' | 'cotizar' } {
  const t = userText.toLowerCase().trim();
  const userWords = t.replace(/[^\w\sáéíóúñü]/gi, '').split(/\s+/).filter(Boolean);

  // Intención: soporte / ticket
  if (/\b(soporte|ticket|problema|error|falla|no funciona|ayuda)\b/i.test(t)) {
    return {
      text: 'Para crear un ticket de soporte y que le demos seguimiento, usá el botón de abajo. Contame el problema con detalle.',
      action: 'ticket'
    };
  }
  // Intención: cotizar / software
  if (/\b(cotizar|cotización|presupuesto|software a medida|proyecto)\b/i.test(t)) {
    return {
      text: 'Podés ver módulos y cotizar en el catálogo (tienda) o escribirme por WhatsApp para hablar directo.',
      action: 'cotizar'
    };
  }

  // Búsqueda por coincidencia de palabras en preguntas
  let best = { score: 0, respuesta: '' };
  for (const { modulo, pregunta } of TODAS_LAS_PREGUNTAS) {
    const textoBusqueda = `${modulo} ${pregunta.texto}`.toLowerCase();
    const score = userWords.filter((w) => w.length > 2 && textoBusqueda.includes(w)).length;
    if (score > best.score) {
      best = { score, respuesta: pregunta.respuesta };
    }
  }
  if (best.score > 0) return { text: best.respuesta };
  return {
    text: 'No entendí lo que escribes. Describime el problema que estás teniendo.'
  };
}

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

const MENSAJE_INICIAL_BOT =
  'Hola, soy Andrebot. ¿En qué te ayudo?';

export default function AyudaPage() {
  const searchParams = useSearchParams();
  const [vista, setVista] = useState<Vista>('home');
  const [opcionInicio, setOpcionInicio] = useState<OpcionInicio | null>(null);
  const [correoUsuario, setCorreoUsuario] = useState<string | null>(null);
  const [pasoSoporte, setPasoSoporte] = useState<'email' | 'listo'>('email');
  const [soportePasoPregunta, setSoportePasoPregunta] = useState<0 | 1 | 2 | 3>(0);
  const [soporteRespuestas, setSoporteRespuestas] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [typingLabel, setTypingLabel] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [ticketDescripcion, setTicketDescripcion] = useState('');
  const [ticketPrioridad, setTicketPrioridad] = useState('');
  const [ticketCreado, setTicketCreado] = useState<Ticket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const contexto = {
    proyecto: searchParams.get('proyecto') || '',
    usuario: searchParams.get('usuario') || '',
    tienda: searchParams.get('tienda') || '',
    correo: correoUsuario || ''
  };
  // Banner solo con proyecto+usuario desde URL; nunca mostrar el correo arriba
  const tieneContexto = Boolean(contexto.proyecto && contexto.usuario);

  const TEXTO_PROPOSITO = 'Este chat es para responder dudas, pedir soporte o cotizar un software.';

  const entrarAlChat = (opcion: OpcionInicio) => {
    setOpcionInicio(opcion);
    setVista('chat');
    if (opcion === 'soporte') {
      setPasoSoporte('email');
      setCorreoUsuario(null);
      setMessages([{ role: 'bot', text: `${TEXTO_PROPOSITO}\n\nHola, soy Andrebot. Veo que necesitás soporte. ¿Cuál es tu correo? Así te identificamos.` }]);
    } else if (opcion === 'cotizacion') {
      setMessages([
        { role: 'bot', text: `${TEXTO_PROPOSITO}\n\nHola, soy Andrebot. Veo que querés cotizar. Podés ver el catálogo de módulos o escribirme por WhatsApp para hablar directo.`, action: 'cotizar' }
      ]);
    } else {
      setMessages([
        { role: 'bot', text: `${TEXTO_PROPOSITO}\n\nHola, soy Andrebot. Acá podés pedir soporte, cotizar un software a medida o resolver dudas. ¿En qué te ayudo?` }
      ]);
    }
  };

  // Hacer que el chat baje solo al último mensaje para seguir escribiendo
  useEffect(() => {
    if (vista !== 'chat') return;
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    });
    return () => cancelAnimationFrame(timer);
  }, [messages, typing, vista]);

  const enviarMensaje = () => {
    const texto = inputValue.trim();
    if (!texto || typing) return;
    setInputValue('');

    // Flujo soporte: pedimos el correo y lo validamos contra la API del proyecto (platform_users)
    if (opcionInicio === 'soporte' && pasoSoporte === 'email') {
      setMessages((m) => [...m, { role: 'user', text: texto }]);
      if (esEmailValido(texto)) {
        const emailNorm = texto.trim().toLowerCase();
        setTyping(true);
        setTypingLabel('Working...');
        const minDelay = 1200;
        const start = Date.now();
        fetch(`/api/ayuda/identificar?email=${encodeURIComponent(emailNorm)}`)
          .then((res) => res.json())
          .then((data: { found: boolean; nombre?: string; proyecto_nombre?: string; logo_url?: string | null }) => {
            const elapsed = Date.now() - start;
            const wait = Math.max(0, minDelay - elapsed);
            setTimeout(() => {
              setTyping(false);
              setTypingLabel(null);
              if (data.found && data.nombre != null && data.proyecto_nombre != null) {
                setCorreoUsuario(texto);
                setMessages((m) => [
                  ...m,
                  {
                    role: 'bot',
                    text: `Hola ${data.nombre}, de ${data.proyecto_nombre}.`,
                    storeLogo: data.logo_url ?? undefined,
                    storeName: data.proyecto_nombre
                  },
                  { role: 'bot', text: 'Listo, ¿en qué te ayudo?' }
                ]);
                setPasoSoporte('listo');
              } else {
                setMessages((m) => [
                  ...m,
                  {
                    role: 'bot',
                    text: 'Este correo no está registrado en la plataforma. Para solicitar soporte necesitás usar un correo que exista en el sistema. ¿Podés intentar con otro correo?'
                  }
                ]);
              }
            }, wait);
          })
          .catch(() => {
            setTyping(false);
            setTypingLabel(null);
            setMessages((m) => [
              ...m,
              {
                role: 'bot',
                text: 'No pudimos verificar tu correo ahora. Intentá de nuevo en un momento.'
              }
            ]);
          });
      } else {
        setMessages((m) => [
          ...m,
          {
            role: 'bot',
            text: 'Este chat es para soporte, específicamente el error que estás teniendo. Para continuar, ingresá tu correo registrado en la plataforma (ej: nombre@dominio.com).'
          }
        ]);
      }
      return;
    }

    // Flujo soporte + listo: preguntas para recolectar info; al terminar creamos el ticket en la DB y mostramos el link
    if (opcionInicio === 'soporte' && pasoSoporte === 'listo' && soportePasoPregunta >= 1 && soportePasoPregunta <= 3) {
      setMessages((m) => [...m, { role: 'user', text: texto }]);
      setSoporteRespuestas((r) => [...r, texto]);
      setTyping(true);
      const siguientePaso = (soportePasoPregunta + 1) as 1 | 2 | 3 | 4;
      const preguntas: Record<1 | 2 | 3, string> = {
        1: '¿En qué módulo o pantalla te pasa el error? (Ventas, Productos, Clientes, Dashboard, etc.)',
        2: '¿Qué estabas haciendo cuando apareció? (contá los pasos brevemente)',
        3: '¿Tenés un error o alerta en el sistema? Copiá y pegá acá el mensaje de error o alerta que te aparece.'
      };
      const respuestasCompletas = [...soporteRespuestas, texto];
      if (siguientePaso <= 3) {
        const paso = siguientePaso as 1 | 2 | 3;
        setTimeout(() => {
          setTyping(false);
          setSoportePasoPregunta(paso);
          setMessages((m) => [...m, { role: 'bot', text: preguntas[paso] }]);
        }, 600 + Math.random() * 300);
      } else {
        setSoportePasoPregunta(0);
        const [inicial, modulo, pasos, mensaje] = respuestasCompletas;
        const partes = [
          inicial && `Problema: ${inicial}`,
          modulo && `Módulo/pantalla: ${modulo}`,
          pasos && `Pasos: ${pasos}`,
          mensaje && `Mensaje/comportamiento: ${mensaje}`
        ].filter(Boolean);
        const descripcion = partes.join('\n\n');
        const titulo = (inicial || 'Soporte').slice(0, 80);
        fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proyecto_nombre: contexto.proyecto || 'Por identificar',
            modulo: modulo || 'General',
            tienda: contexto.tienda || '',
            titulo,
            descripcion,
            creado_por_nombre: contexto.usuario || 'Usuario',
            creado_por_email: correoUsuario || null
          })
        })
          .then((res) => res.json())
          .then((data: { id?: string; error?: string }) => {
            setTyping(false);
            if (data.id) {
              setMessages((m) => [
                ...m,
                {
                  role: 'bot',
                  text: 'Mirá, he creado un ticket de soporte. Andrés lo va a revisar y podés ver el estado automáticamente.',
                  ticketId: data.id
                }
              ]);
            } else {
              setMessages((m) => [
                ...m,
                {
                  role: 'bot',
                  text: 'No pude crear el ticket ahora. Intentá de nuevo en un momento o escribime por WhatsApp.',
                  action: 'ticket'
                }
              ]);
            }
          })
          .catch(() => {
            setTyping(false);
            setMessages((m) => [
              ...m,
              {
                role: 'bot',
                text: 'No pude crear el ticket ahora. Intentá de nuevo en un momento o escribime por WhatsApp.',
                action: 'ticket'
              }
            ]);
          });
      }
      return;
    }

    setMessages((m) => [...m, { role: 'user', text: texto }]);
    setTyping(true);
    setTimeout(() => {
      const { text, action } = buscarRespuesta(texto);
      // Si está en soporte+listo y pide ticket, en vez de mostrar el botón ya, hacemos las preguntas
      if (
        opcionInicio === 'soporte' &&
        pasoSoporte === 'listo' &&
        soportePasoPregunta === 0 &&
        action === 'ticket'
      ) {
        setSoporteRespuestas([texto]);
        setSoportePasoPregunta(1);
        setMessages((m) => [
          ...m,
          {
            role: 'bot',
            text: '¿En qué módulo o pantalla te pasa el error? (Ventas, Productos, Clientes, Dashboard, etc.)'
          }
        ]);
      } else {
        setMessages((m) => [...m, { role: 'bot', text, action }]);
      }
      setTyping(false);
    }, 600 + Math.random() * 400);
  };

  const iniciarTicket = () => {
    if (soporteRespuestas.length > 0) {
      const [inicial, modulo, pasos, mensaje] = soporteRespuestas;
      const partes = [
        inicial && `Problema: ${inicial}`,
        modulo && `Módulo/pantalla: ${modulo}`,
        pasos && `Pasos: ${pasos}`,
        mensaje && `Mensaje/comportamiento: ${mensaje}`
      ].filter(Boolean);
      setTicketDescripcion(partes.join('\n\n'));
    }
    setVista('ticket_flow');
  };

  const crearTicket = () => {
    const nuevoTicket: Ticket = {
      id: generarUUID(),
      numero: Math.floor(Math.random() * 900) + 100,
      proyecto_id: null,
      proyecto_nombre: contexto.proyecto || 'Por identificar',
      modulo: 'General',
      tienda: contexto.tienda || '',
      titulo: ticketDescripcion.slice(0, 80),
      descripcion: ticketDescripcion,
      estado: 'creado',
      creado_por_nombre: contexto.usuario || 'Usuario',
      creado_por_email: correoUsuario || contexto.correo || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resolved_at: null
    };
    setTicketCreado(nuevoTicket);
    setVista('ticket_creado');
  };

  const volverAlChat = () => {
    setVista('chat');
    setTicketDescripcion('');
    setTicketPrioridad('');
  };

  const reiniciar = () => {
    setVista('home');
    setOpcionInicio(null);
    setCorreoUsuario(null);
    setPasoSoporte('email');
    setSoportePasoPregunta(0);
    setSoporteRespuestas([]);
    setMessages([]);
    setTicketCreado(null);
    setTicketDescripcion('');
    setTicketPrioridad('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <HomeNav />

      {/* Context banner */}
      {tieneContexto && (
        <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="max-w-2xl mx-auto flex items-center gap-3 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
            <span className="text-[var(--text-muted)]">
              {contexto.proyecto && contexto.usuario ? (
                <>
                  <span className="text-[var(--text)]">{contexto.usuario}</span>
                  <span className="mx-2">·</span>
                  <span className="uppercase">{contexto.proyecto}</span>
                </>
              ) : (
                <span className="text-[var(--text)]">{contexto.correo}</span>
              )}
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* HOME del chat — foto grande + 3 opciones */}
        {vista === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-[var(--border)] mb-6 shrink-0">
              <Image
                src={BRAND.avatar}
                alt={BRAND.name}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-semibold text-[var(--text)] mb-2">Andrebot</h1>
            <p className="text-sm text-[var(--text-muted)] text-center max-w-sm mb-10">
              Este chat es para responder dudas, pedir soporte o cotizar un software.
            </p>
            <p className="text-sm font-medium text-[var(--text)] mb-4">¿Qué necesitás?</p>
            <div className="w-full max-w-sm space-y-3">
              <button
                type="button"
                onClick={() => entrarAlChat('soporte')}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text)] text-left"
              >
                <span>Soporte</span>
                <IconArrow />
              </button>
              <button
                type="button"
                onClick={() => entrarAlChat('cotizacion')}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text)] text-left"
              >
                <span>Cotización</span>
                <IconArrow />
              </button>
              <button
                type="button"
                onClick={() => entrarAlChat('mis_servicios')}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text)] text-left"
              >
                <span>Mis servicios</span>
                <IconArrow />
              </button>
            </div>
          </div>
        )}

        {/* CHAT — altura fija para que solo los mensajes hagan scroll y el input quede siempre visible */}
        {vista === 'chat' && (
          <div className="flex flex-col w-full h-[calc(100vh-4.5rem)] max-h-[calc(100vh-4.5rem)] overflow-hidden">
            {/* Opción iniciar nuevo chat */}
            <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
              <div className="max-w-2xl mx-auto flex justify-end">
                <button
                  type="button"
                  onClick={reiniciar}
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Iniciar nuevo chat
                </button>
              </div>
            </div>
            {/* Mensajes — único área con scroll; el input queda fijo abajo */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4">
              <div className="max-w-2xl mx-auto space-y-4">
                {messages.map((msg, i) =>
                  msg.role === 'bot' ? (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center shrink-0 gap-0.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border)]">
                          <Image src={BRAND.avatar} alt="" width={32} height={32} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-medium text-[var(--text-muted)]">Andrebot</span>
                      </div>
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)]">
                        <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{msg.text}</p>
                        {msg.storeLogo && msg.storeName && (
                          <div className="mt-3 flex items-center gap-3 p-2 rounded-lg bg-[var(--bg)]/60 border border-[var(--border)]">
                            {msg.storeLogo.startsWith('http') ? (
                              <img
                                src={msg.storeLogo}
                                alt={msg.storeName}
                                className="w-12 h-12 rounded-lg object-contain"
                              />
                            ) : (
                              <Image
                                src={msg.storeLogo}
                                alt={msg.storeName}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-lg object-contain"
                              />
                            )}
                            <span className="text-xs font-medium text-[var(--text-muted)]">Tu tienda: {msg.storeName}</span>
                          </div>
                        )}
                        {msg.ticketId && (
                          <Link
                            href={`/ticket/${msg.ticketId}`}
                            className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--text)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            Ver estado del ticket
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                        {msg.action === 'ticket' && !msg.ticketId && (
                          <button
                            type="button"
                            onClick={iniciarTicket}
                            className="mt-3 px-3 py-2 rounded-lg bg-[var(--text)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            Crear ticket de soporte
                          </button>
                        )}
                        {msg.action === 'cotizar' && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Link
                              href="/tienda"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--brand-cafe)]/20 text-[var(--brand-cafe)] text-sm font-medium hover:bg-[var(--brand-cafe)]/30 transition-colors"
                            >
                              Ver catálogo
                            </Link>
                            <a
                              href={`https://wa.me/${BRAND.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                              WhatsApp
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 bg-[var(--brand-cafe)]/20 border border-[var(--brand-cafe)]/40">
                        <p className="text-sm text-[var(--text)]">{msg.text}</p>
                      </div>
                    </div>
                  )
                )}
                {typing && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0 gap-0.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--border)]">
                        <Image src={BRAND.avatar} alt="" width={32} height={32} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-medium text-[var(--text-muted)]">Andrebot</span>
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)]">
                      {typingLabel ? (
                        <span className="text-sm text-[var(--text-muted)] italic">{typingLabel}</span>
                      ) : (
                        <span className="inline-flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Ancla para scroll automático al final */}
                <div ref={bottomRef} className="h-0 w-full shrink-0" aria-hidden="true" />
              </div>
            </div>

            {/* Input — siempre fijo abajo, nunca se esconde */}
            <div className="shrink-0 flex-none px-4 sm:px-6 py-4 border-t border-[var(--border)] bg-[var(--bg)]">
                <form
                  onSubmit={(e) => { e.preventDefault(); enviarMensaje(); }}
                  className="max-w-2xl mx-auto flex gap-2"
                >
                  <input
                    type={opcionInicio === 'soporte' && pasoSoporte === 'email' ? 'email' : 'text'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={opcionInicio === 'soporte' && pasoSoporte === 'email' ? 'tu@correo.com' : 'Escribí tu duda, pedido de soporte o cotización...'}
                    className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--text-muted)]"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || typing}
                    className="px-4 py-3 rounded-xl bg-[var(--brand-cafe)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    Enviar
                  </button>
                </form>
            </div>
          </div>
        )}

        {/* TICKET FLOW */}
        {vista === 'ticket_flow' && (
          <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
            <button
              onClick={volverAlChat}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors"
            >
              <IconBack />
              <span>Volver al chat</span>
            </button>

            <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Crear ticket</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Agregá una descripción detallada del error: qué te está pasando y qué estabas haciendo. Así podemos ayudarte mejor.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  Descripción del error (detallada)
                </label>
                <p className="text-xs text-[var(--text-muted)] mb-2">
                  Contanos qué te está pasando: ¿en qué pantalla o módulo? ¿Qué acción hiciste? ¿Qué mensaje o comportamiento ves?
                </p>
                <textarea
                  value={ticketDescripcion}
                  onChange={(e) => setTicketDescripcion(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-muted)] text-sm resize-none"
                  placeholder="Ej: Estaba en Ventas, intenté anular una factura y me sale «Error de permisos». No puedo completar la anulación. Ocurre desde ayer."
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
              Volver al chat
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
