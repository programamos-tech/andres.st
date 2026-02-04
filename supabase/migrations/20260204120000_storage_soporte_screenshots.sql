-- Bucket para imágenes de errores en tickets de soporte (Andrebot).
-- Si falla: crear el bucket desde Dashboard > Storage > New bucket "soporte-screenshots" (public, límite 5MB, MIME images).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'soporte-screenshots',
  'soporte-screenshots',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
on conflict (id) do nothing;
