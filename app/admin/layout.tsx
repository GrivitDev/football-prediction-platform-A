'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Toaster } from 'react-hot-toast';

import { LoaderCircle } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';

import AdminSidebar from '@/components/admin/admin-sidebar';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

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
          min-h-screen
          flex
          items-center
          justify-center
          bg-background
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            gap-4
          "
        >

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-primary
              animate-pulse
            "
          >

            <LoaderCircle
              size={28}
              className="animate-spin"
            />

          </div>


          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            Loading admin panel...
          </p>


        </div>


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

    <main
      className="
        relative
        min-h-screen
        flex
        overflow-hidden
        bg-background
        text-foreground
      "
    >


      {/* BACKGROUND EFFECTS */}

      <div
        className="
          pointer-events-none
          absolute
          -top-40
          left-20
          h-96
          w-96
          rounded-full
          bg-primary/10
          blur-[150px]
        "
      />


      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          right-0
          h-96
          w-96
          rounded-full
          bg-emerald-500/10
          blur-[150px]
        "
      />



      {/* SIDEBAR */}

      <AdminSidebar />



      {/* CONTENT */}

<section
  className="
    relative
    flex-1
    min-w-0
    overflow-y-auto
  "
>

<div
  className="
    min-h-screen
    w-full
    p-4
    lg:p-6
  "
>

          {children}

        </div>


      </section>



      <Toaster
        position="top-right"
        toastOptions={{
          className:
            'border border-border bg-card text-foreground',
          duration: 3500,
        }}
      />


    </main>

  );
}