import type { Metadata } from 'next';
import { HistoricalEvolutionGame } from '@/components/practice';

export const metadata: Metadata = {
  title: 'Historical Evolution Battles — Practice',
};

// This page is intentionally a thin Server Component shell.
// All interactive game state lives inside HistoricalEvolutionGame (Client Component).
export default function HistoricalEvolutionPracticePage() {
  return <HistoricalEvolutionGame />;
}
