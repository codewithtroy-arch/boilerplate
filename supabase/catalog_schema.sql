-- Run this in Supabase: Project > SQL Editor > New query > paste > Run

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

-- Anyone can view products (it's a public storefront)
alter table products enable row level security;

create policy "Public can view products"
  on products for select
  using (true);

-- Sample products so you can see the catalog working right away.
-- Delete these later and add your own via the Supabase Table Editor.
insert into products (name, description, price, image_url) values
  ('Sample Product A', 'Replace with your real product', 2500, null),
  ('Sample Product B', 'Replace with your real product', 5000, null),
  ('Sample Product C', 'Replace with your real product', 1200, null);
