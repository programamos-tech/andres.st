import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

export const runtime = 'nodejs';

/** GET: lista de propuestas comerciales (más recientes primero) */
export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('propuestas')
      .select('id, numero_cotizacion, cliente_nombre, cliente_contacto, cliente_email, cliente_whatsapp, sistema_nombre, total_cop, estado, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error listando propuestas:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data ?? []);
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error('Error listando propuestas:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
