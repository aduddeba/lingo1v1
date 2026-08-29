'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameBoard } from './GameBoard';
import { AnswerPanel } from './AnswerPanel';
import { Button } from '@/components/ui';
import { useGame, usePlayer } from '@/hooks';
import { useGameStore, useLobbyStore } from '@/store';
import { formatScore } from '@/lib/utils/format';
import type { MatchCompletionReason } from '@/types';

interface MatchViewProps {
  matchId: string;
}

export function MatchView({ matchId }: MatchViewProps) {
  const { player } = usePlayer();
  const {
    match,
    localPlayerId,
    timeRemaining,
    ratingResult,
    winnerId,
    submitAnswer,
    surrenderMatch,
  } = useGame();
  const router = useRouter();
  const resetGame = useGameStore((s) => s.resetGame);
  const resetLobby = useLobbyStore((s) => s.resetLobby);

  // Guests without an identity (e.g. a direct link, or a refresh that lost
  // localStorage) have no way to be scored - send them back to pick a name.
  useEffect(() => {
    if (!player) router.replace('/lobby');
  }, [player, router]);

  const handleBackToLobby = () => {
    resetGame();
    resetLobby();
    router.push('/lobby');
  };

  if (!player) return null;

  if (!match || match.id !== matchId) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-gray-500">Connecting to match…</p>
      </div>
    );
  }

  const localScore = match.scores[localPlayerId ?? player.id]?.score ?? match.scores[player.id]?.score;
  const opponentScore = Object.values(match.scores).find(
    (score) => score.playerId !== (localPlayerId ?? player.id)
  )?.score;

  return (
    <div className="flex flex-col gap-8">
      <GameBoard
        match={match}
        localPlayerId={localPlayerId ?? player.id}
        timeRemaining={timeRemaining}
      />

      {match.phase === 'active' && (
        <AnswerPanel match={match} onSubmit={submitAnswer} onSurrender={surrenderMatch} />
      )}

      {match.phase === 'game_over' && (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
          <p className="text-2xl font-bold text-gray-900">
            {winnerId === null
              ? "It's a tie!"
              : winnerId === player.id
                ? 'You won!'
                : 'You lost - good game.'}
          </p>
          {typeof localScore === 'number' && typeof opponentScore === 'number' && (
            <p className="text-lg font-bold text-gray-900">
              {formatScore(localScore)} - {formatScore(opponentScore)}
            </p>
          )}
          <p className="text-sm font-semibold text-gray-500">
            {formatCompletionReason(match.completionReason, match.roundsPlayed)}
          </p>
          {ratingResult ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-3">
              <p
                className={
                  ratingResult.ratingChange >= 0
                    ? 'text-lg font-bold text-green-600'
                    : 'text-lg font-bold text-red-600'
                }
              >
                {ratingResult.ratingChange >= 0 ? '+' : ''}
                {ratingResult.ratingChange} Elo
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {ratingResult.previousRating} to {ratingResult.newRating}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No Elo change for this match.</p>
          )}
          <Button onClick={handleBackToLobby}>Back to Lobby</Button>
        </div>
      )}
    </div>
  );
}

function formatCompletionReason(reason: MatchCompletionReason | null, roundsPlayed: number): string {
  switch (reason) {
    case 'target_score':
      return 'Target score reached';
    case 'round_limit':
      return `Won after ${roundsPlayed} rounds`;
    case 'draw':
      return `Draw after ${roundsPlayed} rounds`;
    case 'forfeit':
      return 'Won by forfeit';
    case 'surrender':
      return 'Won by surrender';
    default:
      return 'Match complete';
  }
}



