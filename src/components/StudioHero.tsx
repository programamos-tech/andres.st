import Image from 'next/image';
import { BRAND, CTA_WHATSAPP_MESSAGE } from '@/lib/constants';
import { PROYECTOS } from '@/lib/proyectos';

const TAGS = ['UI/UX centrado en el usuario', 'Responsive y escalable'] as const;
const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`;
const featured = PROYECTOS.find((p) => p.categoria === 'Sitio web') ?? PROYECTOS[0];

function CornerMarks({ className }: { className?: string }) {
  return (
    <div className={`studio-corner-marks ${className ?? ''}`} aria-hidden>
      <span className="studio-corner studio-corner-tl" />
      <span className="studio-corner studio-corner-br" />
    </div>
  );
}

export function StudioHero() {
  return (
    <section className="studio-hero-wrap">
      <div className="studio-deco studio-deco-grid" aria-hidden />
      <div className="studio-deco studio-deco-path studio-deco-path-tr" aria-hidden />
      <div className="studio-deco studio-deco-path studio-deco-path-br" aria-hidden />

      <div className="studio-card">
        <div className="studio-card-bar">
          <div className="studio-window-dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <span className="font-proxima-bold text-sm text-white/85">{BRAND.name}</span>
        </div>

        <div className="studio-card-body">
          <div className="studio-card-copy">
            <h1 className="studio-headline">
              <span className="font-proxima-bold block">Diseño Web</span>
              <span className="font-proxima-bold block studio-headline-accent">&amp; Desarrollo</span>
            </h1>
            <p className="studio-tagline font-proxima italic">
              UI limpia. UX fluida. Código escalable.
            </p>
            <div className="studio-tags">
              {TAGS.map((tag) => (
                <span key={tag} className="studio-tag font-proxima">
                  {tag}
                </span>
              ))}
            </div>
            <p className="studio-cta-line font-proxima-bold">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="studio-cta-link">
                ¡Agenda tu consulta GRATIS!
              </a>
            </p>
            <div className="studio-contact font-proxima">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="studio-contact-item">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                +57 300 206 1711
              </a>
              <span className="studio-contact-sep" aria-hidden>
                |
              </span>
              <a href="https://andres.st" className="studio-contact-item">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                andres.st
              </a>
            </div>
          </div>

          <div className="studio-card-visual">
            <div className="studio-photo-stack">
              <div className="studio-photo studio-photo-back">
                <CornerMarks />
                <div className="studio-photo-media">
                  <video
                    src={featured.video}
                    className="w-full h-full object-cover object-top"
                    playsInline
                    muted
                    loop
                    autoPlay
                    preload="metadata"
                    aria-label={`Proyecto: ${featured.titulo}`}
                  />
                </div>
              </div>
              <div className="studio-photo studio-photo-front">
                <CornerMarks />
                <div className="studio-photo-media studio-photo-portrait">
                  <Image
                    src={BRAND.portrait}
                    alt={BRAND.name}
                    fill
                    className="object-cover object-top grayscale"
                    sizes="(max-width: 768px) 55vw, 220px"
                    priority
                  />
                </div>
                <svg className="studio-cursor" width="18" height="22" viewBox="0 0 18 22" fill="none" aria-hidden>
                  <path d="M1 1L1 19L6 14L10 21L13 19L9 12L16 11L1 1Z" fill="#141414" stroke="#fafaf8" strokeWidth="1.2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
