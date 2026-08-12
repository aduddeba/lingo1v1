import type { Metadata } from 'next';
import { LobbyFlow } from '@/components/lobby';

export const metadata: Metadata = {
  title: 'Lobby',
};

export default function LobbyPage() {
  return (
    <div className="flex justify-center py-8">
      <LobbyFlow />
    </div>
  );
}
