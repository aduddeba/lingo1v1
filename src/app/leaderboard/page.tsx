import type { Metadata } from 'next';
import { Card } from '@/components/ui';
import { getCurrentSession } from '@/lib/auth/cookies';
import { getLeaderboardPage, type PublicLeaderboardEntry } from '@/lib/auth/users';

export const metadata: Metadata = {
  title: 'Leaderboard',
};

interface LeaderboardPageProps {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const session = await getCurrentSession();
  const params = (await searchParams) ?? {};
  const leaderboard = await getLeaderboardPage({
    page: parsePositiveInteger(params.page),
    pageSize: parsePositiveInteger(params.limit),
    currentUserId: session?.user.id ?? null,
  });
  const currentUserOnPage = leaderboard.entries.some((entry) => entry.isCurrentUser);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Competitive
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">Leaderboard</h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-500">Ranked players</p>
          <p className="text-3xl font-extrabold text-brand-700">
            {leaderboard.totalRankedUsers}
          </p>
        </div>
      </section>

      {leaderboard.currentUser && !currentUserOnPage && (
        <Card variant="bordered" className="rounded-lg p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Your Rank
              </p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">
                {leaderboard.currentUser.rank ? `#${leaderboard.currentUser.rank}` : 'Unranked'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm sm:text-right">
              <div>
                <p className="font-semibold text-gray-400">Elo</p>
                <p className="text-lg font-bold text-gray-900">
                  {leaderboard.currentUser.eloRating}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-400">Top</p>
                <p className="text-lg font-bold text-gray-900">
                  {leaderboard.currentUser.topPercent
                    ? `${leaderboard.currentUser.topPercent}%`
                    : 'Unranked'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card variant="bordered" className="overflow-hidden rounded-lg p-0">
        {leaderboard.entries.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No ranked players yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3 text-right">Elo</th>
                  <th className="px-4 py-3 text-right">Wins</th>
                  <th className="px-4 py-3 text-right">Losses</th>
                  <th className="px-4 py-3 text-right">Played</th>
                  <th className="px-4 py-3 text-right">Win Rate</th>
                  <th className="px-4 py-3 text-right">Top</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboard.entries.map((entry) => (
                  <LeaderboardRow key={`${entry.rank}:${entry.username}`} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {leaderboard.totalPages > 1 && (
        <nav className="flex items-center justify-between text-sm">
          <PaginationLink
            disabled={leaderboard.page <= 1}
            href={leaderboardHref(leaderboard.page - 1, leaderboard.pageSize)}
          >
            Previous
          </PaginationLink>
          <span className="font-semibold text-gray-500">
            Page {leaderboard.page} of {leaderboard.totalPages}
          </span>
          <PaginationLink
            disabled={leaderboard.page >= leaderboard.totalPages}
            href={leaderboardHref(leaderboard.page + 1, leaderboard.pageSize)}
          >
            Next
          </PaginationLink>
        </nav>
      )}
    </div>
  );
}

function LeaderboardRow({ entry }: { entry: PublicLeaderboardEntry }) {
  const rowClass = entry.isCurrentUser
    ? 'bg-brand-50 text-brand-900'
    : 'bg-white text-gray-700';

  return (
    <tr className={rowClass}>
      <td className="px-4 py-3 font-bold text-gray-900">#{entry.rank}</td>
      <td className="px-4 py-3">
        <span className="font-semibold text-gray-900">{entry.username}</span>
        {entry.isCurrentUser && (
          <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700">
            You
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right font-bold text-gray-900">{entry.eloRating}</td>
      <td className="px-4 py-3 text-right">{entry.wins}</td>
      <td className="px-4 py-3 text-right">{entry.losses}</td>
      <td className="px-4 py-3 text-right">{entry.gamesPlayed}</td>
      <td className="px-4 py-3 text-right">{entry.winPercentage}%</td>
      <td className="px-4 py-3 text-right">{entry.topPercent}%</td>
    </tr>
  );
}

function PaginationLink({
  children,
  disabled,
  href,
}: {
  children: string;
  disabled: boolean;
  href: string;
}) {
  if (disabled) {
    return <span className="font-semibold text-gray-300">{children}</span>;
  }

  return (
    <a href={href} className="font-semibold text-brand-700 transition-colors hover:text-brand-500">
      {children}
    </a>
  );
}

function leaderboardHref(page: number, pageSize: number): string {
  return `/leaderboard?page=${page}&limit=${pageSize}`;
}

function parsePositiveInteger(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}
