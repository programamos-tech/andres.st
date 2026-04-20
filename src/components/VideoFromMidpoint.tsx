'use client';

import { useRef, useCallback } from 'react';

interface VideoFromMidpointProps {
  src?: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
  /** Si se define, el video arranca en este segundo (ej. 40 = 0:40). Si no, arranca desde la mitad. */
  startAtSeconds?: number;
}

/** Video que arranca desde la mitad de la duración (o desde startAtSeconds). Controls, loop, etc. */
export function VideoFromMidpoint({ src = '', title, className = '', children, startAtSeconds }: VideoFromMidpointProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const didSetTimeRef = useRef(false);

  const startFromMiddle = useCallback(() => {
    const el = videoRef.current;
    if (!el || didSetTimeRef.current) return;
    const duration = el.duration;
    if (!Number.isFinite(duration) || duration <= 0) return;
    didSetTimeRef.current = true;
    if (typeof startAtSeconds === 'number' && startAtSeconds >= 0) {
      el.currentTime = Math.min(startAtSeconds, duration);
    } else {
      el.currentTime = duration * 0.5;
    }
    // muted + play() tras el seek: las políticas del navegador permiten autoplay solo sin audio
    void el.play().catch(() => {});
  }, [startAtSeconds]);

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
      muted
      playsInline
      loop
      preload="metadata"
      title={title}
      onLoadedMetadata={startFromMiddleDeferred}
      onLoadedData={startFromMiddleDeferred}
      onCanPlay={startFromMiddle}
    >
      {children ?? (
        <source
          src={src}
          type={src.toLowerCase().endsWith('.mov') ? 'video/quicktime' : 'video/mp4'}
        />
      )}
    </video>
  );
}
