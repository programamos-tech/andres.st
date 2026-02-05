'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';

interface BackstageSubNavProps {
  totalProyectos?: number;
  proyectosActivos?: number;
  proyectosConErrores?: number;
  onRefresh?: () => void;
  isDemo?: boolean;
  showStats?: boolean;
  contained?: boolean;
}

const NAV_ITEMS = [
  { href: '/backstage', label: 'Proyectos' },
  { href: '/backstage/actividades', label: 'Actividades' },
  { href: '/backstage/tickets', label: 'Tickets' },
  { href: '/backstage/andrebot', label: 'Andrebot' },
  { href: '/cotizaciones', label: 'Cotizaciones' },
];

export function BackstageSubNav({
  totalProyectos = 0,
  proyectosActivos = 0,
  proyectosConErrores = 0,
  onRefresh,
  isDemo,
  showStats = true,
  contained = false,
}: BackstageSubNavProps) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('backstage_auth');
    window.location.href = '/';
  };

  return (
    <header className={contained ? 'border-b border-[var(--border)] py-3 bg-[var(--bg)]' : 'border-b border-[var(--border)] px-6 py-3 bg-[var(--bg)]'}>
      <div className={contained ? 'flex items-center justify-between' : 'max-w-7xl mx-auto flex items-center justify-between'}>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== '/backstage' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {isDemo && (
            <span className="text-xs px-2 py-1 rounded-full border border-[var(--border)] text-[var(--text-muted)]">
              demo
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          {showStats && (
            <div className="hidden lg:flex items-center gap-4 text-xs text-[var(--text-muted)]">
              <span>{totalProyectos} proyectos</span>
              <span style={{ color: 'var(--status-ok)' }}>{proyectosActivos} activos</span>
              {proyectosConErrores > 0 && (
                <span style={{ color: 'var(--status-error)' }}>{proyectosConErrores} errores</span>
              )}
            </div>
          )}
          <span className="text-sm text-[var(--text-muted)] hidden sm:block font-mono">
            {format(currentTime, 'HH:mm')}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
              title="Actualizar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <button
            onClick={cerrarSesion}
            className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
            title="Salir"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
