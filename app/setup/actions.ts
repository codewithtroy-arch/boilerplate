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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Stored on the auth user itself. The database trigger (see
      // roles_migration.sql) reads this and saves it as the shop's
      // business name — this way it works identically whether or not
      // "Confirm email" is required, since the trigger runs the moment
      // the account is created either way, not when this request returns.
      data: { business_name: businessName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Depending on your Supabase project's "Confirm email" setting, signUp
  // either returns an active session immediately, or requires the person
  // to click a confirmation email first. Either way, the business name is
  // already saved by the trigger — this branch is just about whether
  // *this browser* has a session yet.
  if (!data.session) {
    return {
      needsEmailConfirm: true,
      message:
        "Almost done — check your email and click the confirmation link. It'll bring you straight into your admin dashboard.",
    };
  }

  return { success: true };
}
