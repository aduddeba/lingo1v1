'use client';

import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { PlayerList } from './PlayerList';
import { useLobbyStore } from '@/store';
import { usePlayerStore } from '@/store';
import { useLobby } from '@/hooks';

export function LobbyPanel() {
  const { players, readyCount, maxPlayers, isReady, countdown } = useLobbyStore();
  const player = usePlayerStore((s) => s.player);
  const { setReady } = useLobby();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
    >
      <h2 className="mb-6 text-xl font-bold text-gray-900">Game Lobby</h2>

      <PlayerList
        players={players}
        localPlayerId={player?.id}
        maxPlayers={maxPlayers}
      />

      <div className="mt-6 flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {countdown !== null ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-2"
            >
              <p className="text-sm text-gray-500">Match starting in</p>
              <motion.p
                key={countdown}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-bold text-brand-600"
              >
                {countdown}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button
                variant={isReady ? 'secondary' : 'primary'}
                onClick={() => setReady(!isReady)}
                className="w-full"
              >
                {isReady ? 'Cancel Ready' : 'Ready Up'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-gray-400">
          {readyCount} / {players.length} players ready
        </p>
      </div>
    </motion.div>
  );
}
