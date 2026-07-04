'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/providers/auth-provider';

import AdminSidebar from '@/components/admin-sidebar';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, loading } =
    useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (
    !user ||
    user.role !== 'admin'
  ) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        {children}
              <Toaster position="top-right" />
      </div>
    </main>
  );
}