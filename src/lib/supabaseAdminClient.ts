import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getAdminSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export function getAdminSupabaseConfigError() {
  if (!supabaseUrl) return 'Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL';
  if (!supabaseServiceRoleKey) return 'Missing SUPABASE_SERVICE_ROLE_KEY';
  return null;
}
