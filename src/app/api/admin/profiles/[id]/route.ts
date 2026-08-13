import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';
import { getAdminSupabaseClient, getAdminSupabaseConfigError } from '@/lib/supabaseAdminClient';

export async function PUT(request: NextRequest, context: any) {
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
    const params = (context && context.params) || {};
    const id = params.id;

    const body = await request.json();
    const { role, display_name } = body;

    const { data: updated, error } = await supabase.from('admin_profiles').update({ role, display_name, updated_at: new Date().toISOString() }).eq('id', id).select().maybeSingle();
    if (error) throw error;

    await supabase.from('audit_logs').insert({ actor_user_id: auth.user.id, action: 'update_admin', entity: 'admin_profiles', entity_id: id, metadata: { role } });

    return NextResponse.json({ admin: updated });
  } catch (err: any) {
    console.error('admin profiles PUT error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
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
    const params = (context && context.params) || {};
    const id = params.id;

    const { error } = await supabase.from('admin_profiles').delete().eq('id', id);
    if (error) throw error;

    await supabase.from('audit_logs').insert({ actor_user_id: auth.user.id, action: 'delete_admin', entity: 'admin_profiles', entity_id: id });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('admin profiles DELETE error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
