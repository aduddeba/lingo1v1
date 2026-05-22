'use client';

import { motion } from 'framer-motion';
import { formatRating } from '@/lib/utils/format';
import type { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  isLocal?: boolean;
  index?: number;
}

export function PlayerCard({ player, isLocal = false, index = 0 }: PlayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLocal ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`flex items-center gap-3 rounded-xl p-4 ${
        isLocal ? 'bg-brand-50 ring-2 ring-brand-200' : 'bg-gray-50'
      }`}
    >
      <PlayerAvatar username={player.username} avatarUrl={player.avatarUrl} />
      <div className="min-w-0">
        <p className="truncate font-semibold text-gray-900">
          {player.username}
          {isLocal && (
            <span className="ml-2 text-xs font-normal text-brand-600">(you)</span>
          )}
        </p>
        <p className="text-xs text-gray-500">Rating {formatRating(player.rating)}</p>
      </div>
    </motion.div>
  );
}

function PlayerAvatar({
  username,
  avatarUrl,
}: {
  username: string;
  avatarUrl: string | null;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${username}'s avatar`}
        className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
      {username[0]?.toUpperCase() ?? '?'}
    </div>
  );
}
