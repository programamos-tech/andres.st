import { NextRequest, NextResponse } from 'next/server';
import {
  SISTEMAS_BASE,
  FORMAS_PAGO,
  TIPOS_NEGOCIO,
  calcularCotizacion,
} from '@/lib/cotizaciones-data';
import { createServerClient } from '@/lib/supabase/client';
import { renderPropuestaPdf, type PropuestaPayload } from '@/lib/cotizaciones-render-pdf';

export const runtime = 'nodejs';

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
    let body: PropuestaPayload;
    try {
      body = (await request.json()) as PropuestaPayload;
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo de la petición inválido (JSON)' },
        { status: 400 }
      );
    }
    const cliente = body.cliente ?? {};
    const sistema = SISTEMAS_BASE.find((s) => s.id === body.sistemaBaseId);
    const formaPago = FORMAS_PAGO.find((f) => f.id === body.formaPagoId);
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
      modulosDescuento: body.modulosDescuento,
      serviciosDescuento: body.serviciosDescuento,
      descuentoPorcentajeOverride: body.descuentoPorcentajeOverride,
    });
    const tipoNegocioLabel =
      body.cliente?.tipoNegocio && TIPOS_NEGOCIO.find((t) => t.id === body.cliente!.tipoNegocio)?.nombre;

    const numero = numeroCotizacion();
    const fecha = fechaFormato();
    const buffer = await renderPropuestaPdf(body, { numero, fecha });

    const clienteNombre = cliente.nombreNegocio || 'Cliente';
    const supabase = createServerClient();
    const { data: propuesta, error: insertError } = await supabase
      .from('propuestas')
      .insert({
        numero_cotizacion: numero,
        cliente_nombre: clienteNombre,
        cliente_contacto: cliente.contacto || null,
        cliente_email: cliente.email || null,
        cliente_whatsapp: cliente.whatsapp || null,
        cliente_tipo_negocio: tipoNegocioLabel || cliente.tipoNegocio || null,
        sistema_nombre: sistema.nombre,
        total_cop: totals.total,
        estado: 'enviada',
        payload: {
          cliente: body.cliente,
          sistemaBaseId: body.sistemaBaseId,
          modulosIds: body.modulosIds ?? [],
          planSoporteId: body.planSoporteId,
          formaPagoId: body.formaPagoId,
          serviciosIds: body.serviciosIds ?? [],
          mesesHosting: body.serviciosIds?.includes('hosting') ? body.mesesHosting ?? 12 : undefined,
          modulosDescuento: body.modulosDescuento,
          serviciosDescuento: body.serviciosDescuento,
          descuentoPorcentajeOverride: body.descuentoPorcentajeOverride,
        },
      })
      .select('id')
      .single();

    const filename = `${numero}.pdf`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-Cotizacion-Numero': numero,
    };
    if (!insertError && propuesta?.id) headers['X-Propuesta-Id'] = propuesta.id;

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers,
    });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error('Error generando cotización PDF:', err.message, err.stack);
    return NextResponse.json(
      {
        error: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
      { status: 500 }
    );
  }
}
