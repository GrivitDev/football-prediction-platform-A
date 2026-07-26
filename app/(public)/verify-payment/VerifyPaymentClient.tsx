'use client';

import { useEffect } from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { verifyVipPayment } from '@/services/vip.service';

export default function VerifyPaymentClient() {
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');

      if (!reference) {
        router.push('/payment-failed');
        return;
      }

      try {
        await verifyVipPayment(reference);

        router.push('/payment-success');
      } catch (error) {
        router.push('/payment-failed');
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-black">
          Verifying Payment...
        </h1>

        <p className="mt-4 text-slate-400">
          Please wait while we verify your transaction.
        </p>
      </div>
    </main>
  );
}