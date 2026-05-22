'use client';

import { useCallback } from 'react';
import { useLobbyStore } from '@/store';
import { useSocketEvent, useSocketEmit } from '@/lib/socket/hooks';

// Wires lobby socket events to the lobby store and returns actions that
// emit to the server and update local state atomically.
export function useLobby() {
  const { setPlayers, addPlayer, removePlayer, setReadyCount, setMaxPlayers, setCountdown, setReady: setReadyState } =
    useLobbyStore();

  const emit = useSocketEmit();

  useSocketEvent('lobby:update', ({ players, readyCount, maxPlayers }) => {
    setPlayers(players);
    setReadyCount(readyCount);
    setMaxPlayers(maxPlayers);
  });

  useSocketEvent('lobby:player_joined', ({ player }) => addPlayer(player));
  useSocketEvent('lobby:player_left', ({ playerId }) => removePlayer(playerId));
  useSocketEvent('lobby:countdown', ({ startsIn }) => setCountdown(startsIn));

  const joinLobby = useCallback(
    (lobbyId: string) => {
      emit('lobby:join', { lobbyId }, (err) => {
        if (err) console.error('Failed to join lobby:', err);
      });
    },
    [emit]
  );

  const leaveLobby = useCallback(
    (lobbyId: string) => {
      emit('lobby:leave', { lobbyId });
    },
    [emit]
  );

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
