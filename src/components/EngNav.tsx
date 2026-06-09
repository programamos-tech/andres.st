'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';

const LINKS = [
  { href: '/#servicios', label: 'servicios' },
  { href: '/#proyectos', label: 'proyectos' },
  { href: '/#contacto', label: 'contacto' },
] as const;

export function EngNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="eng-nav">
      <Link href="/" className="font-mono text-sm text-[var(--text)] no-underline">
        <span className="text-[var(--accent)]">ar</span>.st
      </Link>

      <nav className="hidden md:flex items-center gap-6" aria-label="Principal">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="eng-nav-link">
            {l.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="md:hidden font-mono text-xs text-[var(--text-muted)] border border-[var(--border)] px-2 py-1 rounded"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? '×' : 'menu'}
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg-card)] border-b border-[var(--border)] p-4 flex flex-col gap-2 shadow-[var(--shadow-soft)]">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="eng-nav-link py-2">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
