-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
-- No placeholders to edit — works as-is.

alter table products add column if not exists category text default 'other';
alter table settings add column if not exists announcement_text text;
