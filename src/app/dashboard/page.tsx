import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui';
import { EloHistoryChart } from '@/components/dashboard';
import { getCurrentSession } from '@/lib/auth/cookies';
import { getDashboardDataForUser } from '@/lib/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect('/login');

  const result = await getDashboardDataForUser(session.user.id);
  if (result.status !== 200) redirect('/login');

  const { user, ratingHistory, peakElo, recentEloChange, recentResults } = result.dashboard;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">Dashboard</p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-900">{user.username}</h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-500">Current Elo</p>
          <p className="text-3xl font-extrabold text-brand-700">{user.eloRating}</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Stat label="Wins" value={user.wins} />
        <Stat label="Losses" value={user.losses} />
        <Stat label="Played" value={user.gamesPlayed} />
        <Stat label="Win Rate" value={`${user.winPercentage}%`} />
        <Stat label="Peak Elo" value={peakElo} />
        <Stat
          label="Recent"
          value={`${recentEloChange >= 0 ? '+' : ''}${recentEloChange}`}
          tone={recentEloChange >= 0 ? 'positive' : 'negative'}
        />
      </section>

      <Card variant="bordered" className="rounded-lg">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Elo Progress</h2>
            <p className="text-sm text-gray-500">Rating after each completed ranked match.</p>
          </div>
          <p className="text-sm font-semibold text-gray-400">{ratingHistory.length} matches</p>
        </div>
        <EloHistoryChart history={ratingHistory} />
      </Card>

      <Card variant="bordered" className="rounded-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Latest Ranked Results</h2>
          <p className="text-sm font-semibold text-gray-400">Last 5</p>
        </div>
        {recentResults.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
            No ranked results yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentResults.map((result) => (
              <div key={result.matchId} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold capitalize text-gray-900">{result.result}</p>
                  <p className="text-xs text-gray-500">
                    {new Intl.DateTimeFormat('en', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(result.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {result.scoreFor} - {result.scoreAgainst}
                  </p>
                  <p className={result.ratingChange >= 0 ? 'text-xs text-green-600' : 'text-xs text-red-600'}>
                    {result.ratingChange >= 0 ? '+' : ''}
                    {result.ratingChange} Elo
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone?: 'positive' | 'negative';
}) {
  const toneClass =
    tone === 'positive' ? 'text-green-600' : tone === 'negative' ? 'text-red-600' : 'text-gray-900';

  return (
    <Card variant="bordered" className="rounded-lg p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`mt-2 text-2xl font-extrabold ${toneClass}`}>{value}</p>
    </Card>
  );
}
