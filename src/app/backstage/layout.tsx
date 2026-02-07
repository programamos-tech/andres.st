import { HomeNav } from '@/components/HomeNav';
import { BackstageLayoutClient } from './BackstageLayoutClient';

export default function BackstageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <HomeNav />
      <BackstageLayoutClient>{children}</BackstageLayoutClient>
    </div>
  );
}
