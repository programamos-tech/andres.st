/**
 * Construye el elemento raíz del PDF usando la misma instancia de React
 * que @react-pdf/renderer (evita "Cannot read properties of null (reading 'props')").
 * Solo se usa en la API route; no usar en cliente.
 */

import type { CotizacionPDFProps } from '@/components/cotizaciones/CotizacionPDF';

const colors = {
  bg: '#f5f0eb',
  bgSecondary: '#dcd5cd',
  text: '#2c2b2c',
  textMuted: '#5f4e43',
  border: '#a06f5940',
  accent: '#d5957a',
  cafe: '#a06f59',
};

function formatPeso(n: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

/** Compatible with React and @react-pdf/renderer's React. */
type ReactLike = {
  createElement: (...args: unknown[]) => unknown;
};

type PDFLike = {
  Document: unknown;
  Page: unknown;
  View: unknown;
  Text: unknown;
  Image: unknown;
  StyleSheet: { create: (styles: Record<string, unknown>) => Record<string, unknown> };
};

export function buildCotizacionPDFElement(React: ReactLike, PDF: PDFLike, props: CotizacionPDFProps): unknown {
  const { Document, Page, View, Text, Image, StyleSheet } = PDF;
  const styles = StyleSheet.create({
    page: { padding: 28, fontFamily: 'Helvetica', fontSize: 9, backgroundColor: colors.bg, color: colors.text },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    headerLeft: { marginRight: 12 },
    avatarWrap: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', backgroundColor: colors.bgSecondary },
    avatar: { width: '100%', height: '100%', objectFit: 'cover' },
    headerRight: { flex: 1 },
    brand: { fontSize: 12, fontWeight: 600, color: colors.textMuted, marginBottom: 0, letterSpacing: 0.2 },
    title: { fontSize: 18, fontWeight: 700, color: colors.text, marginTop: 4 },
    titleSub: { fontSize: 14, fontWeight: 600, color: colors.cafe, marginTop: 2 },
    subtitle: { fontSize: 8, color: colors.textMuted, marginTop: 4 },
    topRow: { flexDirection: 'row', gap: 20, marginBottom: 16 },
    col: { flex: 1 },
    section: { marginTop: 14, marginBottom: 0 },
    sectionTitle: { fontSize: 9, fontWeight: 700, color: colors.textMuted, marginBottom: 6, letterSpacing: 0.5 },
    row: { flexDirection: 'row', marginBottom: 2 },
    label: { width: '32%', color: colors.textMuted, fontSize: 8 },
    value: { width: '68%', color: colors.text, fontSize: 9 },
    block: { marginBottom: 2 },
    bullet: { flexDirection: 'row', marginBottom: 1 },
    bulletDot: { width: 10, color: colors.accent, fontSize: 8 },
    box: { backgroundColor: colors.bgSecondary, borderRadius: 6, padding: 14, marginTop: 6, marginBottom: 4 },
    lineItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
    lineItemLabel: { color: colors.text, fontSize: 9 },
    lineItemValue: { color: colors.text, fontWeight: 600, fontSize: 9 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, fontWeight: 700, fontSize: 11, color: colors.text },
    discount: { color: colors.cafe },
    bottomRow: { flexDirection: 'row', gap: 16, marginTop: 14 },
    bottomCol: { flex: 1 },
    pasosList: { marginTop: 2 },
    pasoItem: { fontSize: 9, color: colors.text, marginBottom: 2 },
    footer: { marginTop: 20, fontSize: 8, color: colors.textMuted, textAlign: 'center' },
  });

  const {
    numeroCotizacion,
    fecha,
    cliente,
    sistema,
    desgloseModulos,
    desgloseServicios,
    formaPago,
    planFinanciamientoDesglose = [],
    subtotalSistema,
    subtotal,
    descuento,
    descuentoPorcentaje = 0,
    recargo,
    total,
    planSoporte,
    marca,
    avatarBase64,
  } = props;

  const header = React.createElement(
    View,
    { style: styles.header },
    avatarBase64 &&
      React.createElement(
        View,
        { style: styles.headerLeft },
        React.createElement(View, { style: styles.avatarWrap }, React.createElement(Image, { src: avatarBase64, style: styles.avatar }))
      ),
    React.createElement(
      View,
      { style: styles.headerRight },
      React.createElement(Text, { style: styles.brand }, marca.username),
      React.createElement(Text, { style: styles.title }, 'Propuesta Comercial'),
      React.createElement(Text, { style: styles.titleSub }, cliente.nombreNegocio),
      React.createElement(Text, { style: styles.subtitle }, `No. ${numeroCotizacion} · ${fecha}`)
    )
  );

  const clienteCol = React.createElement(
    View,
    { style: styles.col },
    React.createElement(Text, { style: styles.sectionTitle }, 'Cliente'),
    React.createElement(View, { style: styles.row }, React.createElement(Text, { style: styles.label }, 'Nombre:'), React.createElement(Text, { style: styles.value }, cliente.nombreNegocio)),
    ...(cliente.contacto ? [React.createElement(View, { key: 'contacto', style: styles.row }, React.createElement(Text, { style: styles.label }, 'Contacto:'), React.createElement(Text, { style: styles.value }, cliente.contacto))] : []),
    ...(cliente.email ? [React.createElement(View, { key: 'email', style: styles.row }, React.createElement(Text, { style: styles.label }, 'Email:'), React.createElement(Text, { style: styles.value }, cliente.email))] : []),
    ...(cliente.whatsapp ? [React.createElement(View, { key: 'wa', style: styles.row }, React.createElement(Text, { style: styles.label }, 'WhatsApp:'), React.createElement(Text, { style: styles.value }, cliente.whatsapp))] : []),
    ...(cliente.tipoNegocio ? [React.createElement(View, { key: 'tipo', style: styles.row }, React.createElement(Text, { style: styles.label }, 'Tipo negocio:'), React.createElement(Text, { style: styles.value }, cliente.tipoNegocio))] : [])
  );

  const resumenCol = React.createElement(
    View,
    { style: styles.col },
    React.createElement(Text, { style: styles.sectionTitle }, 'Proyecto'),
    React.createElement(View, { style: styles.block }, React.createElement(Text, { style: styles.value }, `Sistema: ${sistema.nombre}`), React.createElement(Text, { style: styles.subtitle }, `Tiempo estimado: ${sistema.tiempoSemanas}`))
  );

  const topRow = React.createElement(View, { style: styles.topRow }, clienteCol, resumenCol);

  const sistemaPrecioLabel = sistema.precioDesde ? `Desde ${formatPeso(subtotalSistema)}` : formatPeso(subtotalSistema);
  const incluyeSlice = sistema.incluye.slice(0, 4);
  const detalleBullets = incluyeSlice.map((item, i) =>
    React.createElement(View, { key: i, style: styles.bullet }, React.createElement(Text, { style: styles.bulletDot }, '•'), React.createElement(Text, { style: styles.value }, item))
  );
  const extraBullet = sistema.incluye.length > 4
    ? [React.createElement(View, { key: 'extra', style: styles.bullet }, React.createElement(Text, { style: styles.bulletDot }, '•'), React.createElement(Text, { style: { ...(styles.value as Record<string, unknown>), fontStyle: 'italic' } }, `+ ${sistema.incluye.length - 4} ítems más`))]
    : [];
  const modulosLines = desgloseModulos.map((m, i) =>
    React.createElement(
      View,
      { key: i, style: styles.lineItem },
      React.createElement(Text, { style: styles.lineItemLabel }, `${m.nombre}${m.descuentoPorcentaje >= 100 ? ' (Cortesía)' : m.descuentoPorcentaje > 0 ? ` (-${m.descuentoPorcentaje}%)` : ''}`),
      React.createElement(Text, { style: styles.lineItemValue }, formatPeso(m.precioFinal))
    )
  );
  const serviciosLines = desgloseServicios.map((s, i) =>
    React.createElement(
      View,
      { key: i, style: styles.lineItem },
      React.createElement(Text, { style: styles.lineItemLabel }, `${s.nombre}${s.label ? ` (${s.label})` : ''}${s.descuentoPorcentaje >= 100 ? ' (Cortesía)' : s.descuentoPorcentaje > 0 ? ` (-${s.descuentoPorcentaje}%)` : ''}`),
      React.createElement(Text, { style: styles.lineItemValue }, formatPeso(s.precioFinal))
    )
  );

  const boxContent = [
    React.createElement(View, { key: 'sistema', style: styles.lineItem }, React.createElement(Text, { style: styles.lineItemLabel }, `Sistema ${sistema.nombre}`), React.createElement(Text, { style: styles.lineItemValue }, sistemaPrecioLabel)),
    ...detalleBullets,
    ...extraBullet,
    ...(desgloseModulos.length > 0 ? [React.createElement(Text, { key: 'modTitle', style: { ...(styles.value as Record<string, unknown>), marginTop: 4, marginBottom: 2, fontSize: 8 } }, 'Módulos adicionales'), ...modulosLines] : []),
    ...(desgloseServicios.length > 0 ? [React.createElement(Text, { key: 'servTitle', style: { ...(styles.value as Record<string, unknown>), marginTop: 4, marginBottom: 2, fontSize: 8 } }, 'Servicios complementarios'), ...serviciosLines] : []),
    React.createElement(View, { key: 'sub', style: styles.lineItem }, React.createElement(Text, { style: styles.lineItemLabel }, 'Subtotal'), React.createElement(Text, { style: styles.lineItemValue }, formatPeso(subtotal))),
    ...(descuento > 0 ? [React.createElement(View, { key: 'desc', style: [styles.lineItem, styles.discount] }, React.createElement(Text, { style: styles.lineItemLabel }, `Descuento${descuentoPorcentaje > 0 ? ` (${descuentoPorcentaje}%)` : ''}`), React.createElement(Text, { style: styles.lineItemValue }, `-${formatPeso(descuento)}`))] : []),
    ...(recargo > 0 ? [React.createElement(View, { key: 'rec', style: styles.lineItem }, React.createElement(Text, { style: styles.lineItemLabel }, 'Recargo'), React.createElement(Text, { style: styles.lineItemValue }, `+${formatPeso(recargo)}`))] : []),
    React.createElement(View, { key: 'total', style: styles.totalRow }, React.createElement(Text, null, 'TOTAL A PAGAR'), React.createElement(Text, null, formatPeso(total))),
  ];
  const detalleSection = React.createElement(
    View,
    { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, 'Servicios'),
    React.createElement(View, { style: styles.box }, ...boxContent)
  );

  const planFinanciamientoLines = planFinanciamientoDesglose.map((item, i) =>
    React.createElement(View, { key: i, style: styles.lineItem }, React.createElement(Text, { style: styles.lineItemLabel }, item.concepto), React.createElement(Text, { style: styles.lineItemValue }, formatPeso(item.monto)))
  );
  const planFinanciamientoSection = React.createElement(
    View,
    { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, 'Plan de financiamiento'),
    React.createElement(
      View,
      { style: styles.box },
      React.createElement(Text, { style: { ...(styles.value as Record<string, unknown>), marginBottom: 4 } }, formaPago.nombre),
      ...(formaPago.descripcion ? [React.createElement(Text, { key: 'desc', style: { ...(styles.subtitle as Record<string, unknown>), marginBottom: 8 } }, formaPago.descripcion)] : []),
      ...(planFinanciamientoLines.length > 0
        ? [
            React.createElement(Text, { key: 'desgloseTitle', style: { ...(styles.value as Record<string, unknown>), marginBottom: 4, marginTop: 6, fontWeight: 700, fontSize: 8 } }, 'Desglose de pagos'),
            ...planFinanciamientoLines,
          ]
        : [])
    )
  );

  const planSection =
    planSoporte && planSoporte.precioMensual > 0
      ? React.createElement(
          View,
          { style: { ...(styles.section as Record<string, unknown>), marginTop: 4 } },
          React.createElement(Text, { style: styles.sectionTitle }, 'Soporte'),
          React.createElement(
            View,
            { style: { ...(styles.box as Record<string, unknown>), padding: 8 } },
            React.createElement(View, { style: styles.lineItem }, React.createElement(Text, { style: styles.lineItemLabel }, `Plan ${planSoporte.nombre}`), React.createElement(Text, { style: styles.lineItemValue }, `${formatPeso(planSoporte.precioMensual)}/mes · 1er mes gratis`)),
            React.createElement(View, { style: styles.bullet }, React.createElement(Text, { style: styles.bulletDot }, '✓'), React.createElement(Text, { style: { ...(styles.value as Record<string, unknown>), fontSize: 8 } }, planSoporte.incluye.join(' · ')))
          )
        )
      : null;

  const condicionesCol = React.createElement(
    View,
    { style: styles.bottomCol },
    React.createElement(Text, { style: styles.sectionTitle }, 'Condiciones'),
    React.createElement(Text, { style: { ...(styles.value as Record<string, unknown>), marginBottom: 0 } }, 'Válida 15 días · Pago según forma acordada')
  );
  const pasosCol = React.createElement(
    View,
    { style: styles.bottomCol },
    React.createElement(Text, { style: styles.sectionTitle }, 'Próximos pasos'),
    React.createElement(
      View,
      { style: styles.pasosList },
      React.createElement(Text, { style: styles.pasoItem }, '1. Agendar reunión para afinar detalles'),
      React.createElement(Text, { style: styles.pasoItem }, '2. Firmar propuesta'),
      React.createElement(Text, { style: styles.pasoItem }, '3. Pago inicial'),
      React.createElement(Text, { style: styles.pasoItem }, '4. ¡Comenzamos!')
    )
  );
  const bottomRow = React.createElement(View, { style: styles.bottomRow }, condicionesCol, pasosCol);

  const footerSection = React.createElement(
    View,
    { style: styles.footer },
    React.createElement(Text, null, marca.name),
    React.createElement(Text, null, `Software a la medida · ${marca.location}`),
    React.createElement(Text, null, `WhatsApp: ${marca.whatsapp} · ${marca.email}`)
  );

  const pageChildren = [header, topRow, detalleSection, planFinanciamientoSection, planSection, bottomRow, footerSection].filter(Boolean);
  const page = React.createElement(Page, { size: 'A4', style: styles.page }, ...pageChildren);
  return React.createElement(Document, null, page);
}
