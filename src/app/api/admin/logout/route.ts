import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeAdmin(request);
    if (!isAuthorizedAdmin(auth)) return auth;
    const supabase = auth.supabase;
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase server configuration is invalid.';
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
