export const BRAND = {
  /** Nombre visible en web y propuestas */
  name: 'Andrew Russ',
  /** Handle legado (redes, URLs internas) */
  username: 'programamos',
  title: 'Desarrollador Web',
  pitch: 'Sistemas hechos para vender más y administrar mejor.',
  tagline: 'Desarrollador Web // Sistemas a la medida',
  heroIntro:
    'Desarrollador Web en Sincelejo — Sitios Web, POS, Inventario, Tiendas en línea y software a la medida.',
  location: 'Sincelejo, Colombia · Atención remota a todo el país',
  locationShort: 'Sincelejo, Colombia',
  stats: {
    proyectos: '17+',
    clientes: '10+',
    años: '7+',
  },
  role: 'Software Engineer',
  footerBio:
    'Software engineer con más de 7 años de experiencia trabajando para empresas de tecnología en Colombia y USA, en plataformas de retail, fintech y ciberseguridad.',
  avatar: '/andrew-portrait.jpg',
  portrait: '/andrew-portrait.jpg',
  heroBackground: '/andrew-portrait.jpg',
  whatsapp: '573152802343',
  email: 'andrewjruss7@gmail.com',
  phoneDisplay: '+57 315 280 2343',
  phoneShort: '315 280 2343',
  phoneTel: '+573152802343',
} as const;

/** Redes sociales */
export const SOCIAL_LINKS = [
  { href: 'https://instagram.com/andrewjruss7', label: 'Instagram', icon: 'instagram' },
  { href: 'https://tiktok.com/@programamos', label: 'TikTok', icon: 'tiktok' },
  { href: 'https://youtube.com/@programamos', label: 'YouTube', icon: 'youtube' },
] as const;

/** Mensaje por defecto para CTAs a WhatsApp */
export const CTA_WHATSAPP_MESSAGE =
  'Hola Andrew, tengo una idea / necesito digitalizar algo en mi negocio. ¿Podemos hablar sin compromiso?';

/** Mensaje para CTAs de la página Landing (sitios web) */
export const CTA_LANDING_WHATSAPP =
  'Hola Andrew, necesito un sitio web o landing. ¿Me cuentas cómo trabajas y rangos de inversión?';

/** Mensaje para servicios por licencia */
export const CTA_LICENCIA_WHATSAPP =
  'Hola Andrew, me interesa un sistema de gestión comercial con licencia anual. ¿Podemos ver si encaja con mi negocio?';

/** Links del navbar */
export const NAV_LINKS: readonly { href: string; label: string }[] = [
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#proyectos', label: 'Portafolio' },
  { href: '/#contacto', label: 'Contacto' },
];
