'use client';

import { useRef, useEffect } from 'react';

/** Envuelve un contenedor con scroll horizontal y centra el hijo en el índice dado al montar (ej. 1 = Rogerbox en el centro). */
export function ScrollToCenterVideo({
  children,
  centerIndex = 1,
}: {
  children: React.ReactNode;
  centerIndex?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[centerIndex] as HTMLElement | undefined;
    if (child) {
      // Solo desplazamos horizontalmente el carrusel para centrar el video.
      // No usamos scrollIntoView para no provocar scroll vertical de la página.
      const containerWidth = el.clientWidth;
      const childLeft = child.offsetLeft;
      const childWidth = child.offsetWidth;
      el.scrollLeft = Math.max(0, childLeft - containerWidth / 2 + childWidth / 2);
    }
  }, [centerIndex]);

  return (
    <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory flex gap-4 px-3 pb-2 sm:gap-5 sm:px-4 md:gap-6 md:px-5" style={{ scrollbarGutter: 'stable' }}>
      {children}
    </div>
  );
}
