'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BackstageGuard } from '@/components/auth/BackstageGuard';
import {
  SISTEMAS_BASE,
  MODULOS,
  PLANES_SOPORTE,
  FORMAS_PAGO,
  SERVICIOS_ADICIONALES,
  TIPOS_NEGOCIO,
  calcularCotizacion,
  formatPeso,
  type SistemaBaseId,
  type FormaPagoId,
  type PlanSoporteId,
} from '@/lib/cotizaciones-data';

const defaultSistema: SistemaBaseId = 'profesional';
const defaultFormaPago: FormaPagoId = 'contado';
const defaultPlanSoporte: PlanSoporteId = 'profesional';

export default function NuevaPropuestaPage() {
  const router = useRouter();
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [contacto, setContacto] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tipoNegocio, setTipoNegocio] = useState('');
  const [sistemaId, setSistemaId] = useState<SistemaBaseId>(defaultSistema);
  const [modulosIds, setModulosIds] = useState<string[]>([]);
  const [planSoporteId, setPlanSoporteId] = useState<PlanSoporteId>(defaultPlanSoporte);
  const [formaPagoId, setFormaPagoId] = useState<FormaPagoId>(defaultFormaPago);
  const [serviciosIds, setServiciosIds] = useState<string[]>([]);
  const [mesesHosting, setMesesHosting] = useState(12);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descuentoMaxSugerido, setDescuentoMaxSugerido] = useState(15);
  const [descuentoAplicar, setDescuentoAplicar] = useState<number | null>(null);
  const [modulosDescuento, setModulosDescuento] = useState<Record<string, number>>({});
  const [serviciosDescuento, setServiciosDescuento] = useState<Record<string, number>>({});

  const sistema = SISTEMAS_BASE.find((s) => s.id === sistemaId)!;
  const formaPago = FORMAS_PAGO.find((f) => f.id === formaPagoId)!;
  const planSoporte = PLANES_SOPORTE.find((p) => p.id === planSoporteId)!;

  const descuentoEfectivoPct =
    descuentoAplicar !== null
      ? Math.min(Math.max(0, descuentoAplicar), descuentoMaxSugerido)
      : (formaPago.descuentoPorcentaje ?? 0);

  const totals = useMemo(
    () =>
      calcularCotizacion({
        sistema,
        modulosIds,
        formaPago,
        serviciosIds,
        mesesHosting: serviciosIds.includes('hosting') ? mesesHosting : undefined,
        modulosDescuento,
        serviciosDescuento,
        descuentoPorcentajeOverride: descuentoEfectivoPct,
      }),
    [sistema, modulosIds, formaPago, serviciosIds, mesesHosting, modulosDescuento, serviciosDescuento, descuentoEfectivoPct]
  );

  const setDescuentoModulo = (id: string, pct: number) => {
    setModulosDescuento((prev) => (pct === 0 ? (({ [id]: _, ...r }) => r)(prev) : { ...prev, [id]: Math.min(100, Math.max(0, pct)) }));
  };
  const setDescuentoServicio = (id: string, pct: number) => {
    setServiciosDescuento((prev) => (pct === 0 ? (({ [id]: _, ...r }) => r)(prev) : { ...prev, [id]: Math.min(100, Math.max(0, pct)) }));
  };
  const toggleModulo = (id: string) => {
    setModulosIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleServicio = (id: string) => {
    setServiciosIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const generarPdf = async () => {
    setError(null);
    setGenerando(true);
    try {
      const res = await fetch('/api/cotizaciones/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: {
            nombreNegocio: nombreNegocio || 'Cliente',
            contacto: contacto || '',
            email: email || '',
            whatsapp: whatsapp || '',
            tipoNegocio: tipoNegocio || '',
          },
          sistemaBaseId: sistemaId,
          modulosIds,
          planSoporteId,
          formaPagoId,
          serviciosIds,
          mesesHosting: serviciosIds.includes('hosting') ? mesesHosting : undefined,
          modulosDescuento,
          serviciosDescuento,
          descuentoPorcentajeOverride: descuentoEfectivoPct,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || res.statusText || 'Error al generar PDF');
      }
      const contentType = res.headers.get('Content-Type') || '';
      if (contentType.includes('application/pdf')) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        URL.revokeObjectURL(url);
        router.push('/backstage/cotizaciones');
      } else {
        const data = await res.json();
        if (data.pdfUrl) window.open(data.pdfUrl, '_blank');
        router.push('/backstage/cotizaciones');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setGenerando(false);
    }
  };

  return (
    <BackstageGuard>
      <div className="flex flex-col flex-1">
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                href="/backstage/cotizaciones"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al listado
              </Link>
              <h1 className="hero-heading text-2xl sm:text-3xl text-[var(--brand-carbon)] tracking-tight">
                Nueva propuesta comercial
              </h1>
              <p className="text-[var(--brand-marron)] text-sm mt-1">
                Completá los datos del cliente y armá la propuesta. Al final generá el PDF con tu marca.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">1. Información del cliente</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Nombre del negocio</label>
                    <input
                      type="text"
                      value={nombreNegocio}
                      onChange={(e) => setNombreNegocio(e.target.value)}
                      placeholder="Ej. Ferretería El Tornillo"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Persona de contacto</label>
                    <input type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} placeholder="Juan Pérez" className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contacto@empresa.com" className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">WhatsApp</label>
                    <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="300 123 4567" className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Tipo de negocio</label>
                    <select value={tipoNegocio} onChange={(e) => setTipoNegocio(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">
                      <option value="">Seleccionar</option>
                      {TIPOS_NEGOCIO.map((t) => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">2. Sistema base</h2>
                <div className="space-y-3">
                  {SISTEMAS_BASE.map((s) => (
                    <label key={s.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${sistemaId === s.id ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] hover:border-[var(--text-muted)]/50'}`}>
                      <input type="radio" name="sistema" value={s.id} checked={sistemaId === s.id} onChange={() => setSistemaId(s.id as SistemaBaseId)} className="mt-1 text-[var(--accent)]" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-[var(--text)]">{s.nombre}{s.destacado && <span className="ml-1.5 text-[var(--accent)] text-xs">⭐ Recomendado</span>}</span>
                        <p className="text-sm text-[var(--text-muted)] mt-0.5">{s.precioDesde ? `Desde ${formatPeso(s.precio)}` : formatPeso(s.precio)} · {s.tiempoSemanas}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{s.para}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">3. Módulos adicionales</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MODULOS.map((m) => (
                    <label key={m.id} className="flex items-start gap-2 p-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--text-muted)]/50 cursor-pointer">
                      <input type="checkbox" checked={modulosIds.includes(m.id)} onChange={() => toggleModulo(m.id)} className="mt-0.5 text-[var(--accent)]" />
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-[var(--text)]">{m.nombre}</span>
                        <span className="text-sm text-[var(--text-muted)] ml-1">{m.precioDesde ? `Desde ${formatPeso(m.precio)}` : formatPeso(m.precio)}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-1">4. Planes de Acompañamiento Mensual</h2>
                <p className="text-xs text-[var(--text-muted)] mb-4">Todo incluido: Servidores, estabilidad y evolución.</p>
                <div className="space-y-2">
                  {PLANES_SOPORTE.map((p) => (
                    <label key={p.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${planSoporteId === p.id ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)]'}`}>
                      <input type="radio" name="soporte" value={p.id} checked={planSoporteId === p.id} onChange={() => setPlanSoporteId(p.id as PlanSoporteId)} className="mt-1 text-[var(--accent)] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-[var(--text)]">{p.nombre}{p.precioMensual > 0 && <span className="text-[var(--text-muted)] font-normal ml-1">{formatPeso(p.precioMensual)}/mes</span>}{p.destacado && <span className="ml-1.5 text-[var(--accent)] text-xs">⭐</span>}</span>
                        {p.incluye.length > 0 && (
                          <ul className="mt-2 space-y-0.5 text-xs text-[var(--text-muted)] list-none">
                            {p.incluye.map((item, i) => (
                              <li key={i} className="flex gap-1.5"><span className="text-[var(--accent)] shrink-0">•</span><span>{item}</span></li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">5. Forma de pago</h2>
                <div className="space-y-2">
                  {FORMAS_PAGO.map((f) => (
                    <label key={f.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${formaPagoId === f.id ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)]'}`}>
                      <input type="radio" name="pago" value={f.id} checked={formaPagoId === f.id} onChange={() => setFormaPagoId(f.id as FormaPagoId)} className="text-[var(--accent)]" />
                      <div>
                        <span className="font-medium text-[var(--text)]">{f.nombre}</span>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{f.descripcion}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">6. Servicios complementarios</h2>
                <div className="space-y-2">
                  {SERVICIOS_ADICIONALES.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <label className="flex items-start gap-2 flex-1 p-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--text-muted)]/50 cursor-pointer">
                        <input type="checkbox" checked={serviciosIds.includes(s.id)} onChange={() => toggleServicio(s.id)} className="mt-0.5 text-[var(--accent)] shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium text-[var(--text)]">{s.nombre}</span>
                          <span className="text-sm text-[var(--text-muted)] ml-1">{s.precioDesde ? `Desde ${formatPeso(s.precio)}` : formatPeso(s.precio)}{s.esMensual && '/mes'}{s.esAnual && '/año'}{s.esPorHora && '/h'}</span>
                          {s.descripcion && <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.descripcion}</p>}
                        </div>
                      </label>
                      {s.id === 'hosting' && serviciosIds.includes('hosting') && (
                        <div className="flex items-center gap-1">
                          <input type="number" min={1} max={24} value={mesesHosting} onChange={(e) => setMesesHosting(Number(e.target.value) || 12)} className="w-16 px-2 py-1.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm" />
                          <span className="text-xs text-[var(--text-muted)]">meses</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 p-5 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-2">Resumen</h2>
                <p className="text-xs text-[var(--text-muted)] mb-3">Servicios elegidos (margen base)</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">{sistema.nombre}</span>
                    <span className="text-[var(--text)]">{sistema.precioDesde ? `Desde ${formatPeso(totals.subtotalSistema)}` : formatPeso(totals.subtotalSistema)}</span>
                  </div>
                  {totals.desgloseModulos.map((m) => {
                    const pct = modulosDescuento[m.id] ?? 0;
                    const selectValue = pct === 0 ? '0' : pct === 100 ? '100' : [10, 25, 50].includes(pct) ? String(pct) : 'otro';
                    return (
                      <div key={m.id} className="flex flex-col gap-1 py-1.5 border-b border-[var(--border)]/50 last:border-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[var(--text-muted)] text-sm truncate">{m.nombre}</span>
                          <span className="text-[var(--text)] text-sm font-medium shrink-0">{m.descuentoPorcentaje >= 100 ? 'Cortesía' : formatPeso(m.precioFinal)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select value={selectValue} onChange={(e) => { const v = e.target.value; if (v === 'otro') setDescuentoModulo(m.id, pct || 0); else setDescuentoModulo(m.id, Number(v)); }} className="text-xs rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] px-2 py-1 flex-1 min-w-0">
                            <option value="0">Pagar completo</option>
                            <option value="100">Gratis (cortesía)</option>
                            <option value="10">10% desc</option>
                            <option value="25">25% desc</option>
                            <option value="50">50% desc</option>
                            <option value="otro">Otro %</option>
                          </select>
                          {selectValue === 'otro' && <input type="number" min={0} max={100} value={pct} onChange={(e) => setDescuentoModulo(m.id, Number(e.target.value) || 0)} className="w-14 px-1.5 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-xs" placeholder="%" />}
                        </div>
                      </div>
                    );
                  })}
                  {totals.desgloseServicios.map((s) => {
                    const pct = serviciosDescuento[s.id] ?? 0;
                    const selectValue = pct === 0 ? '0' : pct === 100 ? '100' : [10, 25, 50].includes(pct) ? String(pct) : 'otro';
                    return (
                      <div key={s.id} className="flex flex-col gap-1 py-1.5 border-b border-[var(--border)]/50 last:border-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[var(--text-muted)] text-sm truncate">{s.nombre}{s.label && ` (${s.label})`}</span>
                          <span className="text-[var(--text)] text-sm font-medium shrink-0">{s.descuentoPorcentaje >= 100 ? 'Cortesía' : formatPeso(s.precioFinal)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select value={selectValue} onChange={(e) => { const v = e.target.value; if (v === 'otro') setDescuentoServicio(s.id, pct || 0); else setDescuentoServicio(s.id, Number(v)); }} className="text-xs rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] px-2 py-1 flex-1 min-w-0">
                            <option value="0">Pagar completo</option>
                            <option value="100">Gratis (cortesía)</option>
                            <option value="10">10% desc</option>
                            <option value="25">25% desc</option>
                            <option value="50">50% desc</option>
                            <option value="otro">Otro %</option>
                          </select>
                          {selectValue === 'otro' && <input type="number" min={0} max={100} value={pct} onChange={(e) => setDescuentoServicio(s.id, Number(e.target.value) || 0)} className="w-14 px-1.5 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-xs" placeholder="%" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Subtotal</span>
                    <span className="text-[var(--text)]">{formatPeso(totals.subtotal)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <label className="flex items-center gap-1">
                      <span className="text-[var(--text-muted)]">Descuento (%):</span>
                      <input type="number" min={0} max={100} step={1} value={descuentoAplicar ?? formaPago.descuentoPorcentaje ?? 0} onChange={(e) => setDescuentoAplicar(e.target.value ? Number(e.target.value) : null)} className="w-12 px-1.5 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" />
                    </label>
                    <label className="flex items-center gap-1">
                      <span className="text-[var(--text-muted)]">Máx. sugerido (%):</span>
                      <input type="number" min={0} max={100} step={1} value={descuentoMaxSugerido} onChange={(e) => setDescuentoMaxSugerido(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} className="w-12 px-1.5 py-1 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" title="No superar este % para no venderse por debajo del margen" />
                    </label>
                  </div>
                  {totals.descuento > 0 && (
                    <div className="flex justify-between text-sm text-[var(--status-ok)]">
                      <span>Descuento ({totals.descuentoPorcentaje}%)</span>
                      <span>-{formatPeso(totals.descuento)}</span>
                    </div>
                  )}
                  {totals.recargo > 0 && (
                    <div className="flex justify-between text-sm text-[var(--text-muted)]">
                      <span>Recargo</span>
                      <span>+{formatPeso(totals.recargo)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-[var(--text)] pt-2">
                    <span>Total</span>
                    <span>{formatPeso(totals.total)}</span>
                  </div>
                </div>
                {planSoporte.precioMensual > 0 && (
                  <p className="mt-3 text-xs text-[var(--text-muted)]">
                    + Acompañamiento {planSoporte.nombre}: {formatPeso(planSoporte.precioMensual)}/mes<br />
                    <span className="text-[var(--status-ok)]">(1er mes gratis)</span>
                  </p>
                )}
                {error && <p className="mt-3 text-sm text-[var(--status-error)]" role="alert">{error}</p>}
                <button type="button" onClick={generarPdf} disabled={generando} className="mt-4 w-full py-3 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium disabled:opacity-60 transition-colors">
                  {generando ? 'Generando PDF…' : 'Generar PDF'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BackstageGuard>
  );
}
