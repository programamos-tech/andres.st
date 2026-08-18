import { BRAND, CTA_WHATSAPP_MESSAGE } from '@/lib/constants';
import { PROYECTOS } from '@/lib/proyectos';
import { CinematicNav } from '@/components/CinematicNav';
import { CinematicHero } from '@/components/CinematicHero';
import { ProjectCard } from '@/components/ProjectCard';
import { RevealOnScroll } from '@/components/RevealOnScroll';

const SERVICIOS = [
  {
    idx: '01',
    titulo: 'Sistemas comerciales',
    descripcion: 'Inventario, ventas, clientes y reportes. Licencia anual con implementación y capacitación.',
  },
  {
    idx: '02',
    titulo: 'Sitios web',
    descripcion: 'Landing pages y sitios corporativos. Diseño limpio, responsive y enfocados en conversión.',
  },
  {
    idx: '03',
    titulo: 'Software a la medida',
    descripcion: 'Cuando tu negocio necesita algo único: lo diseño, desarrollo y dejo en producción.',
  },
] as const;

const whatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`;

export default function Home() {
  return (
    <div>
      <CinematicNav />
      <CinematicHero />

      <section id="servicios" className="section-wrap scroll-mt-20 border-t border-[var(--border)]">
        <RevealOnScroll>
          <p className="section-tag">Servicios</p>
          <h2 className="section-title">Lo que hago</h2>
        </RevealOnScroll>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            {SERVICIOS.map((s, i) => (
              <RevealOnScroll key={s.idx} as="article" className="service-row" delay={i * 100}>
                <span className="service-idx">{s.idx}</span>
                <div>
                  <h3 className="service-name">{s.titulo}</h3>
                  <p className="service-desc">{s.descripcion}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <RevealOnScroll id="sobre-mi" className="scroll-mt-24" delay={150}>
            <p className="section-tag">Sobre mí</p>
            <p className="text-[var(--text-muted)] leading-relaxed mb-8">
              Trabajo desde Sincelejo, Colombia. Llevo años construyendo herramientas digitales para negocios
              locales: más de 17 proyectos y más de 10 clientes. Me importa que el software sea fácil de usar,
              estable y fácil de mantener.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { val: BRAND.stats.proyectos, lbl: 'Proyectos' },
                { val: BRAND.stats.clientes, lbl: 'Clientes' },
                { val: BRAND.stats.años, lbl: 'Años' },
              ].map((stat, i) => (
                <RevealOnScroll key={stat.lbl} delay={200 + i * 80}>
                  <div className="stat-box">
                    <p className="stat-val">{stat.val}</p>
                    <p className="stat-lbl">{stat.lbl}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section id="proyectos" className="section-wrap scroll-mt-20 bg-[var(--bg-secondary)] border-y border-[var(--border)]">
        <RevealOnScroll>
          <p className="section-tag">Portafolio</p>
          <h2 className="section-title">Proyectos</h2>
        </RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROYECTOS.map((p, i) => (
            <RevealOnScroll key={p.id} delay={(i % 3) * 100}>
              <ProjectCard proyecto={p} />
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section id="contacto" className="section-wrap scroll-mt-20 border-t border-[var(--border)]">
        <RevealOnScroll>
          <p className="section-tag">Contacto</p>
          <h2 className="section-title">Hablemos</h2>
          <p className="text-[var(--text-muted)] max-w-md mb-8 leading-relaxed">
            ¿Tienes un proyecto en mente? La primera conversación es sin costo. Escríbeme, llámame o mándame un correo.
          </p>
          <div className="contact-actions">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-pill btn-pill-solid">
              WhatsApp
            </a>
            <a href={`tel:${BRAND.phoneTel}`} className="btn-pill btn-pill-outline">
              {BRAND.phoneShort}
            </a>
            <a href={`mailto:${BRAND.email}`} className="btn-pill btn-pill-outline">
              {BRAND.email}
            </a>
          </div>
          <p className="mt-6 text-sm text-[var(--text-muted)]">{BRAND.location}</p>
        </RevealOnScroll>
      </section>

      <RevealOnScroll as="footer" className="site-footer" delay={100}>
        <div className="site-footer-inner">
          <div className="footer-brand">
            <span className="cine-logo !text-sm">{BRAND.name}</span>
            <p className="footer-role">{BRAND.role}</p>
          </div>
          <p className="footer-bio">{BRAND.footerBio}</p>
        </div>
      </RevealOnScroll>
    </div>
  );
}
