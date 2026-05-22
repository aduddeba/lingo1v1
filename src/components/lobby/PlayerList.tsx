'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { PlayerCard } from '@/components/game';
import type { Player } from '@/types';

interface PlayerListProps {
  players: Player[];
  localPlayerId: string | undefined;
  maxPlayers: number;
}

export function PlayerList({ players, localPlayerId, maxPlayers }: PlayerListProps) {
  const emptySlots = Math.max(0, maxPlayers - players.length);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        Players ({players.length}/{maxPlayers})
      </p>

      <AnimatePresence initial={false}>
        {players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            isLocal={player.id === localPlayerId}
            index={index}
          />
        ))}

        {Array.from({ length: emptySlots }).map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 p-4"
          >
            <div className="h-10 w-10 rounded-full bg-gray-100" />
            <p className="text-sm text-gray-400">Waiting for player…</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
