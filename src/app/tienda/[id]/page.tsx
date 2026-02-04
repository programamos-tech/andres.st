'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { BRAND } from '@/lib/constants';
import { HomeNav } from '@/components/HomeNav';
import { getProductoById, getSolicitudesFromStorage, addSolicitudToStorage, removeSolicitudFromStorage } from '@/lib/tienda-productos';
import { PreviewSimulation } from '@/components/tienda/PreviewSimulation';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function ProductoDetallePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const producto = id ? getProductoById(id) : undefined;

  const [solicitudes, setSolicitudes] = useState<string[]>([]);

  useEffect(() => {
    setSolicitudes(getSolicitudesFromStorage());
  }, []);

  const agregar = useCallback(() => {
    if (!producto) return;
    addSolicitudToStorage(producto.id);
    setSolicitudes(getSolicitudesFromStorage());
  }, [producto]);

  const quitar = useCallback(() => {
    if (!producto) return;
    removeSolicitudFromStorage(producto.id);
    setSolicitudes(getSolicitudesFromStorage());
  }, [producto]);

  const enSolicitudes = producto ? solicitudes.includes(producto.id) : false;

  if (!id || !producto) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)]">
        <HomeNav />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="text-[var(--brand-marron)] mb-4">Producto no encontrado.</p>
          <Link href="/tienda" className="text-[var(--brand-cafe)] font-medium hover:underline">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const tipoLabel =
    producto.tipo === 'funcionalidad'
      ? 'Funcionalidad'
      : producto.tipo === 'integracion'
        ? 'Integración'
        : 'Sistema completo';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <HomeNav />

      <main className="flex-1 min-h-0 px-6 pt-3 pb-6 md:pt-4 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 text-sm text-[var(--brand-marron)] hover:text-[var(--brand-carbon)] transition-colors mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al catálogo
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
            {/* Columna izquierda: detalle de la funcionalidad */}
            <article className="section-card rounded-2xl border border-[var(--border)] overflow-hidden flex-1 min-w-0">
              <div className="p-4 md:p-6">
                <span
                  className={`inline-flex w-fit px-2 py-0.5 rounded text-xs font-medium mb-2 ${
                    producto.tipo === 'funcionalidad'
                      ? 'bg-[var(--brand-terracota)]/20 text-[var(--brand-terracota)]'
                      : producto.tipo === 'integracion'
                        ? 'bg-[var(--brand-cafe)]/20 text-[var(--brand-cafe)]'
                        : 'bg-[var(--brand-marron)]/25 text-[var(--brand-marron)]'
                  }`}
                >
                  {tipoLabel}
                </span>
                <h1 className="hero-heading text-xl md:text-3xl text-[var(--brand-carbon)] mb-2 tracking-tight">
                  {producto.titulo}
                </h1>
                <p className="text-[var(--brand-marron)] text-base mb-4">
                  {producto.descripcion}
                </p>

                <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--brand-crema)] p-3 md:p-4 mb-6">
                  <p className="text-xs text-[var(--brand-marron)] mb-2 font-medium">
                    Así se vería en tu sistema
                  </p>
                  <PreviewSimulation tipo={producto.preview} grande tipoProducto={producto.tipo} />
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="font-semibold text-[var(--brand-carbon)] mb-1 text-base">Descripción</h2>
                    <p className="text-[var(--brand-marron)] text-sm leading-relaxed">
                      {producto.detalle}
                    </p>
                  </div>
                  <div>
                    <h2 className="font-semibold text-[var(--brand-carbon)] mb-2 text-base">Qué incluye</h2>
                    <ul className="space-y-1 text-[var(--brand-marron)] text-sm">
                      {producto.incluye.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className={`mt-0.5 shrink-0 ${producto.tipo === 'funcionalidad' ? 'text-[var(--brand-terracota)]' : producto.tipo === 'integracion' ? 'text-[var(--brand-cafe)]' : 'text-[var(--brand-marron)]'}`}>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>

            {/* Columna derecha: comprar / agregar a solicitudes */}
            <aside className="lg:w-64 lg:shrink-0 lg:sticky lg:top-20">
              <div className="section-card rounded-2xl border border-[var(--border)] p-4">
                {producto.precio && (
                  <p className="text-[var(--brand-marron)] text-sm mb-3">
                    Precio: <span className="font-semibold text-[var(--brand-carbon)]">{producto.precio}</span>
                  </p>
                )}
                {enSolicitudes ? (
                  <button
                    type="button"
                    onClick={quitar}
                    className="btn btn-outline w-full text-sm py-2 border-[var(--brand-marron)]/40 text-[var(--brand-marron)] hover:border-[var(--brand-marron)] mb-3"
                  >
                    Quitar de solicitudes
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={agregar}
                    className={`btn w-full text-sm py-2 mb-3 ${producto.tipo === 'integracion' ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    Agregar a solicitudes
                  </button>
                )}
                <Link
                  href="/tienda"
                  className="block text-center text-[var(--brand-cafe)] hover:text-[var(--brand-carbon)] text-xs font-medium transition-colors"
                >
                  Seguir viendo catálogo
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer — mismo que home */}
      <footer className="shrink-0 px-6 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg)]">
        <ScrollReveal className="max-w-6xl mx-auto" delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <p className="hero-heading mb-3 text-[var(--brand-carbon)]">{BRAND.username}</p>
              <p className="text-sm text-[var(--brand-marron)] leading-relaxed">
                Software a la medida para negocios que quieren crecer con herramientas propias.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-3 text-[var(--brand-carbon)]">Contacto</p>
              <div className="space-y-2 text-sm">
                <a
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[var(--brand-marron)] hover:text-[var(--brand-cafe)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  +57 300 206 1711
                </a>
                <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 text-[var(--brand-marron)] hover:text-[var(--brand-cafe)] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {BRAND.email}
                </a>
                <p className="flex items-center gap-2 text-[var(--brand-marron)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {BRAND.location}
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-3 text-[var(--brand-carbon)]">Links</p>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-[var(--brand-marron)] hover:text-[var(--brand-cafe)] transition-colors">
                  Inicio
                </Link>
                <Link href="/tienda" className="block text-[var(--brand-marron)] hover:text-[var(--brand-cafe)] transition-colors">
                  Catálogo
                </Link>
                <Link href="/backstage" className="block text-[var(--brand-marron)] hover:text-[var(--brand-cafe)] transition-colors">
                  Dashboard
                </Link>
                <a href={`https://wa.me/${BRAND.whatsapp}?text=Hola%20Andrés,%20me%20interesa%20un%20proyecto`} target="_blank" rel="noopener noreferrer" className="block text-[var(--brand-marron)] hover:text-[var(--brand-terracota)] transition-colors">
                  Iniciar proyecto
                </a>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-[var(--border)]">
            <div className="marca-fullview flex items-center justify-center px-4 sm:px-6 pt-0 pb-0 mt-0 mb-0 min-w-0">
              <p className="hero-heading text-center text-[var(--brand-carbon)] tracking-tight select-none w-full m-0 min-w-0" style={{ fontSize: 'clamp(1.5rem, 8vw, 11rem)', lineHeight: 1 }}>
                {BRAND.username}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-4 pt-6 pb-0 text-center sm:text-left">
              <p className="text-sm text-[var(--brand-marron)]">
                © 2026 {BRAND.username}. Todos los derechos reservados.
              </p>
              <p className="text-sm text-[var(--brand-cafe)]">
                Hecho desde Sincelejo para el mundo.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  );
}
