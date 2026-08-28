import type { Metadata } from 'next';
import { ForgeryGame } from '@/components/practice';

export const metadata: Metadata = {
  title: 'Forgery - Practice',
};

export default function ForgeryPracticePage() {
  return <ForgeryGame />;
}
