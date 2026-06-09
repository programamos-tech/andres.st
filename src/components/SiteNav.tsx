'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND, NAV_LINKS, CTA_WHATSAPP_MESSAGE } from '@/lib/constants';

const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <Link href="/" className="site-logo">
          <span className="site-logo-mark">
            AR<span>.</span>
          </span>
          <span className="text-sm font-semibold tracking-tight hidden sm:inline">andrés</span>
        </Link>

        <nav className="site-nav-links" aria-label="Principal">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="site-nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark hidden sm:inline-flex">
            Escríbeme
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
          <button
            type="button"
            className="md:hidden w-9 h-9 rounded-full border border-[var(--border)] bg-white/70 flex items-center justify-center"
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
        </div>
      </div>

      {open && (
        <div className="md:hidden mx-4 mt-2 p-4 rounded-2xl border border-[var(--border)] bg-white/90 backdrop-blur-md shadow-[var(--shadow-soft)] flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 px-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              {l.label}
            </Link>
          ))}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark justify-center mt-2">
            Escríbeme
          </a>
        </div>
      )}
    </header>
  );
}
