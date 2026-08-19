'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateSettings(formData: FormData) {
  const supabase = createClient();

  const businessName = String(formData.get('business_name') || '').trim();
  const tagline = String(formData.get('tagline') || '').trim();
  const whatsappNumber = String(formData.get('whatsapp_number') || '').trim();
  const aboutText = String(formData.get('about_text') || '').trim();
  const announcementText = String(formData.get('announcement_text') || '').trim();

  if (!businessName) return;

  await supabase
    .from('settings')
    .update({
      business_name: businessName,
      tagline,
      whatsapp_number: whatsappNumber || null,
      about_text: aboutText,
      announcement_text: announcementText || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1);

  revalidatePath('/admin/settings');
  revalidatePath('/catalog');
}
