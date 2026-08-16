-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
-- Assigns the uploaded vitamin-c-serum.jpg photo to your real "Vitamin C
-- Serum" product, if one exists with that exact name. Safe to run even
-- if it doesn't match anything — it just won't update any rows.

update products
set image_url = '/images/vitamin-c-serum.jpg'
where name ilike '%vitamin c serum%';
