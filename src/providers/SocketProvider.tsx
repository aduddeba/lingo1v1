'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSocket, disconnectSocket, prepareSocketAuth } from '@/lib/socket/client';
import { useAuthStore, useGameStore } from '@/store';

const SOCKET_ROUTES = ['/lobby', '/match'];

function needsSocket(pathname: string): boolean {
  return SOCKET_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const setConnectionStatus = useGameStore((s) => s.setConnectionStatus);
  const authStatus = useAuthStore((s) => s.status);
  const authUserId = useAuthStore((s) => s.user?.id ?? null);
  const pathname = usePathname();
  const active = needsSocket(pathname);

  useEffect(() => {
    if (!active) {
      setConnectionStatus('disconnected');
      return;
    }

    if (authStatus === 'loading') return;

    let cancelled = false;
    const socket = getSocket();

    const onConnect = () => setConnectionStatus('connected');
    const onDisconnect = () => setConnectionStatus('disconnected');
    const onConnectError = () => setConnectionStatus('error');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    async function connect() {
      setConnectionStatus('connecting');
      await prepareSocketAuth(authStatus === 'authenticated');
      if (!cancelled) socket.connect();
    }

    void connect();

    return () => {
      cancelled = true;
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      disconnectSocket();
    };
  }, [setConnectionStatus, active, authStatus, authUserId]);

  return <>{children}</>;
}
