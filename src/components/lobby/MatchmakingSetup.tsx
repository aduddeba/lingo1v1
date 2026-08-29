'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { useLobby } from '@/hooks';
import { useLobbyStore, usePlayerStore } from '@/store';

// Quick Match joins the ranked server-side queue. The server picks question
// difficulty from authoritative Elo at match start; clients never choose it.
export function MatchmakingSetup() {
  const { joinLobby } = useLobby();
  const player = usePlayerStore((s) => s.player);
  const joinError = useLobbyStore((s) => s.joinError);

  const handleFindMatch = () => {
    if (!player) return;
    joinLobby({ id: player.id, username: player.username });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
    >
      <h2 className="mb-2 text-xl font-bold text-gray-900">Quick Match</h2>
      <p className="mb-6 text-sm text-gray-500">
        Questions are drawn from every game mode. Ranked difficulty is set automatically from your rating.
      </p>
      {joinError && <p className="mt-4 text-sm text-red-600">{joinError}</p>}

      <Button className="w-full" onClick={handleFindMatch}>
        Find Match
      </Button>
    </motion.div>
  );
}



