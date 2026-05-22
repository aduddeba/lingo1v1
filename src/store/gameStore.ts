import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Match, Round, PlayerScore, ConnectionStatus, AnswerResult } from '@/types';

interface GameState {
  match: Match | null;
  connectionStatus: ConnectionStatus;
  timeRemaining: number;
  lastAnswerResult: AnswerResult | null;
}

interface GameActions {
  setMatch: (match: Match | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  updateRound: (round: Round) => void;
  updateScores: (scores: Record<string, PlayerScore>) => void;
  setTimeRemaining: (ms: number) => void;
  setLastAnswerResult: (result: AnswerResult | null) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  match: null,
  connectionStatus: 'disconnected',
  timeRemaining: 0,
  lastAnswerResult: null,
};

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    immer((set) => ({
      ...initialState,

      setMatch: (match) =>
        set((state) => {
          state.match = match;
        }),

      setConnectionStatus: (status) =>
        set((state) => {
          state.connectionStatus = status;
        }),

      // Immer lets us mutate nested objects directly without spreading.
      updateRound: (round) =>
        set((state) => {
          if (state.match) state.match.currentRound = round;
        }),

      updateScores: (scores) =>
        set((state) => {
          if (state.match) state.match.scores = scores;
        }),

      setTimeRemaining: (ms) =>
        set((state) => {
          state.timeRemaining = ms;
        }),

      setLastAnswerResult: (result) =>
        set((state) => {
          state.lastAnswerResult = result;
        }),

      resetGame: () => set(() => ({ ...initialState })),
    })),
    { name: 'GameStore' }
  )
);
