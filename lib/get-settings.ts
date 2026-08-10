import { createClient } from './supabase/server';

export type Settings = {
  business_name: string;
  tagline: string;
  whatsapp_number: string | null;
};

const DEFAULTS: Settings = {
  business_name: 'My Shop',
  tagline: 'Quality you can trust',
  whatsapp_number: null,
};

export async function getSettings(): Promise<Settings> {
  const supabase = createClient();
  const { data } = await supabase
    .from('settings')
    .select('business_name, tagline, whatsapp_number')
    .eq('id', 1)
    .single();

  return data ?? DEFAULTS;
}
