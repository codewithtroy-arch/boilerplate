'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

function str(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

export async function updateSettings(formData: FormData) {
  const supabase = createClient();

  const businessName = str(formData, 'business_name');
  if (!businessName) return;

  const testimonial1Rating = Number(formData.get('testimonial_1_rating')) || 5;
  const testimonial2Rating = Number(formData.get('testimonial_2_rating')) || 5;
  const testimonial3Rating = Number(formData.get('testimonial_3_rating')) || 5;

  await supabase
    .from('settings')
    .update({
      business_name: businessName,
      tagline: str(formData, 'tagline'),
      whatsapp_number: str(formData, 'whatsapp_number') || null,
      about_text: str(formData, 'about_text'),
      announcement_text: str(formData, 'announcement_text') || null,
      hero_headline: str(formData, 'hero_headline') || 'Illuminate Your Radiance',
      trust_badge_1: str(formData, 'trust_badge_1') || 'Clean Formulas',
      trust_badge_2: str(formData, 'trust_badge_2') || 'Cruelty Free',
      trust_badge_3: str(formData, 'trust_badge_3') || 'Verified Seller',
      trust_badge_4: str(formData, 'trust_badge_4') || 'WhatsApp Support',
      instagram_url: str(formData, 'instagram_url') || null,
      tiktok_url: str(formData, 'tiktok_url') || null,
      pinterest_url: str(formData, 'pinterest_url') || null,

      testimonial_1_quote: str(formData, 'testimonial_1_quote'),
      testimonial_1_name: str(formData, 'testimonial_1_name'),
      testimonial_1_rating: testimonial1Rating,
      testimonial_2_quote: str(formData, 'testimonial_2_quote'),
      testimonial_2_name: str(formData, 'testimonial_2_name'),
      testimonial_2_rating: testimonial2Rating,
      testimonial_3_quote: str(formData, 'testimonial_3_quote'),
      testimonial_3_name: str(formData, 'testimonial_3_name'),
      testimonial_3_rating: testimonial3Rating,

      press_mentions: str(formData, 'press_mentions') || null,

      ingredient_1_icon: str(formData, 'ingredient_1_icon') || '✦',
      ingredient_1_title: str(formData, 'ingredient_1_title'),
      ingredient_1_desc: str(formData, 'ingredient_1_desc'),
      ingredient_2_icon: str(formData, 'ingredient_2_icon') || '✧',
      ingredient_2_title: str(formData, 'ingredient_2_title'),
      ingredient_2_desc: str(formData, 'ingredient_2_desc'),
      ingredient_3_icon: str(formData, 'ingredient_3_icon') || '☾',
      ingredient_3_title: str(formData, 'ingredient_3_title'),
      ingredient_3_desc: str(formData, 'ingredient_3_desc'),
      ingredient_4_icon: str(formData, 'ingredient_4_icon') || '❀',
      ingredient_4_title: str(formData, 'ingredient_4_title'),
      ingredient_4_desc: str(formData, 'ingredient_4_desc'),

      ritual_1_title: str(formData, 'ritual_1_title'),
      ritual_1_desc: str(formData, 'ritual_1_desc'),
      ritual_2_title: str(formData, 'ritual_2_title'),
      ritual_2_desc: str(formData, 'ritual_2_desc'),
      ritual_3_title: str(formData, 'ritual_3_title'),
      ritual_3_desc: str(formData, 'ritual_3_desc'),

      updated_at: new Date().toISOString(),
    })
    .eq('id', 1);

  revalidatePath('/admin/settings');
  revalidatePath('/catalog');
}
