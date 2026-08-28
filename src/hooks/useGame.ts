'use client';

import { useCallback } from 'react';
import { useGameStore } from '@/store';
import { useSocketEvent, useSocketEmit } from '@/lib/socket/hooks';

// Central hook that wires server→client game events to the game store
// and exposes a typed submitAnswer action to UI components.
export function useGame() {
  const {
    match,
    timeRemaining,
    lastAnswerResult,
    winnerId,
    setMatch,
    localPlayerId,
    setLocalPlayerId,
    updateRound,
    updateScores,
    setTimeRemaining,
    setLastAnswerResult,
    setWinnerId,
  } = useGameStore();

  const emit = useSocketEmit();

  useSocketEvent('match:start', ({ match: m, localPlayerId: id }) => {
    setMatch(m);
    setLocalPlayerId(id);
  });
  useSocketEvent('match:state', ({ match: m }) => setMatch(m));
  useSocketEvent('match:end', ({ match: m, winnerId: w }) => {
    setMatch(m);
    setWinnerId(w);
  });

  useSocketEvent('round:start', ({ round }) => updateRound(round));
  useSocketEvent('round:tick', ({ timeRemaining: ms }) => setTimeRemaining(ms));

  useSocketEvent('score:update', ({ scores }) => updateScores(scores));

  useSocketEvent('answer:result', (result) => {
    setLastAnswerResult(result);
    // Auto-clear feedback after 2 s so the UI can reset
    setTimeout(() => setLastAnswerResult(null), 2_000);
  });

  const submitAnswer = useCallback(
    (answer: string) => {
      if (!match?.id || !match.currentRound?.id) return;
      emit('answer:submit', {
        matchId: match.id,
        roundId: match.currentRound.id,
        answer,
      });
    },
    [match, emit]
  );

  const surrenderMatch = useCallback(() => {
    if (!match?.id) return;
    emit('match:surrender', { matchId: match.id });
  }, [match?.id, emit]);

  return {
    match,
    localPlayerId,
    timeRemaining,
    lastAnswerResult,
    winnerId,
    submitAnswer,
    surrenderMatch,
  };
}


