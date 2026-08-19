-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
-- No placeholders to edit — works as-is.

create table if not exists newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_signups enable row level security;

-- Anyone can sign up (public form)
create policy "Public can sign up"
  on newsletter_signups for insert
  with check (true);

-- Only admins can view the list
create policy "Admins can view signups"
  on newsletter_signups for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
