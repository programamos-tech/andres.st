'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRAND, SOCIAL_LINKS } from '@/lib/constants';

const NAV_SOCIAL = SOCIAL_LINKS.filter((s) => s.icon === 'instagram');

function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'instagram') {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  return null;
}

export function CinematicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [first, last] = BRAND.name.split(' ');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`cine-nav cine-nav--light${scrolled ? ' cine-nav--scrolled' : ''}`}>
      <Link href="/" className="cine-logo">
        {first} {last}
      </Link>

      <nav className="cine-pill-nav" aria-label="Principal">
        <Link href="/#servicios" className="cine-pill-link">
          Servicios
        </Link>
        <Link href="/#proyectos" className="cine-pill-icon" aria-label="Proyectos">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </Link>
        <Link href="/#proyectos" className="cine-pill-link">
          Proyectos
        </Link>
      </nav>

      <div className="cine-nav-right">
        <div className="cine-contact">
          <a href={`tel:${BRAND.phoneTel}`} className="cine-contact-link">
            {BRAND.phoneShort}
          </a>
        </div>
        {NAV_SOCIAL.length > 0 && (
          <div className="cine-nav-social">
            {NAV_SOCIAL.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <SocialIcon icon={s.icon} />
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
