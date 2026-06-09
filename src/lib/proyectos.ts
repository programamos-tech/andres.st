export type CategoriaProyecto = 'Sistema' | 'Sitio web';

export type Proyecto = {
  id: string;
  titulo: string;
  cliente: string;
  categoria: CategoriaProyecto;
  descripcion: string;
  /** Video completo — solo se carga al abrir el modal */
  video?: string;
  /** Miniatura estática para la card */
  poster?: string;
  imagen?: string;
  url?: string;
  logo?: string;
  pendiente?: boolean;
};

/** Vitrina de trabajos realizados — orden de aparición en la landing */
export const PROYECTOS: Proyecto[] = [
  {
    id: 'zonat',
    titulo: 'Gestión comercial multi-tienda',
    cliente: 'Zonat',
    categoria: 'Sistema',
    descripcion:
      'Multi-tiendas, créditos, proveedores, ventas, inventario y transferencias en un solo sistema.',
    video: '/previews/zonat-lite.mp4',
    poster: '/previews/zonat-poster.jpg',
    logo: '/zonat.png',
  },
  {
    id: 'rogerbox-sistema',
    titulo: 'Gestión de gimnasio',
    cliente: 'Rogerbox',
    categoria: 'Sistema',
    descripcion: 'Membresías, pagos y creación de cursos para operar un gym completo.',
    video: '/previews/rogerboxx-lite.mp4',
    poster: '/previews/rogerboxx-poster.jpg',
    logo: '/rogerbox.jpg',
  },
  {
    id: 'controlgarage-web',
    titulo: 'Reparación de garajes',
    cliente: 'Control Garage',
    categoria: 'Sitio web',
    descripcion: 'Servicios de instalación y reparación en Orlando, FL.',
    imagen: '/previews/controlgarage-web.jpg',
  },
  {
    id: 'milagros-guacari',
    titulo: 'Tienda web y ERP',
    cliente: 'Milagros',
    categoria: 'Sitio web',
    descripcion: 'Tienda en línea con panel interno: ventas, productos, combos y gestión general.',
    video: '/previews/milagros-guacari-lite.mp4',
    poster: '/previews/milagros-guacari-poster.jpg',
  },
  {
    id: 'mariapaz-imports',
    titulo: 'Tienda de importaciones y ERP',
    cliente: 'Maria Paz Imports',
    categoria: 'Sitio web',
    descripcion: 'Tienda en línea con ERP: catálogo, clientes, pasarela de pago y gestión de la tienda.',
    video: '/previews/mariapazimports-lite.mp4',
    poster: '/previews/mariapazimports-poster.jpg',
  },
  {
    id: 'fundesae-web',
    titulo: 'Compromiso socio-ambiental',
    cliente: 'Fundesae',
    categoria: 'Sitio web',
    descripcion: 'Sitio institucional de fortalecimiento social y ambiental.',
    imagen: '/previews/fundesae-web.jpg',
    logo: '/fundease.jpeg',
  },
  {
    id: 'cym-web',
    titulo: 'Sitio corporativo',
    cliente: 'C&M',
    categoria: 'Sitio web',
    descripcion: 'Sitio web para constructora: servicios, proyectos y contacto.',
    video: '/previews/cym-lite.mp4',
    poster: '/previews/cym-poster.jpg',
  },
  {
    id: 'casa-artesanal',
    titulo: 'Gestión comercial multi-tienda',
    cliente: 'La Casa Artesanal',
    categoria: 'Sistema',
    descripcion:
      'Sistema para 3 tiendas y fábrica de sombreros: inventario, facturas, transferencias, usuarios y roles.',
    video: '/previews/casa-artesanal-lite.mp4',
    poster: '/previews/casa-artesanal-poster.jpg',
  },
  {
    id: 'bernabe',
    titulo: 'Asistencia y seguimiento',
    cliente: 'Bernabé',
    categoria: 'Sistema',
    descripcion: 'Gestión de asistencia en iglesia y seguimiento de personas.',
    video: '/previews/bernabe-lite.mp4',
    poster: '/previews/bernabe-poster.jpg',
  },
];
