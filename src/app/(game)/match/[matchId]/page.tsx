import type { Metadata } from 'next';
import { MatchView } from '@/components/game';

// In Next.js 15, route params are Promises - always await them.
interface Props {
  params: Promise<{ matchId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { matchId } = await params;
  return { title: `Match ${matchId.slice(0, 8)}` };
}

export default async function MatchPage({ params }: Props) {
  const { matchId } = await params;

  return (
    <div className="flex flex-col gap-8 py-8">
      <header className="text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400">Live Match</p>
        <p className="font-mono text-sm text-gray-600">{matchId}</p>
      </header>
      <MatchView matchId={matchId} />
    </div>
  );
}
