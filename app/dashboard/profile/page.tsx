'use client';

import { useAuth } from '@/providers/auth-provider';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-black">
          Profile Settings
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your account
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-2xl">
        <div className="mb-6">
          <label className="block text-slate-400 mb-2">
            Email
          </label>

          <input
            value={
              user?.email || ''
            }
            disabled
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-400 mb-2">
            Account Type
          </label>

          <input
            value={
              user?.isVip
                ? 'VIP'
                : 'FREE'
            }
            disabled
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
          />
        </div>

        <button className="bg-green-600 hover:bg-green-700 transition px-8 py-4 rounded-xl font-bold">
          Update Profile
        </button>
      </div>
    </div>
  );
}