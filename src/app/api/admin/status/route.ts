import { NextRequest, NextResponse } from 'next/server';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  return NextResponse.json({ authenticated: true, role: auth.profile.role });
}
