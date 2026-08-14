import { NextResponse } from 'next/server';
import { getPublicSupabaseConfigError, getPublicSupabaseServerClient } from '@/lib/supabasePublicServerClient';

const SERVICE_FIELDS = 'id,name,slug,short_description,description,image_url,price,currency,duration_minutes,category,is_active,sort_order,created_at,updated_at';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getPublicSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: getPublicSupabaseConfigError() ?? 'Server database is not configured.' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('services')
    .select(SERVICE_FIELDS)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Public services lookup failed', error.message);
    return NextResponse.json({ error: 'Unable to load services.', ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {}) }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}
