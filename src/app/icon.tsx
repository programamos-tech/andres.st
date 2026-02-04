import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

function getImageDataUrl(): string {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const imagePath = path.join(publicDir, 'andrew.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch {
    return '';
  }
}

export default function Icon() {
  const imageSrc = getImageDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e5e5e5',
        }}
      >
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            width={32}
            height={32}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        ) : (
          <span style={{ fontSize: 16, color: '#737373' }}>A</span>
        )}
      </div>
    ),
    { ...size }
  );
}
