'use client';

import { useState, useMemo } from 'react';
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

export default function CotizacionesPage() {
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

  const sistema = SISTEMAS_BASE.find((s) => s.id === sistemaId)!;
  const formaPago = FORMAS_PAGO.find((f) => f.id === formaPagoId)!;
  const planSoporte = PLANES_SOPORTE.find((p) => p.id === planSoporteId)!;

  const totals = useMemo(
    () =>
      calcularCotizacion({
        sistema,
        modulosIds,
        formaPago,
        serviciosIds,
        mesesHosting: serviciosIds.includes('hosting') ? mesesHosting : undefined,
      }),
    [sistema, modulosIds, formaPago, serviciosIds, mesesHosting]
  );

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
      } else {
        const data = await res.json();
        if (data.pdfUrl) window.open(data.pdfUrl, '_blank');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar la cotización');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <BackstageGuard>
      <div className="flex flex-col flex-1">
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto w-full">
          <header className="mb-8">
            <h1 className="hero-heading text-2xl sm:text-3xl text-[var(--brand-carbon)] tracking-tight">
              Cotizaciones
            </h1>
            <p className="text-[var(--brand-marron)] text-sm mt-1">
              Completa los datos del cliente y arma la cotización. Al final genera el PDF con tu marca.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Cliente */}
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
                    <input
                      type="text"
                      value={contacto}
                      onChange={(e) => setContacto(e.target.value)}
                      placeholder="Juan Pérez"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contacto@empresa.com"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="300 123 4567"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Tipo de negocio</label>
                    <select
                      value={tipoNegocio}
                      onChange={(e) => setTipoNegocio(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      <option value="">Seleccionar</option>
                      {TIPOS_NEGOCIO.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* 2. Sistema base */}
              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">2. Sistema base</h2>
                <div className="space-y-3">
                  {SISTEMAS_BASE.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        sistemaId === s.id
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                          : 'border-[var(--border)] hover:border-[var(--text-muted)]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="sistema"
                        value={s.id}
                        checked={sistemaId === s.id}
                        onChange={() => setSistemaId(s.id as SistemaBaseId)}
                        className="mt-1 text-[var(--accent)]"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-[var(--text)]">
                          {s.nombre}
                          {s.destacado && (
                            <span className="ml-1.5 text-[var(--accent)] text-xs">⭐ Recomendado</span>
                          )}
                        </span>
                        <p className="text-sm text-[var(--text-muted)] mt-0.5">{formatPeso(s.precio)} · {s.tiempoSemanas}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{s.para}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* 3. Módulos */}
              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">3. Módulos adicionales</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MODULOS.map((m) => (
                    <label
                      key={m.id}
                      className="flex items-start gap-2 p-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--text-muted)]/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={modulosIds.includes(m.id)}
                        onChange={() => toggleModulo(m.id)}
                        className="mt-0.5 text-[var(--accent)]"
                      />
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-[var(--text)]">{m.nombre}</span>
                        <span className="text-sm text-[var(--text-muted)] ml-1">{formatPeso(m.precio)}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* 4. Plan soporte */}
              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">4. Plan de soporte</h2>
                <div className="space-y-2">
                  {PLANES_SOPORTE.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                        planSoporteId === p.id ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="soporte"
                        value={p.id}
                        checked={planSoporteId === p.id}
                        onChange={() => setPlanSoporteId(p.id as PlanSoporteId)}
                        className="text-[var(--accent)]"
                      />
                      <span className="font-medium text-[var(--text)]">
                        {p.nombre}
                        {p.precioMensual > 0 && (
                          <span className="text-[var(--text-muted)] font-normal ml-1">
                            {formatPeso(p.precioMensual)}/mes
                          </span>
                        )}
                        {p.destacado && (
                          <span className="ml-1.5 text-[var(--accent)] text-xs">⭐</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* 5. Forma de pago */}
              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">5. Forma de pago</h2>
                <div className="space-y-2">
                  {FORMAS_PAGO.map((f) => (
                    <label
                      key={f.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                        formaPagoId === f.id ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pago"
                        value={f.id}
                        checked={formaPagoId === f.id}
                        onChange={() => setFormaPagoId(f.id as FormaPagoId)}
                        className="text-[var(--accent)]"
                      />
                      <div>
                        <span className="font-medium text-[var(--text)]">{f.nombre}</span>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{f.descripcion}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* 6. Servicios adicionales */}
              <section className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 sm:p-6 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">6. Servicios complementarios</h2>
                <div className="space-y-2">
                  {SERVICIOS_ADICIONALES.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <label className="flex items-center gap-2 flex-1 p-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--text-muted)]/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serviciosIds.includes(s.id)}
                          onChange={() => toggleServicio(s.id)}
                          className="text-[var(--accent)]"
                        />
                        <span className="text-sm text-[var(--text)]">{s.nombre}</span>
                        <span className="text-sm text-[var(--text-muted)]">
                          {formatPeso(s.precio)}
                          {s.esMensual && '/mes'}
                          {s.esAnual && '/año'}
                          {s.esPorHora && '/h'}
                        </span>
                      </label>
                      {s.id === 'hosting' && serviciosIds.includes('hosting') && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={1}
                            max={24}
                            value={mesesHosting}
                            onChange={(e) => setMesesHosting(Number(e.target.value) || 12)}
                            className="w-16 px-2 py-1.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm"
                          />
                          <span className="text-xs text-[var(--text-muted)]">meses</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Resumen lateral */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 p-5 shadow-[var(--shadow-soft)]">
                <h2 className="text-sm font-semibold text-[var(--text)] mb-4">Resumen</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">{sistema.nombre}</span>
                    <span className="text-[var(--text)]">{formatPeso(totals.subtotalSistema)}</span>
                  </div>
                  {totals.desgloseModulos.map((m) => (
                    <div key={m.id} className="flex justify-between">
                      <span className="text-[var(--text-muted)]">{m.nombre}</span>
                      <span className="text-[var(--text)]">{formatPeso(m.precio)}</span>
                    </div>
                  ))}
                  {totals.desgloseServicios.map((s) => (
                    <div key={s.id} className="flex justify-between">
                      <span className="text-[var(--text-muted)]">
                        {s.nombre}
                        {s.label && ` (${s.label})`}
                      </span>
                      <span className="text-[var(--text)]">{formatPeso(s.precio)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Subtotal</span>
                    <span className="text-[var(--text)]">{formatPeso(totals.subtotal)}</span>
                  </div>
                  {totals.descuento > 0 && (
                    <div className="flex justify-between text-sm text-[var(--status-ok)]">
                      <span>Descuento (10%)</span>
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
                    + Soporte {planSoporte.nombre}: {formatPeso(planSoporte.precioMensual)}/mes
                    <br />
                    <span className="text-[var(--status-ok)]">(1er mes gratis)</span>
                  </p>
                )}
                {error && (
                  <p className="mt-3 text-sm text-[var(--status-error)]" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={generarPdf}
                  disabled={generando}
                  className="mt-4 w-full py-3 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium disabled:opacity-60 transition-colors"
                >
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
