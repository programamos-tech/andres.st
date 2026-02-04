import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'project-logos';
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase configuration');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * POST /api/backstage/projects/[id]/logo
 * Body: multipart/form-data with field "logo" (image file).
 * Uploads to Supabase Storage bucket "project-logos", updates project logo_url, returns { logo_url }.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const formData = await request.formData();
    const file = formData.get('logo');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Envía un archivo en el campo "logo".' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'El archivo no puede superar 2 MB.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|svg)$/i)) {
      return NextResponse.json(
        { error: 'Formato no permitido. Usa JPEG, PNG, WebP o SVG.' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const safeExt = ['jpeg', 'jpg', 'png', 'webp', 'svg'].includes(ext) ? ext : 'png';
    const path = `${projectId}/logo.${safeExt}`;

    const supabase = getSupabase();

    // Ensure bucket exists (public for read)
    await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {});

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      console.error('[backstage/projects/[id]/logo] upload:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'Error al subir el archivo.' },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const logoUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from('proyectos_maestros')
      .update({ logo_url: logoUrl, updated_at: new Date().toISOString() })
      .eq('id', projectId);

    if (updateError) {
      console.error('[backstage/projects/[id]/logo] update project:', updateError);
      return NextResponse.json(
        { error: 'Logo subido pero no se pudo guardar en el proyecto.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ logo_url: logoUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error al subir el logo';
    console.error('[backstage/projects/[id]/logo]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
