'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import type { Proyecto } from '@/lib/proyectos';

type ProjectCardProps = {
  proyecto: Proyecto;
};

export function ProjectCard({ proyecto }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tienePreview = Boolean(proyecto.video || proyecto.imagen || proyecto.poster);
  const esEnlace = Boolean(proyecto.url && !proyecto.pendiente);
  const thumbSrc = proyecto.poster ?? proyecto.imagen;

  useEffect(() => {
    setMounted(true);
  }, []);

  const cerrar = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, cerrar]);

  const abrirPreview = () => {
    if (tienePreview) setOpen(true);
  };

  const modal =
    open && mounted
      ? createPortal(
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Vista completa: ${proyecto.titulo}`}
            onClick={cerrar}
          >
            <button
              type="button"
              className="project-modal-close"
              onClick={cerrar}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="project-modal-media" onClick={(e) => e.stopPropagation()}>
              {proyecto.video ? (
                <video
                  src={proyecto.video}
                  className="project-modal-video"
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                />
              ) : thumbSrc ? (
                <Image
                  src={thumbSrc}
                  alt={proyecto.titulo}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <article
        className={`project-card${tienePreview ? ' project-card--interactive' : ''}`}
        onClick={tienePreview ? abrirPreview : undefined}
        onKeyDown={
          tienePreview
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  abrirPreview();
                }
              }
            : undefined
        }
        role={tienePreview ? 'button' : undefined}
        tabIndex={tienePreview ? 0 : undefined}
      >
        <div className="project-thumb relative">
          {thumbSrc ? (
            <Image
              src={thumbSrc}
              alt={`Vista previa: ${proyecto.titulo}`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : null}
          {proyecto.pendiente && (
            <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] rounded-full">
              Próximamente
            </span>
          )}
        </div>
        <div className="p-5">
          <p className="section-tag !mb-2 !text-[10px]">
            {proyecto.categoria} · {proyecto.cliente}
          </p>
          <h3 className="font-proxima-bold text-[var(--text)] mb-2">{proyecto.titulo}</h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">{proyecto.descripcion}</p>
          {esEnlace && (
            <a
              href={proyecto.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-[var(--text)]"
              onClick={(e) => e.stopPropagation()}
            >
              Ver proyecto →
            </a>
          )}
        </div>
      </article>
      {modal}
    </>
  );
}
