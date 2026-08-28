import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/cookies';
import { createSocketAuthToken } from '@/lib/auth/session';

export async function POST() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const token = createSocketAuthToken({
    userId: session.user.id,
    username: session.user.username,
    email: session.user.email,
  });

  return NextResponse.json({ token });
}
