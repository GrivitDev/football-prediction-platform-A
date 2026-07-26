'use client';

import Link from 'next/link';

import {
  ArrowRight,
  Trophy,
  BarChart3,
  Target,
  ShieldCheck,
  Mail,
  Phone,
} from 'lucide-react';

import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaTelegram,
  FaWhatsapp,
} from 'react-icons/fa6';

import LegalPreview from '@/components/LegalPreview';


const features = [
  {
    icon: <BarChart3 />,
    title: 'Match Analysis',
    text: 'We study team form, statistics, performance trends and important match factors.',
  },
  {
    icon: <Target />,
    title: 'Football Predictions',
    text: 'Our predictions are created through careful research and football understanding.',
  },
  {
    icon: <ShieldCheck />,
    title: 'Premium Content',
    text: 'Exclusive predictions, tactical insights, previews and football discussions.',
  },
];



const communities = [
  {
    icon: <FaTelegram />,
    name: 'Telegram Channel',
    text: 'Daily predictions and announcements',
    link: '#',
  },
  {
    icon: <FaWhatsapp />,
    name: 'WhatsApp Channel',
    text: 'Follow football updates and insights',
    link: '#',
  },
  {
    icon: <FaWhatsapp />,
    name: 'WhatsApp Group',
    text: 'Discuss matches with other football fans',
    link: '#',
  },
  {
    icon: <FaFacebook />,
    name: 'Facebook Page',
    text: 'News and community updates',
    link: '#',
  },
  {
    icon: <FaXTwitter />,
    name: 'X (Twitter)',
    text: 'Football opinions and updates',
    link: '#',
  },
  {
    icon: <FaInstagram />,
    name: 'Instagram',
    text: 'Football content and highlights',
    link: '#',
  },
  {
    icon: <FaYoutube />,
    name: 'YouTube',
    text: 'Football analysis videos',
    link: '#',
  },
];



export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      <div className="absolute inset-0 -z-20 bg-background" />


      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        <div className="
          absolute left-1/2 top-[-250px]
          h-[650px] w-[950px]
          -translate-x-1/2
          rounded-full
          bg-gradient-to-r
          from-indigo-500/20
          via-cyan-500/15
          to-emerald-500/20
          blur-3xl
          animate-ambient
        "/>


        <div className="
          absolute bottom-[-200px] right-[-150px]
          h-[420px] w-[420px]
          rounded-full
          bg-purple-500/10
          blur-3xl
          animate-float-slow
        "/>

      </div>



      <section className="mx-auto max-w-7xl px-6 pb-24 pt-24">


        {/* HERO */}

        <div className="mx-auto max-w-4xl text-center">

          <div className="
            mx-auto flex w-fit items-center gap-2
            rounded-full border border-border
            bg-muted/40 px-5 py-2
            backdrop-blur-xl
          ">
            <Trophy className="h-4 w-4 text-cyan-500" />
            Football Analysis Platform
          </div>



          <h1 className="
            mt-10 text-5xl font-black tracking-tight md:text-7xl
          ">
            <span className="
              bg-gradient-to-r
              from-foreground
              via-cyan-500
              to-emerald-500
              bg-clip-text
              text-transparent
            ">
              About PredictPro
            </span>
          </h1>



          <p className="
            mt-8 text-lg leading-8 text-muted-foreground
          ">
            PredictPro is a football analysis and prediction platform built
            for fans who want a deeper understanding of the game.

            We provide carefully researched match insights, predictions and
            premium football content to help our community follow football
            with better information.
          </p>

        </div>





        {/* MISSION */}

        <div className="
          mt-20 rounded-[32px]
          border border-border/60
          bg-background/70
          p-10 backdrop-blur-2xl
          md:p-14
          animate-card-float
        ">

          <h2 className="text-3xl font-bold">
            Our Mission
          </h2>


          <p className="
            mt-5 max-w-4xl
            leading-8 text-muted-foreground
          ">
            Our mission is to make football analysis simple, accessible and
            valuable for everyone.

            Football is unpredictable, and no prediction can guarantee an
            outcome. Through research, statistics, team evaluation and
            football knowledge, we aim to provide valuable insights that
            help fans make better informed decisions.
          </p>

        </div>





        {/* FEATURES */}

        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {features.map((item) => (
            <InfoCard key={item.title} {...item} />
          ))}

        </div>






        {/* COMMUNITY */}

        <section className="mt-24">

          <h2 className="text-center text-4xl font-black">
            Connect With Our Community
          </h2>


          <p className="
            mx-auto mt-4 max-w-2xl
            text-center text-muted-foreground
          ">
            Follow PredictPro across our platforms and stay updated with
            football insights, predictions and announcements.
          </p>



          <div className="
            mt-12 grid gap-6
            sm:grid-cols-2
            lg:grid-cols-4
          ">

            {communities.map((item) => (
              <SocialCard key={item.name} {...item} />
            ))}

          </div>

        </section>






        {/* CONTACT */}

        <section className="mt-24">

          <h2 className="text-center text-4xl font-black">
            Contact Us
          </h2>


          <div className="mt-10 grid gap-6 md:grid-cols-2">


            <ContactCard
              icon={<Mail />}
              title="Email"
              value="support@predictpro.com"
            />


            <ContactCard
              icon={<Phone />}
              title="Phone / WhatsApp"
              value="+234 XXX XXX XXXX"
            />


          </div>

        </section>







        <div className="mt-20 flex justify-center">

          <Link
            href="/"
            className="
              group flex items-center gap-3
              rounded-full border border-border
              bg-muted/40 px-8 py-4
              font-semibold backdrop-blur-xl
              transition
              hover:border-cyan-500/50
            "
          >

            Explore PredictPro

            <ArrowRight className="
              h-4 w-4 transition
              group-hover:translate-x-1
            "/>

          </Link>

        </div>
<LegalPreview/>

      </section>

    </main>
  );
}






function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {

  return (
    <div className="
      rounded-2xl border border-border
      bg-muted/30 p-6
      backdrop-blur-xl
      transition-all duration-500
      hover:-translate-y-3
    ">

      <div className="mb-5 text-cyan-500">
        {icon}
      </div>


      <h3 className="text-xl font-bold">
        {title}
      </h3>


      <p className="mt-3 text-sm text-muted-foreground">
        {text}
      </p>

    </div>
  );
}







function SocialCard({
  icon,
  name,
  text,
  link,
}: {
  icon: React.ReactNode;
  name: string;
  text: string;
  link: string;
}) {

  return (
    <Link
      href={link}
      className="
        rounded-2xl border border-border
        bg-muted/30 p-6
        backdrop-blur-xl
        transition-all
        hover:-translate-y-2
        hover:border-cyan-500/40
      "
    >

      <div className="mb-4 text-cyan-500 text-2xl">
        {icon}
      </div>


      <h3 className="font-bold">
        {name}
      </h3>


      <p className="mt-2 text-sm text-muted-foreground">
        {text}
      </p>

    </Link>
  );
}







function ContactCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {

  return (
    <div className="
      rounded-2xl border border-border
      bg-muted/30 p-6
      backdrop-blur-xl
    ">

      <div className="mb-4 text-cyan-500">
        {icon}
      </div>


      <h3 className="text-xl font-bold">
        {title}
      </h3>


      <p className="mt-3 text-muted-foreground">
        {value}
      </p>

    </div>
  );
}