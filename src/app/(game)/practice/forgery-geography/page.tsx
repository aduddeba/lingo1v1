import type { Metadata } from 'next';
import { ForgeryGeographyBoard } from '@/components/game/ForgeryGeographyBoard';

export const metadata: Metadata = {
  title: 'Forgery Geography — Practice',
};

export default function ForgeryGeographyPage() {
  return <ForgeryGeographyBoard />;
}
