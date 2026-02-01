import Link from 'next/link';
import { BRAND } from '@/lib/constants';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-semibold">{BRAND.username}</span>
          
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-medium">
              Home
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

      {/* Hero */}
      <main className="min-h-screen flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
            
            {/* Text */}
            <div className="lg:pr-8">
              <p className="text-xl md:text-2xl font-semibold mb-6">
                {BRAND.name} <span className="text-[var(--text-muted)] font-normal">| Software a la medida</span>
              </p>
              
              <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-8 leading-[1.2]">
                No adaptes tu empresa a un software. Construyamos el que tu marca necesita.
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
                className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full object-cover"
              />
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            
            {/* Brand */}
            <div>
              <p className="font-semibold mb-3">{BRAND.username}</p>
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

          {/* Bottom */}
          <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              © 2026 {BRAND.username}. Todos los derechos reservados.
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              Hecho con cafe desde Colombia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
