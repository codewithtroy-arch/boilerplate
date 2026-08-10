-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
-- No placeholders to edit this time — this one just works as-is.

create table if not exists settings (
  id int primary key default 1,
  business_name text not null default 'My Shop',
  tagline text not null default 'Quality you can trust',
  whatsapp_number text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into settings (id) values (1) on conflict (id) do nothing;

alter table settings enable row level security;

-- Anyone can read settings (the catalog page needs the business name/tagline)
create policy "Public can view settings"
  on settings for select
  using (true);

-- Only admins can change them
create policy "Admins can update settings"
  on settings for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
