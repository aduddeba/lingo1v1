import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/cookies';
import { getRatingHistoryForUser } from '@/lib/auth/users';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const ratingHistory = await getRatingHistoryForUser(session.user.id);
  return NextResponse.json({ ratingHistory });
}
