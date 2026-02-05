import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

// Colores marca: terracota #d5957a, café #a06f59, carbón #2c2b2c, crema #dcd5cd, marrón #5f4e43
const colors = {
  bg: '#f5f0eb',
  bgSecondary: '#dcd5cd',
  text: '#2c2b2c',
  textMuted: '#5f4e43',
  border: '#a06f5940',
  accent: '#d5957a',
  cafe: '#a06f59',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: colors.bg,
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
    paddingBottom: 16,
  },
  headerLeft: {
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.accent,
    backgroundColor: colors.bgSecondary,
  },
  headerRight: {
    flex: 1,
  },
  brand: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.cafe,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.text,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  section: {
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: '30%',
    color: colors.textMuted,
  },
  value: {
    width: '70%',
    color: colors.text,
  },
  block: {
    marginBottom: 6,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletDot: {
    width: 12,
    color: colors.accent,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lineItemLabel: {
    color: colors.text,
  },
  lineItemValue: {
    color: colors.text,
    fontWeight: 600,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    fontWeight: 700,
    fontSize: 12,
  },
  discount: {
    color: colors.cafe,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

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
  };
  desgloseModulos: { nombre: string; precio: number }[];
  desgloseServicios: { nombre: string; precio: number; label?: string }[];
  formaPago: { nombre: string };
  subtotalSistema: number;
  subtotal: number;
  descuento: number;
  recargo: number;
  total: number;
  planSoporte?: { nombre: string; precioMensual: number; incluye: string[] };
  marca: { name: string; username: string; location: string; whatsapp: string; email: string };
  /** Data URI de la foto (base64) para el avatar redondo */
  avatarBase64?: string;
}

export function CotizacionPDF({
  numeroCotizacion,
  fecha,
  cliente,
  sistema,
  desgloseModulos,
  desgloseServicios,
  formaPago,
  subtotalSistema,
  subtotal,
  descuento,
  recargo,
  total,
  planSoporte,
  marca,
  avatarBase64,
}: CotizacionPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {avatarBase64 && (
            <View style={styles.headerLeft}>
              <Image src={avatarBase64} style={styles.avatar} />
            </View>
          )}
          <View style={styles.headerRight}>
            <Text style={styles.brand}>{marca.username}</Text>
            <Text style={styles.title}>COTIZACIÓN</Text>
            <Text style={styles.subtitle}>
              No. {numeroCotizacion} · Fecha: {fecha}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLIENTE</Text>
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
              <Text style={styles.label}>Tipo de negocio:</Text>
              <Text style={styles.value}>{cliente.tipoNegocio}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RESUMEN DEL PROYECTO</Text>
          <View style={styles.block}>
            <Text style={styles.value}>Sistema: {sistema.nombre}</Text>
            <Text style={styles.subtitle}>Tiempo estimado: {sistema.tiempoSemanas}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLE DE COTIZACIÓN</Text>

          <Text style={[styles.value, { marginBottom: 4 }]}>1. Sistema base</Text>
          <View style={styles.lineItem}>
            <Text style={styles.lineItemLabel}>Sistema {sistema.nombre}</Text>
            <Text style={styles.lineItemValue}>{formatPeso(subtotalSistema)}</Text>
          </View>
          {sistema.incluye.map((item, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.value}>{item}</Text>
            </View>
          ))}

          {desgloseModulos.length > 0 && (
            <>
              <Text style={[styles.value, { marginTop: 10, marginBottom: 4 }]}>2. Módulos adicionales</Text>
              {desgloseModulos.map((m, i) => (
                <View key={i} style={styles.lineItem}>
                  <Text style={styles.lineItemLabel}>{m.nombre}</Text>
                  <Text style={styles.lineItemValue}>{formatPeso(m.precio)}</Text>
                </View>
              ))}
            </>
          )}

          {desgloseServicios.length > 0 && (
            <>
              <Text style={[styles.value, { marginTop: 10, marginBottom: 4 }]}>
                {desgloseModulos.length > 0 ? '3' : '2'}. Servicios complementarios
              </Text>
              {desgloseServicios.map((s, i) => (
                <View key={i} style={styles.lineItem}>
                  <Text style={styles.lineItemLabel}>
                    {s.nombre}
                    {s.label ? ` (${s.label})` : ''}
                  </Text>
                  <Text style={styles.lineItemValue}>{formatPeso(s.precio)}</Text>
                </View>
              ))}
            </>
          )}

          <View style={styles.lineItem}>
            <Text style={styles.lineItemLabel}>Subtotal</Text>
            <Text style={styles.lineItemValue}>{formatPeso(subtotal)}</Text>
          </View>
          {formaPago.nombre && (
            <View style={styles.lineItem}>
              <Text style={styles.lineItemLabel}>Forma de pago</Text>
              <Text style={styles.lineItemValue}>{formaPago.nombre}</Text>
            </View>
          )}
          {descuento > 0 && (
            <View style={[styles.lineItem, styles.discount]}>
              <Text style={styles.lineItemLabel}>Descuento</Text>
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

        {planSoporte && planSoporte.precioMensual > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PLAN DE SOPORTE RECOMENDADO</Text>
            <View style={styles.lineItem}>
              <Text style={styles.lineItemLabel}>Plan {planSoporte.nombre}</Text>
              <Text style={styles.lineItemValue}>{formatPeso(planSoporte.precioMensual)}/mes</Text>
            </View>
            {planSoporte.incluye.map((item, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={styles.bulletDot}>✓</Text>
                <Text style={styles.value}>{item}</Text>
              </View>
            ))}
            <Text style={[styles.subtitle, { marginTop: 6 }]}>* Primer mes gratis</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONDICIONES</Text>
          <Text style={styles.value}>• Cotización válida por 15 días</Text>
          <Text style={styles.value}>• Pago inicial según forma de pago acordada</Text>
          <Text style={styles.value}>• Código fuente 100% tuyo</Text>
          <Text style={styles.value}>• Garantía de 90 días incluida</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRÓXIMOS PASOS</Text>
          <Text style={styles.value}>1. Agendar reunión para afinar detalles</Text>
          <Text style={styles.value}>2. Firmar propuesta</Text>
          <Text style={styles.value}>3. Pago inicial</Text>
          <Text style={styles.value}>4. ¡Comenzamos!</Text>
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
