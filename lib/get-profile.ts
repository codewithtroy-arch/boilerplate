import type { User } from '@supabase/supabase-js';
import { createClient } from './supabase/server';

type Role = 'admin' | 'customer' | null;

export async function getCurrentProfile(): Promise<{ user: User | null; role: Role }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, role: null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return { user, role: (profile?.role as Role) ?? 'customer' };
}
