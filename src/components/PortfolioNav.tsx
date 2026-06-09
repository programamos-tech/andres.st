'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';

const LINKS = [
  { href: '/#top', label: 'Inicio' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#proyectos', label: 'Proyectos' },
  { href: '/#contacto', label: 'Contacto' },
] as const;

export function PortfolioNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="portfolio-nav">
      <Link href="/" className="font-proxima-bold text-lg text-[var(--text)] no-underline">
        {BRAND.name}
      </Link>

      <nav className="hidden md:flex items-center gap-8" aria-label="Principal">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="portfolio-nav-link">
            {l.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="md:hidden w-9 h-9 rounded-md border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 z-50 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex flex-col gap-1 shadow-[var(--shadow-mid)]">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
