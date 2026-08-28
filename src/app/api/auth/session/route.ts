import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/cookies';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json(session);
}
