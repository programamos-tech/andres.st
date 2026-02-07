'use client';

import { useRef, useCallback } from 'react';

interface VideoFromMidpointProps {
  src?: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

/** Video que arranca desde la mitad de la duración (controls, loop, etc.). Funciona en desktop, tablet y móvil. */
export function VideoFromMidpoint({ src = '', title, className = '', children }: VideoFromMidpointProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const didSetTimeRef = useRef(false);

  const startFromMiddle = useCallback(() => {
    const el = videoRef.current;
    if (!el || didSetTimeRef.current) return;
    const duration = el.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    didSetTimeRef.current = true;
    el.currentTime = duration * 0.5;
  }, []);

  const startFromMiddleDeferred = useCallback(() => {
    requestAnimationFrame(() => {
      startFromMiddle();
      setTimeout(startFromMiddle, 0);
    });
  }, [startFromMiddle]);

  return (
    <video
      ref={videoRef}
      className={className}
      controls
      playsInline
      loop
      preload="metadata"
      title={title}
      onLoadedMetadata={startFromMiddleDeferred}
      onLoadedData={startFromMiddleDeferred}
      onCanPlay={startFromMiddle}
    >
      {children ?? <source src={src} type="video/mp4" />}
    </video>
  );
}
