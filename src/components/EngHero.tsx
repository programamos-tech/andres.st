import Image from 'next/image';
import { BRAND, CTA_WHATSAPP_MESSAGE } from '@/lib/constants';

const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`;

export function EngHero() {
  return (
    <section className="eng-hero">
      <p className="eng-comment">// andres_russ — software engineer</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div>
          <h1 className="eng-title">
            Diseño y construyo
            <br />
            software que escala.
          </h1>

          <p className="eng-formula">
            <span className="code-f">f</span>(x) = <em>diseño</em> + <em>código</em> + <em>deploy</em>
          </p>

          <p className="text-[var(--text-muted)] text-base leading-relaxed mb-8 max-w-md">
            Sistemas comerciales, sitios web y software a la medida para negocios en Colombia. Desde Sincelejo, con
            enfoque en precisión, claridad y mantenibilidad.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              contactar()
            </a>
            <a href="#proyectos" className="btn btn-outline">
              ver_proyectos →
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <div className="code-panel">
            <div className="code-panel-bar" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <pre className="code-panel-body">
              <code>
                <span className="code-k">const</span> servicios = {'['}
                {'\n'}
                {'  '}
                <span className="code-s">&apos;sistemas_comerciales&apos;</span>,{'\n'}
                {'  '}
                <span className="code-s">&apos;sitios_web&apos;</span>,{'\n'}
                {'  '}
                <span className="code-s">&apos;software_medida&apos;</span>,{'\n'}
                {']'} <span className="code-k">as const</span>
                {'\n\n'}
                <span className="code-k">const</span> stack = {'['}
                <span className="code-s">&apos;Next.js&apos;</span>,{' '}
                <span className="code-s">&apos;TypeScript&apos;</span>,{' '}
                <span className="code-s">&apos;PostgreSQL&apos;</span>
                {']'}
                {'\n\n'}
                <span className="code-c">// Σ proyectos = </span>
                <span className="code-n">{BRAND.stats.proyectos}</span>
                <span className="code-c"> · clientes = </span>
                <span className="code-n">{BRAND.stats.clientes}</span>
                <span className="code-c"> · ubicación = </span>
                <span className="code-s">&apos;Sincelejo&apos;</span>
              </code>
            </pre>
          </div>

          <div className="relative pb-6">
            <div className="eng-photo-frame">
              <Image
                src={BRAND.portrait}
                alt={BRAND.name}
                fill
                className="object-cover object-top grayscale contrast-[1.05]"
                sizes="280px"
                priority
              />
            </div>
            <span className="eng-photo-coords">x₀, y₀ · sincelejo</span>
          </div>
        </div>
      </div>
    </section>
  );
}
