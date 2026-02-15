export const BRAND = {
  name: 'Andrés Russ',
  username: 'andresruss.st',
  location: 'Sincelejo, Colombia',
  avatar: '/andrew.jpg',
  whatsapp: '573002061711',
  email: 'andresruss.st@gmail.com',
} as const;

/** Redes sociales (mismo user andresruss.st) */
export const SOCIAL_LINKS = [
  { href: 'https://instagram.com/andresruss.st', label: 'Instagram', icon: 'instagram' },
  { href: 'https://tiktok.com/@andresruss.st', label: 'TikTok', icon: 'tiktok' },
  { href: 'https://youtube.com/@andresruss.st', label: 'YouTube', icon: 'youtube' },
] as const;

/** Mensaje por defecto para CTAs a WhatsApp */
export const CTA_WHATSAPP_MESSAGE = 'Hola, estoy necesitando un desarrollo de software, me podrían brindar más información?';

/** Links del navbar y del footer (una sola fuente de verdad) */
export const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/andrebot', label: 'Andrebot' },
  { href: '/backstage', label: 'Backstage' },
] as const;
