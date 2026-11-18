-- ============================================================
--  Lina Home & Deco — Varias fotos por producto
--  Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

alter table public.products
  add column if not exists images text[] not null default '{}';

-- Los productos que ya tenían una foto pasan a tener esa foto como portada.
update public.products
   set images = array[image_url]
 where image_url is not null
   and (images is null or cardinality(images) = 0);

-- Verificación
-- select name, image_url, images from public.products order by created_at desc;
