'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post('/auth/reset-password', {
        email,
        token,
        newPassword: password,
      });

      setMessage(res.data.message);

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || 'Reset failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md bg-slate-900 p-8 rounded-2xl"
      >
        <h1 className="text-2xl font-bold mb-6">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-slate-800 border border-slate-700"
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {message && (
          <p className="mt-4 text-sm text-green-400">{message}</p>
        )}
      </form>
    </main>
  );
}