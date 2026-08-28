'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GameBoard } from './GameBoard';
import { AnswerPanel } from './AnswerPanel';
import { Button } from '@/components/ui';
import { useGame, usePlayer } from '@/hooks';
import { useGameStore, useLobbyStore } from '@/store';

interface MatchViewProps {
  matchId: string;
}

export function MatchView({ matchId }: MatchViewProps) {
  const { player } = usePlayer();
  const { match, localPlayerId, timeRemaining, winnerId, submitAnswer, surrenderMatch } = useGame();
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
          <Button onClick={handleBackToLobby}>Back to Lobby</Button>
        </div>
      )}
    </div>
  );
}



