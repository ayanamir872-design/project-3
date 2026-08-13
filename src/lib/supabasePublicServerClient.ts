import { createClient } from '@supabase/supabase-js';

export function getPublicSupabaseServerClient(accessToken?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  return createClient(url, publishableKey, {
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getPublicSupabaseConfigError() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return 'Missing NEXT_PUBLIC_SUPABASE_URL.';
  if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return 'Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.';
  return null;
}
