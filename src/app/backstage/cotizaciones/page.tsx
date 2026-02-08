'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BackstageGuard } from '@/components/auth/BackstageGuard';
import type { PropuestaEstado } from '@/types/database';
import { formatPeso } from '@/lib/cotizaciones-data';

export default function CotizacionesPage() {
  const [propuestas, setPropuestas] = useState<Array<{
    id: string;
    numero_cotizacion: string;
    cliente_nombre: string;
    cliente_contacto: string | null;
    cliente_email: string | null;
    cliente_whatsapp: string | null;
    sistema_nombre: string;
    total_cop: number;
    estado: PropuestaEstado;
    created_at: string;
  }>>([]);
  const [loadingPropuestas, setLoadingPropuestas] = useState(true);

  const fetchPropuestas = useCallback(async () => {
    try {
      const res = await fetch('/api/cotizaciones');
      if (res.ok) setPropuestas(await res.json());
    } catch {
      setPropuestas([]);
    } finally {
      setLoadingPropuestas(false);
    }
  }, []);

  useEffect(() => {
    fetchPropuestas();
  }, [fetchPropuestas]);

  return (
    <BackstageGuard>
      <div className="flex flex-col flex-1">
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="hero-heading text-2xl sm:text-3xl text-[var(--brand-carbon)] tracking-tight">
                Propuestas comerciales
              </h1>
              <p className="text-[var(--brand-marron)] text-sm mt-1">
                Control de propuestas y generación de PDF con tu marca.
              </p>
            </div>
            <Link
              href="/backstage/cotizaciones/nueva"
              className="shrink-0 px-4 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors text-center"
            >
              Nueva propuesta
            </Link>
          </header>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden shadow-[var(--shadow-soft)]">
            <div className="px-4 sm:px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--text)]">Listado de propuestas</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Descargá de nuevo el PDF o actualizá el estado.</p>
            </div>
            {loadingPropuestas ? (
              <div className="px-4 sm:px-6 py-12 text-center text-[var(--text-muted)] text-sm">Cargando…</div>
            ) : propuestas.length === 0 ? (
              <div className="px-4 sm:px-6 py-12 text-center text-[var(--text-muted)] text-sm">
                Aún no hay propuestas. Creá una con el botón de arriba.
              </div>
            ) : (
              <>
                {/* Mobile: cards */}
                <div className="sm:hidden divide-y divide-[var(--border)]/60">
                  {propuestas.map((p) => (
                    <div key={p.id} className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="text-[var(--text)] font-medium truncate">{p.cliente_nombre}</p>
                          <p className="text-[var(--text-muted)] font-mono text-xs">{p.numero_cotizacion}</p>
                        </div>
                        <span className="text-[var(--text)] font-semibold shrink-0">{formatPeso(p.total_cop)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={p.estado}
                          onChange={async (e) => {
                            const nuevo = e.target.value as PropuestaEstado;
                            const res = await fetch(`/api/cotizaciones/${p.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ estado: nuevo }),
                            });
                            if (res.ok) fetchPropuestas();
                          }}
                          className="text-xs rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] px-2 py-1.5 min-w-0 max-w-[120px]"
                        >
                          <option value="enviada">Enviada</option>
                          <option value="vista">Vista</option>
                          <option value="aceptada">Aceptada</option>
                          <option value="rechazada">Rechazada</option>
                          <option value="expirada">Expirada</option>
                        </select>
                        <a
                          href={`/api/cotizaciones/${p.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDF
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Tablet/desktop: tabla */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/50">
                        <th className="text-left py-3 px-4 font-semibold text-[var(--text)]">Número</th>
                        <th className="text-left py-3 px-4 font-semibold text-[var(--text)]">Cliente</th>
                        <th className="text-left py-3 px-4 font-semibold text-[var(--text)] hidden md:table-cell">Contacto</th>
                        <th className="text-left py-3 px-4 font-semibold text-[var(--text)] hidden lg:table-cell">Sistema</th>
                        <th className="text-right py-3 px-4 font-semibold text-[var(--text)]">Total</th>
                        <th className="text-left py-3 px-4 font-semibold text-[var(--text)]">Estado</th>
                        <th className="text-left py-3 px-4 font-semibold text-[var(--text)] hidden lg:table-cell">Fecha</th>
                        <th className="text-right py-3 px-4 font-semibold text-[var(--text)]">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propuestas.map((p) => (
                        <tr key={p.id} className="border-b border-[var(--border)]/60 hover:bg-[var(--bg-secondary)]/30 transition-colors">
                          <td className="py-3 px-4 text-[var(--text)] font-mono text-xs">{p.numero_cotizacion}</td>
                          <td className="py-3 px-4 text-[var(--text)] font-medium">{p.cliente_nombre}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)] hidden md:table-cell">{p.cliente_contacto || p.cliente_email || '—'}</td>
                          <td className="py-3 px-4 text-[var(--text-muted)] hidden lg:table-cell">{p.sistema_nombre}</td>
                          <td className="py-3 px-4 text-right text-[var(--text)] font-medium">{formatPeso(p.total_cop)}</td>
                          <td className="py-3 px-4">
                            <select
                              value={p.estado}
                              onChange={async (e) => {
                                const nuevo = e.target.value as PropuestaEstado;
                                const res = await fetch(`/api/cotizaciones/${p.id}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ estado: nuevo }),
                                });
                                if (res.ok) fetchPropuestas();
                              }}
                              className="text-xs rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] px-2 py-1 min-w-0 max-w-[120px]"
                            >
                              <option value="enviada">Enviada</option>
                              <option value="vista">Vista</option>
                              <option value="aceptada">Aceptada</option>
                              <option value="rechazada">Rechazada</option>
                              <option value="expirada">Expirada</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-[var(--text-muted)] text-xs hidden lg:table-cell">
                            {new Date(p.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <a
                              href={`/api/cotizaciones/${p.id}/pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-secondary)] text-[var(--text)] text-xs font-medium transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Descargar PDF
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </BackstageGuard>
  );
}
