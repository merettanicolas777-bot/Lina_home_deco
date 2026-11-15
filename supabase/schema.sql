-- ============================================================
--  Lina Home & Deco — Esquema de Supabase
--  Ejecutar completo en: Supabase Dashboard → SQL Editor
--
--  Categorías válidas:
--    Velas · Home Sprays · Difusores de Varillas ·
--    Difusores de Auto · Body Splash · Perfumes de Cartera
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. Tabla de productos
-- ------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(12, 2) not null default 0,
  category    text not null default 'Velas',
  image_url   text,
  in_stock    boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_category_idx on public.products (category);

-- ------------------------------------------------------------
-- 2. RLS — lectura pública, escritura solo autenticada
-- ------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "products_auth_insert" on public.products;
create policy "products_auth_insert"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "products_auth_update" on public.products;
create policy "products_auth_update"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "products_auth_delete" on public.products;
create policy "products_auth_delete"
  on public.products for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- 3. Storage — bucket público product-images
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "product_images_auth_insert" on storage.objects;
create policy "product_images_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "product_images_auth_update" on storage.objects;
create policy "product_images_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "product_images_auth_delete" on storage.objects;
create policy "product_images_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ------------------------------------------------------------
-- 4. Datos de ejemplo (opcional, se puede borrar)
-- ------------------------------------------------------------
-- Migración: renombra las categorías de productos ya cargados con el
-- esquema anterior (Difusores) al nombre actual del catálogo.
update public.products
   set category = 'Difusores de Varillas'
 where category in ('Difusores', 'Difusor', 'Difusores de varillas');

-- Los productos de categorías que ya no se venden (Textil, Deco) quedan
-- sin filtro propio: borralos desde el panel o con
--   delete from public.products where category in ('Textil', 'Deco');

insert into public.products (name, description, price, category, image_url, in_stock)
select * from (values
  (
    'Vela de Soja Ámbar & Vainilla',
    'Vela artesanal de cera de soja 100% vegetal, con mecha de algodón y 45 horas de duración. Notas de ámbar, vainilla y madera de sándalo que envuelven el ambiente en calidez. Recipiente de vidrio ámbar reutilizable.',
    18400::numeric, 'Velas', '/images/product-vela.svg', true
  ),
  (
    'Vela de Soja Higo & Cedro',
    'Una vela de perfil profundo: higo maduro, cedro y un fondo apenas dulce de musgo. Ideal para la mesa del living o el escritorio. 40 horas de aroma.',
    17200::numeric, 'Velas', '/images/product-vela-2.svg', true
  ),
  (
    'Home Spray Jardín de Té',
    'Textil y ambiente. Una bruma fresca de té verde, hojas de higuera y almizcle blanco. Frasco de 100 ml con válvula de niebla fina.',
    12900::numeric, 'Home Sprays', '/images/product-spray.svg', true
  ),
  (
    'Difusor de Varillas Lino & Neroli',
    'Difusor de 200 ml con varillas de ratán natural. Aroma limpio de lino recién lavado y neroli. Perfuma espacios de hasta 25 m² durante 3 meses.',
    24600::numeric, 'Difusores de Varillas', '/images/product-difusor.svg', true
  ),
  (
    'Difusor de Varillas Sándalo',
    'Notas amaderadas y ligeramente ahumadas para rincones de lectura. Incluye 6 varillas de ratán y aceite de 200 ml.',
    23800::numeric, 'Difusores de Varillas', '/images/product-difusor.svg', false
  ),
  (
    'Difusor de Auto Vainilla & Cedro',
    'Difusor colgante para el espejo retrovisor, con tapa de madera y cordón de algodón. Notas de vainilla suave, cedro y un toque de canela. Rinde entre 4 y 6 semanas.',
    9800::numeric, 'Difusores de Auto', '/images/product-auto.svg', true
  ),
  (
    'Body Splash Flor de Higo',
    'Bruma corporal ligera de 200 ml con aloe vera y glicerina. Notas de flor de higo, hoja verde y ámbar blanco. Se puede usar sobre el cuerpo o la ropa.',
    15600::numeric, 'Body Splash', '/images/product-bodysplash.svg', true
  ),
  (
    'Perfume de Cartera Ámbar',
    'Mini flacon de 10 ml para llevar en la cartera, con válvula pulverizadora y cadena dorada. Notas de ámbar, vainilla y madera. Recargable.',
    11900::numeric, 'Perfumes de Cartera', '/images/product-perfume.svg', true
  )
) as seed(name, description, price, category, image_url, in_stock)
where not exists (select 1 from public.products);
