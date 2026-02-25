export const BRAND = {
  name: 'Programamos',
  username: 'programamos',
  location: 'Sincelejo, Colombia',
  avatar: '/andrew.jpg',
  whatsapp: '573002061711',
  email: 'andresruss.st@gmail.com',
} as const;

/** Redes sociales */
export const SOCIAL_LINKS = [
  { href: 'https://instagram.com/programamos', label: 'Instagram', icon: 'instagram' },
  { href: 'https://tiktok.com/@programamos', label: 'TikTok', icon: 'tiktok' },
  { href: 'https://youtube.com/@programamos', label: 'YouTube', icon: 'youtube' },
] as const;

/** Mensaje por defecto para CTAs a WhatsApp */
export const CTA_WHATSAPP_MESSAGE = 'Hola, estoy necesitando un desarrollo de software, me podrían brindar más información?';

/** Mensaje para CTAs de la página Landing (sitios web) */
export const CTA_LANDING_WHATSAPP = 'Hola, necesito un sitio web o landing, ¿me pueden contar cómo trabajan y cuánto sería?';

/** Links del navbar y del footer (una sola fuente de verdad) */
export const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/landing', label: 'Landing' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/andrebot', label: 'Andrebot' },
  { href: '/backstage', label: 'Backstage' },
] as const;
