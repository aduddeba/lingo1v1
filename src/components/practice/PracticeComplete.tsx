'use client';

import { motion } from 'framer-motion';
import { formatScore } from '@/lib/utils/format';
import { getPerformanceLabel } from '@/lib/practice/engine';
import type { PracticeSessionStats } from '@/types/practice';

const LABEL_STYLES: Record<string, string> = {
  'Etymology Master': 'text-yellow-600 bg-yellow-50 ring-yellow-300',
  Scholar: 'text-brand-700 bg-brand-50 ring-brand-300',
  Wordsmith: 'text-purple-700 bg-purple-50 ring-purple-300',
  Apprentice: 'text-gray-700 bg-gray-100 ring-gray-300',
  Beginner: 'text-gray-600 bg-gray-50 ring-gray-200',
};

interface PracticeCompleteProps {
  stats: PracticeSessionStats;
  onPlayAgain: () => void;
}

export function PracticeComplete({ stats, onPlayAgain }: PracticeCompleteProps) {
  const { score, correctCount, totalCount, maxStreak, difficulty } = stats;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const label = getPerformanceLabel(correctCount, totalCount);
  const labelStyle = LABEL_STYLES[label] ?? LABEL_STYLES['Beginner'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 text-center"
    >
      {/* Performance label */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Performance
        </p>
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className={`mt-2 inline-block rounded-full px-5 py-1.5 text-xl font-extrabold ring-2 ${labelStyle}`}
        >
          {label}
        </motion.p>
      </div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <p className="text-5xl font-extrabold tabular-nums text-brand-700">
          {formatScore(score)}
        </p>
        <p className="mt-1 text-sm text-gray-400">points</p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <StatCell label="Accuracy" value={`${accuracy}%`} />
        <StatCell label="Correct" value={`${correctCount}/${totalCount}`} />
        <StatCell label="Best Streak" value={String(maxStreak)} />
      </motion.div>

      {/* Difficulty badge */}
      <p className="text-xs text-gray-400">
        Difficulty:{' '}
        <span className="font-semibold capitalize text-gray-600">{difficulty}</span>
      </p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-3"
      >
        <button
          onClick={onPlayAgain}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Play Again
        </button>
        <button
          onClick={onPlayAgain}
          className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
        >
          Change Settings
        </button>
      </motion.div>
    </motion.div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
