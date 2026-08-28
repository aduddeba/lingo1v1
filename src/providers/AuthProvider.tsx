'use client';

import { useEffect } from 'react';
import { useAuthStore, usePlayerStore } from '@/store';
import type { LocalPlayer, PublicUser } from '@/types';

function userToPlayer(user: PublicUser): LocalPlayer {
  return {
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
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((s) => s.setSession);
  const setStatus = useAuthStore((s) => s.setStatus);
  const setPlayer = usePlayerStore((s) => s.setPlayer);
  const currentPlayer = usePlayerStore((s) => s.player);
  const authStatus = useAuthStore((s) => s.status);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      setStatus('loading');
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
        cache: 'no-store',
      }).catch(() => null);

      if (cancelled) return;

      if (!response?.ok) {
        setSession(null);
        return;
      }

      const data = (await response.json()) as { user: PublicUser };
      setSession(data.user);
      setPlayer(userToPlayer(data.user));
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [setSession, setStatus, setPlayer]);

  useEffect(() => {
    if (authStatus === 'unauthenticated' && currentPlayer?.identityKind === 'guest') {
      useAuthStore.getState().setStatus('guest');
    }
  }, [authStatus, currentPlayer]);

  return <>{children}</>;
}

export { userToPlayer };

