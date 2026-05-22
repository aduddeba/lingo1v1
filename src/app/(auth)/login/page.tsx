import type { Metadata } from 'next';
import { Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function LoginPage() {
  return (
    <div className="flex justify-center py-16">
      <Card variant="bordered" className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
        <p className="mt-2 text-sm text-gray-500">
          Authentication flow to be implemented (JWT / OAuth).
        </p>
      </Card>
    </div>
  );
}
