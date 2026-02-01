'use client';

import { useRef, useEffect } from 'react';

interface SlowVideoProps {
  src: string;
  speed?: number;
  className?: string;
}

export function SlowVideo({ src, speed = 0.5, className }: SlowVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
