'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getSocket } from './client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/types';

// ─── useSocketEvent ───────────────────────────────────────────────────────────
// Subscribes to a typed server→client event for the lifetime of the component.
//
// The handler is stored in a ref so callers can pass inline functions without
// triggering effect re-runs. The effect re-runs only when `event` changes,
// which in practice is never (event names are string literals).

export function useSocketEvent<K extends keyof ServerToClientEvents>(
  event: K,
  handler: ServerToClientEvents[K]
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket();

    const stableListener = (...args: Parameters<ServerToClientEvents[K]>) =>
      (handlerRef.current as (...a: Parameters<ServerToClientEvents[K]>) => void)(...args);

    socket.on(event, stableListener as never);
    return () => {
      socket.off(event, stableListener as never);
    };
  }, [event]);
}

// ─── useSocketEmit ────────────────────────────────────────────────────────────
// Returns a stable emit function typed against ClientToServerEvents.
// The returned reference never changes, so it is safe to include in dep arrays.

export function useSocketEmit() {
  return useCallback(
    <K extends keyof ClientToServerEvents>(
      event: K,
      ...args: Parameters<ClientToServerEvents[K]>
    ) => {
      getSocket().emit(event, ...args);
    },
    []
  );
}

// ─── useSocketConnected ───────────────────────────────────────────────────────

export function useSocketConnected(): boolean {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    setConnected(socket.connected);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return connected;
}
