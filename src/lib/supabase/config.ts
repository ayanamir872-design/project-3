export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const missing: string[] = [];

  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!publishableKey) missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

  if (missing.length > 0) {
    throw new Error(`Supabase configuration error: missing ${missing.join(' and ')}.`);
  }

  return { url: url!, publishableKey: publishableKey! };
}

