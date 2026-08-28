import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/cookies';
import { getPublicUserById } from '@/lib/auth/users';

interface RouteContext {
  params: Promise<{ userId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const { userId } = await context.params;
  if (userId !== session.user.id) {
    return NextResponse.json({ error: 'You can only access your own user record.' }, { status: 403 });
  }

  const user = await getPublicUserById(userId);
  if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  return NextResponse.json({ user });
}
