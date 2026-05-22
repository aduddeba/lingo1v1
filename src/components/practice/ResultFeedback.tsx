'use client';

import { motion } from 'framer-motion';
import { formatScore } from '@/lib/utils/format';
import type { PracticeAnswerResult } from '@/types/practice';

interface ResultFeedbackProps {
  result: PracticeAnswerResult;
  isLast: boolean;
  onNext: () => void;
}

export function ResultFeedback({ result, isLast, onNext }: ResultFeedbackProps) {
  const {
    correct,
    selectedAnswer,
    correctAnswer,
    correctAnswerLanguage,
    explanation,
    targetWord,
    targetLabel,
    pointsEarned,
    streakBonus,
  } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      {/* Verdict banner */}
      <div
        className={`rounded-xl p-4 text-center ${
          correct ? 'bg-green-50 ring-2 ring-green-400' : 'bg-red-50 ring-2 ring-red-400'
        }`}
      >
        <p
          className={`text-2xl font-extrabold ${
            correct ? 'text-green-700' : 'text-red-600'
          }`}
        >
          {correct ? 'Correct!' : 'Incorrect'}
        </p>

        {correct ? (
          <p className="mt-1 text-sm font-semibold text-green-600">
            +{formatScore(pointsEarned)} points
            {streakBonus && (
              <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
                streak bonus
              </span>
            )}
          </p>
        ) : (
          <div className="mt-2 space-y-1 text-sm">
            <p className="text-gray-500">
              You chose:{' '}
              <span className="font-semibold text-red-600">{selectedAnswer}</span>
            </p>
            <p className="text-gray-500">
              Correct ({correctAnswerLanguage}):{' '}
              <span className="font-semibold text-green-700">{correctAnswer}</span>
            </p>
          </div>
        )}
      </div>

      {/* Word / language highlight */}
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {targetLabel}
        </span>
        <p className="mt-0.5 text-2xl font-extrabold text-brand-700">{targetWord}</p>
      </div>

      {/* Explanation */}
      <div className="rounded-xl bg-gray-50 p-4">
        <p className="text-sm leading-relaxed text-gray-700">{explanation}</p>
      </div>

      {/* Auto-advance bar + Next button */}
      <div className="space-y-2">
        <button
          onClick={onNext}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {isLast ? 'See Results' : 'Next Question'}
        </button>

        {/* Countdown bar — animates from full to empty in 4s; onAnimationComplete fires advanceQuestion */}
        <div className="h-1 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full rounded-full bg-gray-400"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 4, ease: 'linear' }}
            style={{ transformOrigin: 'left' }}
            onAnimationComplete={onNext}
          />
        </div>
        <p className="text-center text-xs text-gray-400">Auto-advancing in 4 s</p>
      </div>
    </motion.div>
  );
}
