import { createClient } from './supabase/server';

export type Settings = {
  business_name: string;
  tagline: string;
  whatsapp_number: string | null;
  about_text: string;
  announcement_text: string | null;
  hero_headline: string;
  trust_badge_1: string;
  trust_badge_2: string;
  trust_badge_3: string;
  trust_badge_4: string;
  instagram_url: string | null;
  tiktok_url: string | null;
  pinterest_url: string | null;
  testimonial_1_quote: string;
  testimonial_1_name: string;
  testimonial_1_rating: number;
  testimonial_2_quote: string;
  testimonial_2_name: string;
  testimonial_2_rating: number;
  testimonial_3_quote: string;
  testimonial_3_name: string;
  testimonial_3_rating: number;
  press_mentions: string | null;
  ingredient_1_icon: string;
  ingredient_1_title: string;
  ingredient_1_desc: string;
  ingredient_2_icon: string;
  ingredient_2_title: string;
  ingredient_2_desc: string;
  ingredient_3_icon: string;
  ingredient_3_title: string;
  ingredient_3_desc: string;
  ingredient_4_icon: string;
  ingredient_4_title: string;
  ingredient_4_desc: string;
  ritual_1_title: string;
  ritual_1_desc: string;
  ritual_2_title: string;
  ritual_2_desc: string;
  ritual_3_title: string;
  ritual_3_desc: string;
};

const DEFAULTS: Settings = {
  business_name: 'My Shop',
  tagline: 'Quality you can trust',
  whatsapp_number: null,
  about_text: "We're a small business dedicated to quality products and honest service.",
  announcement_text: null,
  hero_headline: 'Illuminate Your Radiance',
  trust_badge_1: 'Clean Formulas',
  trust_badge_2: 'Cruelty Free',
  trust_badge_3: 'Verified Seller',
  trust_badge_4: 'WhatsApp Support',
  instagram_url: null,
  tiktok_url: null,
  pinterest_url: null,
  testimonial_1_quote: '',
  testimonial_1_name: '',
  testimonial_1_rating: 5,
  testimonial_2_quote: '',
  testimonial_2_name: '',
  testimonial_2_rating: 5,
  testimonial_3_quote: '',
  testimonial_3_name: '',
  testimonial_3_rating: 5,
  press_mentions: null,
  ingredient_1_icon: '✦',
  ingredient_1_title: '',
  ingredient_1_desc: '',
  ingredient_2_icon: '✧',
  ingredient_2_title: '',
  ingredient_2_desc: '',
  ingredient_3_icon: '☾',
  ingredient_3_title: '',
  ingredient_3_desc: '',
  ingredient_4_icon: '❀',
  ingredient_4_title: '',
  ingredient_4_desc: '',
  ritual_1_title: '',
  ritual_1_desc: '',
  ritual_2_title: '',
  ritual_2_desc: '',
  ritual_3_title: '',
  ritual_3_desc: '',
};

const SETTINGS_COLUMNS = Object.keys(DEFAULTS).join(', ');

export async function getSettings(): Promise<Settings> {
  const supabase = createClient();
  const { data } = await supabase
    .from('settings')
    .select(SETTINGS_COLUMNS)
    .eq('id', 1)
    .single();

  return data ? ({ ...DEFAULTS, ...data } as Settings) : DEFAULTS;
}
