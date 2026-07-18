'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaTelegram,
  FaWhatsapp,
} from 'react-icons/fa6';


const explore = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Live Scores',
    href: '/live-scores',
  },
  {
    name: 'Articles',
    href: '/articles',
  },
  {
    name: 'About',
    href: '/about',
  },
];


const company = [
  {
    name: 'VIP Membership',
    href: '/vip-payment',
  },
  {
    name: 'About Us',
    href: '/about',
  },
  {
    name: 'Contact',
    href: '/about#contact',
  },
];


const legal = [
  {
    name: 'Privacy Policy',
    href: '/privacy-policy',
  },
  {
    name: 'Terms & Conditions',
    href: '/terms-and-conditions',
  },
  {
    name: 'Cookie Policy',
    href: '/cookie-policy',
  },
  {
    name: 'Disclaimer',
    href: '/disclaimer',
  },
  {
    name: 'Refund Policy',
    href: '/refund-policy',
  },
  {
    name: 'Responsible Gambling',
    href: '/responsible-gambling',
  },
  {
    name: 'Advertising Policy',
    href: '/advertising-policy',
  },
];


const socials = [
  {
    icon: FaWhatsapp,
    href:
      'https://wa.me/2348164580712?text=Hello%20PredictPro%20Support,%20I%20need%20assistance%20with%20your%20platform.',
  },
  {
    icon: FaXTwitter,
    href: '#',
  },
  {
    icon: FaFacebookF,
    href: '#',
  },
  {
    icon: FaInstagram,
    href: '#',
  },
  {
    icon: FaTelegram,
    href: '#',
  },
];


export default function Footer() {

  return (

    <footer
  className="
    relative
    overflow-hidden
    bg-gradient-to-b
    from-transparent
    via-background/40
    to-background
  "
>
{/* BACKGROUND */}

<div className="absolute inset-0 overflow-hidden">

  {/* Left Glow */}

  <div
    className="
      absolute
      -left-40
      top-24
      h-[450px]
      w-[450px]
      rounded-full
      bg-indigo-500/10
      blur-[140px]
    "
  />

  {/* Center Glow */}

  <div
    className="
      absolute
      left-1/2
      top-0
      h-[650px]
      w-[950px]
      -translate-x-1/2
      rounded-full
      bg-sky-500/10
      blur-[160px]
    "
  />

  {/* Right Glow */}

  <div
    className="
      absolute
      -right-32
      bottom-0
      h-[500px]
      w-[500px]
      rounded-full
      bg-emerald-500/10
      blur-[150px]
    "
  />

  {/* Grid */}

  <div
    className="
      absolute
      inset-0
      opacity-[0.025]
    "
    style={{
      backgroundImage: `
        linear-gradient(to right,currentColor 1px,transparent 1px),
        linear-gradient(to bottom,currentColor 1px,transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}
  />

  {/* Watermark */}

  <div
    className="
      pointer-events-none
      absolute
      left-1/2
      top-20
      -translate-x-1/2
      select-none
      whitespace-nowrap
      text-[150px]
      font-black
      tracking-[0.4em]
      text-foreground/[0.025]
      blur-[2px]
      md:text-[260px]
    "
  >
    PREDICTPRO
  </div>

</div>
      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-6
          py-5
        "
      >
<div
  className="
    relative
    overflow-hidden
    rounded-[40px]
    border
    border-white/10
    bg-background/55
    shadow-2xl
    shadow-black/30
    backdrop-blur-3xl
  "
>
          <div
            className="
              grid
              gap-14
              p-10
              lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]
            "
          >
            {/* BRAND */}
            <div>
              <Link
                href="/"
                className="flex items-center gap-3"
              >
                <Image
                  src="/logo.png"
                  alt="PredictPro"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
                <span
                  className="
                    bg-gradient-to-r
                    from-foreground
                    via-indigo-500
                    to-emerald-500
                    bg-clip-text
                    text-3xl
                    font-bold
                    text-transparent
                  "
                >
                  PredictPro
                </span>
              </Link>
              <p
                className="
                  mt-6
                  max-w-sm
                  leading-8
                  text-muted-foreground
                "
              >
                Premium football predictions,
                live match coverage,
                winning insights,
                and everything you need to stay one step ahead.
              </p>
            </div>
            {/* EXPLORE */}
            <FooterColumn
              title="Explore"
              items={explore}
            />
            {/* COMPANY */}
            <FooterColumn
              title="Company"
              items={company}
            />
            {/* LEGAL */}
            <FooterColumn
              title="Legal"
              items={legal}
            />
            {/* VIP CARD */}
            <div>
              <div
                className="
                  rounded-3xl
                  border
                  border-border/60
                  bg-muted/30
                  p-6
                  backdrop-blur-xl
                "
              >
                <div
                  className="
                    mb-4
                    inline-flex
                    rounded-full
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    uppercase
                    tracking-widest
                    text-emerald-500
                  "
                >
                  VIP
                </div>
                <h3 className="text-2xl font-bold">
                  Become a VIP Member
                </h3>
                <p
                  className="
                    mt-4
                    text-sm
                    leading-7
                    text-muted-foreground
                  "
                >
                  Unlock premium predictions,
                  exclusive tips,
                  early match analysis,
                  and members-only content.
                </p>
                <Link
                  href="/vip-payment"
                  className="
                    mt-8
                    inline-flex
                    items-center
                    rounded-full
                    bg-gradient-to-r
                    from-indigo-500
                    via-sky-500
                    to-emerald-500
                    px-6
                    py-3
                    font-medium
                    text-white
                    transition
                    hover:scale-[1.02]
                  "
                >
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          {/* BOTTOM BAR */}
          <div
            className="
              border-t
              border-border/60
              px-10
              py-8
            "
          >
            <div
              className="
                flex
                flex-col
                items-center
                justify-between
                gap-6
                md:flex-row
              "
            >
              <div>
                <p className="font-medium">
                  © 2026 PredictPro
                </p>
                <p
                  className="
                    mt-2
                    text-sm
                    text-muted-foreground
                  "
                >
                  Predict with confidence.
                  Football never stops.
                </p>
                <p
                  className="
                    mt-4
                    text-sm
                    text-muted-foreground
                  "
                >
                  Designed & Developed by{' '}
                  <a
                    href='https://wa.me/2348164580712?text=Hello%20PredictPro%20Support,%20I%20need%20assistance%20with%20your%20platform.'
                    className="
                      font-semibold
                      tracking-wide
                      text-foreground
                      transition
                      hover:text-primary
                    "
                  >
                    GrivitDev
                  </a>
                </p>
              </div>
              {/* SOCIALS */}
              <div className="flex gap-3">
                {socials.map(
                  ({ icon: Icon, href }, index) => (
                    <Link
                      key={index}
                      href={href}
                      target="_blank"
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-border
                        bg-background/40
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-indigo-500/40
                        hover:bg-muted
                      "
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: {
    name: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <h3 className="mb-6 text-lg font-semibold">
        {title}
      </h3>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="
                group
                inline-flex
                items-center
                text-muted-foreground
                transition
                hover:text-foreground
              "
            >
              {item.name}
              <ArrowRight
                className="
                  ml-2
                  h-4
                  w-4
                  -translate-x-2
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:translate-x-0
                  group-hover:opacity-100
                "
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}