import { HomeNav } from '@/components/HomeNav';

export default function BackstageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <HomeNav />
      {children}
    </div>
  );
}
