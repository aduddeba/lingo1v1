'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSocket, disconnectSocket } from '@/lib/socket/client';
import { useGameStore } from '@/store';

const SOCKET_ROUTES = ['/lobby', '/match'];

function needsSocket(pathname: string): boolean {
  return SOCKET_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const setConnectionStatus = useGameStore((s) => s.setConnectionStatus);
  const pathname = usePathname();
  // /lobby and /match/[matchId] are two different routes but must share one
  // connection — the server ties a match to a socket.id at pairing time, so
  // tearing the socket down mid-navigation (i.e. depending on raw `pathname`
  // here) would hand the server a stale id and silently drop every answer
  // submitted from the match page.
  const active = needsSocket(pathname);

  useEffect(() => {
    if (!active) {
      setConnectionStatus('disconnected');
      return;
    }

    const socket = getSocket();

    const onConnect = () => setConnectionStatus('connected');
    const onDisconnect = () => setConnectionStatus('disconnected');
    const onConnectError = () => setConnectionStatus('error');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    setConnectionStatus('connecting');
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      disconnectSocket();
    };
  }, [setConnectionStatus, active]);

  return <>{children}</>;
}
