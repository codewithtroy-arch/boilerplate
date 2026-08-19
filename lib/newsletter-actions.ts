'use server';

import { createServiceClient } from '@/lib/supabase/service';

export async function submitNewsletterSignup(email: string): Promise<{ error?: string }> {
  if (!email || !email.includes('@')) {
    return { error: 'Enter a valid email.' };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('newsletter_signups')
    .insert({ email: email.trim().toLowerCase() });

  // A duplicate email (already signed up) isn't a real error from the
  // user's point of view — treat it as success either way.
  if (error && !error.message.includes('duplicate')) {
    return { error: 'Could not sign up — try again.' };
  }

  return {};
}
