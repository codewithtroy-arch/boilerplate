-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
-- No placeholders to edit — works as-is.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;
