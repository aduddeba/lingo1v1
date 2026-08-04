import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { calculatePoints, TIME_LIMITS } from '@/lib/practice/engine';
import { checkAnswer } from '@/lib/practice/cityCountryEngine';
import type {
  CityCountryQuestion,
  CityCountryConfig,
  PracticeAnswerResult,
  PracticePhase,
} from '@/types/practice';

interface CityCountryState {
  phase: PracticePhase;
  config: CityCountryConfig | null;
  questions: CityCountryQuestion[];
  currentIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  timeRemaining: number;
  timeLimit: number;
  lastResult: PracticeAnswerResult | null;
}

interface CityCountryActions {
  initSession: (questions: CityCountryQuestion[], config: CityCountryConfig) => void;
  startQuestion: () => void;
  tick: () => void;
  submitAnswer: (answer: string) => void;
  advanceQuestion: () => void;
  resetSession: () => void;
}

const initialState: CityCountryState = {
  phase: 'settings',
  config: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  timeRemaining: 20,
  timeLimit: 20,
  lastResult: null,
};

export const useCityCountryStore = create<CityCountryState & CityCountryActions>()(
  devtools(
    immer((set) => ({
      ...initialState,

      initSession: (questions, config) =>
        set((state) => {
          state.questions = questions;
          state.config = config;
          state.currentIndex = 0;
          state.score = 0;
          state.streak = 0;
          state.maxStreak = 0;
          state.correctCount = 0;
          state.lastResult = null;
          state.phase = 'intro';
          const first = questions[0];
          if (first) {
            state.timeLimit = TIME_LIMITS[first.difficulty];
            state.timeRemaining = state.timeLimit;
          }
        }),

      startQuestion: () =>
        set((state) => {
          const q = state.questions[state.currentIndex];
          if (!q) return;
          const limit = TIME_LIMITS[q.difficulty];
          state.timeLimit = limit;
          state.timeRemaining = limit;
          state.phase = 'question';
        }),

      tick: () =>
        set((state) => {
          if (state.timeRemaining > 0) state.timeRemaining -= 1;
        }),

      submitAnswer: (answer) =>
        set((state) => {
          const q = state.questions[state.currentIndex];
          if (!q || state.phase !== 'question') return;

          const isTimeout = answer === '__timeout__';
          const correct = !isTimeout && checkAnswer(answer, q);
          const newStreak = correct ? state.streak + 1 : 0;
          const pointsEarned = calculatePoints(
            correct,
            state.timeRemaining,
            state.timeLimit,
            newStreak,
            q.difficulty
          );

          state.lastResult = {
            correct,
            selectedAnswer: isTimeout ? 'Time ran out!' : answer,
            correctAnswer: q.answer,
            correctAnswerLanguage: q.continent,
            explanation: q.explanation,
            targetWord: q.city,
            targetLabel: 'City',
            pointsEarned,
            streakBonus: correct && newStreak >= 3,
          };

          if (correct) {
            state.score += pointsEarned;
            state.correctCount += 1;
          }

          state.streak = newStreak;
          state.maxStreak = Math.max(state.maxStreak, newStreak);
          state.phase = 'feedback';
        }),

      advanceQuestion: () =>
        set((state) => {
          const nextIndex = state.currentIndex + 1;
          if (nextIndex >= state.questions.length) {
            state.phase = 'complete';
            return;
          }
          const q = state.questions[nextIndex];
          if (!q) {
            state.phase = 'complete';
            return;
          }
          const limit = TIME_LIMITS[q.difficulty];
          state.currentIndex = nextIndex;
          state.timeLimit = limit;
          state.timeRemaining = limit;
          state.phase = 'question';
        }),

      resetSession: () => set(() => ({ ...initialState })),
    })),
    { name: 'CityCountryStore' }
  )
);
