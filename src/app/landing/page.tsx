'use client';

import Link from 'next/link';
import { HomeNav } from '@/components/HomeNav';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BRAND, CTA_LANDING_WHATSAPP } from '@/lib/constants';

type Sitio = {
  name: string;
  url: string;
  domain: string;
  pending?: boolean;
  /** Video en public/previews/ que muestra cómo se ve el sitio (ej. rogerbox-web.mp4) */
  previewVideo?: string;
};

const PASOS = [
  { numero: '01', titulo: 'Contamos tu historia', texto: 'Te escuchamos. Qué hacés, a quién le vendés y qué querés que sienta quien entra a tu sitio.' },
  { numero: '02', titulo: 'Diseño exclusivo', texto: 'Bocetos y diseño hecho para vos. Sin plantillas genéricas: tu marca, tu estilo, tu mensaje.' },
  { numero: '03', titulo: 'Lo construimos', texto: 'Desarrollamos el sitio: rápido, responsive y listo para que te encuentren en Google.' },
  { numero: '04', titulo: 'Lo subimos', texto: 'Dominio, hosting y dejamos tu sitio en vivo. Vos solo te encargás de sumar contenido cuando quieras.' },
] as const;

const SITIOS_WEB: Sitio[] = [
  { name: 'Rogerbox', url: 'https://rogerbox.co', domain: 'rogerbox.co', previewVideo: '/previews/rogerbox-web.mov' },
  { name: 'Martha Lucia Contreras', url: 'https://marthaluciacontreras.com', domain: 'marthaluciacontreras.com', previewVideo: '/previews/fundesae-web.mov' },
  { name: 'Fundesae', url: 'https://fundesae.co', domain: 'fundesae.co', previewVideo: '/previews/marthaluciacontreras-web.mov' },
  { name: 'C&M', url: '#', domain: 'Próximamente', pending: true, previewVideo: '/previews/cym-web.mov' },
];

export default function LandingPage() {
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_LANDING_WHATSAPP)}`;

  return (
    <div id="top" className="min-h-screen flex flex-col scroll-mt-4">
      <HomeNav />

      <main className="flex-1">
        {/* Hero — oferta de sitio web */}
        <section className="py-16 md:py-24 px-4 sm:px-6 border-b border-[var(--border)]">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <p className="text-[var(--accent)] font-medium text-sm uppercase tracking-wider mb-4">
                Sitios web y landings
              </p>
              <h1 className="hero-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--text)] tracking-tight font-bold mb-6 leading-tight">
                ¿Necesitás un sitio web?
              </h1>
              <p className="text-xl md:text-2xl text-[var(--accent)] font-bold mb-6">
                Nosotros lo hacemos.
              </p>
              <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                Diseño exclusivo, a tu medida y listo para conectar con tus clientes. Sin plantillas: tu marca, tu historia, tu negocio en la web.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
              >
                Quiero mi sitio web
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </ScrollReveal>
          </div>
        </section>

        {/* Paso a paso */}
        <section className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)] border-b border-[var(--border)]">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <h2 className="hero-heading text-2xl md:text-3xl text-[var(--text)] text-center tracking-tight mb-4">
                Cómo lo hacemos
              </h2>
              <p className="text-center text-[var(--text-muted)] text-lg mb-12 max-w-2xl mx-auto">
                Un proceso claro, sin vueltas. De la idea al sitio en vivo.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {PASOS.map((paso, i) => (
                <ScrollReveal key={paso.numero} delay={i * 0.1}>
                  <div className="flex gap-5">
                    <span className="hero-heading text-3xl md:text-4xl text-[var(--accent)] font-bold shrink-0">
                      {paso.numero}
                    </span>
                    <div>
                      <h3 className="font-semibold text-[var(--text)] text-lg mb-2">{paso.titulo}</h3>
                      <p className="text-[var(--text-muted)] leading-relaxed">{paso.texto}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Así se ven — videos de los sitios (máximo protagonismo) */}
        <section className="py-16 md:py-24 px-2 sm:px-4 md:px-6 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="hero-heading text-3xl md:text-4xl lg:text-5xl text-[var(--text)] text-center tracking-tight mb-4">
                Así se ven los sitios que creamos
              </h2>
              <p className="text-center text-[var(--text-muted)] text-lg md:text-xl mb-12 md:mb-16 max-w-2xl mx-auto">
                Grabamos cada sitio para que veas cómo se ve en vivo.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              {SITIOS_WEB.map((site) => (
                <ScrollReveal key={site.domain}>
                  <a
                    href={site.url}
                    target={site.pending ? undefined : '_blank'}
                    rel={site.pending ? undefined : 'noopener noreferrer'}
                    className={`block rounded-xl md:rounded-2xl border-2 border-[var(--border)] bg-[var(--bg)] overflow-hidden transition-all no-underline text-inherit shadow-[var(--shadow-mid)] ${
                      site.pending ? 'opacity-90 cursor-default' : 'hover:border-[var(--accent)]/60 hover:shadow-lg'
                    }`}
                  >
                    <div className="aspect-video w-full min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] bg-[var(--bg)] relative overflow-hidden">
                      {site.previewVideo ? (
                        <>
                          <video
                            src={site.previewVideo}
                            className="w-full h-full object-cover object-top"
                            playsInline
                            muted
                            loop
                            autoPlay
                            preload="metadata"
                            aria-label={`Vista previa de ${site.name}`}
                          />
                          {/* Overlay para tapar badges del navegador (ej. extensiones) en la esquina */}
                          <div
                            className="absolute top-0 right-0 w-24 h-10 md:w-28 md:h-11 bg-[var(--bg)] rounded-bl-lg"
                            aria-hidden
                          />
                        </>
                      ) : site.pending ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[var(--text-muted)] font-medium text-lg">Próximamente</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                          <span className="material-symbols-outlined text-4xl text-[var(--text-muted)]">videocam</span>
                          <span className="text-[var(--text-muted)] text-sm text-center">
                            Subí un video en <code className="text-xs bg-[var(--bg)] px-1 rounded">previews/</code>
                          </span>
                        </div>
                      )}
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--bg-secondary)]">
          <div className="max-w-2xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="hero-heading text-2xl md:text-3xl text-[var(--text)] tracking-tight mb-4">
                ¿Listo para tener tu sitio?
              </h2>
              <p className="text-[var(--text-muted)] text-lg mb-8">
                Escribinos por WhatsApp y te contamos pasos y precio.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
              >
                Hablar por WhatsApp
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </ScrollReveal>
          </div>
        </section>

        <div className="py-8 px-4 text-center border-t border-[var(--border)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
