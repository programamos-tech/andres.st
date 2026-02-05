'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND } from '@/lib/constants';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/andrebot', label: 'Andrebot' },
  { href: '/cotizaciones', label: 'Cotizaciones' },
  { href: '/backstage', label: 'Backstage' },
];

const WHATSAPP_MENSAJE = 'Hola Andrés, necesito invertir en un software, ¿podemos hablarlo?';
const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;

type HomeNavProps = {
  /** Acción extra a la derecha (ej. botón de solicitudes en catálogo) */
  extraAction?: React.ReactNode;
};

export function HomeNav({ extraAction }: HomeNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 px-4 sm:px-6 py-4 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]/50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="hero-heading text-lg sm:text-inherit truncate min-w-0">
          {BRAND.username}
        </Link>

        {/* Desktop: links + extra + WhatsApp */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isActive = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium ${isActive ? 'text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'} transition-colors`}
              >
                {l.label}
              </Link>
            );
          })}
          {extraAction}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--text)] transition-colors shrink-0"
            aria-label="WhatsApp"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>

        {/* Mobile: extra + WhatsApp + hamburger, menu dropdown */}
        <div className="flex md:hidden items-center gap-2">
          {extraAction}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--text)] transition-colors shrink-0"
            aria-label="WhatsApp"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center hover:border-[var(--text)] transition-colors"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg)] border-b border-[var(--border)] px-4 py-4 flex flex-col gap-1">
          {links.map((l) => {
            const isActive = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-3 px-2 text-sm font-medium rounded-lg ${isActive ? 'text-[var(--text)] bg-[var(--bg-secondary)]' : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-secondary)]'} transition-colors`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
