'use client';

import { useRef, useEffect } from 'react';

/** Envuelve un contenedor con scroll horizontal y centra el hijo en el índice dado al montar (ej. 1 = Rogerbox en el centro). */
export function ScrollToCenterVideo({
  children,
  centerIndex = 1,
  showArrows = false,
}: {
  children: React.ReactNode;
  centerIndex?: number;
  showArrows?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[centerIndex] as HTMLElement | undefined;
    if (child) {
      const containerWidth = el.clientWidth;
      const childLeft = child.offsetLeft;
      const childWidth = child.offsetWidth;
      el.scrollLeft = Math.max(0, childLeft - containerWidth / 2 + childWidth / 2);
    }
  }, [centerIndex]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.85;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  return (
    <div className="relative flex items-center">
      {showArrows && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[var(--border)] bg-[var(--bg)]/90 hover:bg-[var(--bg)] hover:border-[var(--accent)] flex items-center justify-center shadow-[var(--shadow-mid)] transition-colors"
          aria-label="Ver anterior"
        >
          <span className="material-symbols-outlined text-[var(--text)] text-2xl">chevron_left</span>
        </button>
      )}
      <div ref={scrollRef} className={`overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory flex gap-4 px-3 pb-2 sm:gap-5 sm:px-4 md:gap-6 md:px-5 flex-1 min-w-0 ${showArrows ? 'video-carousel-scroll' : ''}`}>
        {children}
      </div>
      {showArrows && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[var(--border)] bg-[var(--bg)]/90 hover:bg-[var(--bg)] hover:border-[var(--accent)] flex items-center justify-center shadow-[var(--shadow-mid)] transition-colors"
          aria-label="Ver siguiente"
        >
          <span className="material-symbols-outlined text-[var(--text)] text-2xl">chevron_right</span>
        </button>
      )}
    </div>
  );
}
