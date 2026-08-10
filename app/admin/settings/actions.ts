'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function updateSettings(formData: FormData) {
  const supabase = createClient();

  const businessName = String(formData.get('business_name') || '').trim();
  const tagline = String(formData.get('tagline') || '').trim();
  const whatsappNumber = String(formData.get('whatsapp_number') || '').trim();

  if (!businessName) return;

  await supabase
    .from('settings')
    .update({
      business_name: businessName,
      tagline,
      whatsapp_number: whatsappNumber || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1);

  revalidatePath('/admin/settings');
  revalidatePath('/catalog');
}
