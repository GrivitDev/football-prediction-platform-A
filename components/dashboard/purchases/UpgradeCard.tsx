'use client';

import {
  Crown,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import type { PlanConfig } from '@/types/plan-config';


interface Props {

  plan:
    | 'free'
    | 'regular'
    | 'vip';

  config: PlanConfig;

  onUpgrade: (
    target: 'regular' | 'vip',
  ) => void;

}



export default function UpgradeCard({
  plan,
  config,
  onUpgrade,
}: Props) {



  if (plan === 'vip') {

    return (

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-amber-500/30
          bg-gradient-to-br
          from-amber-500/20
          via-background
          to-background
          p-6
          shadow-xl
          transition-all
          duration-500
          hover:-translate-y-1
          hover:shadow-amber-500/20
        "
      >

        <div
          className="
            absolute
            -right-20
            -top-20
            h-64
            w-64
            rounded-full
            bg-amber-500/20
            blur-3xl
          "
        />


        <div
          className="
            relative
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
              bg-gradient-to-br
              from-amber-400
              to-orange-500
              text-white
              shadow-lg
            "
          >

            <Crown
              className="
                h-7
                w-7
              "
            />

          </div>



          <div
            className="
              mt-5
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-amber-500
            "
          >

            <Sparkles
              className="
                h-4
                w-4
              "
            />

            Premium Member

          </div>



          <h3
            className="
              mt-3
              text-2xl
              font-black
            "
          >

            You have the highest plan

          </h3>



          <p
            className="
              mt-2
              max-w-md
              text-muted-foreground
            "
          >

            You already enjoy complete VIP access,
            premium predictions, and all available benefits.

          </p>



          <div
            className="
              mt-6
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-amber-500/20
              bg-amber-500/5
              p-4
            "
          >

            <ShieldCheck
              className="
                h-5
                w-5
                text-amber-500
              "
            />

            <span
              className="
                text-sm
                text-muted-foreground
              "
            >

              Your account is fully unlocked.

            </span>

          </div>


        </div>


      </div>

    );

  }



  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-border/60
        bg-gradient-to-br
        from-primary/10
        via-background
        to-background
        p-6
        shadow-lg
      "
    >


      <div
        className="
          absolute
          -right-24
          -top-24
          h-72
          w-72
          rounded-full
          bg-primary/20
          blur-3xl
        "
      />



      <div className="relative">


        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-primary
            "
          >

            <Zap
              className="
                h-6
                w-6
              "
            />

          </div>


          <div>

            <h3
              className="
                text-2xl
                font-black
              "
            >

              Upgrade your membership

            </h3>


            <p
              className="
                text-sm
                text-muted-foreground
              "
            >

              Unlock more prediction power.

            </p>

          </div>


        </div>




        <div
          className="
            mt-6
            grid
            gap-5
            sm:grid-cols-2
          "
        >


          {
            plan === 'free' && (

              <button
                onClick={() =>
                  onUpgrade('regular')
                }
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  bg-gradient-to-br
                  from-blue-600
                  via-indigo-600
                  to-violet-600
                  p-6
                  text-left
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-blue-500/30
                "
              >

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-br
                    from-white/20
                    to-transparent
                    opacity-0
                    transition-opacity
                    group-hover:opacity-100
                  "
                />


                <div className="relative">


                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        font-black
                      "
                    >

                      Regular Plan

                    </span>


                    <ArrowUpRight
                      className="
                        h-5
                        w-5
                      "
                    />

                  </div>



                  <p
                    className="
                      mt-6
                      text-3xl
                      font-black
                    "
                  >

                    ₦
                    {config.regularPrice.toLocaleString(
                      'en-GB',
                    )}

                  </p>



                  <p
                    className="
                      mt-3
                      text-sm
                      text-white/80
                    "
                  >

                    Access regular predictions

                  </p>


                </div>


              </button>

            )
          }





          <button
            onClick={() =>
              onUpgrade('vip')
            }
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-amber-500/30
              bg-gradient-to-br
              from-amber-500/10
              via-background
              to-background
              p-6
              text-left
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-amber-500/50
              hover:shadow-xl
            "
          >

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-amber-500/20
                to-transparent
                opacity-0
                transition-opacity
                group-hover:opacity-100
              "
            />


            <div className="relative">


              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    flex
                    items-center
                    gap-2
                    font-black
                  "
                >

                  VIP Plan

                  <Crown
                    className="
                      h-5
                      w-5
                      text-amber-500
                    "
                  />

                </span>


                <ArrowUpRight
                  className="
                    h-5
                    w-5
                    text-amber-500
                  "
                />

              </div>



              <p
                className="
                  mt-6
                  text-3xl
                  font-black
                "
              >

                ₦
                {config.vipPrice.toLocaleString(
                  'en-GB',
                )}

              </p>



              <p
                className="
                  mt-3
                  text-sm
                  text-muted-foreground
                "
              >

                Unlock full premium benefits

              </p>


            </div>


          </button>


        </div>


      </div>


    </div>

  );

}