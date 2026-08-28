'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useLobbyStore, useGameStore, usePlayerStore } from '@/store';
import { useSocketEvent, useSocketEmit } from '@/lib/socket/hooks';
import type { Difficulty } from '@/types';

// Wires lobby socket events to the lobby store and returns actions that
// emit to the server and update local state atomically.
export function useLobby() {
  const {
    setPlayers,
    addPlayer,
    removePlayer,
    setReadyCount,
    setMaxPlayers,
    setCountdown,
    setReady: setReadyState,
    resetLobby,
    setJoinError,
  } = useLobbyStore();

  const emit = useSocketEmit();
  const router = useRouter();
  const setMatch = useGameStore((s) => s.setMatch);
  const setLocalPlayerId = useGameStore((s) => s.setLocalPlayerId);
  const setPlayer = usePlayerStore((s) => s.setPlayer);
  const authUser = useAuthStore((s) => s.user);

  useSocketEvent('lobby:update', ({ players, readyCount, maxPlayers }) => {
    setPlayers(players);
    setReadyCount(readyCount);
    setMaxPlayers(maxPlayers);
  });

  useSocketEvent('lobby:player_joined', ({ player }) => addPlayer(player));
  useSocketEvent('lobby:player_left', ({ playerId }) => removePlayer(playerId));
  useSocketEvent('lobby:countdown', ({ startsIn }) => setCountdown(startsIn));
  useSocketEvent('player:identity', ({ player, authenticated }) => {
    setPlayer({
      ...player,
      identityKind: authenticated ? 'authenticated' : 'guest',
      email: authenticated ? authUser?.email : undefined,
      gamesPlayed: authenticated ? authUser?.gamesPlayed : undefined,
    });
  });

  // The lobby stays mounted while queueing/readying up, so this is the
  // natural place to hand off to the match page once the server pairs us.
  // gameStore is populated here (not just in useGame) because useGame only
  // mounts once MatchView renders, after this event has already fired.
  useSocketEvent('match:start', ({ match, localPlayerId }) => {
    setMatch(match);
    setLocalPlayerId(localPlayerId);
    router.push(`/match/${match.id}`);
  });

  const joinLobby = useCallback(
    (difficulty: Difficulty, player: { id: string; username: string }) => {
      setJoinError(null);
      emit('lobby:join', { difficulty, player }, (err) => {
        if (err) setJoinError(err);
      });
    },
    [emit, setJoinError]
  );

  const leaveLobby = useCallback(() => {
    emit('lobby:leave');
    // The server only notifies the *other* player on leave; reset our own
    // local view immediately rather than waiting for a round-trip.
    resetLobby();
  }, [emit, resetLobby]);

  // Updates optimistic local state AND emits to server so they stay in sync.
  const setReady = useCallback(
    (ready: boolean) => {
      setReadyState(ready);
      emit('lobby:ready', { ready });
    },
    [setReadyState, emit]
  );

  return { joinLobby, leaveLobby, setReady };
}
