'use client';

import Link from 'next/link';

import { useAuth } from '@/providers/auth-provider';

export default function Navbar() {
  const { user, logout } =
    useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-white"
        >
          PredictPro ⚽
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-slate-300">
          <Link href="/">
            Home
          </Link>

          <Link href="#">
            Predictions
          </Link>

          <Link href="#">
            VIP
          </Link>

          <Link href="#">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="bg-green-600 px-4 py-2 rounded-lg text-white"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded-lg text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-green-600 px-4 py-2 rounded-lg text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}