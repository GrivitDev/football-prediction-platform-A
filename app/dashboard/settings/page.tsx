'use client';

import { useState } from 'react';
import axios from '@/lib/axios';

import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      await axios.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert('Password changed successfully');

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Account Settings
        </h1>
        <p className="text-gray-500">
          Manage your security settings
        </p>
      </div>

      {/* CHANGE PASSWORD CARD */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CURRENT PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </Card>
    </div>
  );
}