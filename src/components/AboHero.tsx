import Image from 'next/image';
import { BRAND, CTA_WHATSAPP_MESSAGE } from '@/lib/constants';

const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`;

export function AboHero() {
  return (
    <section className="abo-hero" id="top">
      <div className="abo-hero-grid">
        <div>
          <h1 className="abo-headline">
            <span className="abo-headline-solid">Desarrollo</span>
            <span className="abo-headline-outline">Web &amp;</span>
            <span className="abo-headline-solid">Software</span>
          </h1>

          <p className="abo-bio">
            Hola, soy <strong>{BRAND.name}</strong>. Ingeniero de software en Sincelejo, Colombia. Construyo sitios web,
            sistemas comerciales y software a la medida — con interfaces claras y código que escala.
          </p>

          <div className="abo-cta-row">
            <a href="#proyectos" className="btn-pill btn-pill-solid">
              Ver proyectos
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-outline">
              Escríbeme
            </a>
          </div>
        </div>

        <div className="abo-photo-wrap">
          <div className="abo-photo">
            <Image
              src={BRAND.portrait}
              alt={BRAND.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 90vw, 400px"
              priority
            />
          </div>
        </div>
      </div>

      <a href="#servicios" className="abo-scroll no-underline text-inherit">
        Scroll down
      </a>
    </section>
  );
}
