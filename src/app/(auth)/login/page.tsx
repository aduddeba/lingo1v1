import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function LoginPage() {
  return (
    <div className="flex justify-center py-16">
      <AuthForm />
    </div>
  );
}
