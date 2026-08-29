import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Match, Round, PlayerScore, ConnectionStatus, AnswerResult, RatingResult } from '@/types';

interface GameState {
  match: Match | null;
  localPlayerId: string | null;
  connectionStatus: ConnectionStatus;
  timeRemaining: number;
  lastAnswerResult: AnswerResult | null;
  ratingResult: RatingResult | null;
  winnerId: string | null;
}

interface GameActions {
  setMatch: (match: Match | null) => void;
  setLocalPlayerId: (playerId: string | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  updateRound: (round: Round) => void;
  updateScores: (scores: Record<string, PlayerScore>) => void;
  setTimeRemaining: (ms: number) => void;
  setLastAnswerResult: (result: AnswerResult | null) => void;
  setRatingResult: (result: RatingResult | null) => void;
  setWinnerId: (winnerId: string | null) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  match: null,
  localPlayerId: null,
  connectionStatus: 'disconnected',
  timeRemaining: 0,
  lastAnswerResult: null,
  ratingResult: null,
  winnerId: null,
};

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    immer((set) => ({
      ...initialState,

      setMatch: (match) =>
        set((state) => {
          state.match = match;
        }),

      setLocalPlayerId: (playerId) =>
        set((state) => {
          state.localPlayerId = playerId;
        }),

      setConnectionStatus: (status) =>
        set((state) => {
          state.connectionStatus = status;
        }),

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

      setRatingResult: (result) =>
        set((state) => {
          state.ratingResult = result;
        }),

      setWinnerId: (winnerId) =>
        set((state) => {
          state.winnerId = winnerId;
        }),

      resetGame: () => set(() => ({ ...initialState })),
    })),
    { name: 'GameStore' }
  )
);
