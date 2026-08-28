import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { LocalPlayer } from '@/types';

interface PlayerState {
  player: LocalPlayer | null;
}

interface PlayerActions {
  setPlayer: (player: LocalPlayer | null) => void;
  clearPlayer: () => void;
}

// Persisted to localStorage so the player survives a page refresh.
// The sessionToken inside LocalPlayer is intentionally kept client-side only -
// it is never stored in a cookie that goes to the server as a plain header.
export const usePlayerStore = create<PlayerState & PlayerActions>()(
  devtools(
    persist(
      (set) => ({
        player: null,
        setPlayer: (player) => set({ player }, false, 'setPlayer'),
        clearPlayer: () => set({ player: null }, false, 'clearPlayer'),
      }),
      { name: 'lingo1v1-player' }
    ),
    { name: 'PlayerStore' }
  )
);
