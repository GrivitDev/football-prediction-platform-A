'use client';


import Image from 'next/image';

import {
  motion,
} from 'framer-motion';


import {
  Trophy,
  TrendingUp,
  ShieldCheck,
  Target,
} from 'lucide-react';



export default function AboutHero() {


  return (

    <section
      className="
        relative
        isolate
        overflow-hidden
        mx-auto
        max-w-7xl
        px-3
        pb-4
        pt-4
      "
    >


      {/* BACKGROUND GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          overflow-hidden
        "
      >

        <motion.div

          animate={{
            x:[-50,50,-50],
            y:[0,40,0],
          }}

          transition={{
            duration:18,
            repeat:Infinity,
            ease:'easeInOut',
          }}

          className="
            absolute
            left-1/2
            top-20
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-cyan-500/20
            blur-[140px]
          "

        />


        <motion.div

          animate={{
            x:[40,-40,40],
            y:[30,-30,30],
          }}

          transition={{
            duration:22,
            repeat:Infinity,
            ease:'easeInOut',
          }}

          className="
            absolute
            right-0
            top-40
            h-[350px]
            w-[350px]
            rounded-full
            bg-emerald-500/20
            blur-[120px]
          "

        />

      </div>





      {/* HERO CONTENT */}

      <div
        className="
          grid
          items-center
          gap-14
          lg:grid-cols-2
        "
      >



        {/* LEFT SIDE */}

        <div>


          <motion.div

            initial={{
              opacity:0,
              y:-20,
            }}

            animate={{
              opacity:1,
              y:0,
            }}

            transition={{
              duration:.6,
            }}

            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              border-border
              bg-muted/40
              px-5
              py-2
              backdrop-blur-xl
            "
          >

            <Trophy
              className="
                h-4
                w-4
                text-cyan-500
              "
            />

            Football Intelligence Platform

          </motion.div>






          <motion.h1

            initial={{
              opacity:0,
              y:30,
            }}

            animate={{
              opacity:1,
              y:0,
            }}

            transition={{
              duration:.8,
              delay:.2,
            }}

            className="
              mt-10
              text-5xl
              font-black
              tracking-tight
              md:text-7xl
            "
          >

            <span
              className="
                block
                bg-gradient-to-r
                from-foreground
                via-cyan-500
                to-emerald-500
                bg-[length:200%]
                bg-clip-text
                text-transparent
                animate-gradient
              "
            >

              About PredictPro

            </span>


          </motion.h1>







          <motion.p

            initial={{
              opacity:0,
            }}

            animate={{
              opacity:1,
            }}

            transition={{
              duration:.8,
              delay:.5,
            }}

            className="
              mt-8
              max-w-xl
              text-lg
              leading-8
              text-muted-foreground
            "
          >

            PredictPro is a football analysis and prediction platform built
            for fans who want a deeper understanding of the game.

            We provide carefully researched match insights, predictions and
            premium football content to help our community follow football
            with better information.

          </motion.p>




          <div
            className="
              mt-10
              flex
              flex-wrap
              gap-4
            "
          >


            <Feature
              icon={<TrendingUp />}
              text="Smart Match Analysis"
            />


            <Feature
              icon={<ShieldCheck />}
              text="Reliable Insights"
            />


            <Feature
              icon={<Target />}
              text="Prediction Accuracy"
            />


          </div>


        </div>









        {/* RIGHT IMAGE AREA */}


        <div
          className="
            relative
            flex
            justify-center
          "
        >



          {/* Floating Prediction Card */}

          <FloatingCard
            className="
              left-0
              top-16
            "
            title="Arsenal"
            value="82%"
          />



          <FloatingCard
            className="
              bottom-20
              right-0
            "
            title="BTTS"
            value="76%"
          />







          <motion.div

            initial={{
              opacity:0,
              scale:.8,
            }}

            animate={{
              opacity:1,
              scale:1,
              y:[0,-15,0],
            }}

            transition={{
              opacity: { duration: 1 },
              scale: { duration: 1 },
              y: {
                duration:5,
                repeat:Infinity,
                ease:'easeInOut',
              },
            }}

            className="
              relative
              h-[420px]
              w-full
              max-w-md
            "
          >

            <div
              className="
                absolute
                inset-0
                rounded-full
                bg-cyan-500/20
                blur-3xl
              "
            />


            <Image

              src="/images/ball3.png"

              alt="Football analysis"

              fill

              className="
                object-contain
                drop-shadow-2xl
              "

              priority

            />


          </motion.div>



        </div>



      </div>


    </section>

  );
}








function Feature({
  icon,
  text,
}:{
  icon:React.ReactNode;
  text:string;
}) {


  return (

    <div
      className="
        flex
        items-center
        gap-2
        rounded-full
        border
        border-border
        bg-background/40
        px-4
        py-2
        text-sm
        backdrop-blur-xl
      "
    >

      <span
        className="
          text-cyan-500
        "
      >
        {icon}
      </span>


      {text}

    </div>

  );

}








function FloatingCard({
  title,
  value,
  className,
}:{
  title:string;
  value:string;
  className:string;
}) {


  return (

    <motion.div

      animate={{
        y:[0,-15,0],
      }}

      transition={{
        duration:4,
        repeat:Infinity,
        ease:'easeInOut',
      }}

      className={`
        absolute
        z-20
        rounded-2xl
        border
        border-border
        bg-background/60
        p-4
        shadow-xl
        backdrop-blur-xl
        ${className}
      `}
    >

      <p
        className="
          text-xs
          text-muted-foreground
        "
      >
        {title}
      </p>


      <p
        className="
          mt-1
          text-2xl
          font-black
          text-cyan-500
        "
      >
        {value}
      </p>


    </motion.div>

  );

}