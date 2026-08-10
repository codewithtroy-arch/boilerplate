-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
--
-- IMPORTANT: Near the bottom, replace 'you@example.com' with the email you
-- already use to sign in — this backfills your existing account as admin,
-- since the auto-admin trigger below only applies to brand-new signups.

-- One row per signed-in user, tracking whether they're the admin.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Auto-creates a profile row whenever someone signs up. The FIRST person
-- ever to sign up becomes admin automatically; everyone after that is a
-- regular customer account.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  admin_already_exists boolean;
begin
  select exists(select 1 from public.profiles where role = 'admin') into admin_already_exists;

  insert into public.profiles (id, email, role)
  values (new.id, new.email, case when admin_already_exists then 'customer' else 'admin' end);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill: your existing account (created before this migration existed)
-- won't have triggered the function above. This makes sure it's marked
-- admin. Replace the email below with yours.
insert into public.profiles (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'you@example.com'
on conflict (id) do update set role = 'admin';

-- Replace the old hardcoded-email policies with role-based ones.
drop policy if exists "Admin can insert products" on products;
drop policy if exists "Admin can update products" on products;
drop policy if exists "Admin can delete products" on products;
drop policy if exists "Admin can view orders" on orders;

create policy "Admins can insert products"
  on products for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update products"
  on products for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete products"
  on products for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can view orders"
  on orders for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
