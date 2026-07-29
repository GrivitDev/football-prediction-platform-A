'use client';

import Image from 'next/image';
import {
  useEffect,
} from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import {
  ShieldCheck,
  TrendingUp,
  Trophy,
} from 'lucide-react';

import VerifyOtpModal from '@/components/VerifyOtpModal';



export default function VerifyEmailClient() {

  const router = useRouter();

  const searchParams = useSearchParams();


  const email =
    searchParams.get('email') || '';



  useEffect(() => {

    if (!email) {

      router.replace('/register');

    }

  }, [
    email,
    router,
  ]);



  if (!email) {

    return (

      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-background
          text-foreground
        "
      >

        <div
          className="
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-primary
            border-t-transparent
          "
        />

      </main>

    );

  }



  return (

    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-background
        pt-12
        pb-12
        text-foreground
      "
    >


      {/* BACKGROUND */}

      <div
        className="
          absolute
          inset-0
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-primary/20
            blur-[180px]
          "
        />


        <div
          className="
            absolute
            -bottom-40
            -right-40
            h-[600px]
            w-[600px]
            rounded-full
            bg-cyan-500/15
            blur-[180px]
          "
        />


        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[700px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-foreground/5
            blur-[220px]
          "
        />


        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-transparent
            via-background/40
            to-background
          "
        />

      </div>




      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          max-w-7xl
          items-center
          px-6
        "
      >



        {/* LEFT BRAND AREA */}


        <div
          className="
            hidden
            flex-1
            lg:block
          "
        >

          <div
            className="
              max-w-xl
            "
          >


            <div
              className="
                mb-5
                flex
                justify-center
              "
            >

              <Image

                src="/images/ball5.png"

                alt="Football Predictions"

                width={560}

                height={170}

                className="
                  max-w-full
                  object-contain
                "

                priority

              />

            </div>




            <h1
              className="
                mt-8
                text-4xl
                font-black
                leading-tight
              "
            >

              Verify

              <br />


              <span
                className="
                  bg-gradient-to-r
                  from-primary
                  via-primary
                  to-cyan-500
                  bg-clip-text
                  text-6xl
                  text-transparent
                "
              >

                Your Account.

              </span>


            </h1>




            <p
              className="
                mt-6
                text-lg
                leading-8
                text-muted-foreground
              "
            >

              Confirm your email address to
              activate your PredictPro account
              and start accessing football
              predictions, statistics, and features.

            </p>




            <div
              className="
                mt-12
                grid
                grid-cols-3
                gap-5
              "
            >


              <div
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-card/70
                  p-5
                  shadow-lg
                  backdrop-blur-xl
                "
              >

                <ShieldCheck
                  className="
                    mb-3
                    h-7
                    w-7
                    text-primary
                  "
                />


                <h3
                  className="
                    text-xl
                    font-bold
                  "
                >

                  Secure

                </h3>


                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >

                  Verification

                </p>


              </div>




              <div
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-card/70
                  p-5
                  shadow-lg
                  backdrop-blur-xl
                "
              >

                <TrendingUp
                  className="
                    mb-3
                    h-7
                    w-7
                    text-cyan-500
                  "
                />


                <h3
                  className="
                    text-xl
                    font-bold
                  "
                >

                  Fast

                </h3>


                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >

                  Activation

                </p>


              </div>




              <div
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-card/70
                  p-5
                  shadow-lg
                  backdrop-blur-xl
                "
              >

                <Trophy
                  className="
                    mb-3
                    h-7
                    w-7
                    text-yellow-500
                  "
                />


                <h3
                  className="
                    text-xl
                    font-bold
                  "
                >

                  Ready

                </h3>


                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >

                  Predict

                </p>


              </div>



            </div>


          </div>


        </div>






        {/* OTP MODAL */}


        <div
          className="
            flex
            flex-1
            justify-center
            lg:justify-end
          "
        >

          <VerifyOtpModal

            email={email}

            onClose={() => {}}

          />

        </div>



      </div>


    </main>

  );

}