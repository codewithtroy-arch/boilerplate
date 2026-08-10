-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
-- No placeholders to edit — works as-is.

alter table settings add column if not exists about_text text
  not null default 'We''re a small business dedicated to quality products and honest service. Every order is handled with care, and we stand behind everything we sell.';
