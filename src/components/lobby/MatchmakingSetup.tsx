'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useLobby } from '@/hooks';
import { useLobbyStore, usePlayerStore } from '@/store';
import type { Difficulty } from '@/types';

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: 'Relaxed pace, more time per question.' },
  { value: 'medium', label: 'Medium', description: 'A balanced challenge.' },
  { value: 'hard', label: 'Hard', description: 'Fast-paced, less time to answer.' },
  { value: 'mixed', label: 'Mixed', description: 'A blend of all difficulty tiers.' },
];

// Quick Match picker: pick a difficulty, then join the matching server-side
// queue. The match itself draws questions from every game mode at random
// (see server/src/questions.ts buildMixedQuestionSet) - there's no mode
// choice here on purpose.
export function MatchmakingSetup() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const { joinLobby } = useLobby();
  const player = usePlayerStore((s) => s.player);
  const joinError = useLobbyStore((s) => s.joinError);

  const handleFindMatch = () => {
    if (!player) return;
    joinLobby(difficulty, { id: player.id, username: player.username });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
    >
      <h2 className="mb-2 text-xl font-bold text-gray-900">Quick Match</h2>
      <p className="mb-6 text-sm text-gray-500">
        Questions are drawn at random from every game mode - pick a difficulty and go.
      </p>

      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Difficulty
      </p>
      <div className="flex flex-col gap-2">
        {DIFFICULTIES.map((d) => (
          <button
            key={d.value}
            type="button"
            onClick={() => setDifficulty(d.value)}
            className={cn(
              'rounded-lg border p-3 text-left text-sm transition-colors',
              difficulty === d.value
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-gray-200 hover:bg-gray-50'
            )}
          >
            <p className="font-semibold">{d.label}</p>
            <p className="text-xs text-gray-500">{d.description}</p>
          </button>
        ))}
      </div>
      {joinError && <p className="mt-4 text-sm text-red-600">{joinError}</p>}

      <Button className="mt-6 w-full" onClick={handleFindMatch}>
        Find Match
      </Button>
    </motion.div>
  );
}



