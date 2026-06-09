import { readFile } from 'fs/promises';
import path from 'path';
import React from 'react';
import * as ReactPDF from '@react-pdf/renderer';
import { BRAND } from '@/lib/constants';
import { TarjetaPresentacionPDF } from '@/components/tarjeta/TarjetaPresentacionPDF';

let fontsRegistered = false;

async function registerFonts() {
  if (fontsRegistered) return;
  const fontsDir = path.join(process.cwd(), 'public', 'fonts');
  ReactPDF.Font.register({
    family: 'Tanker',
    src: path.join(fontsDir, 'Tanker-Regular.woff'),
  });
  fontsRegistered = true;
}

async function loadImageBase64(relativePath: string): Promise<string | undefined> {
  try {
    const filePath = path.join(process.cwd(), 'public', relativePath.replace(/^\//, ''));
    const buffer = await readFile(filePath);
    const ext = relativePath.split('.').pop()?.toLowerCase();
    const mime =
      ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${buffer.toString('base64')}`;
  } catch {
    return undefined;
  }
}

export async function renderTarjetaPdf(): Promise<Buffer> {
  await registerFonts();

  const [avatarBase64, mascotBase64] = await Promise.all([
    loadImageBase64(BRAND.avatar),
    loadImageBase64('/andrewmuleco-sm.png'),
  ]);

  const doc = React.createElement(TarjetaPresentacionPDF, { avatarBase64, mascotBase64 });
  const { renderToBuffer } = ReactPDF;
  return Buffer.from(await renderToBuffer(doc as Parameters<typeof renderToBuffer>[0]));
}
