import Link from 'next/link';
import { BRAND, CTA_WHATSAPP_MESSAGE, NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';
import { ScrollReveal } from '@/components/ScrollReveal';
import { HomeNav } from '@/components/HomeNav';
import { VideoFromMidpoint } from '@/components/VideoFromMidpoint';
import { ScrollToCenterVideo } from '@/components/ScrollToCenterVideo';
import { PreviewSimulation } from '@/components/tienda/PreviewSimulation';
import { PRODUCTOS } from '@/lib/tienda-productos';

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
    <div id="top" className="min-h-screen flex flex-col scroll-mt-4">
      <HomeNav />

      {/* Hero + Marcas: primera pantalla */}
      <div className="min-h-screen flex flex-col hero-glow">
        <main className="flex-1 flex items-center px-6 py-12 md:py-16">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
              
              {/* Text */}
              <div className="lg:pr-8">
                <h1 className="hero-heading text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-4 leading-tight md:leading-[1.2] max-w-xl tracking-tight font-bold text-[var(--text)]">
                  ¿Los sistemas del mercado no resuelven tu problema?
                </h1>
                
                <h2 className="hero-heading text-lg sm:text-xl md:text-2xl lg:text-3xl text-[var(--accent)] mb-4 tracking-tight font-bold">
                  Construimos el software que tu negocio necesita.
                </h2>
                
                <p className="text-[var(--text-muted)] text-base md:text-lg mb-6 leading-relaxed">
                  No adaptamos tu empresa a un software genérico.
                  <br />
                  Programamos desde cero lo que realmente necesitas.
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <a 
                    href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary inline-flex items-center gap-2"
                  >
                    Cuéntanos tu problema
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <a 
                    href="#como-funciona"
                    className="btn btn-outline inline-flex items-center gap-2"
                  >
                    ¿Cómo trabajamos?
                  </a>
                </div>

                <p className="text-[var(--text-muted)] text-sm md:text-base flex flex-col gap-1">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined icon-sm text-[var(--status-ok)]">check_circle</span> 10 negocios ya usan software hecho por nosotros</span>
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined icon-sm text-[var(--status-ok)]">check_circle</span> Desde Sincelejo para toda Colombia</span>
                </p>
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

        {/* Marcas que trabajan con nosotros — mismo bloque que el hero */}
        <section className="border-t border-[var(--border)] py-8 md:py-10 overflow-hidden flex-shrink-0">
          <h2 className="hero-heading text-center text-xl md:text-2xl lg:text-3xl text-[var(--text)] mb-6 px-6 tracking-tight">
            Marcas que trabajan con nosotros
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

      {/* ¿Cuándo necesitas software a la medida? */}
      <section className="px-6 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="hero-heading text-2xl md:text-3xl text-[var(--text)] mb-10 text-center tracking-tight">
              ¿Cuándo necesitas software a la medida?
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10">
            {[
              { icon: 'block', title: 'Los sistemas del mercado no funcionan', text: 'Probaste opciones de facturación, contabilidad, inventario... ninguno hace lo que tu negocio necesita.' },
              { icon: 'swap_horiz', title: 'Te obligan a adaptar tu proceso', text: 'El software dice "así se hace" pero tu negocio funciona diferente.' },
              { icon: 'payments', title: 'Pagas por funciones que no usas', text: 'Suscripciones caras con módulos que nunca tocaste.' },
              { icon: 'lightbulb', title: 'Necesitás algo único', text: 'Tu operación es específica. No hay software para eso.' },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 md:p-6">
                  <h3 className="font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined icon-lg text-[var(--text-muted)]">{s.icon}</span>
                    {s.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed">{s.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="rounded-xl border-2 border-[var(--accent)] bg-[var(--bg)] p-6 md:p-8 text-center">
              <h3 className="hero-heading text-xl md:text-2xl text-[var(--text)] mb-3 tracking-tight flex items-center justify-center gap-2">
                <span className="material-symbols-outlined icon-xl text-[var(--accent)]">handshake</span>
                Ahí entramos nosotros
              </h3>
              <p className="text-[var(--text-muted)] text-base md:text-lg leading-relaxed">
                Nos sentamos contigo, entendemos cómo trabajas,
                <br />
                y programamos el sistema que resuelva tu problema.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Sistema a la medida en acción — scroll horizontal con 3 videos */}
      <section className="py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
          <ScrollReveal>
            <h2 className="hero-heading text-center text-2xl md:text-3xl text-[var(--text)] mb-4 tracking-tight">
              Un sistema a la medida en acción
            </h2>
            <p className="text-center text-[var(--text-muted)] text-lg">
              Así puede verse un sistema hecho para tu negocio: a tu ritmo, con lo que necesitas. Usá las flechas o deslizá para ver los tres proyectos.
            </p>
          </ScrollReveal>
        </div>
        <ScrollReveal>
          <div className="w-full">
            <ScrollToCenterVideo centerIndex={1} showArrows>
              <div className="flex-shrink-0 w-[92vw] max-w-4xl snap-center sm:w-[88vw] md:w-[78vw]">
                <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-mid)] border border-[var(--border)] bg-[var(--bg)] aspect-video flex items-center justify-center">
                  <VideoFromMidpoint
                    src="/zpnat.mp4"
                    title="Sistema de seguimiento de clientes y domicilios"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex-shrink-0 w-[92vw] max-w-4xl snap-center sm:w-[88vw] md:w-[78vw]">
                <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-mid)] border border-[var(--border)] bg-[var(--bg)] aspect-video flex items-center justify-center">
                  <VideoFromMidpoint
                    src="/rogerbox.mp4"
                    title="Plataforma de cursos y gestión de un gimnasio"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex-shrink-0 w-[92vw] max-w-4xl snap-center sm:w-[88vw] md:w-[78vw]">
                <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-mid)] border border-[var(--border)] bg-[var(--bg)] aspect-video flex items-center justify-center">
                  <VideoFromMidpoint
                    title="Distribuidora de productos con diferentes tiendas"
                    className="w-full h-full object-contain"
                  >
                    <source src={encodeURI('/video-bg (2).mp4')} type="video/mp4" />
                    <source src="/sistema.mov" type="video/quicktime" />
                    Tu navegador no soporta la reproducción del video.
                  </VideoFromMidpoint>
                </div>
              </div>
            </ScrollToCenterVideo>
          </div>
        </ScrollReveal>
      </section>

      {/* Funcionalidades e integraciones — marquee con más presencia */}
      <section className="py-20 md:py-24 border-t border-[var(--border)] bg-[var(--bg-secondary)] relative overflow-hidden">
        {/* Fondo sutil para dar profundidad */}
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, var(--accent) 0%, transparent 60%)' }} aria-hidden />
        <div className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
            <ScrollReveal>
              <h2 className="hero-heading text-2xl md:text-4xl text-[var(--text)] text-center tracking-tight mb-3">
                Funcionalidades e integraciones para tu sistema
              </h2>
              <p className="text-center text-[var(--text-muted)] text-base md:text-lg max-w-2xl mx-auto">
                Reportes, dashboards, integraciones con WhatsApp o pasarelas de pago, y sistemas completos. Todo a la medida.
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <div className="w-full overflow-x-hidden modules-marquee-wrap">
              <div className="modules-marquee-track py-4">
                {[...PRODUCTOS, ...PRODUCTOS].map((p, i) => (
                  <Link
                    key={`${p.id}-${i}`}
                    href={`/tienda/${p.id}`}
                    className={`module-card flex-shrink-0 w-[300px] min-w-[300px] rounded-2xl border-l-4 border-[var(--border)] bg-[var(--bg)] p-5 flex flex-col group no-underline text-inherit ${
                      p.tipo === 'funcionalidad'
                        ? 'hover:border-l-[var(--accent)]'
                        : p.tipo === 'integracion'
                          ? 'hover:border-l-[var(--brand-cafe)]'
                          : 'hover:border-l-[var(--text-muted)]'
                    }`}
                  >
                    <div className="mb-4 flex-shrink-0 rounded-lg overflow-hidden border border-[var(--border)]/60">
                      <PreviewSimulation tipo={p.preview} tipoProducto={p.tipo} />
                    </div>
                    <span
                      className={`inline-flex w-fit px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide mb-2 ${
                        p.tipo === 'funcionalidad'
                          ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                          : p.tipo === 'integracion'
                            ? 'bg-[var(--brand-cafe)]/15 text-[var(--brand-cafe)]'
                            : 'bg-[var(--text-muted)]/15 text-[var(--text-muted)]'
                      }`}
                    >
                      {p.tipo === 'funcionalidad' ? 'Funcionalidad' : p.tipo === 'integracion' ? 'Integración' : 'Sistema'}
                    </span>
                    <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2 text-base">{p.titulo}</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-3 flex-1">{p.descripcion}</p>
                    {p.precio && (
                      <p className="text-xs font-medium text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--border)]/60">{p.precio}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12">
            <ScrollReveal>
              <div className="text-center">
                <Link
                  href="/tienda"
                  className="btn btn-primary inline-flex items-center gap-2 text-base px-6 py-3"
                >
                  Ver catálogo completo
                  <span className="material-symbols-outlined icon-sm">arrow_forward</span>
                </Link>
                <p className="text-sm text-[var(--text-muted)] mt-4">
                  Explorá módulos y sistemas. Elegí lo que necesitas y lo cotizamos.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Cómo trabajamos — Kanban por etapas */}
      <section id="como-funciona" className="px-4 sm:px-6 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="hero-heading text-2xl md:text-3xl text-[var(--text)] mb-2 text-center tracking-tight">
              Cómo trabajamos
            </h2>
            <p className="text-center text-[var(--text-muted)] text-sm md:text-base mb-8">
              Cada columna es una etapa. El ticket es lo que hacemos ahí.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div
              className="overflow-x-auto md:overflow-visible pb-4 md:pb-0 scroll-smooth snap-x snap-mandatory md:snap-none"
              style={{ scrollbarGutter: 'stable' }}
            >
              <div className="grid grid-flow-col auto-cols-[260px] md:grid-flow-row md:grid-cols-2 lg:grid-cols-5 md:auto-cols-auto gap-3 md:gap-4 min-w-0">
              {[
                { icon: 'chat', title: 'Conversamos', text: 'Te escuchamos. Qué problema tienes, cómo trabajas hoy, qué necesitas.', time: '30-60 min' },
                { icon: 'visibility', title: 'Entendemos', text: 'Vamos a tu negocio (o videollamada). Observamos cómo operas realmente.', time: '2-3 h' },
                { icon: 'design_services', title: 'Diseñamos juntos', text: 'Te mostramos cómo se vería el sistema. Mockups, flujos, funciones.', time: '1 sem' },
                { icon: 'code', title: 'Programamos', text: 'Construimos el sistema desde cero. Te mostramos avances cada semana.', time: '2-8 sem' },
                { icon: 'install_mobile', title: 'Implementamos', text: 'Instalamos, capacitamos a tu equipo. Garantía 1 año en todos los sistemas.', time: '1 sem +' },
              ].map((step, i) => (
                <div
                  key={i}
                  className="kanban-column flex-shrink-0 w-[260px] md:w-auto min-w-0 snap-center rounded-xl border border-[var(--border)] bg-[var(--bg)]/80 overflow-hidden"
                >
                  <div className="kanban-column-header px-3 py-2.5 border-b border-[var(--border)] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--accent)] text-lg">{step.icon}</span>
                    <span className="font-semibold text-[var(--text)] text-sm">{step.title}</span>
                  </div>
                  <div className="p-3">
                    <div className="kanban-ticket rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 shadow-[var(--shadow-soft)]">
                      <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-3">{step.text}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-medium">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {step.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="flex justify-center mt-10">
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-cute inline-flex items-center gap-2"
              >
                Cuéntanos sobre tu proyecto
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Cómo funciona la inversión */}
      <section className="px-6 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="hero-heading text-2xl md:text-3xl text-[var(--text)] mb-6 text-center tracking-tight">
              Cómo funciona la inversión
            </h2>
            <p className="text-center text-[var(--text-muted)] text-lg mb-10">
              No es una suscripción mensual infinita.
              <br />
              Es como comprar un carro: lo pagas, es tuyo.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <ScrollReveal delay={0.1} className="h-full">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 h-full flex flex-col">
                <h3 className="font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined icon-lg text-[var(--accent)]">code</span>
                  Desarrollo
                </h3>
                <p className="text-[var(--text-muted)] text-sm mb-3">Como cuando compras un carro: eliges color, tapicería, parlantes. Así el software a la medida.</p>
                <ul className="text-sm text-[var(--text-muted)] space-y-1 mb-4 list-disc pl-5">
                  <li>Eliges lo que necesitas: facturación, cartera, inventarios, clientes, reportes, etc.; lo programamos a tu medida</li>
                  <li>Un solo pago, una única vez. Es tuyo para siempre (no suscripción eterna)</li>
                  <li>Planes a cuotas en la negociación: 50 y 50, 40-30-30 u otras combinaciones</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15} className="h-full">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 h-full flex flex-col">
                <h3 className="font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined icon-lg text-[var(--accent)]">build_circle</span>
                  Soporte Anual
                </h3>
                <p className="text-[var(--text-muted)] text-sm mb-4">Como el cambio de aceite de un carro: hay que hacerlo para que tu sistema funcione bien. Hosting, seguridad, backups, actualizaciones, soporte técnico. Te lo detallamos en la propuesta comercial.</p>
                <ul className="text-sm text-[var(--text-muted)] space-y-1 mb-4 list-disc pl-5">
                  <li>Servidor dedicado (no compartido)</li>
                  <li>Base de datos individual</li>
                  <li>SSL, backups diarios</li>
                  <li>Soporte por WhatsApp</li>
                </ul>
                <p className="text-sm text-[var(--text-muted)] mt-auto">Si prefieres, puedes hostearlo tú mismo y encargarte del mantenimiento.</p>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <p className="text-center text-sm text-[var(--text-muted)]">
              Con nosotros pagas el desarrollo una vez y el software es tuyo. Sin suscripción eterna. Los números concretos los ves en la propuesta comercial.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Qué marcas, negocios o empresas pueden tener software a la medida */}
      <section className="px-6 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="hero-heading text-2xl md:text-3xl text-[var(--text)] mb-4 text-center tracking-tight">
              ¿Qué marcas, negocios o empresas pueden tener software a la medida?
            </h2>
            <p className="text-center text-[var(--text-muted)] text-base mb-10 max-w-2xl mx-auto">
              Cualquier negocio con procesos propios que no encajan en un software genérico. Algunos ejemplos:
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: 'store', title: 'Retail y tiendas', text: 'Tiendas físicas u online que necesitan inventario, ventas, domicilios o facturación a su medida.' },
              { icon: 'restaurant', title: 'Restaurantes y gastronomía', text: 'Pedidos, cocina, delivery, caja o reservas. El flujo que ya tienes, digital.' },
              { icon: 'fitness_center', title: 'Gimnasios y estudios', text: 'Clases, reservas, membresías, pagos e instructores en un solo sistema.' },
              { icon: 'medical_services', title: 'Clínicas y consultorios', text: 'Agenda, historiales, turnos y recordatorios sin depender de plataformas genéricas.' },
              { icon: 'school', title: 'Academias y centros educativos', text: 'Cursos, estudiantes, notas, asistencia o plataforma de aprendizaje propia.' },
              { icon: 'business_center', title: 'Pymes y equipos de trabajo', text: 'Cualquier operación con procesos únicos: si no existe el software, lo construimos.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.04}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 h-[172px] flex flex-col">
                  <h3 className="font-semibold text-[var(--text)] mb-2 flex items-center gap-2 flex-shrink-0">
                    <span className="material-symbols-outlined icon-lg text-[var(--accent)]">{item.icon}</span>
                    <span className="line-clamp-1">{item.title}</span>
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed flex-1 min-h-0 line-clamp-3">{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
          <ScrollReveal>
            <div className="space-y-2">
              {[
                {
                  q: '¿Qué es un software a la medida?',
                  a: 'Es un sistema hecho específicamente para tu negocio: lo programamos desde cero según tus procesos, tu forma de trabajar y lo que necesitas. No es un producto empaquetado que adaptas; es la herramienta que tu marca necesita, sin módulos de más ni pantallas que no usas.',
                },
                {
                  q: '¿Cuánto cuesta un software a la medida?',
                  a: 'Depende del alcance. En la primera conversación revisamos tu necesidad y te pasamos la inversión en una propuesta comercial, sin compromiso. Desarrollo y soporte anual se detallan ahí.',
                },
                {
                  q: '¿El software es mío o lo alquilo?',
                  a: 'Es tuyo. Pagas el desarrollo una vez y el software es tuyo para siempre. No dependes de que sigamos existiendo; puedes llevártelo a otro proveedor si quisieras. No es suscripción eterna.',
                },
                {
                  q: '¿Mis datos están separados de otros clientes?',
                  a: 'Sí. Cada cliente tiene su propia base de datos y, si contratas soporte con nosotros, servidor dedicado. No compartes infraestructura con nadie.',
                },
                {
                  q: '¿Cuánto tiempo toma desarrollarlo?',
                  a: 'Varía según la complejidad. Un sistema básico puede estar en unas semanas; uno más completo en dos o tres meses. Definimos plazos realistas desde el inicio.',
                },
                {
                  q: '¿Qué necesito para empezar?',
                  a: 'Una idea clara de qué quieres lograr: procesos que hoy te duelen, reportes que necesitas, quién usará el sistema. No hace falta saber de tecnología; te guiamos en el resto.',
                },
                {
                  q: '¿Puedo hacer cambios después de que esté listo?',
                  a: 'Sí. El software es tuyo y puede crecer con tu negocio. Agregamos funciones, ajustamos reportes o integramos nuevas herramientas cuando lo necesites.',
                },
                {
                  q: '¿Cómo es el proceso de trabajo?',
                  a: 'Conversamos tu necesidad, definimos alcance y tiempos, desarrollamos por etapas y vas viendo avances. Probamos juntos y al final lo desplegamos. Soporte directo por WhatsApp.',
                },
                {
                  q: '¿En qué se diferencia de un software ya hecho (ERP, etc.)?',
                  a: 'Un ERP genérico te obliga a adaptar tu operación a cómo viene programado. A la medida es al revés: el sistema se construye alrededor de cómo tú trabajas, sin módulos de más ni funciones que no usas.',
                },
              ].map((faq, i) => (
                <details key={i} className="faq-item group border-b border-[var(--border)]">
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
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Comparación SaaS vs a la medida — qué trae cada uno */}
      <section className="px-6 py-24 md:py-28 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="hero-heading text-2xl md:text-3xl text-[var(--text)] mb-10 text-center tracking-tight">
              SaaS vs software a la medida
            </h2>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
              <table className="w-full text-left text-base">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="py-5 px-5 md:px-8 font-semibold text-[var(--text)]">Qué incluye</th>
                    <th className="py-5 px-5 md:px-8 font-semibold text-[var(--text-muted)] text-center w-28">SaaS</th>
                    <th className="py-5 px-5 md:px-8 font-semibold text-[var(--text)] text-center w-28">A la medida</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--text-muted)]">
                  {[
                    { feature: 'Se adapta a tu forma de trabajar', saas: false, medida: true },
                    { feature: 'Solo las funciones que necesitas', saas: false, medida: true },
                    { feature: 'El producto es tuyo (no suscripción eterna)', saas: false, medida: true },
                    { feature: 'Cambios cuando tú lo necesites', saas: false, medida: true },
                    { feature: 'Datos en tu servidor o tu nube', saas: false, medida: true },
                    { feature: 'Listo en poco tiempo (plantilla fija)', saas: true, medida: false },
                    { feature: 'Pago mensual predecible (suscripción)', saas: true, medida: false },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-[var(--border)] last:border-b-0">
                      <td className="py-4 px-5 md:px-8">{row.feature}</td>
                      <td className="py-4 px-5 md:px-8 text-center">
                        {row.saas ? <span className="material-symbols-outlined icon-sm text-[var(--status-ok)]">check_circle</span> : <span className="text-[var(--text-muted)]/30">—</span>}
                      </td>
                      <td className="py-4 px-5 md:px-8 text-center">
                        {row.medida ? <span className="material-symbols-outlined icon-sm text-[var(--status-ok)]">check_circle</span> : <span className="text-[var(--text-muted)]/30">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-24 md:py-28 border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="hero-heading text-2xl md:text-3xl lg:text-4xl text-[var(--text)] mb-4 tracking-tight">
              ¿Los sistemas del mercado no resuelven tu problema?
            </h2>
            <p className="text-[var(--text-muted)] text-lg mb-8 leading-relaxed">
              Cuéntanos qué necesitas.
              <br />
              Si podemos resolverlo con software a la medida, te decimos cómo.
              <br />
              Si no, te recomendamos qué usar.
            </p>
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(CTA_WHATSAPP_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
            >
              Iniciar conversación por WhatsApp
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <p className="text-[var(--text-muted)] text-sm mt-8 flex flex-col gap-1 items-center">
              <span className="flex items-center gap-2"><span className="material-symbols-outlined icon-sm text-[var(--status-ok)]">check_circle</span> 10 negocios ya usan software hecho por nosotros</span>
              <span className="flex items-center gap-2"><span className="material-symbols-outlined icon-sm text-[var(--status-ok)]">check_circle</span> Respondemos personalmente</span>
              <span className="flex items-center gap-2"><span className="material-symbols-outlined icon-sm text-[var(--status-ok)]">check_circle</span> Desde Sincelejo, Colombia</span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 md:py-20 border-t border-[var(--border)] bg-[var(--bg)]">
        <ScrollReveal className="max-w-6xl mx-auto" delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 mb-10 md:gap-x-16">
            
            {/* Brand */}
            <div className="min-w-0">
              <p className="hero-heading text-2xl sm:text-3xl md:text-4xl text-[var(--text)] tracking-tight mb-3">{BRAND.username}</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Somos un estudio. No programamos software por programar: pensamos en soluciones y las hacemos realidad con software.
              </p>
            </div>

            {/* Contact */}
            <div className="min-w-0">
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
                <div className="flex items-center gap-3 mt-2">
                  <a href={SOCIAL_LINKS[0].href} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href={SOCIAL_LINKS[1].href} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" aria-label="TikTok">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  </a>
                  <a href={SOCIAL_LINKS[2].href} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" aria-label="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Links (mismos que el navbar) */}
            <div className="min-w-0">
              <p className="font-semibold mb-3">Links</p>
              <div className="space-y-2 text-sm">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Línea + logo grande */}
          <div className="pt-10 border-t border-[var(--border)]">
            <div className="marca-fullview flex flex-col items-center justify-center px-4 sm:px-6 pt-0 pb-0 mt-0 mb-0 min-w-0">
              <p
                className="hero-heading text-center text-[var(--text)] tracking-tight select-none w-full m-0"
                style={{ fontSize: 'clamp(1.5rem, 8vw, 11rem)', lineHeight: 1 }}
              >
                {BRAND.username}
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-[0.35em] mt-2 font-normal opacity-80">
                Estudio de desarrollo de software
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-4 pt-6 pb-0 text-center sm:text-left">
              <p className="text-sm text-[var(--text-muted)]">
                © 2026 {BRAND.username}. Todos los derechos reservados.
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Hecho desde Sincelejo para el mundo.
              </p>
            </div>
            <div className="flex justify-center pt-6">
              <a
                href="#top"
                className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                aria-label="Volver arriba"
              >
                <span className="material-symbols-outlined text-xl">arrow_upward</span>
                Volver arriba
              </a>
            </div>
          </div>
        </ScrollReveal>
      </footer>
    </div>
  );
}
