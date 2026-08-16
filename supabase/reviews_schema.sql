-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
-- No placeholders to edit — works as-is.

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  reviewer_name text,
  comment text,
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

-- Anyone can see reviews (they're social proof on the public catalog)
create policy "Public can view reviews"
  on reviews for select
  using (true);

-- Anyone can leave one — kept simple for now (no login required to
-- review). If review spam becomes a problem later, this is the policy
-- to tighten (e.g. requiring it match a real paid order).
create policy "Public can submit reviews"
  on reviews for insert
  with check (rating between 1 and 5);
