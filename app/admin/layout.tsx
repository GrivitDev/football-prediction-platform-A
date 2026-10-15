'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  LoaderCircle,
} from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';

import AdminSidebar from '@/components/admin/admin-sidebar';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    user,
    loading,
  } = useAuth();


  useEffect(() => {

    if (loading) return;


    if (!user) {
      router.push('/login');
      return;
    }


    if (user.role !== 'admin') {
      router.push('/');
    }

  }, [
    user,
    loading,
    router,
  ]);


  if (loading) {

    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
          bg-background
        "
      >

        <LoaderCircle
          size={32}
          className="
            animate-spin
            text-primary
          "
        />

      </div>
    );

  }


  if (!user || user.role !== 'admin') {
    return null;
  }


  return (
    <div
      className="
        relative
        flex
        min-h-[calc(100vh-4rem)]
        w-full
        min-w-0
        overflow-hidden
        bg-background
        text-foreground
      "
    >

      {/* ================================================================
          ADMIN SIDEBAR
      ================================================================ */}

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />


      {/* ================================================================
          ADMIN CONTENT
      ================================================================ */}

      <section
        className="
          flex
          min-w-0
          flex-1
          flex-col
        "
      >

        <div
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
          "
        >

          <div
            className="
              min-h-full
              min-w-0
              max-w-full
              p-3
              sm:p-4
              lg:p-5
            "
          >
            {children}
          </div>

        </div>

      </section>

    </div>
  );
}