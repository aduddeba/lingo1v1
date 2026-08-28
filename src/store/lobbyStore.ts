import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Player } from '@/types';

interface LobbyState {
  lobbyId: string | null;
  players: Player[];
  readyCount: number;
  maxPlayers: number;
  isReady: boolean;
  countdown: number | null;
  joinError: string | null;
}

interface LobbyActions {
  setLobby: (lobbyId: string) => void;
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setReadyCount: (count: number) => void;
  setMaxPlayers: (max: number) => void;
  setReady: (ready: boolean) => void;
  setCountdown: (seconds: number | null) => void;
  setJoinError: (error: string | null) => void;
  resetLobby: () => void;
}

const initialState: LobbyState = {
  lobbyId: null,
  players: [],
  readyCount: 0,
  maxPlayers: 2,
  isReady: false,
  countdown: null,
  joinError: null,
};

export const useLobbyStore = create<LobbyState & LobbyActions>()(
  devtools(
    immer((set) => ({
      ...initialState,

      setLobby: (lobbyId) =>
        set((state) => {
          state.lobbyId = lobbyId;
        }),

      setPlayers: (players) =>
        set((state) => {
          state.players = players;
          state.joinError = null;
        }),

      addPlayer: (player) =>
        set((state) => {
          if (!state.players.find((p) => p.id === player.id)) {
            state.players.push(player);
          }
        }),

      removePlayer: (playerId) =>
        set((state) => {
          state.players = state.players.filter((p) => p.id !== playerId);
        }),

      setReadyCount: (count) =>
        set((state) => {
          state.readyCount = count;
        }),

      setMaxPlayers: (max) =>
        set((state) => {
          state.maxPlayers = max;
        }),

      setReady: (ready) =>
        set((state) => {
          state.isReady = ready;
        }),

      setCountdown: (seconds) =>
        set((state) => {
          state.countdown = seconds;
        }),

      setJoinError: (error) =>
        set((state) => {
          state.joinError = error;
        }),

      resetLobby: () => set(() => ({ ...initialState })),
    })),
    { name: 'LobbyStore' }
  )
);
