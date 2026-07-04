'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { loginUser } from '@/services/auth.service';

import { useAuth } from '@/providers/auth-provider';

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

 const handleLogin = async (
  e: React.FormEvent,
) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response =
      await loginUser({
        email,
        password,
      });

    login(response.token);

    if (
      response.user.role ===
      'admin'
    ) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch (error: any) {
    alert(
      error?.response?.data
        ?.message ||
        'Login failed',
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-slate-900 p-8 rounded-2xl"
      >
        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value,
              )
            }
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value,
              )
            }
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
          />
        </div>

        <div className="mb-4 text-right">
  <Link
    href="/forgot-password"
    className="text-sm text-blue-400 hover:underline"
  >
    Forgot Password?
  </Link>
</div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded-lg font-semibold"
        >
          {loading
            ? 'Logging in...'
            : 'Login'}
        </button>
      </form>
    </main>
  );
}