'use client';

import { useCallback, useEffect } from 'react';
import { useForgeryStore, getForgeryStats } from '@/store/forgeryStore';
import { selectForgeryQuestions } from '@/lib/practice/forgeryEngine';
import type { ForgeryConfig } from '@/types/practice';

export function useForgery() {
  const store = useForgeryStore();

  // Timer — same pattern as usePractice
  useEffect(() => {
    if (store.phase !== 'question') return;

    const id = setInterval(() => {
      const { phase, timeRemaining, submitAnswer, tick } = useForgeryStore.getState();
      if (phase !== 'question') return;
      if (timeRemaining <= 1) {
        submitAnswer('__timeout__');
      } else {
        tick();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [store.phase, store.currentIndex]);

  const startSession = useCallback((config: ForgeryConfig) => {
    const questions = selectForgeryQuestions(config);
    useForgeryStore.getState().initSession(questions, config);
  }, []);

  const currentQuestion = store.questions[store.currentIndex] ?? null;
  const stats = getForgeryStats(store);

  return {
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
    startSession,
    startQuestion: store.startQuestion,
    submitAnswer: store.submitAnswer,
    advanceQuestion: store.advanceQuestion,
    resetSession: store.resetSession,
  };
}
