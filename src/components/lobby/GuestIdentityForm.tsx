'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { usePlayerStore } from '@/store';
import { generateId } from '@/lib/utils/id';

// Multiplayer only needs a display name to key scores/rooms by — there's no
// account system yet (see src/app/(auth)/login/page.tsx, still a stub).
// This is the one place a LocalPlayer gets created.
export function GuestIdentityForm() {
  const [username, setUsername] = useState('');
  const setPlayer = usePlayerStore((s) => s.setPlayer);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setPlayer({
      id: generateId(),
      username: trimmed,
      avatarUrl: null,
      status: 'idle',
      rating: 0,
      wins: 0,
      losses: 0,
      createdAt: Date.now(),
      sessionToken: generateId(),
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
    >
      <h2 className="mb-2 text-xl font-bold text-gray-900">Choose a display name</h2>
      <p className="mb-6 text-sm text-gray-500">
        This is how your opponent will see you — no account needed.
      </p>

      <Input
        label="Display name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="e.g. WordWizard"
        maxLength={20}
        autoFocus
      />

      <Button type="submit" className="mt-4 w-full" disabled={!username.trim()}>
        Continue
      </Button>
    </motion.form>
  );
}
