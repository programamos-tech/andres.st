import Link from 'next/link';
import { BRAND } from '@/lib/constants';
import { ScrollReveal } from '@/components/ScrollReveal';

/** Logos de las marcas que trabajan conmigo */
const CLIENT_LOGOS = [
  { src: '/aleya.jpeg', alt: 'Aleya' },
  { src: '/torocell4h.webp', alt: 'Torocell 4H' },
  { src: '/torocellsahagun.jpeg', alt: 'Torocell Sahagún' },
  { src: '/zonat.png', alt: 'Zonat' },
  { src: '/rogerbox.jpg', alt: 'Rogerbox' },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="hero-heading">{BRAND.username}</span>
          
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/tienda" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Catálogo
            </Link>
            <Link href="/ayuda" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Ayuda
            </Link>
            <Link href="/backstage" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
              Backstage
            </Link>
          </div>

          <a 
            href={`https://wa.me/${BRAND.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-[var(--text)] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* Hero + Marcas: primera pantalla */}
      <div className="min-h-screen flex flex-col hero-glow">
        <main className="flex-1 flex items-center px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
              
              {/* Text */}
              <div className="lg:pr-8">
                <p className="text-xl md:text-2xl font-semibold mb-6">
                  {BRAND.name} <span className="text-[var(--text-muted)] font-normal">| Software a la medida</span>
                </p>
                
                <h1 className="hero-heading text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 leading-[1.2]">
                  No adaptes tu empresa a un software.<br />
                  Construyamos el que tu marca necesita.
                </h1>
                
                <p className="text-[var(--text-muted)] text-lg mb-8 leading-relaxed">
                  Trabajo contigo para crear sistemas de gestión, control de equipos y seguimiento de clientes, programados desde cero para tu negocio y la forma en que realmente operas.
                </p>

                <a 
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  Iniciar mi proyecto a medida
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              {/* Avatar */}
              <div className="flex justify-center lg:justify-end order-first lg:order-last">
                <img 
                  src={BRAND.avatar}
                  alt={BRAND.name}
                  className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full object-cover shadow-[var(--shadow-mid)] ring-4 ring-[var(--border)]/30"
                />
              </div>

            </div>
          </div>
        </main>

        {/* Marcas que trabajan conmigo — mismo bloque que el hero */}
        <section className="border-t border-[var(--border)] py-8 md:py-10 overflow-hidden flex-shrink-0">
          <h2 className="hero-heading text-center text-xl md:text-2xl lg:text-3xl text-[var(--text)] mb-6 px-6 tracking-tight">
            Marcas que trabajan conmigo
          </h2>
          <div className="relative">
            <div className="logos-marquee-track">
              {[...Array(6)].flatMap(() => [...CLIENT_LOGOS, ...CLIENT_LOGOS]).map((logo, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center flex-shrink-0 px-6 md:px-8"
                >
                  <div className="rounded-full overflow-hidden w-20 h-20 md:w-28 md:h-28 bg-[var(--bg-secondary)] flex items-center justify-center">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="logo-marca w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Sistema a la medida en acción */}
      <section className="px-6 py-24 md:py-28 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="hero-heading text-center text-2xl md:text-3xl text-[var(--text)] mb-4 tracking-tight">
              Un sistema a la medida en acción
            </h2>
            <p className="text-center text-[var(--text-muted)] mb-10 text-lg">
              Así puede verse un sistema hecho para tu negocio: a tu ritmo, con lo que necesitás.
            </p>
            <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-mid)] border border-[var(--border)] bg-[var(--bg)] aspect-video flex items-center justify-center">
              <video
                className="w-full h-full object-contain"
                controls
                playsInline
                loop
                preload="metadata"
              >
                <source src={encodeURI('/video-bg (2).mp4')} type="video/mp4" />
                <source src="/sistema.mov" type="video/quicktime" />
                Tu navegador no soporta la reproducción del video.
              </video>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="px-6 py-24 md:py-28 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="hero-heading text-2xl md:text-3xl text-[var(--text)] mb-10 tracking-tight">
              Preguntas frecuentes
            </h2>
          </ScrollReveal>
          <div className="space-y-2">
            {[
              {
                q: '¿Cuánto cuesta un software a la medida?',
                a: 'Depende del alcance: qué módulos necesitas, integraciones, usuarios, etc. En la primera conversación revisamos tu necesidad y te doy una idea de inversión sin compromiso.',
              },
              {
                q: '¿Cuánto tiempo toma desarrollarlo?',
                a: 'Varía según la complejidad. Un sistema básico puede estar en unas semanas; uno más completo en dos o tres meses. Definimos plazos realistas desde el inicio.',
              },
              {
                q: '¿Qué necesito para empezar?',
                a: 'Una idea clara de qué quieres lograr: procesos que hoy te duelen, reportes que necesitas, quién usará el sistema. No hace falta saber de tecnología; yo te guío en el resto.',
              },
              {
                q: '¿Puedo hacer cambios después de que esté listo?',
                a: 'Sí. El software es tuyo y puede crecer con tu negocio. Agregamos funciones, ajustamos reportes o integramos nuevas herramientas cuando lo necesites.',
              },
              {
                q: '¿Cómo es el proceso de trabajo?',
                a: 'Platicamos tu necesidad, definimos alcance y tiempos, desarrollo por etapas y vas viendo avances. Probamos juntos y al final lo desplegamos. Soporte directo por WhatsApp o correo.',
              },
              {
                q: '¿En qué se diferencia de un software ya hecho (ERP, etc.)?',
                a: 'Un ERP genérico te obliga a adaptar tu operación a cómo viene programado. A la medida es al revés: el sistema se construye alrededor de cómo tú trabajas, sin módulos de más ni funciones que no usas.',
              },
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <details className="faq-item group border-b border-[var(--border)]">
                  <summary className="py-5 cursor-pointer list-none flex items-center justify-between gap-4 text-[var(--text)] font-medium text-left">
                    <span>{faq.q}</span>
                    <span className="faq-icon flex-shrink-0 w-5 h-5 text-[var(--text-muted)] transition-transform group-open:rotate-180" aria-hidden>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </summary>
                  <p className="pb-5 text-[var(--text-muted)] leading-relaxed pl-0">
                    {faq.a}
                  </p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-24 md:py-28 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="hero-heading text-2xl md:text-3xl lg:text-4xl text-[var(--text)] mb-4 tracking-tight">
              ¿Tenés un proceso que ningún software resuelve?
            </h2>
            <p className="text-[var(--text-muted)] text-lg mb-10 leading-relaxed">
              Contame tu idea o el problema que te duele del día a día. Vemos si lo armamos juntos.
            </p>
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=Hola%20Andrés,%20tengo%20una%20idea%20o%20un%20proceso%20que%20ningún%20software%20me%20resuelve.%20Me%20gustaría%20contarte.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
            >
              Escribime por WhatsApp
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg)]">
        <ScrollReveal className="max-w-6xl mx-auto" delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            
            {/* Brand */}
            <div>
              <p className="hero-heading mb-3">{BRAND.username}</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Software a la medida para negocios que quieren crecer con herramientas propias.
              </p>
            </div>

            {/* Contact */}
            <div>
              <p className="font-semibold mb-3">Contacto</p>
              <div className="space-y-2 text-sm">
                <a 
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  +57 300 206 1711
                </a>
                <a 
                  href={`mailto:${BRAND.email}`}
                  className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {BRAND.email}
                </a>
                <p className="flex items-center gap-2 text-[var(--text-muted)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {BRAND.location}
                </p>
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="font-semibold mb-3">Links</p>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  Inicio
                </Link>
                <Link href="/backstage" className="block text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  Dashboard
                </Link>
                <a 
                  href={`https://wa.me/${BRAND.whatsapp}?text=Hola%20Andrés,%20me%20interesa%20un%20proyecto`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  Iniciar proyecto
                </a>
              </div>
            </div>

          </div>

          {/* Línea + logo grande */}
          <div className="pt-10 border-t border-[var(--border)]">
            <div className="marca-fullview flex items-center justify-center px-6 pt-0 pb-0 mt-0 mb-0">
              <p
                className="hero-heading text-center text-[var(--text)] tracking-tight select-none w-full m-0"
                style={{ fontSize: 'clamp(3.5rem, 18vw, 11rem)', lineHeight: 1 }}
              >
                {BRAND.username}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-0">
              <p className="text-sm text-[var(--text-muted)]">
                © 2026 {BRAND.username}. Todos los derechos reservados.
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Hecho con café desde Colombia
              </p>
            </div>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  );
}
