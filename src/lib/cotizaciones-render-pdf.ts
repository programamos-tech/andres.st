/**
 * Genera el buffer del PDF de una propuesta a partir del payload guardado.
 * Usado por POST /api/cotizaciones/generar y GET /api/cotizaciones/[id]/pdf.
 */
import { readFile } from 'fs/promises';
import path from 'path';
import React from 'react';
import * as ReactPDF from '@react-pdf/renderer';
import {
  SISTEMAS_BASE,
  PLANES_SOPORTE,
  FORMAS_PAGO,
  TIPOS_NEGOCIO,
  calcularCotizacion,
} from '@/lib/cotizaciones-data';
import { BRAND } from '@/lib/constants';
import { buildCotizacionPDFElement } from '@/lib/buildCotizacionPDFElement';

export type PropuestaPayload = {
  cliente?: {
    nombreNegocio?: string;
    contacto?: string;
    email?: string;
    whatsapp?: string;
    tipoNegocio?: string;
  };
  sistemaBaseId: string;
  modulosIds: string[];
  planSoporteId: string;
  formaPagoId: string;
  serviciosIds: string[];
  mesesHosting?: number;
  modulosDescuento?: Record<string, number>;
  serviciosDescuento?: Record<string, number>;
  descuentoPorcentajeOverride?: number;
};

function planFinanciamientoDesglose(
  formaPagoId: string,
  total: number
): { concepto: string; monto: number }[] {
  const round = (n: number) => Math.round(n);
  switch (formaPagoId) {
    case 'contado':
      return [{ concepto: 'Pago único al iniciar', monto: total }];
    case 'financiado_sin_interes': {
      const inicial = round(total * 0.4);
      const mitad = round(total * 0.3);
      const entregar = total - inicial - mitad;
      return [
        { concepto: 'Al iniciar (40%)', monto: inicial },
        { concepto: 'A mitad de proyecto (30%)', monto: mitad },
        { concepto: 'Al entregar (30%)', monto: entregar },
      ];
    }
    case 'financiado_con_soporte': {
      const inicial = round(total * 0.3);
      const resto = total - inicial;
      const cuota = round(resto / 6);
      const cuotas = Array.from({ length: 6 }, (_, i) =>
        i < 5 ? cuota : resto - cuota * 5
      );
      return [
        { concepto: 'Al iniciar (30%)', monto: inicial },
        ...cuotas.map((m, i) => ({ concepto: `Cuota ${i + 1}/6`, monto: m })),
      ];
    }
    default:
      return [];
  }
}

export async function renderPropuestaPdf(
  body: PropuestaPayload,
  options: { numero: string; fecha: string }
): Promise<Buffer> {
  const cliente = body.cliente ?? {};
  const sistema = SISTEMAS_BASE.find((s) => s.id === body.sistemaBaseId);
  const formaPago = FORMAS_PAGO.find((f) => f.id === body.formaPagoId);
  const planSoporte = PLANES_SOPORTE.find((p) => p.id === body.planSoporteId);

  if (!sistema || !formaPago) {
    throw new Error('Sistema base o forma de pago no válidos');
  }

  const totals = calcularCotizacion({
    sistema,
    modulosIds: body.modulosIds ?? [],
    formaPago,
    serviciosIds: body.serviciosIds ?? [],
    mesesHosting: body.serviciosIds?.includes('hosting') ? body.mesesHosting ?? 12 : undefined,
    modulosDescuento: body.modulosDescuento,
    serviciosDescuento: body.serviciosDescuento,
    descuentoPorcentajeOverride: body.descuentoPorcentajeOverride,
  });

  const tipoNegocioLabel =
    body.cliente?.tipoNegocio && TIPOS_NEGOCIO.find((t) => t.id === body.cliente!.tipoNegocio)?.nombre;

  let avatarBase64: string | undefined;
  try {
    const avatarPath = path.join(process.cwd(), 'public', BRAND.avatar.replace(/^\//, ''));
    const avatarBuffer = await readFile(avatarPath);
    avatarBase64 = `data:image/jpeg;base64,${avatarBuffer.toString('base64')}`;
  } catch {
    // Sin avatar si el archivo no existe
  }

  const pdfProps = {
    numeroCotizacion: options.numero,
    fecha: options.fecha,
    cliente: {
      nombreNegocio: cliente.nombreNegocio || 'Cliente',
      contacto: cliente.contacto || '',
      email: cliente.email || '',
      whatsapp: cliente.whatsapp || '',
      tipoNegocio: tipoNegocioLabel || cliente.tipoNegocio || '',
    },
    sistema: {
      nombre: sistema.nombre,
      tiempoSemanas: sistema.tiempoSemanas,
      incluye: sistema.incluye,
      precioDesde: sistema.precioDesde,
    },
    desgloseModulos: totals.desgloseModulos.map((m) => ({
      nombre: m.nombre,
      precio: m.precio,
      precioFinal: m.precioFinal,
      descuentoPorcentaje: m.descuentoPorcentaje,
      precioDesde: m.precioDesde,
    })),
    desgloseServicios: totals.desgloseServicios.map((s) => ({
      nombre: s.nombre,
      precio: s.precio,
      precioFinal: s.precioFinal,
      descuentoPorcentaje: s.descuentoPorcentaje,
      label: s.label,
      precioDesde: s.precioDesde,
    })),
    formaPago: { nombre: formaPago.nombre, descripcion: formaPago.descripcion },
    planFinanciamientoDesglose: planFinanciamientoDesglose(body.formaPagoId, totals.total),
    subtotalSistema: totals.subtotalSistema,
    subtotal: totals.subtotal,
    descuento: totals.descuento,
    descuentoPorcentaje: totals.descuentoPorcentaje,
    recargo: totals.recargo,
    total: totals.total,
    planSoporte:
      planSoporte && planSoporte.precioMensual > 0
        ? {
            nombre: planSoporte.nombre,
            precioMensual: planSoporte.precioMensual,
            incluye: planSoporte.incluye,
          }
        : undefined,
    marca: {
      name: BRAND.name,
      username: BRAND.username,
      location: BRAND.location,
      whatsapp: BRAND.whatsapp,
      email: BRAND.email,
    },
    avatarBase64,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- React/ReactPDF types are stricter than ReactLike/PDFLike; runtime is correct
  const docEl = buildCotizacionPDFElement(React as any, ReactPDF as any, pdfProps);
  const { renderToBuffer } = ReactPDF;
  return Buffer.from(await renderToBuffer(docEl as Parameters<typeof renderToBuffer>[0]));
}
