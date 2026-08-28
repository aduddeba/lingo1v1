'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ScoreDisplay } from './ScoreDisplay';
import { formatTime } from '@/lib/utils/format';
import type { Match, PlayerScore } from '@/types';

interface GameBoardProps {
  match: Match;
  localPlayerId: string;
  timeRemaining: number;
}

// GameBoard is a pure display component - it receives all state as props
// so it is trivially testable and reusable (e.g. spectator mode).
const SCRIPT_BLITZ_PROMPT_PREFIXES = [
  'What script is this?',
  'What language is this?',
  'What country is this surname from?',
] as const;

function splitPrompt(prompt: string): { instruction: string; displayText?: string } {
  const prefix = SCRIPT_BLITZ_PROMPT_PREFIXES.find((p) => prompt.startsWith(p));
  if (prefix) {
    const displayText = prompt.slice(prefix.length).trim();

    return {
      instruction: prefix,
      displayText: displayText || undefined,
    };
  }

  const [instruction = '', ...rest] = prompt.split('\n');
  const displayText = rest.join('\n').trim();

  return { instruction, displayText: displayText || undefined };
}

export function GameBoard({ match, localPlayerId, timeRemaining }: GameBoardProps) {
  const playerIds = Object.keys(match.scores);
  const resolvedLocalPlayerId = match.scores[localPlayerId]
    ? localPlayerId
    : (playerIds[0] ?? localPlayerId);
  const opponentId = playerIds.find((id) => id !== resolvedLocalPlayerId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      <ScoreBanner
        localScore={match.scores[resolvedLocalPlayerId]}
        opponentScore={opponentId ? match.scores[opponentId] : undefined}
        timeRemaining={timeRemaining}
        phase={match.phase}
      />

      <AnimatePresence mode="wait">
        {match.currentRound && match.phase === 'active' && (
          <motion.div
            key={match.currentRound.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100"
          >
            <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">
              Round {match.currentRound.number}
            </p>
            {(() => {
              const { instruction, displayText } = splitPrompt(match.currentRound.prompt);

              return (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-lg font-semibold text-gray-500">{instruction}</p>
                  {displayText && (
                    <p className="text-4xl font-bold tracking-wide text-gray-900">
                      {displayText}
                    </p>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ScoreBannerProps {
  localScore: PlayerScore | undefined;
  opponentScore: PlayerScore | undefined;
  timeRemaining: number;
  phase: Match['phase'];
}

function ScoreBanner({ localScore, opponentScore, timeRemaining, phase }: ScoreBannerProps) {
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      {localScore ? <ScoreDisplay score={localScore} label="You" highlight /> : <div />}

      <div className="text-center">
        {phase === 'active' && (
          <span className="font-mono text-2xl font-bold text-gray-700">
            {formatTime(timeRemaining)}
          </span>
        )}
        {phase === 'countdown' && (
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-2xl font-bold text-brand-600"
          >
            GET READY
          </motion.span>
        )}
        {phase === 'game_over' && (
          <span className="text-lg font-semibold text-gray-500">GAME OVER</span>
        )}
      </div>

      {opponentScore ? <ScoreDisplay score={opponentScore} label="Opponent" /> : <div />}
    </div>
  );
}


