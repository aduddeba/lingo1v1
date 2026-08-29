import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/cookies';
import { getDashboardDataForUser } from '@/lib/dashboard';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const result = await getDashboardDataForUser(session.user.id);
  if (result.status !== 200) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.dashboard);
}
