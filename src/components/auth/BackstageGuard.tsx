'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BackstageGuardProps {
  children: React.ReactNode;
}

export function BackstageGuard({ children }: BackstageGuardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const auth = localStorage.getItem('backstage_auth');

    if (!auth) {
      setIsAuthenticated(false);
      router.replace('/backstage/login');
      return;
    }

    try {
      const authData = JSON.parse(auth);
      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - authData.timestamp > maxAge) {
        localStorage.removeItem('backstage_auth');
        setIsAuthenticated(false);
        router.replace('/backstage/login');
        return;
      }
      setIsAuthenticated(authData.authenticated === true);
      if (authData.authenticated !== true) {
        router.replace('/backstage/login');
      }
    } catch {
      localStorage.removeItem('backstage_auth');
      setIsAuthenticated(false);
      router.replace('/backstage/login');
    }
  }, [mounted, router]);

  if (!mounted || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-[var(--text-muted)] text-sm">Verificando acceso...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
