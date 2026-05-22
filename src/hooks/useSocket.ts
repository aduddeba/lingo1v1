'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket/client';
import { useGameStore } from '@/store';
import type { ConnectionStatus } from '@/types';

// Manages the socket lifecycle for a page or subtree that needs a live connection.
// Prefer SocketProvider at the app root; use this hook only for pages that need
// to connect/disconnect on mount/unmount (e.g. match pages).
export function useSocket(): { isConnected: boolean; status: ConnectionStatus } {
  const [isConnected, setIsConnected] = useState(false);
  const setConnectionStatus = useGameStore((s) => s.setConnectionStatus);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
    };
    const onDisconnect = () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };
    const onConnectError = () => {
      setConnectionStatus('error');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    if (!socket.connected) {
      setConnectionStatus('connecting');
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, [setConnectionStatus]);

  const status = useGameStore((s) => s.connectionStatus);

  return { isConnected, status };
}
