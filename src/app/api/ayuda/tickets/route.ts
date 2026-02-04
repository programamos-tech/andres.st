import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const ESTADO_LABEL: Record<string, string> = {
  creado: 'Creado',
  replicando: 'Replicando',
  ajustando: 'Ajustando',
  probando: 'Probando',
  desplegando: 'Desplegando',
  resuelto: 'Resuelto',
};

/**
 * GET /api/ayuda/tickets?email=xxx
 * Devuelve los tickets asociados a ese correo (creado_por_email), ordenados por fecha descendente.
 * Útil para mostrar "Tenés este ticket en el estado correspondiente" al identificar al usuario.
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    const trimmed = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!trimmed) {
      return NextResponse.json({ tickets: [] }, { status: 200 });
    }

    function inicialesProyecto(nombre: string | null | undefined): string {
      const n = (nombre || '').trim();
      if (!n) return 'S';
      const palabras = n.split(/\s+/).filter(Boolean);
      if (palabras.length >= 2) {
        return palabras
          .slice(0, 3)
          .map((p) => (p[0] || '').toUpperCase())
          .join('')
          .slice(0, 3);
      }
      return (n.slice(0, 2).toUpperCase() || 'S');
    }

    const supabase = getSupabase();
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select('id, numero, proyecto_nombre, titulo, descripcion, estado, created_at')
      .ilike('creado_por_email', trimmed)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('[ayuda/tickets GET]', error);
      return NextResponse.json({ tickets: [] }, { status: 200 });
    }

    const list = (tickets || []).map((t) => {
      const tituloRaw = t.titulo?.trim();
      const titulo =
        tituloRaw ||
        (typeof t.descripcion === 'string' && t.descripcion.trim()
          ? t.descripcion.trim().split(/\r?\n/)[0].slice(0, 80).trim() || 'Soporte'
          : 'Soporte');
      const numero = typeof t.numero === 'number' ? t.numero : 0;
      const shortNum = numero % 100;
      const supportId = `${inicialesProyecto(t.proyecto_nombre)}-${String(shortNum).padStart(2, '0')}`;
      return {
        id: t.id,
        supportId,
        titulo,
        estado: t.estado,
        estadoLabel: ESTADO_LABEL[t.estado as string] || t.estado,
        created_at: t.created_at,
      };
    });

    return NextResponse.json({ tickets: list });
  } catch (e) {
    console.error('[ayuda/tickets GET]', e);
    return NextResponse.json({ tickets: [] }, { status: 200 });
  }
}
