'use client';

import { useCallback, useEffect } from 'react';
import { useCityCountryStore } from '@/store';
import { selectCityCountryQuestions } from '@/lib/practice/cityCountryEngine';
import type { CityCountryConfig, PracticeSessionStats } from '@/types/practice';

// useCityCountry owns the timer side-effect. All other game logic lives in the
// Zustand store so it is safe to access from multiple components without
// prop-drilling. The timer is co-located here because setInterval is a
// side-effect that belongs in a hook, not in a store action.
export function useCityCountry() {
  const store = useCityCountryStore();

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (store.phase !== 'question') return;

    const id = setInterval(() => {
      const { phase, timeRemaining, submitAnswer, tick } = useCityCountryStore.getState();
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
  const startSession = useCallback((config: CityCountryConfig) => {
    const questions = selectCityCountryQuestions(config);
    useCityCountryStore.getState().initSession(questions, config);
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
