import Image from 'next/image';
import { BRAND, CTA_WHATSAPP_MESSAGE } from '@/lib/constants';

const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`;
const [firstName, lastName] = BRAND.name.split(' ');

export function CinematicHero() {
  return (
    <section className="cine-hero" id="top">
      <Image
        src={BRAND.heroBackground}
        alt="Andrew Russ en su escritorio"
        fill
        className="cine-hero-img"
        sizes="100vw"
        priority
      />
      <div className="cine-hero-overlay" aria-hidden />
      <div className="cine-grain" aria-hidden />
      <div className="cine-vignette" aria-hidden />

      <div className="cine-hero-inner cine-hero-inner--bottom">
        <div className="cine-bottom">
          <div className="cine-name-row">
            <span className="cine-name-part">{firstName}</span>
            <span className="cine-name-part cine-name-stroke">{lastName}</span>
          </div>

          <p className="cine-tagline">{BRAND.heroIntro}</p>

          <div className="cine-cta-row cine-cta-row--center">
            <a href="#proyectos" className="btn-cine btn-cine-solid">
              Ver proyectos
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-cine btn-cine-ghost">
              Escríbeme
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
