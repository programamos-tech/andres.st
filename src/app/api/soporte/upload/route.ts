import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'soporte-screenshots';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * POST /api/soporte/upload
 * Sube una imagen del error a Supabase Storage (bucket soporte-screenshots).
 * Body: FormData con campo "file" (imagen).
 * Devuelve { url } con la URL pública de la imagen.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Falta el archivo (campo "file")' }, { status: 400 });
    }
    const type = file.type;
    if (!type.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 });
    }
    const ext = file.name.split('.').pop() || 'jpg';
    const name = `error-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const supabase = getSupabase();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(name, await file.arrayBuffer(), {
        contentType: type,
        upsert: false,
      });

    if (error) {
      console.error('[soporte/upload]', error);
      return NextResponse.json(
        { error: error.message || 'Error subiendo la imagen. ¿Creaste el bucket "soporte-screenshots" en Supabase?' },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    return NextResponse.json({ url: urlData.publicUrl });
  } catch (e) {
    console.error('[soporte/upload]', e);
    return NextResponse.json({ error: 'Error subiendo la imagen' }, { status: 500 });
  }
}
