'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { registerUser } from '@/services/auth.service';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] =
    useState('');

  const [username, setUsername] =
    useState('');

  const [phoneNumber, setPhoneNumber] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (
      password !== confirmPassword
    ) {
      alert(
        'Passwords do not match',
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await registerUser({
          fullName,
          username,
          phoneNumber,
          email,
          password,
        });

      alert(
        response.message,
      );

      router.push(
        `/verify-email?email=${encodeURIComponent(
          email,
        )}`,
      );
    } catch (error: any) {
      alert(
        error?.response?.data
          ?.message ||
          'Registration failed',
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    confirmPassword &&
    password ===
      confirmPassword;

  const passwordsDontMatch =
    confirmPassword &&
    password !==
      confirmPassword;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <form
        onSubmit={
          handleRegister
        }
        className="w-full max-w-md bg-slate-900 p-8 rounded-2xl"
      >
        <h1 className="text-3xl font-bold mb-6">
          Register
        </h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value,
              )
            }
            required
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value,
              )
            }
            required
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
          />
        </div>

        <div className="mb-4">
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(
                e.target.value,
              )
            }
            required
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
          />
        </div>

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
            required
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value,
              )
            }
            required
            minLength={6}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
          />
        </div>

        <div className="mb-2">
          <input
            type="password"
            placeholder="Confirm Password"
            value={
              confirmPassword
            }
            onChange={(e) =>
              setConfirmPassword(
                e.target.value,
              )
            }
            required
            minLength={6}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
          />
        </div>

        {passwordsDontMatch && (
          <p className="text-red-500 text-sm mb-4">
            Passwords do not
            match
          </p>
        )}

        {passwordsMatch && (
          <p className="text-green-500 text-sm mb-4">
            Passwords match
          </p>
        )}

        <button
          type="submit"
          disabled={
            loading ||
            !!passwordsDontMatch
          }
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-700 p-3 rounded-lg font-semibold transition"
        >
          {loading
            ? 'Creating account...'
            : 'Register'}
        </button>
      </form>
    </main>
  );
}