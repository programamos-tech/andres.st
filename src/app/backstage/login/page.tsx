'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND } from '@/lib/constants';

const ADMIN_CREDENTIALS = {
  email: 'andresruss.st@gmail.com',
  password: '$Ol1v3r2023',
};

export default function BackstageLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('backstage_auth', JSON.stringify({
        email,
        authenticated: true,
        timestamp: Date.now()
      }));
      router.push('/backstage');
    } else {
      setError('Credenciales incorrectas');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      {/* Nav — mismo que home */}
      <nav className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="hero-heading text-[var(--text)]">
            {BRAND.username}
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Home
            </Link>
            <Link href="/tienda" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Catálogo
            </Link>
            <Link href="/ayuda" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Ayuda
            </Link>
            <span className="text-sm font-medium text-[var(--text)]">Backstage</span>
          </div>

          <a
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--text)] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
              <Image
                src={BRAND.avatar}
                alt={BRAND.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-semibold text-[var(--text)]">Backstage</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Acceso restringido</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-muted)] text-sm"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--text-muted)] text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: 'var(--status-error)' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[var(--accent)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-xs text-[var(--text-muted)] text-center mt-6">
            Solo para administradores
          </p>
        </div>
      </div>

      {/* Footer — mismo que home */}
      <footer className="px-6 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg)] shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <p className="hero-heading mb-3">{BRAND.username}</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Software a la medida para negocios que quieren crecer con herramientas propias.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-3">Contacto</p>
              <div className="space-y-2 text-sm">
                <a
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  +57 300 206 1711
                </a>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {BRAND.email}
                </a>
                <p className="flex items-center gap-2 text-[var(--text-muted)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {BRAND.location}
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-3">Links</p>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  Inicio
                </Link>
                <Link href="/backstage" className="block text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  Dashboard
                </Link>
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=Hola%20Andrés,%20me%20interesa%20un%20proyecto`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  Iniciar proyecto
                </a>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-[var(--border)]">
            <div className="marca-fullview flex items-center justify-center px-4 sm:px-6 pt-0 pb-0 mt-0 mb-0 min-w-0">
              <p
                className="hero-heading text-center text-[var(--text)] tracking-tight select-none w-full m-0 min-w-0"
                style={{ fontSize: 'clamp(1.5rem, 8vw, 11rem)', lineHeight: 1 }}
              >
                {BRAND.username}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-4 pt-6 pb-0 text-center sm:text-left">
              <p className="text-sm text-[var(--text-muted)]">
                © 2026 {BRAND.username}. Todos los derechos reservados.
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Hecho desde Sincelejo para el mundo.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
