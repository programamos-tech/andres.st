'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BRAND } from '@/lib/constants';
import { BackstageGuard } from '@/components/auth/BackstageGuard';

interface ProyectoDetalle {
  id: string;
  nombre_proyecto: string;
  nombre_cliente: string;
  url_dominio: string;
  status_servidor: string;
  last_activity_at: string;
  actividad_ultima_hora: number;
  usuarios_activos: number;
  errores_ultima_hora: number;
  top_modulos: { modulo: string; count: number }[];
  ultimo_error: { error_mensaje: string; timestamp: string } | null;
  actividades_recientes: {
    id: string;
    usuario_nombre: string;
    modulo_visitado: string;
    accion_realizada: string;
    es_error: boolean;
    timestamp: string;
  }[];
}

// Mock data
const MOCK_PROYECTOS: Record<string, ProyectoDetalle> = {
  '1': {
    id: '1',
    nombre_proyecto: 'Sistema POS ZonaT',
    nombre_cliente: 'ZonaT',
    url_dominio: 'https://zonat.vercel.app',
    status_servidor: 'online',
    last_activity_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    actividad_ultima_hora: 47,
    usuarios_activos: 5,
    errores_ultima_hora: 0,
    top_modulos: [
      { modulo: 'Ventas', count: 28 },
      { modulo: 'Inventario', count: 12 },
      { modulo: 'Reportes', count: 7 }
    ],
    ultimo_error: null,
    actividades_recientes: [
      { id: '1', usuario_nombre: 'María García', modulo_visitado: 'Ventas', accion_realizada: 'Nueva venta #245', es_error: false, timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString() },
      { id: '2', usuario_nombre: 'Carlos López', modulo_visitado: 'Inventario', accion_realizada: 'Ajuste de stock', es_error: false, timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
      { id: '3', usuario_nombre: 'María García', modulo_visitado: 'Ventas', accion_realizada: 'Nueva venta #244', es_error: false, timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
      { id: '4', usuario_nombre: 'Ana Pérez', modulo_visitado: 'Clientes', accion_realizada: 'Cliente registrado', es_error: false, timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString() }
    ]
  },
  '2': {
    id: '2',
    nombre_proyecto: 'ERP Aleya',
    nombre_cliente: 'Aleya',
    url_dominio: 'https://aleya.vercel.app',
    status_servidor: 'online',
    last_activity_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    actividad_ultima_hora: 89,
    usuarios_activos: 12,
    errores_ultima_hora: 2,
    top_modulos: [
      { modulo: 'Facturación', count: 45 },
      { modulo: 'Contabilidad', count: 28 },
      { modulo: 'Nómina', count: 16 }
    ],
    ultimo_error: { error_mensaje: 'Error al generar reporte PDF - timeout', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    actividades_recientes: [
      { id: '1', usuario_nombre: 'Pedro Ruiz', modulo_visitado: 'Facturación', accion_realizada: 'Factura #1024 generada', es_error: false, timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
      { id: '2', usuario_nombre: 'Laura Sánchez', modulo_visitado: 'Reportes', accion_realizada: 'Error al generar PDF', es_error: true, timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
      { id: '3', usuario_nombre: 'Pedro Ruiz', modulo_visitado: 'Contabilidad', accion_realizada: 'Asiento contable', es_error: false, timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() }
    ]
  }
};

// Iconos
const IconBack = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconExternal = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export default function ProyectoDetallePage() {
  const params = useParams();
  const proyectoId = params.id as string;
  const [proyecto, setProyecto] = useState<ProyectoDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga (en producción vendría de Supabase)
    setTimeout(() => {
      setProyecto(MOCK_PROYECTOS[proyectoId] || MOCK_PROYECTOS['1']);
      setLoading(false);
    }, 300);
  }, [proyectoId]);

  if (loading) {
    return (
      <BackstageGuard>
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
          <div className="text-[var(--text-muted)]">Cargando...</div>
        </div>
      </BackstageGuard>
    );
  }

  if (!proyecto) {
    return (
      <BackstageGuard>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)]">
          <h1 className="text-xl font-semibold text-[var(--text)] mb-2">Proyecto no encontrado</h1>
          <Link href="/backstage" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)]">
            Volver al Backstage
          </Link>
        </div>
      </BackstageGuard>
    );
  }

  const statusColor = proyecto.errores_ultima_hora > 0 ? 'bg-red-500' : 'bg-emerald-500';

  return (
    <BackstageGuard>
      <div className="min-h-screen bg-[var(--bg)]">
        {/* Nav */}
        <nav className="px-6 py-4 border-b border-[var(--border)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/backstage" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                <IconBack />
              </Link>
              <span className="font-semibold text-[var(--text)]">{BRAND.username}</span>
            </div>
            <span className="text-sm text-[var(--text-muted)]">Backstage / Proyecto</span>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-6 py-8">
          {/* Header del proyecto */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-xl font-semibold">
                {proyecto.nombre_proyecto.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[var(--text)]">{proyecto.nombre_proyecto}</h1>
                  <span className={`w-3 h-3 rounded-full ${statusColor}`}></span>
                </div>
                <p className="text-[var(--text-muted)]">{proyecto.nombre_cliente}</p>
              </div>
            </div>
            <a 
              href={proyecto.url_dominio} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--text-muted)] transition-colors"
            >
              <span>Visitar</span>
              <IconExternal />
            </a>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <p className="text-2xl font-bold text-[var(--text)]">{proyecto.actividad_ultima_hora}</p>
              <p className="text-sm text-[var(--text-muted)]">Eventos (1h)</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <p className="text-2xl font-bold text-[var(--text)]">{proyecto.usuarios_activos}</p>
              <p className="text-sm text-[var(--text-muted)]">Usuarios activos</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <p className={`text-2xl font-bold ${proyecto.errores_ultima_hora > 0 ? 'text-red-500' : 'text-[var(--text)]'}`}>
                {proyecto.errores_ultima_hora}
              </p>
              <p className="text-sm text-[var(--text-muted)]">Errores (1h)</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <p className="text-sm font-medium text-[var(--text)]">
                {proyecto.last_activity_at 
                  ? formatDistanceToNow(new Date(proyecto.last_activity_at), { addSuffix: true, locale: es })
                  : 'Sin actividad'}
              </p>
              <p className="text-sm text-[var(--text-muted)]">Última actividad</p>
            </div>
          </div>

          {/* Error activo */}
          {proyecto.ultimo_error && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 mb-8">
              <p className="text-sm font-medium text-red-500 mb-1">Último error</p>
              <p className="text-sm text-[var(--text)]">{proyecto.ultimo_error.error_mensaje}</p>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                {formatDistanceToNow(new Date(proyecto.ultimo_error.timestamp), { addSuffix: true, locale: es })}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Módulos más usados */}
            <div className="lg:col-span-1">
              <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Módulos más usados</h2>
              <div className="space-y-2">
                {proyecto.top_modulos.map((m, i) => (
                  <div key={m.modulo} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-xs text-[var(--text-muted)]">
                        {i + 1}
                      </span>
                      <span className="text-sm text-[var(--text)]">{m.modulo}</span>
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">{m.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="lg:col-span-2">
              <h2 className="text-sm font-medium text-[var(--text-muted)] mb-4">Actividad reciente</h2>
              <div className="space-y-2">
                {proyecto.actividades_recientes.map((act) => (
                  <div 
                    key={act.id} 
                    className={`p-3 rounded-lg border ${act.es_error ? 'border-red-500/20 bg-red-500/5' : 'border-[var(--border)]'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm ${act.es_error ? 'text-red-500' : 'text-[var(--text)]'}`}>
                          {act.accion_realizada}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {act.usuario_nombre} · {act.modulo_visitado}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">
                        {formatDistanceToNow(new Date(act.timestamp), { addSuffix: true, locale: es })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </BackstageGuard>
  );
}
