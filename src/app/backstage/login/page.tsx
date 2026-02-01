'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND } from '@/lib/constants';

// Credenciales (en producción usar Supabase Auth)
const ADMIN_CREDENTIALS = {
  email: 'andresruss.st@gmail.com',
  password: 'backstage2024'
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

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Guardar sesión
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
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-[var(--border)]">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/" className="font-semibold text-[var(--text)]">{BRAND.username}</Link>
          <span className="text-sm text-[var(--text-muted)]">Backstage</span>
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
              <p className="text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[var(--text)] text-[var(--bg)] rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-xs text-[var(--text-muted)] text-center mt-6">
            Solo para administradores
          </p>
        </div>
      </div>
    </div>
  );
}
