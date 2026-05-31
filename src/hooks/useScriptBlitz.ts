'use client';

import { useCallback, useEffect } from 'react';
import { useScriptBlitzStore, getBlitzStats } from '@/store/scriptBlitzStore';
import { buildBlitzPool } from '@/lib/practice/scriptBlitzEngine';
import type { ScriptBlitzConfig } from '@/types/practice';

export function useScriptBlitz() {
  const store = useScriptBlitzStore();

  // Tick timer every second; respect pause and phase
  useEffect(() => {
    if (store.phase !== 'question') return;

    const id = setInterval(() => {
      const { phase, timeRemaining, isPaused, submitAnswer, tick } =
        useScriptBlitzStore.getState();
      if (phase !== 'question' || isPaused) return;
      if (timeRemaining <= 1) {
        submitAnswer('__timeout__');
      } else {
        tick();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [store.phase, store.poolIndex]);

  const startSession = useCallback((config: ScriptBlitzConfig) => {
    const pool = buildBlitzPool(config);
    useScriptBlitzStore.getState().initSession(pool, config);
  }, []);

  const currentQuestion = store.pool[store.poolIndex] ?? null;
  const stats = getBlitzStats(store);

  const accuracy =
    store.totalAnswered > 0
      ? Math.round((store.correctCount / store.totalAnswered) * 100)
      : 100;

  return {
    phase: store.phase,
    currentQuestion,
    poolIndex: store.poolIndex,
    score: store.score,
    streak: store.streak,
    maxStreak: store.maxStreak,
    correctCount: store.correctCount,
    totalAnswered: store.totalAnswered,
    accuracy,
    timeRemaining: store.timeRemaining,
    timeLimit: store.timeRemaining, // kept for compat; use BLITZ_TIME_LIMIT directly
    lastResult: store.lastResult,
    history: store.history,
    isPaused: store.isPaused,
    stats,
    startSession,
    startQuestion: store.startQuestion,
    submitAnswer: store.submitAnswer,
    skipQuestion: store.skipQuestion,
    advanceQuestion: store.advanceQuestion,
    endSession: store.endSession,
    resetSession: store.resetSession,
    togglePause: store.togglePause,
  };
}
