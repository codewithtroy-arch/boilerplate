'use server';

import { createClient } from '@/lib/supabase/server';

export async function completeSetup(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const businessName = String(formData.get('businessName') || '').trim();

  if (!email || !password || !businessName) {
    return { error: 'All fields are required.' };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  // Depending on your Supabase project's "Confirm email" setting, signUp
  // either returns an active session immediately, or requires the person
  // to click a confirmation email first. Handle both.
  if (!data.session) {
    return {
      needsEmailConfirm: true,
      message:
        'Account created — check your email to confirm it, then sign in.',
    };
  }

  // Session is active — save the business name right away. The trigger
  // in roles_migration.sql already made this account admin, since it's
  // the first one.
  const { error: settingsError } = await supabase
    .from('settings')
    .update({ business_name: businessName })
    .eq('id', 1);

  if (settingsError) {
    return { error: `Signed up, but couldn't save business name: ${settingsError.message}` };
  }

  return { success: true };
}
