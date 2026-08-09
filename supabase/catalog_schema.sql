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

-- Sample data modeled as a skincare/cosmetics reseller
-- ("Ivie's Glow Corner"). Delete these later and add your real products
-- via the Supabase Table Editor, or rename the shop entirely by changing
-- NEXT_PUBLIC_BUSINESS_NAME.
insert into products (name, description, price, image_url) values
  ('Vitamin C Serum', 'Brightening, 30ml', 6500, null),
  ('Niacinamide Serum', 'Pore-minimizing, 30ml', 5500, null),
  ('Shea Butter Body Cream', 'Whipped, unrefined, 250g', 4000, null),
  ('African Black Soap Bar', 'Handmade, unscented', 2000, null),
  ('SPF50 Sunscreen', 'Lightweight, no white cast', 7000, null),
  ('Hyaluronic Acid Moisturizer', 'Hydrating, all skin types', 6000, null);
