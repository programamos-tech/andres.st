import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { BRAND, SOCIAL_LINKS } from '@/lib/constants';
import { SERVICIOS_LANDING } from '@/lib/servicios';

const colors = {
  bg: '#120e0c',
  bgCard: '#1f1915',
  bgSecondary: '#1c1612',
  text: '#f5ebe0',
  textMuted: 'rgba(245, 235, 224, 0.62)',
  accent: '#ff6b2c',
  border: 'rgba(245, 235, 224, 0.12)',
};

const PAGE_W = 300;
const PAGE_H = 580;

function getStyles() {
  return StyleSheet.create({
    page: {
      width: PAGE_W,
      height: PAGE_H,
      backgroundColor: colors.bg,
      color: colors.text,
      fontFamily: 'Helvetica',
      fontSize: 9,
      paddingTop: 22,
      paddingBottom: 18,
      paddingHorizontal: 20,
      position: 'relative',
    },
    topBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: colors.accent,
    },
    header: {
      alignItems: 'center',
      marginBottom: 12,
    },
    avatarWrap: {
      width: 52,
      height: 52,
      borderRadius: 26,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: colors.border,
      marginBottom: 10,
    },
    avatar: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 6,
      marginBottom: 6,
    },
    nameSolid: {
      fontFamily: 'Tanker',
      fontSize: 30,
      color: colors.text,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    nameAccent: {
      fontFamily: 'Tanker',
      fontSize: 30,
      color: colors.accent,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    title: {
      fontSize: 10,
      fontWeight: 700,
      color: colors.accent,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: 8,
      textAlign: 'center',
    },
    intro: {
      fontSize: 8.5,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 1.45,
      maxWidth: 240,
    },
    sectionLabel: {
      fontSize: 7,
      fontWeight: 700,
      color: colors.accent,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      marginBottom: 10,
      marginTop: 4,
    },
    serviceCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 8,
      marginBottom: 6,
      flexDirection: 'row',
      gap: 10,
    },
    serviceIdx: {
      fontSize: 11,
      fontWeight: 700,
      color: colors.accent,
      width: 18,
    },
    serviceBody: {
      flex: 1,
    },
    serviceTitle: {
      fontSize: 9.5,
      fontWeight: 700,
      color: colors.text,
      marginBottom: 3,
    },
    serviceDesc: {
      fontSize: 7.5,
      color: colors.textMuted,
      lineHeight: 1.4,
    },
    contactBox: {
      backgroundColor: colors.bgSecondary,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      marginTop: 4,
    },
    contactRow: {
      flexDirection: 'row',
      marginBottom: 5,
      alignItems: 'flex-start',
    },
    contactLabel: {
      width: 62,
      fontSize: 7,
      fontWeight: 700,
      color: colors.accent,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    contactValue: {
      flex: 1,
      fontSize: 8.5,
      color: colors.text,
      lineHeight: 1.35,
    },
    location: {
      fontSize: 7.5,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 10,
      lineHeight: 1.4,
    },
    footer: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    siteUrl: {
      fontSize: 11,
      fontWeight: 700,
      color: colors.text,
      letterSpacing: 0.3,
    },
    siteHint: {
      fontSize: 7,
      color: colors.textMuted,
      marginTop: 2,
    },
    mascotFixed: {
      position: 'absolute',
      bottom: 14,
      right: 14,
      width: 42,
      height: 56,
    },
    mascot: {
      width: 42,
      height: 56,
      objectFit: 'contain',
    },
  });
}

export type TarjetaPresentacionPDFProps = {
  avatarBase64?: string;
  mascotBase64?: string;
};

export function TarjetaPresentacionPDF({ avatarBase64, mascotBase64 }: TarjetaPresentacionPDFProps) {
  const styles = getStyles();
  const [firstName, lastName] = BRAND.name.split(' ');
  const instagram = SOCIAL_LINKS.find((s) => s.icon === 'instagram');

  return (
    <Document title="Andrew Russ — Tarjeta de presentación" author="Andrew Russ">
      <Page size={[PAGE_W, PAGE_H]} wrap={false} style={styles.page}>
        <View style={styles.topBar} />
        {mascotBase64 ? (
          <View fixed style={styles.mascotFixed}>
            <Image src={mascotBase64} style={styles.mascot} />
          </View>
        ) : null}

        <View style={styles.header}>
          {avatarBase64 ? (
            <View style={styles.avatarWrap}>
              <Image src={avatarBase64} style={styles.avatar} />
            </View>
          ) : null}
          <View style={styles.nameRow}>
            <Text style={styles.nameSolid}>{firstName}</Text>
            <Text style={styles.nameAccent}>{lastName}</Text>
          </View>
          <Text style={styles.title}>Desarrollador Web</Text>
          <Text style={styles.intro}>{BRAND.pitch}</Text>
        </View>

        <Text style={styles.sectionLabel}>Servicios</Text>
        {SERVICIOS_LANDING.map((s) => (
          <View key={s.idx} style={styles.serviceCard}>
            <Text style={styles.serviceIdx}>{s.idx}</Text>
            <View style={styles.serviceBody}>
              <Text style={styles.serviceTitle}>{s.titulo}</Text>
              <Text style={styles.serviceDesc}>{s.descripcion}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Contacto</Text>
        <View style={styles.contactBox}>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>WhatsApp</Text>
            <Text style={styles.contactValue}>{BRAND.phoneDisplay}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{BRAND.email}</Text>
          </View>
          {instagram ? (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Instagram</Text>
              <Text style={styles.contactValue}>@andrewjruss7</Text>
            </View>
          ) : null}
          <View style={[styles.contactRow, { marginBottom: 0 }]}>
            <Text style={styles.contactLabel}>Web</Text>
            <Text style={styles.contactValue}>andres.st</Text>
          </View>
        </View>

        <Text style={styles.location}>{BRAND.location}</Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.siteUrl}>andres.st</Text>
            <Text style={styles.siteHint}>Primera conversación sin costo</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
