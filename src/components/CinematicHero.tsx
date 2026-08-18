import Image from 'next/image';
import { BRAND, CTA_WHATSAPP_MESSAGE } from '@/lib/constants';

const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`;
const [firstName, lastName] = BRAND.name.split(' ');

export function CinematicHero() {
  return (
    <section className="cine-hero" id="top">
      <div className="cine-hero-split">
        <div className="cine-hero-copy">
          <div className="cine-name-row">
            <span className="cine-name-part">{firstName}</span>
            <span className="cine-name-part cine-name-stroke">{lastName}</span>
          </div>
          <p className="cine-tagline">{BRAND.heroIntro}</p>
          <div className="cine-cta-row">
            <a href="#proyectos" className="btn-cine btn-cine-solid">
              Ver proyectos
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-cine btn-cine-ghost">
              Escríbeme
            </a>
          </div>
        </div>

        <div className="cine-hero-portrait">
          <Image
            src={BRAND.portrait}
            alt="Andrew Russ, desarrollador web"
            fill
            quality={90}
            priority
            sizes="(max-width: 899px) 100vw, 80vw"
            className="cine-hero-portrait-img"
          />
          <div className="cine-hero-portrait-haze" aria-hidden />
        </div>
      </div>
    </section>
  );
}
