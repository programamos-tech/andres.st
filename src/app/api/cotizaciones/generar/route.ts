import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { CotizacionPDF } from '@/components/cotizaciones/CotizacionPDF';
import {
  SISTEMAS_BASE,
  PLANES_SOPORTE,
  FORMAS_PAGO,
  TIPOS_NEGOCIO,
  calcularCotizacion,
} from '@/lib/cotizaciones-data';
import { BRAND } from '@/lib/constants';

type Body = {
  cliente: {
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
};

function numeroCotizacion(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `COT-${y}-${m}${d}-${h}${min}`;
}

function fechaFormato(): string {
  return new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Body;
    const cliente = body.cliente ?? {};
    const sistema = SISTEMAS_BASE.find((s) => s.id === body.sistemaBaseId);
    const formaPago = FORMAS_PAGO.find((f) => f.id === body.formaPagoId);
    const planSoporte = PLANES_SOPORTE.find((p) => p.id === body.planSoporteId);

    if (!sistema || !formaPago) {
      return NextResponse.json(
        { error: 'Sistema base o forma de pago no válidos' },
        { status: 400 }
      );
    }

    const totals = calcularCotizacion({
      sistema,
      modulosIds: body.modulosIds ?? [],
      formaPago,
      serviciosIds: body.serviciosIds ?? [],
      mesesHosting: body.serviciosIds?.includes('hosting') ? body.mesesHosting ?? 12 : undefined,
    });

    const tipoNegocioLabel =
      body.cliente?.tipoNegocio && TIPOS_NEGOCIO.find((t) => t.id === body.cliente!.tipoNegocio)?.nombre;

    const numero = numeroCotizacion();
    const fecha = fechaFormato();

    let avatarBase64: string | undefined;
    try {
      const avatarPath = path.join(process.cwd(), 'public', BRAND.avatar.replace(/^\//, ''));
      const avatarBuffer = await readFile(avatarPath);
      avatarBase64 = `data:image/jpeg;base64,${avatarBuffer.toString('base64')}`;
    } catch {
      // Sin avatar si el archivo no existe
    }

    const doc = React.createElement(CotizacionPDF, {
        numeroCotizacion: numero,
        fecha,
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
        },
        desgloseModulos: totals.desgloseModulos.map((m) => ({ nombre: m.nombre, precio: m.precio })),
        desgloseServicios: totals.desgloseServicios.map((s) => ({
          nombre: s.nombre,
          precio: s.precio,
          label: s.label,
        })),
        formaPago: { nombre: formaPago.nombre },
        subtotalSistema: totals.subtotalSistema,
        subtotal: totals.subtotal,
        descuento: totals.descuento,
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
      });
    // renderToBuffer expects Document root; CotizacionPDF returns <Document>...</Document>
    const buffer = await renderToBuffer(doc as Parameters<typeof renderToBuffer>[0]);

    const filename = `${numero}.pdf`;
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Cotizacion-Numero': numero,
      },
    });
  } catch (e) {
    console.error('Error generando cotización PDF:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error al generar la cotización' },
      { status: 500 }
    );
  }
}
