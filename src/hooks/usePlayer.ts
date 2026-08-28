'use client';

import { useAuthStore, usePlayerStore } from '@/store';
import type { LocalPlayer, PublicUser } from '@/types';

export function usePlayer(): {
  player: LocalPlayer | null;
  user: PublicUser | null;
  isAuthenticated: boolean;
  setPlayer: (p: LocalPlayer | null) => void;
  clearPlayer: () => void;
} {
  const { player, setPlayer, clearPlayer } = usePlayerStore();
  const user = useAuthStore((s) => s.user);

  return {
    player,
    user,
    isAuthenticated: user !== null,
    setPlayer,
    clearPlayer,
  };
}
