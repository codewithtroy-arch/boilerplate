-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
-- No placeholders to edit — works as-is.

-- Testimonials (3 slots)
alter table settings add column if not exists testimonial_1_quote text default 'The Vitamin C serum completely transformed my dull winter skin. I''ve never received so many compliments.';
alter table settings add column if not exists testimonial_1_name text default 'Sophia M.';
alter table settings add column if not exists testimonial_1_rating int default 5;
alter table settings add column if not exists testimonial_2_quote text default 'Night Repair Cream is pure magic. Woke up with plump, glowing skin after just one week.';
alter table settings add column if not exists testimonial_2_name text default 'Elena R.';
alter table settings add column if not exists testimonial_2_rating int default 5;
alter table settings add column if not exists testimonial_3_quote text default 'Finally a clean brand that actually works. The Hydrating Essence is now my holy grail.';
alter table settings add column if not exists testimonial_3_name text default 'Amara K.';
alter table settings add column if not exists testimonial_3_rating int default 5;

-- Press mentions — comma-separated names. Empty/null hides the "As seen
-- in" section entirely, so it's off by default instead of claiming press
-- coverage that hasn't actually happened.
alter table settings add column if not exists press_mentions text;

-- Star Ingredients (4 slots)
alter table settings add column if not exists ingredient_1_icon text default '✦';
alter table settings add column if not exists ingredient_1_title text default 'Vitamin C';
alter table settings add column if not exists ingredient_1_desc text default 'Brightens, protects, and visibly evens tone with stable, potent ascorbic acid.';
alter table settings add column if not exists ingredient_2_icon text default '✧';
alter table settings add column if not exists ingredient_2_title text default 'Hyaluronic Acid';
alter table settings add column if not exists ingredient_2_desc text default 'Multi-weight molecules that deeply hydrate and plump from within.';
alter table settings add column if not exists ingredient_3_icon text default '☾';
alter table settings add column if not exists ingredient_3_title text default 'Retinol';
alter table settings add column if not exists ingredient_3_desc text default 'Encapsulated retinol that renews overnight for smoother, firmer skin.';
alter table settings add column if not exists ingredient_4_icon text default '❀';
alter table settings add column if not exists ingredient_4_title text default 'Botanical Complex';
alter table settings add column if not exists ingredient_4_desc text default 'Rare plant extracts that calm, nourish, and support the skin barrier.';

-- Daily Ritual (3 steps)
alter table settings add column if not exists ritual_1_title text default 'Cleanse';
alter table settings add column if not exists ritual_1_desc text default 'Start by gently purifying and prepping the skin.';
alter table settings add column if not exists ritual_2_title text default 'Treat';
alter table settings add column if not exists ritual_2_desc text default 'Apply a treatment serum for brightening and protection.';
alter table settings add column if not exists ritual_3_title text default 'Nourish';
alter table settings add column if not exists ritual_3_desc text default 'Seal with a rich cream to restore and renew overnight.';

-- Journal / blog posts — a real table (not fixed slots), since posts
-- naturally grow over time. Empty by default; add real ones in
-- /admin/journal.
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  tag text,
  title text not null,
  excerpt text,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;

create policy "Public can view posts"
  on posts for select
  using (true);

create policy "Admins can manage posts"
  on posts for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
