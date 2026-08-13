import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  return NextResponse.json({
    role: auth.profile.role,
    display_name: auth.profile.display_name,
    email: auth.profile.email,
  });
}

export async function POST(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) {
    return auth;
  }

  return NextResponse.json({
    role: auth.profile.role,
    display_name: auth.profile.display_name,
    email: auth.profile.email,
  });
}
