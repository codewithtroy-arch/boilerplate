-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
--
-- IMPORTANT: Before running, replace 'you@example.com' below (in all three
-- places) with the exact email address you use to sign in to this app.
-- This is what actually stops anyone else from adding/editing/deleting
-- products, even if they somehow log in.

create policy "Admin can insert products"
  on products for insert
  with check (auth.jwt() ->> 'email' = 'you@example.com');

create policy "Admin can update products"
  on products for update
  using (auth.jwt() ->> 'email' = 'you@example.com');

create policy "Admin can delete products"
  on products for delete
  using (auth.jwt() ->> 'email' = 'you@example.com');
