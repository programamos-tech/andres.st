'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'backstage_mask_sensitive';

type MaskSensitiveDataContextValue = {
  /** true = ocultar datos sensibles (usuarios, montos), false = mostrar */
  maskSensitiveData: boolean;
  toggleMask: () => void;
  /** Oculta montos de dinero en un texto (ej. "Total: $103.999" → "Total: ••••••") */
  maskAmountsInText: (text: string) => string;
  /** Devuelve "•••" si maskSensitiveData, sino el valor original (para nombres de usuario) */
  maskUser: (name: string | null | undefined) => string;
  /** Devuelve "•••" si maskSensitiveData, sino el número (para conteos como usuarios activos) */
  maskCount: (n: number) => string;
};

const defaultValue: MaskSensitiveDataContextValue = {
  maskSensitiveData: false,
  toggleMask: () => {},
  maskAmountsInText: (t) => t,
  maskUser: (n) => n ?? '—',
  maskCount: (n) => String(n),
};

const Context = createContext<MaskSensitiveDataContextValue>(defaultValue);

/** Reemplaza montos en texto ($ 123.456, Total: $103.999, 103.999 en ventas) por •••••• */
function maskAmountsInTextImpl(text: string): string {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/\$\s*[\d.,]+/g, '••••••')
    .replace(/(Total|total|TOTAL)\s*:\s*[\d.,]+/gi, '$1: ••••••')
    .replace(/[\d.,]+\s*(en ventas|COP|USD)/gi, '•••••• $1');
}

export function MaskSensitiveDataProvider({ children }: { children: React.ReactNode }) {
  const [maskSensitiveData, setMaskSensitiveData] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setMaskSensitiveData(stored === 'true');
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const toggleMask = useCallback(() => {
    setMaskSensitiveData((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const maskAmountsInText = useCallback(
    (text: string) => (maskSensitiveData ? maskAmountsInTextImpl(text) : text),
    [maskSensitiveData]
  );

  const maskUser = useCallback(
    (name: string | null | undefined) =>
      maskSensitiveData ? '•••' : (name?.trim() || '—'),
    [maskSensitiveData]
  );

  const maskCount = useCallback(
    (n: number) => (maskSensitiveData ? '•••' : String(n)),
    [maskSensitiveData]
  );

  const value: MaskSensitiveDataContextValue = mounted
    ? { maskSensitiveData, toggleMask, maskAmountsInText, maskUser, maskCount }
    : defaultValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMaskSensitiveData(): MaskSensitiveDataContextValue {
  const ctx = useContext(Context);
  return ctx ?? defaultValue;
}
