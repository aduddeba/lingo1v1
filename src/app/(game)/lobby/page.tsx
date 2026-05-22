import type { Metadata } from 'next';
import { LobbyPanel } from '@/components/lobby';

export const metadata: Metadata = {
  title: 'Lobby',
};

export default function LobbyPage() {
  return (
    <div className="flex justify-center py-8">
      <LobbyPanel />
    </div>
  );
}
