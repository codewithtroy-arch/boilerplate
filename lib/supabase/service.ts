import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Uses the SERVICE ROLE key, which bypasses Row Level Security entirely.
 * Import this ONLY in server-only files (API routes, Server Actions) that
 * you've written and trust — never in a client component, never expose
 * this key with a NEXT_PUBLIC_ prefix. It's how the app records orders
 * and decrements stock for anonymous customers who aren't logged in.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set on the server.');
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
