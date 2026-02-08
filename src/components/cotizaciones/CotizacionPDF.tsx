import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

const colors = {
  bg: '#f5f0eb',
  bgSecondary: '#dcd5cd',
  text: '#2c2b2c',
  textMuted: '#5f4e43',
  border: '#a06f5940',
  accent: '#d5957a',
  cafe: '#a06f59',
};

function getStyles() {
  if (typeof StyleSheet === 'undefined' || !StyleSheet.create) {
    throw new Error('@react-pdf/renderer StyleSheet no disponible. Revisa next.config (transpilePackages / serverExternalPackages).');
  }
  return StyleSheet.create({
    page: { padding: 28, fontFamily: 'Helvetica', fontSize: 9, backgroundColor: colors.bg, color: colors.text },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    headerLeft: { marginRight: 12 },
    avatarWrap: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' as const, backgroundColor: colors.bgSecondary },
    avatar: { width: '100%', height: '100%', objectFit: 'cover' as const },
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
}

function formatPeso(n: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

export interface CotizacionPDFProps {
  numeroCotizacion: string;
  fecha: string;
  cliente: {
    nombreNegocio: string;
    contacto: string;
    email: string;
    whatsapp: string;
    tipoNegocio: string;
  };
  sistema: {
    nombre: string;
    tiempoSemanas: string;
    incluye: string[];
    precioDesde?: boolean;
  };
  desgloseModulos: { nombre: string; precio: number; precioFinal: number; descuentoPorcentaje: number; precioDesde?: boolean }[];
  desgloseServicios: { nombre: string; precio: number; precioFinal: number; descuentoPorcentaje: number; label?: string; precioDesde?: boolean }[];
  formaPago: { nombre: string; descripcion?: string };
  /** Desglose del plan de financiamiento (cuotas/etapas con montos) para base del contrato */
  planFinanciamientoDesglose?: { concepto: string; monto: number }[];
  subtotalSistema: number;
  subtotal: number;
  descuento: number;
  descuentoPorcentaje?: number;
  recargo: number;
  total: number;
  planSoporte?: { nombre: string; precioMensual: number; incluye: string[] };
  marca: { name: string; username: string; location: string; whatsapp: string; email: string };
  /** Data URI de la foto (base64) para el avatar redondo */
  avatarBase64?: string;
}

let stylesCache: ReturnType<typeof getStyles> | null = null;

export function CotizacionPDF({
  numeroCotizacion,
  fecha,
  cliente,
  sistema,
  desgloseModulos,
  desgloseServicios,
  formaPago,
  planFinanciamientoDesglose,
  subtotalSistema,
  subtotal,
  descuento,
  descuentoPorcentaje = 0,
  recargo,
  total,
  planSoporte,
  marca,
  avatarBase64,
}: CotizacionPDFProps) {
  if (!stylesCache) stylesCache = getStyles();
  const styles = stylesCache;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {avatarBase64 && (
            <View style={styles.headerLeft}>
              <View style={styles.avatarWrap}>
                <Image src={avatarBase64} style={styles.avatar} />
              </View>
            </View>
          )}
          <View style={styles.headerRight}>
            <Text style={styles.brand}>{marca.username}</Text>
            <Text style={styles.title}>Propuesta Comercial</Text>
            <Text style={styles.titleSub}>{cliente.nombreNegocio}</Text>
            <Text style={styles.subtitle}>
              No. {numeroCotizacion} · {fecha}
            </Text>
          </View>
        </View>

        {/* Cliente + Resumen en una fila */}
        <View style={styles.topRow}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Cliente</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{cliente.nombreNegocio}</Text>
            </View>
            {cliente.contacto && (
              <View style={styles.row}>
                <Text style={styles.label}>Contacto:</Text>
                <Text style={styles.value}>{cliente.contacto}</Text>
              </View>
            )}
            {cliente.email && (
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{cliente.email}</Text>
              </View>
            )}
            {cliente.whatsapp && (
              <View style={styles.row}>
                <Text style={styles.label}>WhatsApp:</Text>
                <Text style={styles.value}>{cliente.whatsapp}</Text>
              </View>
            )}
            {cliente.tipoNegocio && (
              <View style={styles.row}>
                <Text style={styles.label}>Tipo negocio:</Text>
                <Text style={styles.value}>{cliente.tipoNegocio}</Text>
              </View>
            )}
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Proyecto</Text>
            <View style={styles.block}>
              <Text style={styles.value}>Sistema: {sistema.nombre}</Text>
              <Text style={styles.subtitle}>Tiempo estimado: {sistema.tiempoSemanas}</Text>
            </View>
          </View>
        </View>

        {/* Cuadrito: servicios que se ofrecerán */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios</Text>
          <View style={styles.box}>
            <View style={styles.lineItem}>
              <Text style={styles.lineItemLabel}>Sistema {sistema.nombre}</Text>
              <Text style={styles.lineItemValue}>{sistema.precioDesde ? `Desde ${formatPeso(subtotalSistema)}` : formatPeso(subtotalSistema)}</Text>
            </View>
            {sistema.incluye.slice(0, 4).map((item, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.value}>{item}</Text>
              </View>
            ))}
            {sistema.incluye.length > 4 && (
              <View style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={[styles.value, { fontStyle: 'italic' }]}>+ {sistema.incluye.length - 4} ítems más</Text>
              </View>
            )}

            {desgloseModulos.length > 0 && (
              <>
                <Text style={[styles.value, { marginTop: 4, marginBottom: 2, fontSize: 8 }]}>Módulos adicionales</Text>
                {desgloseModulos.map((m, i) => (
                  <View key={i} style={styles.lineItem}>
                    <Text style={styles.lineItemLabel}>
                      {m.nombre}
                      {m.descuentoPorcentaje >= 100 ? ' (Cortesía)' : m.descuentoPorcentaje > 0 ? ` (-${m.descuentoPorcentaje}%)` : ''}
                    </Text>
                    <Text style={styles.lineItemValue}>{formatPeso(m.precioFinal)}</Text>
                  </View>
                ))}
              </>
            )}

            {desgloseServicios.length > 0 && (
              <>
                <Text style={[styles.value, { marginTop: 4, marginBottom: 2, fontSize: 8 }]}>Servicios complementarios</Text>
                {desgloseServicios.map((s, i) => (
                  <View key={i} style={styles.lineItem}>
                    <Text style={styles.lineItemLabel}>
                      {s.nombre}
                      {s.label ? ` (${s.label})` : ''}
                      {s.descuentoPorcentaje >= 100 ? ' (Cortesía)' : s.descuentoPorcentaje > 0 ? ` (-${s.descuentoPorcentaje}%)` : ''}
                    </Text>
                    <Text style={styles.lineItemValue}>{formatPeso(s.precioFinal)}</Text>
                  </View>
                ))}
              </>
            )}

            <View style={styles.lineItem}>
              <Text style={styles.lineItemLabel}>Subtotal</Text>
              <Text style={styles.lineItemValue}>{formatPeso(subtotal)}</Text>
            </View>
            {descuento > 0 && (
              <View style={[styles.lineItem, styles.discount]}>
                <Text style={styles.lineItemLabel}>Descuento{descuentoPorcentaje > 0 ? ` (${descuentoPorcentaje}%)` : ''}</Text>
                <Text style={styles.lineItemValue}>-{formatPeso(descuento)}</Text>
              </View>
            )}
            {recargo > 0 && (
              <View style={styles.lineItem}>
                <Text style={styles.lineItemLabel}>Recargo</Text>
                <Text style={styles.lineItemValue}>+{formatPeso(recargo)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text>TOTAL A PAGAR</Text>
              <Text>{formatPeso(total)}</Text>
            </View>
          </View>
        </View>

        {/* Plan de financiamiento: base para el contrato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan de financiamiento</Text>
          <View style={styles.box}>
            <Text style={[styles.value, { marginBottom: 4 }]}>{formaPago.nombre}</Text>
            {formaPago.descripcion ? (
              <Text style={[styles.subtitle, { marginBottom: 8 }]}>{formaPago.descripcion}</Text>
            ) : null}
            {planFinanciamientoDesglose && planFinanciamientoDesglose.length > 0 && (
              <>
                <Text style={[styles.value, { marginBottom: 4, marginTop: 6, fontWeight: 700, fontSize: 8 }]}>Desglose de pagos</Text>
                {planFinanciamientoDesglose.map((item, i) => (
                  <View key={i} style={styles.lineItem}>
                    <Text style={styles.lineItemLabel}>{item.concepto}</Text>
                    <Text style={styles.lineItemValue}>{formatPeso(item.monto)}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>

        {planSoporte && planSoporte.precioMensual > 0 && (
          <View style={[styles.section, { marginTop: 4 }]}>
            <Text style={styles.sectionTitle}>Soporte</Text>
            <View style={[styles.box, { padding: 8 }]}>
              <View style={styles.lineItem}>
                <Text style={styles.lineItemLabel}>Plan {planSoporte.nombre}</Text>
                <Text style={styles.lineItemValue}>{formatPeso(planSoporte.precioMensual)}/mes · 1er mes gratis</Text>
              </View>
              <View style={styles.bullet}>
                <Text style={styles.bulletDot}>✓</Text>
                <Text style={[styles.value, { fontSize: 8 }]}>{planSoporte.incluye.join(' · ')}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Condiciones + Próximos pasos en una fila */}
        <View style={styles.bottomRow}>
          <View style={styles.bottomCol}>
            <Text style={styles.sectionTitle}>Condiciones</Text>
            <Text style={[styles.value, { marginBottom: 0 }]}>Válida 15 días · Pago según forma acordada</Text>
          </View>
          <View style={styles.bottomCol}>
            <Text style={styles.sectionTitle}>Próximos pasos</Text>
            <View style={styles.pasosList}>
              <Text style={styles.pasoItem}>1. Agendar reunión para afinar detalles</Text>
              <Text style={styles.pasoItem}>2. Firmar propuesta</Text>
              <Text style={styles.pasoItem}>3. Pago inicial</Text>
              <Text style={styles.pasoItem}>4. ¡Comenzamos!</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>{marca.name}</Text>
          <Text>Software a la medida · {marca.location}</Text>
          <Text>WhatsApp: {marca.whatsapp} · {marca.email}</Text>
        </View>
      </Page>
    </Document>
  );
}
