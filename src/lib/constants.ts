export const BRAND = {
  /** Nombre visible en web y propuestas */
  name: 'Andrés Russ',
  /** Handle legado (redes, URLs internas) */
  username: 'programamos',
  title: 'Software Engineer',
  location: 'Sincelejo, Colombia',
  avatar: '/andrew.jpg',
  /** Foto principal landing */
  portrait: '/andresruss.png',
  whatsapp: '573002061711',
  email: 'andresruss.st@gmail.com',
} as const;

/** Redes sociales */
export const SOCIAL_LINKS = [
  { href: 'https://instagram.com/programamos', label: 'Instagram', icon: 'instagram' },
  { href: 'https://tiktok.com/@programamos', label: 'TikTok', icon: 'tiktok' },
  { href: 'https://youtube.com/@programamos', label: 'YouTube', icon: 'youtube' },
] as const;

/** Mensaje por defecto para CTAs a WhatsApp (hablan con Andrés) */
export const CTA_WHATSAPP_MESSAGE =
  'Hola Andrés, tengo una idea / necesito digitalizar algo en mi negocio. ¿Podemos hablar sin compromiso?';

/** Mensaje para CTAs de la página Landing (sitios web) */
export const CTA_LANDING_WHATSAPP =
  'Hola Andrés, necesito un sitio web o landing. ¿Me cuentas cómo trabajas y rangos de inversión?';

/** Mensaje para servicios por licencia */
export const CTA_LICENCIA_WHATSAPP =
  'Hola Andrés, me interesa un sistema de gestión comercial con licencia anual. ¿Podemos ver si encaja con mi negocio?';

/** Links del navbar y del footer (vacío: sin menú de navegación) */
export const NAV_LINKS: readonly { href: string; label: string }[] = [];
