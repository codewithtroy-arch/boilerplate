-- Run this in Supabase: Project > SQL Editor > New query > paste > Run
-- No placeholders to edit — works as-is.

alter table settings add column if not exists hero_headline text default 'Illuminate Your Radiance';
alter table settings add column if not exists trust_badge_1 text default 'Clean Formulas';
alter table settings add column if not exists trust_badge_2 text default 'Cruelty Free';
alter table settings add column if not exists trust_badge_3 text default 'Verified Seller';
alter table settings add column if not exists trust_badge_4 text default 'WhatsApp Support';
alter table settings add column if not exists instagram_url text;
alter table settings add column if not exists tiktok_url text;
alter table settings add column if not exists pinterest_url text;
