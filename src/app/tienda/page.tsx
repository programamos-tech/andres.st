'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';
import { HomeNav } from '@/components/HomeNav';
import { AndrebotChat } from '@/components/andrebot/AndrebotChat';
import { ScrollReveal } from '@/components/ScrollReveal';
import { PreviewSimulation } from '@/components/tienda/PreviewSimulation';
import {
  PRODUCTOS,
  TIPOS,
  getSolicitudesFromStorage,
  addSolicitudToStorage,
  removeSolicitudFromStorage,
} from '@/lib/tienda-productos';
import type { TipoProducto } from '@/lib/tienda-productos';

export default function TiendaPage() {
  const [tipoActivo, setTipoActivo] = useState<TipoProducto | 'todos'>('todos');
  const [solicitudes, setSolicitudes] = useState<string[]>([]);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [panelVista, setPanelVista] = useState<'lista' | 'chat'>('lista');

  useEffect(() => {
    setSolicitudes(getSolicitudesFromStorage());
  }, []);

  const productosFiltrados =
    tipoActivo === 'todos'
      ? PRODUCTOS
      : PRODUCTOS.filter((p) => p.tipo === tipoActivo);

  const agregar = (id: string) => {
    addSolicitudToStorage(id);
    setSolicitudes(getSolicitudesFromStorage());
  };

  const quitar = (id: string) => {
    removeSolicitudFromStorage(id);
    setSolicitudes(getSolicitudesFromStorage());
  };

  const enSolicitudes = (id: string) => solicitudes.includes(id);

  const solicitudesButton = (
    <button
      type="button"
      onClick={() => setPanelAbierto(true)}
      className="relative w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--brand-cafe)] transition-colors shrink-0"
      aria-label="Ver solicitudes"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {solicitudes.length > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--brand-cafe)] text-white text-[10px] font-semibold flex items-center justify-center">
          {solicitudes.length}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <HomeNav extraAction={solicitudesButton} />

      {/* Cabecera: título y filtros — ordenada en mobile */}
      <section className="px-4 sm:px-6 pt-5 pb-5 sm:pt-6 sm:pb-4 border-b border-[var(--border)]/60 bg-[var(--bg)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-4">
          <div className="min-w-0">
            <h1 className="hero-heading text-2xl text-[var(--brand-carbon)] tracking-tight">
              Tienda de módulos
            </h1>
            <p className="text-[var(--brand-marron)] text-sm mt-0.5 hidden sm:block">
              Funcionalidades, integraciones y sistemas para tu software.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto sm:max-w-none">
            {(['todos', ...TIPOS.map((t) => t.id)] as const).map((key) => {
              const label = key === 'todos' ? 'Todos' : TIPOS.find((t) => t.id === key)?.label ?? '';
              const active = tipoActivo === key;
              const activeBg = key === 'todos' ? 'var(--brand-terracota)' : key === 'funcionalidad' ? 'var(--brand-terracota)' : key === 'integracion' ? 'var(--brand-cafe)' : 'var(--brand-marron)';
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTipoActivo(key)}
                  className={`px-3 py-2 sm:py-1.5 rounded-md text-xs font-medium transition-colors text-center ${active ? 'text-white' : 'text-[var(--brand-marron)] hover:text-[var(--brand-carbon)] bg-transparent hover:bg-[var(--brand-crema)]/60'}`}
                  style={active ? { background: activeBg } : undefined}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid de productos — protagonista, más cards visibles (tienda surtida) */}
      <section className="px-4 sm:px-6 py-6 md:py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {productosFiltrados.map((p) => {
              const linkColor = p.tipo === 'funcionalidad' ? 'var(--brand-terracota)' : p.tipo === 'integracion' ? 'var(--brand-cafe)' : 'var(--brand-marron)';
              return (
              <article
                key={p.id}
                className={`section-card rounded-xl p-4 flex flex-col border border-[var(--border)] transition-colors group ${
                  p.tipo === 'funcionalidad' ? 'hover:border-[var(--brand-terracota)]/50' : p.tipo === 'integracion' ? 'hover:border-[var(--brand-cafe)]/50' : 'hover:border-[var(--brand-marron)]/50'
                }`}
              >
                <Link
                  href={`/tienda/${p.id}`}
                  className="flex flex-col flex-1 min-h-0 cursor-pointer no-underline text-inherit"
                  aria-label={`Ver detalle de ${p.titulo}`}
                >
                  <div className="mb-2 flex-shrink-0">
                    <PreviewSimulation tipo={p.preview} tipoProducto={p.tipo} />
                  </div>
                  <span
                    className={`inline-flex w-fit px-1.5 py-0.5 rounded text-[10px] font-medium mb-1 ${
                      p.tipo === 'funcionalidad'
                        ? 'bg-[var(--brand-terracota)]/20 text-[var(--brand-terracota)]'
                        : p.tipo === 'integracion'
                          ? 'bg-[var(--brand-cafe)]/20 text-[var(--brand-cafe)]'
                          : 'bg-[var(--brand-marron)]/25 text-[var(--brand-marron)]'
                    }`}
                  >
                    {p.tipo === 'funcionalidad' ? 'Funcionalidad' : p.tipo === 'integracion' ? 'Integración' : 'Sistema'}
                  </span>
                  <h2 className="text-sm font-semibold text-[var(--brand-carbon)] mb-1 line-clamp-2 leading-tight group-hover:underline">
                    {p.titulo}
                  </h2>
                  <p className="text-xs text-[var(--brand-marron)] leading-snug flex-1 mb-2 line-clamp-2">
                    {p.descripcion}
                  </p>
                  <span
                    className="text-xs font-medium mb-1 inline-block transition-colors group-hover:underline"
                    style={{ color: linkColor }}
                  >
                    Ver detalle →
                  </span>
                  {p.precio && (
                    <p className="text-[10px] text-[var(--brand-marron)] mb-2">
                      {p.precio}
                    </p>
                  )}
                </Link>
                {enSolicitudes(p.id) ? (
                  <button
                    type="button"
                    onClick={() => quitar(p.id)}
                    className="btn btn-outline w-full text-xs py-2 border-[var(--brand-marron)]/40 text-[var(--brand-marron)] hover:border-[var(--brand-marron)] mt-auto shrink-0"
                  >
                    Quitar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => agregar(p.id)}
                    className={`btn w-full text-xs py-2 mt-auto shrink-0 ${p.tipo === 'integracion' ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    Agregar
                  </button>
                )}
              </article>
            );
            })}
          </div>
        </div>
      </section>

      {/* Panel de solicitudes (drawer) */}
      {panelAbierto && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-50"
            onClick={() => { setPanelAbierto(false); setPanelVista('lista'); }}
            aria-hidden
          />
          <div className="fixed top-0 right-0 w-full max-w-md h-full bg-[var(--bg)] border-l border-[var(--border)] shadow-[var(--shadow-mid)] z-50 flex flex-col">
            {panelVista === 'chat' ? (
              <AndrebotChat
                solicitudes={solicitudes}
                onClose={() => setPanelVista('lista')}
              />
            ) : (
            <>
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--brand-crema)]/30">
              <h2 className="hero-heading text-xl text-[var(--brand-carbon)]">
                Mis solicitudes
              </h2>
              <button
                type="button"
                onClick={() => setPanelAbierto(false)}
                className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--text)] transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {solicitudes.length === 0 ? (
                <p className="text-[var(--brand-marron)] text-sm">
                  Aún no agregaste nada. Elegí módulos o funcionalidades y agregalos a solicitudes.
                </p>
              ) : (
                <ul className="space-y-3">
                  {solicitudes.map((id) => {
                    const p = PRODUCTOS.find((x) => x.id === id);
                    if (!p) return null;
                    return (
                      <li
                        key={p.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-[var(--brand-crema)]/50 border border-[var(--border)]"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--brand-carbon)] text-sm">
                            {p.titulo}
                          </p>
                          <p className={`text-xs mt-0.5 ${p.tipo === 'funcionalidad' ? 'text-[var(--brand-terracota)]' : p.tipo === 'integracion' ? 'text-[var(--brand-cafe)]' : 'text-[var(--brand-marron)]'}`}>
                            {p.tipo === 'funcionalidad' ? 'Funcionalidad' : p.tipo === 'integracion' ? 'Integración' : 'Sistema completo'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => quitar(p.id)}
                          className="text-[var(--text-muted)] hover:text-[var(--status-error)] transition-colors p-1"
                          aria-label="Quitar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="p-6 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setPanelVista('chat')}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:!transform-none"
                disabled={solicitudes.length === 0}
              >
                Ir a Andrebot ({solicitudes.length})
              </button>
              <p className="text-xs text-[var(--brand-marron)] mt-2 text-center">
                Andrebot te pide proyecto y nombre, crea el ticket y te da el link para seguir el estado.
              </p>
            </div>
            </>
            )}
          </div>
        </>
      )}

      {/* Footer — mismo que home */}
      <footer className="px-6 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg)]">
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
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
