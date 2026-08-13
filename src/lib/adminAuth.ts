import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createClient } from './supabase/server';

export const ADMIN_ROLES = ['superadmin', 'admin', 'staff'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export type AdminProfile = {
  id: string;
  user_id: string;
  role: AdminRole;
  display_name: string | null;
  email: string | null;
};

export type AuthorizedAdmin = {
  supabase: SupabaseClient;
  user: User;
  profile: AdminProfile;
};

export async function authorizeAdmin(
  _request: NextRequest,
  allowedRoles: readonly AdminRole[] = ADMIN_ROLES,
): Promise<AuthorizedAdmin | NextResponse> {
  let supabase: SupabaseClient;

  try {
    supabase = await createClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Supabase server configuration is invalid.';
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Missing or invalid Supabase Auth session.' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('id,user_id,role,display_name,email')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Admin profile lookup failed', profileError.message);
    return NextResponse.json({ error: 'Unable to verify admin authorization.' }, { status: 500 });
  }

  if (!profile || !allowedRoles.includes(profile.role as AdminRole)) {
    return NextResponse.json({ error: 'Admin authorization required.' }, { status: 403 });
  }

  return {
    supabase,
    user: userData.user,
    profile: profile as AdminProfile,
  };
}

export function isAuthorizedAdmin(value: AuthorizedAdmin | NextResponse): value is AuthorizedAdmin {
  return !(value instanceof NextResponse);
}
