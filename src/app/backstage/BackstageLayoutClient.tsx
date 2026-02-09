'use client';

import { MaskSensitiveDataProvider } from '@/contexts/MaskSensitiveDataContext';
import { BackstageSubNav } from '@/components/dashboard/BackstageSubNav';

export function BackstageLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <MaskSensitiveDataProvider>
      <BackstageSubNav showStats={false} />
      {children}
    </MaskSensitiveDataProvider>
  );
}
