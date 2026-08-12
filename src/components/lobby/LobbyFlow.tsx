'use client';

import { usePlayerStore, useLobbyStore } from '@/store';
import { GuestIdentityForm } from './GuestIdentityForm';
import { MatchmakingSetup } from './MatchmakingSetup';
import { LobbyPanel } from './LobbyPanel';

// Three-step flow, gated purely on existing store state (no extra "step"
// field needed): no LocalPlayer yet -> name form; player exists but hasn't
// queued -> mode/difficulty picker; queued (lobbyStore.players populated by
// the server's lobby:update) -> the existing ready-up panel.
export function LobbyFlow() {
  const player = usePlayerStore((s) => s.player);
  const players = useLobbyStore((s) => s.players);

  if (!player) return <GuestIdentityForm />;
  if (players.length === 0) return <MatchmakingSetup />;
  return <LobbyPanel />;
}
