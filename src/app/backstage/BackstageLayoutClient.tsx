'use client';

import { BackstageSubNav } from '@/components/dashboard/BackstageSubNav';

export function BackstageLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackstageSubNav showStats={false} />
      {children}
    </>
  );
}
