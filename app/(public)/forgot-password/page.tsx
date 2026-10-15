'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TriangleAlert,
  LockKeyhole,
} from 'lucide-react';

import api from '@/lib/axios';


export default function ForgotPasswordPage() {

  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState('');

  const [error, setError] = useState('');



  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);



  const handleSubmit = async (
    e: React.FormEvent,
  ) => {

    e.preventDefault();


    setError('');
    setSuccess('');


    if (!emailValid) {

      setError(
        'Please enter a valid email address.',
      );

      return;

    }



    try {

      setLoading(true);


      const res =
        await api.post(
          '/auth/request-password-reset',
          {
            email,
          },
        );


      setSuccess(
        res.data.message ||
        'Password reset link sent successfully.',
      );


    } catch (err:any) {


      setError(
        err?.response?.data?.message ||
        'Unable to send reset link. Please try again.',
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <main className="relative min-h-0 overflow-hidden bg-background py-2 text-foreground lg:min-h-screen lg:py-6">


      {/* BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden">

        <div
          className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[180px]"
        />


        <div
          className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[180px]"
        />


        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />


      </div>



      <div className="relative z-10 mx-auto flex min-h-0 max-w-7xl items-start px-4 py-2 lg:min-h-screen lg:items-center lg:py-0">


        {/* HERO */}

        <div className="hidden flex-1 lg:block">


          <div className="max-w-xl">


            <div className="mb-3 flex justify-center">

              <Image
                src="/images/football1.png"
                alt="Football Predictions"
                width={160}
                height={70}
                className="object-contain"
                priority
              />

            </div>



            <h1 className="text-2xl font-black leading-tight">

              Recover

              <br />

              <span className="bg-gradient-to-r from-primary via-primary to-cyan-500 bg-clip-text text-3xl text-transparent">

                Your Account.

              </span>


            </h1>



            <p className="mt-6 text-base leading-6 text-muted-foreground">

              Forgot your password?
              No problem. We&apos;ll help you securely
              restore access to your football prediction account.

            </p>



            <div className="mt-6 grid grid-cols-3 gap-3">


              <div className="rounded-xl border border-border bg-card/70 p-3 shadow-lg backdrop-blur-xl">

                <ShieldCheck className="mb-3 h-7 w-7 text-primary" />

                <h3 className="text-lg font-bold">
                  100%
                </h3>

                <p className="text-sm text-muted-foreground">
                  Secure Recovery
                </p>

              </div>



              <div className="rounded-xl border border-border bg-card/70 p-3 shadow-lg backdrop-blur-xl">

                <Mail className="mb-3 h-7 w-7 text-cyan-500" />

                <h3 className="text-lg font-bold">
                  Fast
                </h3>

                <p className="text-sm text-muted-foreground">
                  Email Delivery
                </p>

              </div>



              <div className="rounded-xl border border-border bg-card/70 p-3 shadow-lg backdrop-blur-xl">

                <LockKeyhole className="mb-3 h-7 w-7 text-green-500" />

                <h3 className="text-lg font-bold">
                  Safe
                </h3>

                <p className="text-sm text-muted-foreground">
                  Protected Access
                </p>

              </div>


            </div>


          </div>


        </div>



        {/* FORM CARD */}

        <div className="flex flex-1 justify-center lg:justify-end">


          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border border-border bg-card/70 p-5 shadow-2xl backdrop-blur-2xl"
          >


            <div className="mb-4 text-center">
<h2 className="text-2xl font-black">
                Forgot Password
              </h2>


              <p className="mt-2 text-muted-foreground">
                Enter your email and we&apos;ll send you a reset link.
              </p>


            </div>

            
            {/* EMAIL INPUT */}

            <div className="relative mb-3">

              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />


              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                className={`h-11 w-full rounded-xl border bg-background/80 pl-12 pr-4 text-foreground placeholder:text-muted-foreground outline-none   focus-visible:ring-2 ${
                  error
                    ? 'border-destructive focus-visible:ring-destructive/30'
                    : emailValid
                    ? 'border-green-500 focus-visible:ring-green-500/30'
                    : 'border-input focus-visible:border-ring focus-visible:ring-ring/30'
                }`}
                required
              />


            </div>



            {/* EMAIL STATUS */}

            {email && (

              <div className="mb-3">

                {emailValid ? (

                  <div className="flex items-center gap-2 text-sm text-green-500">

                    <CheckCircle2 className="h-4 w-4" />

                    Valid email address

                  </div>

                ) : (

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">

                    <TriangleAlert className="h-4 w-4" />

                    Enter a valid email address

                  </div>

                )}

              </div>

            )}



            {/* ERROR MESSAGE */}

            {error && (

              <div className="mb-3 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">

                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />


                <div>

                  <p className="font-semibold">
                    Request Failed
                  </p>

                  <p className="mt-1 text-sm">
                    {error}
                  </p>

                </div>


              </div>

            )}




            {/* SUCCESS MESSAGE */}

            {success && (

              <div className="mb-3 flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-500">

                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />


                <div>

                  <p className="font-semibold">
                    Reset Link Sent
                  </p>


                  <p className="mt-1 text-sm">
                    {success}
                  </p>


                  <p className="mt-2 text-sm">
                    Please check your inbox and spam folder.
                  </p>


                </div>


              </div>

            )}




            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              disabled={loading || !emailValid || !!success}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-xl bg-primary text-base font-bold text-primary-foreground disabled:pointer-events-none disabled:opacity-50"
            >

              {loading ? (

                <>

                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />

                  Sending Secure Link...

                </>


              ) : success ? (

                <>

                  <CheckCircle2 size={20} />

                  Email Sent

                </>


              ) : (

                <>

                  Send Reset Link

                  <ArrowRight size={20} />

                </>

              )}


            </button>




            {/* SECURITY CARD */}

            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">


              <h3 className="mb-3 flex items-center gap-2 font-semibold">

                <ShieldCheck className="h-5 w-5 text-primary" />

                Security Notice

              </h3>



              <ul className="space-y-2 text-sm text-muted-foreground">


                <li>
                  • Reset links expire automatically.
                </li>


                <li>
                  • Never share password reset links.
                </li>


                <li>
                  • Check your spam folder if you don&apos;t receive the email.
                </li>


              </ul>


            </div>




            {/* FOOTER */}

            <p className="mt-4 text-center text-sm text-muted-foreground">


              Remember your password?{' '}


              <Link
                href="/login"
                className="font-semibold text-primary"
              >
                Back to Login
              </Link>


            </p>




          </form>


        </div>


      </div>


    </main>

  );

}
