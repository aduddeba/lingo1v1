'use client';

import { motion } from 'framer-motion';
import { formatScore } from '@/lib/utils/format';
import type { ForgeryAnswerResult } from '@/types/practice';

interface ForgeryFeedbackProps {
  result: ForgeryAnswerResult;
  isLast: boolean;
  onNext: () => void;
}

export function ForgeryFeedback({ result, isLast, onNext }: ForgeryFeedbackProps) {
  const { correct, selectedText, realText, fakeText, language, explanation, pointsEarned, streakBonus } = result;
  const timedOut = selectedText === '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      {/* Verdict */}
      <div
        className={`rounded-xl p-4 text-center ${
          correct ? 'bg-green-50 ring-2 ring-green-400' : 'bg-red-50 ring-2 ring-red-400'
        }`}
      >
        <p className={`text-2xl font-extrabold ${correct ? 'text-green-700' : 'text-red-600'}`}>
          {timedOut ? 'Time ran out!' : correct ? 'Correct!' : 'Incorrect'}
        </p>
        {correct && (
          <p className="mt-1 text-sm font-semibold text-green-600">
            +{formatScore(pointsEarned)} points
            {streakBonus && (
              <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
                streak bonus
              </span>
            )}
          </p>
        )}
        {!correct && !timedOut && (
          <p className="mt-1 text-sm text-red-500">You picked the fake</p>
        )}
      </div>

      {/* Real vs Fake reveal */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {language} — Real vs Fake
        </p>

        <div className="rounded-xl border-2 border-green-300 bg-green-50 px-4 py-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-green-600">Real</p>
          <p className="leading-relaxed text-gray-900">{realText}</p>
        </div>

        <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-red-500">Fake</p>
          <p className="leading-relaxed text-gray-600 line-through decoration-red-300">{fakeText}</p>
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-xl bg-gray-50 p-4">
        <p className="text-sm leading-relaxed text-gray-700">{explanation}</p>
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        {isLast ? 'See Results' : 'Next Question'}
      </button>
    </motion.div>
  );
}
