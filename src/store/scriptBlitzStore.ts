import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { calculateBlitzPoints, BLITZ_TIME_LIMIT, BLITZ_QUESTION_LIMIT } from '@/lib/practice/scriptBlitzEngine';
import type {
  ScriptBlitzQuestion,
  ScriptBlitzConfig,
  ScriptBlitzAnswerResult,
  ScriptBlitzSessionStats,
  PracticePhase,
} from '@/types/practice';

// ─── State ────────────────────────────────────────────────────────────────────

interface ScriptBlitzState {
  phase: PracticePhase;
  config: ScriptBlitzConfig | null;

  // Pool cycles infinitely — when poolIndex reaches pool.length, reshuffle
  pool: ScriptBlitzQuestion[];
  poolIndex: number;

  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  totalAnswered: number;

  timeRemaining: number;

  lastResult: ScriptBlitzAnswerResult | null;
  history: ScriptBlitzAnswerResult[];

  isPaused: boolean;
}

interface ScriptBlitzActions {
  initSession: (pool: ScriptBlitzQuestion[], config: ScriptBlitzConfig) => void;
  startQuestion: () => void;
  tick: () => void;
  submitAnswer: (typedAnswer: string) => void;
  skipQuestion: () => void;
  advanceQuestion: () => void;
  endSession: () => void;
  resetSession: () => void;
  togglePause: () => void;
}

const initialState: ScriptBlitzState = {
  phase: 'settings',
  config: null,
  pool: [],
  poolIndex: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  totalAnswered: 0,
  timeRemaining: BLITZ_TIME_LIMIT,
  lastResult: null,
  history: [],
  isPaused: false,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useScriptBlitzStore = create<ScriptBlitzState & ScriptBlitzActions>()(
  devtools(
    immer((set) => ({
      ...initialState,

      initSession: (pool, config) =>
        set((state) => {
          state.pool = pool;
          state.config = config;
          state.poolIndex = 0;
          state.score = 0;
          state.streak = 0;
          state.maxStreak = 0;
          state.correctCount = 0;
          state.totalAnswered = 0;
          state.timeRemaining = BLITZ_TIME_LIMIT;
          state.lastResult = null;
          state.history = [];
          state.isPaused = false;
          state.phase = 'intro';
        }),

      startQuestion: () =>
        set((state) => {
          state.timeRemaining = BLITZ_TIME_LIMIT;
          state.lastResult = null;
          state.phase = 'question';
          state.isPaused = false;
        }),

      tick: () =>
        set((state) => {
          if (state.isPaused) return;
          if (state.timeRemaining > 0) state.timeRemaining -= 1;
        }),

      submitAnswer: (typedAnswer) =>
        set((state) => {
          const q = state.pool[state.poolIndex];
          if (!q || state.phase !== 'question') return;

          const isTimeout = typedAnswer === '__timeout__';
          const isSkip = typedAnswer === '__skip__';
          const correct = !isTimeout && !isSkip;

          const newStreak = correct ? state.streak + 1 : 0;
          const pointsEarned = correct
            ? calculateBlitzPoints(state.timeRemaining, BLITZ_TIME_LIMIT, newStreak)
            : 0;

          const result: ScriptBlitzAnswerResult = {
            questionId: q.id,
            displayText: q.displayText,
            correct,
            skipped: isSkip,
            timedOut: isTimeout,
            typedAnswer: isTimeout || isSkip ? '' : typedAnswer,
            correctAnswer: q.answer,
            pointsEarned,
            streakBonus: correct && newStreak >= 3,
            timeRemaining: state.timeRemaining,
          };

          state.lastResult = result;
          state.history.push(result);
          state.totalAnswered += 1;

          if (correct) {
            state.score += pointsEarned;
            state.correctCount += 1;
          }

          state.streak = newStreak;
          state.maxStreak = Math.max(state.maxStreak, newStreak);
          state.phase = 'feedback';
        }),

      skipQuestion: () =>
        set((state) => {
          if (state.phase !== 'question') return;
          const q = state.pool[state.poolIndex];
          if (!q) return;

          const result: ScriptBlitzAnswerResult = {
            questionId: q.id,
            displayText: q.displayText,
            correct: false,
            skipped: true,
            timedOut: false,
            typedAnswer: '',
            correctAnswer: q.answer,
            pointsEarned: 0,
            streakBonus: false,
            timeRemaining: state.timeRemaining,
          };

          state.lastResult = result;
          state.history.push(result);
          state.totalAnswered += 1;
          state.streak = 0;
          state.phase = 'feedback';
        }),

      advanceQuestion: () =>
        set((state) => {
          if (state.totalAnswered >= BLITZ_QUESTION_LIMIT) {
            state.phase = 'complete';
            return;
          }
          const nextIndex = state.poolIndex + 1;
          state.poolIndex = nextIndex < state.pool.length ? nextIndex : 0;
          state.timeRemaining = BLITZ_TIME_LIMIT;
          state.lastResult = null;
          state.phase = 'question';
          state.isPaused = false;
        }),

      endSession: () =>
        set((state) => {
          state.phase = 'complete';
        }),

      resetSession: () => set(() => ({ ...initialState })),

      togglePause: () =>
        set((state) => {
          if (state.phase !== 'question') return;
          state.isPaused = !state.isPaused;
        }),
    })),
    { name: 'ScriptBlitzStore' }
  )
);

// ─── Stats selector ───────────────────────────────────────────────────────────

export function getBlitzStats(state: ScriptBlitzState): ScriptBlitzSessionStats {
  return {
    score: state.score,
    correctCount: state.correctCount,
    totalAnswered: state.totalAnswered,
    maxStreak: state.maxStreak,
  };
}
