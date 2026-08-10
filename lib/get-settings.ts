import { createClient } from './supabase/server';

export type Settings = {
  business_name: string;
  tagline: string;
  whatsapp_number: string | null;
  about_text: string;
};

const DEFAULTS: Settings = {
  business_name: 'My Shop',
  tagline: 'Quality you can trust',
  whatsapp_number: null,
  about_text: "We're a small business dedicated to quality products and honest service.",
};

export async function getSettings(): Promise<Settings> {
  const supabase = createClient();
  const { data } = await supabase
    .from('settings')
    .select('business_name, tagline, whatsapp_number, about_text')
    .eq('id', 1)
    .single();

  return data ?? DEFAULTS;
}
