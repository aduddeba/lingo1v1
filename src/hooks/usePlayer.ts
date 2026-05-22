'use client';

import { usePlayerStore } from '@/store';
import type { LocalPlayer } from '@/types';

export function usePlayer(): {
  player: LocalPlayer | null;
  isAuthenticated: boolean;
  setPlayer: (p: LocalPlayer | null) => void;
  clearPlayer: () => void;
} {
  const { player, setPlayer, clearPlayer } = usePlayerStore();

  return {
    player,
    isAuthenticated: player !== null,
    setPlayer,
    clearPlayer,
  };
}
