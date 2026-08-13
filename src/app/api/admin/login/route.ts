import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabasePublicConfig } from '@/lib/supabase/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? body?.username ?? '').trim();
    const password = String(body?.password ?? '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    const { url, publishableKey } = getSupabasePublicConfig();
    const supabase = createServerClient(url, publishableKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
      },
    });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    response.headers.set('Cache-Control', 'private, no-store');

    return response;
  } catch (error) {
    console.error('ADMIN_LOGIN_ERROR', error);
    return NextResponse.json({ error: 'Unable to sign in.' }, { status: 500 });
  }
}
