'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import {
  resendOtp,
  verifyOtp,
} from '@/services/auth.service';

interface Props {
  email: string;

  onClose: () => void;
}

export default function VerifyOtpModal({
  email,
}: Props) {
  const router = useRouter();

  const [code, setCode] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [countdown, setCountdown] =
    useState(30);

  useEffect(() => {
    if (countdown <= 0)
      return;

    const timer = setTimeout(() => {
      setCountdown(
        (prev) => prev - 1,
      );
    }, 1000);

    return () =>
      clearTimeout(timer);
  }, [countdown]);

  const handleVerify =
    async () => {
      if (code.length !== 6) {
        return alert(
          'Enter a valid 6-digit OTP',
        );
      }

      try {
        setLoading(true);

        const response =
          await verifyOtp({
            email,
            code,
          });

        alert(
          response.message,
        );

        router.push('/login');
      } catch (error: any) {
        alert(
          error?.response?.data
            ?.message ||
            'Verification failed',
        );
      } finally {
        setLoading(false);
      }
    };

  const handleResend =
    async () => {
      try {
        setResending(true);

        const response =
          await resendOtp(
            email,
          );

        alert(
          response.message,
        );

        setCountdown(30);
      } catch (error: any) {
        alert(
          error?.response?.data
            ?.message ||
            'Failed to resend OTP',
        );
      } finally {
        setResending(false);
      }
    };

  return (
    <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">
        Verify Email
      </h2>

      <p className="text-slate-400 mb-6">
        Enter the OTP sent to
        <br />
        <span className="text-white">
          {email}
        </span>
      </p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={code}
        onChange={(e) =>
          setCode(
            e.target.value,
          )
        }
        maxLength={6}
        inputMode="numeric"
        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white mb-4"
      />

      <button
        onClick={handleVerify}
        disabled={
          loading ||
          code.length !== 6
        }
        className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded-lg font-semibold text-white mb-4 disabled:opacity-50"
      >
        {loading
          ? 'Verifying...'
          : 'Verify OTP'}
      </button>

      <button
        onClick={handleResend}
        disabled={
          resending ||
          countdown > 0
        }
        className="w-full bg-slate-700 hover:bg-slate-600 transition p-3 rounded-lg text-white disabled:opacity-50"
      >
        {resending
          ? 'Resending...'
          : countdown > 0
          ? `Resend OTP in ${countdown}s`
          : 'Resend OTP'}
      </button>
    </div>
  );
}