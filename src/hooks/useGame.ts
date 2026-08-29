'use client';

import { useCallback } from 'react';
import { useAuthStore, useGameStore, usePlayerStore } from '@/store';
import { useSocketEvent, useSocketEmit } from '@/lib/socket/hooks';
import type { PublicUser } from '@/types';

function syncAuthenticatedPlayer(user: PublicUser): void {
  useAuthStore.getState().setSession(user);
  usePlayerStore.getState().setPlayer({
    id: user.id,
    username: user.username,
    email: user.email,
    avatarUrl: null,
    status: 'idle',
    rating: user.eloRating,
    wins: user.wins,
    losses: user.losses,
    gamesPlayed: user.gamesPlayed,
    createdAt: user.createdAt,
    identityKind: 'authenticated',
  });
}

async function refreshAuthenticatedUser(): Promise<void> {
  const response = await fetch('/api/auth/session', {
    credentials: 'include',
    cache: 'no-store',
  }).catch(() => null);

  if (!response?.ok) return;
  const data = (await response.json()) as { user: PublicUser | null };
  if (data.user) syncAuthenticatedPlayer(data.user);
}

// Central hook that wires server→client game events to the game store
// and exposes a typed submitAnswer action to UI components.
export function useGame() {
  const {
    match,
    timeRemaining,
    lastAnswerResult,
    ratingResult,
    winnerId,
    setMatch,
    localPlayerId,
    setLocalPlayerId,
    updateRound,
    updateScores,
    setTimeRemaining,
    setLastAnswerResult,
    setRatingResult,
    setWinnerId,
  } = useGameStore();

  const emit = useSocketEmit();

  useSocketEvent('match:start', ({ match: m, localPlayerId: id }) => {
    setMatch(m);
    setLocalPlayerId(id);
  });
  useSocketEvent('match:state', ({ match: m }) => setMatch(m));
  useSocketEvent('match:end', ({ match: m, winnerId: w, ratingResult }) => {
    setMatch(m);
    setWinnerId(w);
    setRatingResult(ratingResult ?? null);
    if (ratingResult) void refreshAuthenticatedUser();
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
    ratingResult,
    winnerId,
    submitAnswer,
    surrenderMatch,
  };
}


