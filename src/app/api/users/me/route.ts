import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/cookies';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  return NextResponse.json({ user: session.user });
}
