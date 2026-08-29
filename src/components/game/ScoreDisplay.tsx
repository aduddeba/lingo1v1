'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { formatScore } from '@/lib/utils/format';
import type { PlayerScore } from '@/types';

interface ScoreDisplayProps {
  score: PlayerScore;
  label: string;
  targetScore: number;
  highlight?: boolean;
}

export function ScoreDisplay({ score, label, targetScore, highlight = false }: ScoreDisplayProps) {
  const progress = Math.min(100, Math.max(0, (score.score / targetScore) * 100));
  const progressClass = highlight ? 'bg-white/90' : 'bg-brand-600';

  return (
    <div
      className={`flex flex-col items-center rounded-xl p-4 ${
        highlight ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-widest opacity-60">{label}</span>

      <AnimatePresence mode="wait">
        <motion.span
          key={score.score}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-3xl font-bold tabular-nums"
        >
          {formatScore(score.score)}
        </motion.span>
      </AnimatePresence>
      <span className="mt-1 text-xs font-semibold opacity-70">
        / {formatScore(targetScore)}
      </span>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
        <motion.div
          className={`h-full rounded-full ${progressClass}`}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {score.streak >= 3 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-1 rounded-full bg-orange-400 px-2 py-0.5 text-xs font-bold text-white"
        >
          {score.streak}× streak
        </motion.span>
      )}
    </div>
  );
}
