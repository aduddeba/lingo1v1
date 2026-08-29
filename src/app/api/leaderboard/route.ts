import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth/cookies';
import { getLeaderboardPage } from '@/lib/auth/users';

export async function GET(request: Request) {
  const session = await getCurrentSession();
  const url = new URL(request.url);
  const page = parsePositiveInteger(url.searchParams.get('page'));
  const pageSize = parsePositiveInteger(url.searchParams.get('limit'));

  const leaderboard = await getLeaderboardPage({
    page,
    pageSize,
    currentUserId: session?.user.id ?? null,
  });

  return NextResponse.json(leaderboard);
}

function parsePositiveInteger(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}
