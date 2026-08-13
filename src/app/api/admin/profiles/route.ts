import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';
import { getAdminSupabaseClient, getAdminSupabaseConfigError } from '@/lib/supabaseAdminClient';

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  if (!['admin', 'superadmin'].includes(auth.profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: getAdminSupabaseConfigError() }, { status: 503 });
  }

  try {
    const { data, error } = await supabase.from('admin_profiles').select('id,user_id,role,display_name,email,created_at');
    if (error) throw error;
    return NextResponse.json({ admins: data ?? [] });
  } catch (err: any) {
    console.error('admin profiles GET error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

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
    const body = await request.json();
    const { email, user_id, role, display_name } = body;

    let targetUserId = user_id ?? null;
    let targetEmail = email ?? null;

    if (!targetUserId && targetEmail) {
      const { data: usersData, error: userError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (userError) throw userError;
      const userRow = usersData.users.find((user) => user.email?.toLowerCase() === targetEmail.toLowerCase());
      if (!userRow) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      targetUserId = userRow.id;
      targetEmail = userRow.email ?? targetEmail;
    }

    if (!targetUserId) return NextResponse.json({ error: 'user_id or email required' }, { status: 400 });

    const requestedRole = role ?? 'admin';
    if (!['admin', 'staff'].includes(requestedRole)) {
      return NextResponse.json({ error: 'Only admin or staff profiles can be created.' }, { status: 400 });
    }
    const payload = { user_id: targetUserId, role: requestedRole, display_name: display_name ?? null, email: targetEmail };

    const { data: inserted, error: insertError } = await supabase.from('admin_profiles').insert(payload).select().single();
    if (insertError) throw insertError;

    await supabase.from('audit_logs').insert({
      actor_user_id: auth.user.id,
      actor_display: auth.profile.display_name,
      action: 'create_admin',
      entity: 'admin_profiles',
      entity_id: inserted.id,
      metadata: { role: inserted.role },
    });

    return NextResponse.json({ admin: inserted }, { status: 201 });
  } catch (err: any) {
    console.error('admin profiles POST error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
