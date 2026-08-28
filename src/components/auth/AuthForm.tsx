'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { useAuthStore, usePlayerStore } from '@/store';
import { userToPlayer } from '@/providers/AuthProvider';
import type { PublicUser } from '@/types';

type AuthMode = 'login' | 'signup';

interface AuthResponse {
  user?: PublicUser;
  error?: string;
}

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const setPlayer = usePlayerStore((s) => s.setPlayer);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const response = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(
        mode === 'signup'
          ? { username: username.trim(), email: email.trim(), password }
          : { email: email.trim(), password }
      ),
    }).catch(() => null);

    setIsLoading(false);

    if (!response) {
      setError('Unable to reach the server.');
      return;
    }

    const data = (await response.json().catch(() => ({}))) as AuthResponse;
    if (!response.ok || !data.user) {
      setError(data.error ?? 'Authentication failed.');
      return;
    }

    setSession(data.user);
    setPlayer(userToPlayer(data.user));
    router.push('/lobby');
  };

  return (
    <Card variant="bordered" className="w-full max-w-sm">
      <div className="mb-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={mode === 'login' ? 'rounded-md bg-white px-3 py-2 text-brand-700 shadow-sm' : 'px-3 py-2 text-gray-500'}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={mode === 'signup' ? 'rounded-md bg-white px-3 py-2 text-brand-700 shadow-sm' : 'px-3 py-2 text-gray-500'}
        >
          Sign up
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        {mode === 'login'
          ? 'Log in to keep your profile ready for ranked play later.'
          : 'Your account starts at 1000 Elo with a clean record.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {mode === 'signup' && (
          <Input
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={2}
            maxLength={20}
            autoComplete="username"
            required
          />
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          minLength={8}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" isLoading={isLoading} className="w-full">
          {mode === 'login' ? 'Log in' : 'Create account'}
        </Button>
      </form>
    </Card>
  );
}
