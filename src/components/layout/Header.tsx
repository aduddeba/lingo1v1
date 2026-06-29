'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useGameStore } from '@/store';
import { usePlayerStore } from '@/store';
import { ThemeToggle } from '@/components/ui';
import type { ConnectionStatus } from '@/types';

export function Header() {
  const connectionStatus = useGameStore((s) => s.connectionStatus);
  const player = usePlayerStore((s) => s.player);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-brand-700 hover:opacity-80 transition-opacity"
        >
          Lingo<span className="text-gray-900">1v1</span>
        </Link>

        <nav className="flex items-center gap-5">
          <Link
            href="/practice"
            className="text-sm font-semibold text-gray-500 transition-colors hover:text-brand-600"
          >
            Practice
          </Link>
          <Link
            href="/lobby"
            className="text-sm font-semibold text-gray-500 transition-colors hover:text-brand-600"
          >
            Play
          </Link>
          <ConnectionBadge status={connectionStatus} />
          {player && (
            <span className="text-sm font-medium text-gray-700">{player.username}</span>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  );
}

const statusColors: Record<ConnectionStatus, string> = {
  connected: 'bg-green-500',
  connecting: 'bg-yellow-500',
  disconnected: 'bg-gray-400',
  error: 'bg-red-500',
};

function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-400">
      <motion.span
        className={`block h-2 w-2 rounded-full ${statusColors[status]}`}
        animate={status === 'connecting' ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      {status}
    </span>
  );
}
