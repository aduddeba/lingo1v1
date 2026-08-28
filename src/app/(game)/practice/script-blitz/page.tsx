import type { Metadata } from 'next';
import { ScriptBlitzGame } from '@/components/practice';

export const metadata: Metadata = {
  title: 'Script Blitz - Practice',
};

export default function ScriptBlitzPage() {
  return <ScriptBlitzGame />;
}
