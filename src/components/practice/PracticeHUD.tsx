'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { formatScore } from '@/lib/utils/format';
import type { PracticePhase } from '@/types/practice';

interface PracticeHUDProps {
  score: number;
  streak: number;
  correctCount: number;
  currentIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  timeLimit: number;
  phase: PracticePhase;
}

export function PracticeHUD({
  score,
  streak,
  correctCount,
  currentIndex,
  totalQuestions,
  timeRemaining,
  timeLimit,
  phase,
}: PracticeHUDProps) {
  const timerPct = timeLimit > 0 ? (timeRemaining / timeLimit) * 100 : 0;
  const timerDanger = timeRemaining <= 5;

  return (
    <div className="mb-5 space-y-3">
      {/* Progress row */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-500">
          Question{' '}
          <span className="font-bold text-gray-900">
            {currentIndex + 1}
          </span>{' '}
          / {totalQuestions}
        </span>

        <div className="flex items-center gap-4">
          {streak >= 2 && (
            <AnimatePresence>
              <motion.span
                key={streak}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-600"
              >
                {streak}× streak
              </motion.span>
            </AnimatePresence>
          )}

          <AnimatePresence mode="wait">
            <motion.span
              key={score}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-bold tabular-nums text-brand-700"
            >
              {formatScore(score)} pts
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Timer bar - only visible during the question phase */}
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
            phase !== 'question'
              ? 'w-0'
              : timerDanger
              ? 'bg-red-500'
              : 'bg-brand-500'
          }`}
          style={{ width: phase === 'question' ? `${timerPct}%` : '0%' }}
        />
      </div>

      {/* Accuracy micro-stat */}
      {currentIndex > 0 && (
        <p className="text-right text-xs text-gray-400">
          {correctCount}/{currentIndex} correct
        </p>
      )}
    </div>
  );
}
