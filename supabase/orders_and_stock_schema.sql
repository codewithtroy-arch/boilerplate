-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
--
-- IMPORTANT: Replace 'you@example.com' below with your admin email
-- (same one used in admin_policies.sql) before running.

-- Track actual stock counts, not just an in/out toggle.
alter table products add column if not exists stock_quantity integer not null default 20;

-- Orders: one row per paid checkout, written server-side after Paystack
-- verification succeeds (see app/api/paystack/verify/route.ts). Customers
-- never write here directly — only the trusted server route does, using
-- the service role key, so no public insert policy is needed.
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  total numeric(10, 2) not null,
  reference text not null unique,
  items jsonb not null,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

create policy "Admin can view orders"
  on orders for select
  using (auth.jwt() ->> 'email' = 'goodpromzy@gmail.com');
