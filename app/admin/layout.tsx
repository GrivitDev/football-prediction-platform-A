'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Toaster } from 'react-hot-toast';

import { LoaderCircle } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';

import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminHeader from '@/components/admin/admin-header';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [sidebarOpen,setSidebarOpen] = useState(false);

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

  },[
    user,
    loading,
    router,
  ]);



  if (loading) {

    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-background
      ">
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

    <main
      className="
        relative
        flex
        h-screen
        overflow-hidden
        bg-background
        text-foreground
      "
    >

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />


      <section
        className="
          flex-1
          min-w-0
          overflow-y-auto
          scrollbar-hide
        "
      >

        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />


        <div
          className="
            min-h-full
            p-4
            lg:p-6
          "
        >

          {children}

        </div>

      </section>


      <Toaster />

    </main>

  );

}