import { io, type Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/types';

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

function isLoopbackHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

function getSocketUrl(): string {
  const fallbackUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
  const configuredUrl = process.env['NEXT_PUBLIC_SOCKET_URL'];
  if (!configuredUrl) return fallbackUrl;

  try {
    const parsedUrl = new URL(configuredUrl);
    if (isLoopbackHost(parsedUrl.hostname) && !isLoopbackHost(window.location.hostname)) {
      parsedUrl.hostname = window.location.hostname;
      return parsedUrl.toString();
    }

    return configuredUrl;
  } catch {
    return fallbackUrl;
  }
}

export function getSocket(): AppSocket {
  if (typeof window === 'undefined') {
    throw new Error('getSocket() must only be called on the client side.');
  }

  if (!socket) {
    const socketUrl = getSocketUrl();

    socket = io(socketUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 10_000,
      timeout: 20_000,
      withCredentials: true,
    });
  }

  return socket;
}

export async function prepareSocketAuth(isAuthenticated: boolean): Promise<void> {
  const activeSocket = getSocket();
  if (!isAuthenticated) {
    activeSocket.auth = {};
    return;
  }

  const response = await fetch('/api/auth/socket-token', {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
  }).catch(() => null);

  if (!response?.ok) {
    activeSocket.auth = {};
    return;
  }

  const data = (await response.json().catch(() => ({}))) as { token?: unknown };
  activeSocket.auth = typeof data.token === 'string' ? { token: data.token } : {};
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
