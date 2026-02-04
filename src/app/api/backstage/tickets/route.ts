import { NextResponse } from 'next/server';
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

/** Orden de prioridad para ordenar: 1 = más urgente */
const PRIORIDAD_ORDEN: Record<string, number> = {
  urgente: 1,
  alto_espera: 2,
  alto_maromas: 3,
  medio: 4,
};

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
  return n.slice(0, 2).toUpperCase() || 'S';
}

/**
 * GET /api/backstage/tickets
 * Lista todos los tickets (creados desde Andrebot/ayuda), ordenados por llegada (más recientes primero).
 */
type TicketRow = {
  id: string;
  numero: number;
  proyecto_nombre: string | null;
  titulo: string | null;
  estado: string;
  prioridad?: string;
  creado_por_nombre: string | null;
  created_at: string;
};

export async function GET() {
  try {
    const supabase = getSupabase();
    let selectWithPrioridad = 'id, numero, proyecto_nombre, titulo, estado, prioridad, creado_por_nombre, created_at';
    let tickets: TicketRow[] | null = null;
    let error: { message?: string } | null = null;
    const r0 = await supabase
      .from('tickets')
      .select(selectWithPrioridad)
      .order('created_at', { ascending: false })
      .limit(200);
    tickets = r0.data as TicketRow[] | null;
    error = r0.error;

    if (error && error.message?.includes('prioridad')) {
      const r = await supabase.from('tickets').select('id, numero, proyecto_nombre, titulo, estado, creado_por_nombre, created_at').order('created_at', { ascending: false }).limit(200);
      error = r.error;
      tickets = r.data as TicketRow[] | null;
    }

    if (error) {
      console.error('[backstage/tickets GET]', error);
      return NextResponse.json({ tickets: [] }, { status: 200 });
    }

    const rawList: TicketRow[] = tickets || [];
    const sorted = [...rawList].sort((a, b) => {
      const ordenA = PRIORIDAD_ORDEN[a.prioridad || 'medio'] ?? 4;
      const ordenB = PRIORIDAD_ORDEN[b.prioridad || 'medio'] ?? 4;
      if (ordenA !== ordenB) return ordenA - ordenB;
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    const list = sorted.map((t) => {
      const numero = typeof t.numero === 'number' ? t.numero : 0;
      const supportId = `${inicialesProyecto(t.proyecto_nombre)}-${String(numero % 100).padStart(2, '0')}`;
      return {
        id: t.id,
        numero: t.numero,
        supportId,
        titulo: t.titulo?.trim() || 'Soporte',
        proyecto_nombre: t.proyecto_nombre || 'Por identificar',
        estado: t.estado,
        estadoLabel: ESTADO_LABEL[t.estado as string] || t.estado,
        prioridad: (t.prioridad as string) || 'medio',
        creado_por_nombre: (t.creado_por_nombre as string)?.trim() || '—',
        created_at: t.created_at,
      };
    });

    return NextResponse.json({ tickets: list });
  } catch (e) {
    console.error('[backstage/tickets GET]', e);
    return NextResponse.json({ tickets: [] }, { status: 200 });
  }
}
