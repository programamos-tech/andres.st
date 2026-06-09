'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND, NAV_LINKS, CTA_WHATSAPP_MESSAGE } from '@/lib/constants';

const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`;

export function FlyerNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flyer-nav">
      <div className="flyer-nav-inner">
        <Link href="/" className="brand-script text-2xl sm:text-3xl text-[var(--text)] no-underline">
          {BRAND.name}
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Principal">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="flyer-nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-matte !py-2 !px-5 !text-[11px] hidden sm:inline-flex">
            WhatsApp
          </a>
          <button
            type="button"
            className="md:hidden w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center"
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
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1 border-t border-[var(--border)] bg-[var(--bg)]">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-[var(--text-muted)]"
            >
              {l.label}
            </Link>
          ))}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-matte justify-center mt-2">
            WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
