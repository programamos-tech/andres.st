import { NextResponse } from 'next/server';
import { renderTarjetaPdf } from '@/lib/tarjeta-render-pdf';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const buffer = await renderTarjetaPdf();
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="andrew-russ-tarjeta.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[tarjeta/pdf]', error);
    return NextResponse.json({ error: 'No se pudo generar el PDF' }, { status: 500 });
  }
}
