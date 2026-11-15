-- ============================================================
--  Lina Home & Deco — Esquema de Supabase
--  Ejecutar completo en: Supabase Dashboard → SQL Editor
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
  category    text not null default 'Deco',
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
    'Difusor de Varillas Lino & Neroli',
    'Difusor de 200 ml con varillas de ratán natural. Aroma limpio de lino recién lavado y neroli. Perfuma espacios de hasta 25 m² durante 3 meses.',
    24600::numeric, 'Difusores', '/images/product-difusor.svg', true
  ),
  (
    'Difusor de Varillas Sándalo',
    'Notas amaderadas y ligeramente ahumadas para rincones de lectura. Incluye 6 varillas de ratán y aceite de 200 ml.',
    23800::numeric, 'Difusores', '/images/product-difusor.svg', false
  ),
  (
    'Home Spray Jardín de Té',
    'Textil y ambiente. Una bruma fresca de té verde, hojas de higuera y almizcle blanco. Frasco de 100 ml con válvula de niebla fina.',
    12900::numeric, 'Home Sprays', '/images/product-spray.svg', true
  ),
  (
    'Manta de Algodón Crudo',
    'Tejido de algodón con textura de lino, flecos anudados a mano. 130 x 170 cm. El abrazo perfecto para el sillón.',
    31500::numeric, 'Textil', '/images/product-textil.svg', true
  ),
  (
    'Bandeja Oval de Madera',
    'Bandeja tallada en madera de paraíso con terminación mate al aceite. 32 x 18 cm. Ideal para armar un rincón de aromas.',
    19800::numeric, 'Deco', '/images/product-bandeja.svg', true
  ),
  (
    'Jarrón de Cerámica Arena',
    'Pieza torneada a mano en cerámica mate color arena. 22 cm de alto. Cada unidad es única, con pequeñas variaciones de textura.',
    22400::numeric, 'Deco', '/images/product-jarron.svg', true
  )
) as seed(name, description, price, category, image_url, in_stock)
where not exists (select 1 from public.products);
