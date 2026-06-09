export type CategoriaProyecto = 'Sistema' | 'Sitio web';

export type Proyecto = {
  id: string;
  titulo: string;
  cliente: string;
  categoria: CategoriaProyecto;
  descripcion: string;
  video?: string;
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
    video: '/zonat.mp4',
    logo: '/zonat.png',
  },
  {
    id: 'rogerbox-sistema',
    titulo: 'Gestión de gimnasio',
    cliente: 'Rogerbox',
    categoria: 'Sistema',
    descripcion: 'Membresías, pagos y creación de cursos para operar un gym completo.',
    video: '/rogerboxx.mp4',
    logo: '/rogerbox.jpg',
  },
  {
    id: 'controlgarage-web',
    titulo: 'Reparación de garajes',
    cliente: 'Control Garage',
    categoria: 'Sitio web',
    descripcion: 'Servicios de instalación y reparación en Orlando, FL.',
    imagen: '/previews/controlgarage-web.png',
  },
  {
    id: 'milagros-guacari',
    titulo: 'Tienda web y ERP',
    cliente: 'Milagros',
    categoria: 'Sitio web',
    descripcion: 'Tienda en línea con panel interno: ventas, productos, combos y gestión general.',
    video: '/milagros-guacari.mp4',
  },
  {
    id: 'mariapaz-imports',
    titulo: 'Tienda de importaciones y ERP',
    cliente: 'Maria Paz Imports',
    categoria: 'Sitio web',
    descripcion: 'Tienda en línea con ERP: catálogo, clientes, pasarela de pago y gestión de la tienda.',
    video: '/mariapazimports.mp4',
  },
  {
    id: 'fundesae-web',
    titulo: 'Compromiso socio-ambiental',
    cliente: 'Fundesae',
    categoria: 'Sitio web',
    descripcion: 'Sitio institucional de fortalecimiento social y ambiental.',
    imagen: '/previews/fundesae-web.png',
    logo: '/fundease.jpeg',
  },
  {
    id: 'cym-web',
    titulo: 'Sitio corporativo',
    cliente: 'C&M',
    categoria: 'Sitio web',
    descripcion: 'Sitio web para constructora: servicios, proyectos y contacto.',
    video: '/cym.mp4',
  },
  {
    id: 'casa-artesanal',
    titulo: 'Gestión comercial multi-tienda',
    cliente: 'La Casa Artesanal',
    categoria: 'Sistema',
    descripcion:
      'Sistema para 3 tiendas y fábrica de sombreros: inventario, facturas, transferencias, usuarios y roles.',
    video: '/casa-artesanal.mp4',
  },
  {
    id: 'bernabe',
    titulo: 'Asistencia y seguimiento',
    cliente: 'Bernabé',
    categoria: 'Sistema',
    descripcion: 'Gestión de asistencia en iglesia y seguimiento de personas.',
    video: '/bernabe.mp4',
  },
];
