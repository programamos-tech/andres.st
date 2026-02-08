import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';
import type { PropuestaEstado } from '@/types/database';

export const runtime = 'nodejs';

/** PATCH: actualizar estado de una propuesta */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Id requerido' }, { status: 400 });
    }
    const body = await request.json().catch(() => ({}));
    const estado = body.estado as PropuestaEstado | undefined;
    const valid: PropuestaEstado[] = ['enviada', 'vista', 'aceptada', 'rechazada', 'expirada'];
    if (!estado || !valid.includes(estado)) {
      return NextResponse.json(
        { error: 'estado inválido. Use: ' + valid.join(', ') },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('propuestas')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
