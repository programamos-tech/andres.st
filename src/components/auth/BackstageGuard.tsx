'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BackstageGuardProps {
  children: React.ReactNode;
}

export function BackstageGuard({ children }: BackstageGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const auth = localStorage.getItem('backstage_auth');

    if (!auth) {
      setIsAuthenticated(false);
      router.replace('/backstage/login');
    } else {
      try {
        const authData = JSON.parse(auth);
        const maxAge = 24 * 60 * 60 * 1000;
        if (Date.now() - authData.timestamp > maxAge) {
          localStorage.removeItem('backstage_auth');
          setIsAuthenticated(false);
          router.replace('/backstage/login');
        } else {
          setIsAuthenticated(authData.authenticated === true);
          if (authData.authenticated !== true) {
            router.replace('/backstage/login');
          }
        }
      } catch {
        localStorage.removeItem('backstage_auth');
        setIsAuthenticated(false);
        router.replace('/backstage/login');
      }
    }

    const fallback = setTimeout(() => {
      setIsAuthenticated((prev) => (prev === null ? false : prev));
    }, 2500);
    return () => clearTimeout(fallback);
  }, [router]);

  if (isAuthenticated === null) {
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

