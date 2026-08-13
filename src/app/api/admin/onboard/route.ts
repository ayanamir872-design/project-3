import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';
import { getAdminSupabaseClient, getAdminSupabaseConfigError } from '@/lib/supabaseAdminClient';

export async function POST(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  if (auth.profile.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: getAdminSupabaseConfigError() }, { status: 503 });
  }

  try {
    const { count, error: countError } = await supabase.from('admin_profiles').select('id', { count: 'exact' });
    if (countError) throw countError;

    if (typeof count === 'number' && count > 0) {
      return NextResponse.json({ error: 'Admin already initialized' }, { status: 400 });
    }

    const payload = {
      user_id: auth.user.id,
      role: 'superadmin',
      display_name: auth.profile.display_name,
      email: auth.profile.email,
    };

    const { data: inserted, error: insertError } = await supabase.from('admin_profiles').insert(payload).select().single();
    if (insertError) throw insertError;

    await supabase.from('audit_logs').insert({
      actor_user_id: auth.user.id,
      actor_display: auth.profile.display_name,
      action: 'onboard_superadmin',
      entity: 'admin_profiles',
      entity_id: inserted.id,
      metadata: { note: 'Initial superadmin created via onboarding endpoint' },
    });

    return NextResponse.json({ success: true, admin: inserted }, { status: 201 });
  } catch (err: any) {
    console.error('onboard error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
