'use client';

import { useCallback, useEffect } from 'react';
import { usePracticeStore } from '@/store';
import { selectQuestions } from '@/lib/practice/engine';
import type { PracticeConfig, PracticeSessionStats } from '@/types/practice';

// usePractice owns the timer side-effect. All other game logic lives in the
// Zustand store so it is safe to access from multiple components without
// prop-drilling. The timer is co-located here because setInterval is a
// side-effect that belongs in a hook, not in a store action.
export function usePractice() {
  const store = usePracticeStore();

  // ── Timer ────────────────────────────────────────────────────────────────
  // Re-runs every time the phase changes to/from 'question', and whenever
  // currentIndex changes (new question resets the interval).
  // We read the latest state via getState() inside the interval to avoid
  // stale closures — the standard Zustand pattern.
  useEffect(() => {
    if (store.phase !== 'question') return;

    const id = setInterval(() => {
      const { phase, timeRemaining, submitAnswer, tick } = usePracticeStore.getState();
      if (phase !== 'question') return;
      if (timeRemaining <= 1) {
        submitAnswer('__timeout__');
      } else {
        tick();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [store.phase, store.currentIndex]);

  // ── Session init ─────────────────────────────────────────────────────────
  const startSession = useCallback((config: PracticeConfig) => {
    const questions = selectQuestions(config);
    usePracticeStore.getState().initSession(questions, config);
  }, []);

  // ── Derived values ───────────────────────────────────────────────────────
  const currentQuestion = store.questions[store.currentIndex] ?? null;

  const stats: PracticeSessionStats = {
    score: store.score,
    correctCount: store.correctCount,
    totalCount: store.questions.length,
    maxStreak: store.maxStreak,
    difficulty: store.config?.difficulty ?? 'mixed',
  };

  return {
    // state
    phase: store.phase,
    currentQuestion,
    currentIndex: store.currentIndex,
    totalQuestions: store.questions.length,
    score: store.score,
    streak: store.streak,
    correctCount: store.correctCount,
    timeRemaining: store.timeRemaining,
    timeLimit: store.timeLimit,
    lastResult: store.lastResult,
    stats,
    // actions
    startSession,
    startQuestion: store.startQuestion,
    submitAnswer: store.submitAnswer,
    advanceQuestion: store.advanceQuestion,
    resetSession: store.resetSession,
  };
}
