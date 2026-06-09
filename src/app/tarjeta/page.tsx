import Link from 'next/link';
import { BRAND } from '@/lib/constants';

export const metadata = {
  title: 'Tarjeta de presentación | Andrew Russ',
  description: 'Tarjeta vertical en PDF con servicios y contacto.',
};

export default function TarjetaPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center px-6 py-16">
      <p className="section-tag mb-3">Tarjeta digital</p>
      <h1 className="font-proxima-bold text-2xl sm:text-3xl mb-3 text-center">{BRAND.name}</h1>
      <p className="text-[var(--text-muted)] text-center max-w-md mb-10 leading-relaxed">
        PDF vertical optimizado para compartir por WhatsApp o mostrar en el teléfono a tus clientes.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <a
          href="/api/tarjeta/pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill btn-pill-solid text-center justify-center"
        >
          Ver / descargar PDF
        </a>
        <Link href="/" className="btn-pill btn-pill-outline text-center justify-center">
          Volver al sitio
        </Link>
      </div>

      <p className="mt-8 text-xs text-[var(--text-muted)] text-center max-w-xs">
        En iPhone: abre el PDF y usa Compartir → Guardar en Archivos. En Android: Descargar.
      </p>
    </main>
  );
}
