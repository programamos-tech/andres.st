import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';
import { renderPropuestaPdf, type PropuestaPayload } from '@/lib/cotizaciones-render-pdf';

export const runtime = 'nodejs';

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/** GET: descarga el PDF de una propuesta guardada por id */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Id de propuesta requerido' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data: propuesta, error } = await supabase
      .from('propuestas')
      .select('numero_cotizacion, payload, created_at')
      .eq('id', id)
      .single();

    if (error || !propuesta) {
      return NextResponse.json(
        { error: error?.message ?? 'Propuesta no encontrada' },
        { status: 404 }
      );
    }

    const payload = propuesta.payload as PropuestaPayload;
    const fecha = formatFecha(propuesta.created_at);
    const buffer = await renderPropuestaPdf(payload, {
      numero: propuesta.numero_cotizacion,
      fecha,
    });

    const filename = `${propuesta.numero_cotizacion}.pdf`;
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error('Error generando PDF propuesta:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
