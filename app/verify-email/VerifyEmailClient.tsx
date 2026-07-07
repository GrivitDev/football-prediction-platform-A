'use client';

import { useEffect } from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import VerifyOtpModal from '@/components/VerifyOtpModal';

export default function VerifyEmailClient() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) {
      router.push('/register');
    }
  }, [email, router]);

  if (!email) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <VerifyOtpModal
        email={email}
        onClose={() => {}}
      />
    </main>
  );
}