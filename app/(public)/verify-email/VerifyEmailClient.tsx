'use client';

import { useEffect } from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import VerifyOtpModal from '@/components/VerifyOtpModal';


export default function VerifyEmailClient() {

  const router = useRouter();

  const searchParams = useSearchParams();


  const email =
    searchParams.get('email') || '';



  useEffect(() => {

    if (!email) {

      router.push('/register');

    }

  }, [email, router]);



  if (!email) {
    return null;
  }



  return (

    <main className="relative min-h-screen overflow-hidden bg-background pt-12 pb-12 text-foreground">


      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden">


        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[180px]" />


        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[180px]" />


        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/5 blur-[220px]" />


        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />


      </div>



      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">


        <VerifyOtpModal
          email={email}
          onClose={() => {}}
        />


      </div>


    </main>

  );

}