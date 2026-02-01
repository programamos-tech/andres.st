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
    const checkAuth = () => {
      const auth = localStorage.getItem('backstage_auth');
      
      if (!auth) {
        setIsAuthenticated(false);
        router.push('/backstage/login');
        return;
      }

      try {
        const authData = JSON.parse(auth);
        
        // Verificar que la sesión no tenga más de 24 horas
        const maxAge = 24 * 60 * 60 * 1000; // 24 horas
        if (Date.now() - authData.timestamp > maxAge) {
          localStorage.removeItem('backstage_auth');
          setIsAuthenticated(false);
          router.push('/backstage/login');
          return;
        }

        if (authData.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/backstage/login');
        }
      } catch {
        localStorage.removeItem('backstage_auth');
        setIsAuthenticated(false);
        router.push('/backstage/login');
      }
    };

    checkAuth();
  }, [router]);

  // Mostrar loading mientras verifica
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-[var(--text-muted)]">Verificando acceso...</div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya redirigió)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
