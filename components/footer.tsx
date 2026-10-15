'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaTelegram,
} from 'react-icons/fa6';

import { useAuth } from '@/providers/auth-provider';


const publicLinks = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Predictions',
    href: '/predictions',
  },
  {
    name: 'Articles',
    href: '/articles',
  },
  {
    name: 'News',
    href: '/news',
  },
  {
    name: 'Highlights',
    href: '/highlights',
  },
];


const adminLinks = [
  {
    name: 'Dashboard',
    href: '/admin',
  },
  {
    name: 'System Monitor',
    href: '/admin/system-monitor',
  },
  {
    name: 'Create Prediction',
    href: '/admin/create-prediction',
  },
  {
    name: 'Predictions',
    href: '/admin/predictions',
  },
  {
    name: 'Create Article',
    href: '/admin/create-article',
  },
  {
    name: 'Articles',
    href: '/admin/articles',
  },
  {
    name: 'Users',
    href: '/admin/users',
  },
  {
    name: 'Subscriptions',
    href: '/admin/subscriptions',
  },
  {
    name: 'Ads',
    href: '/admin/ads',
  },
  {
    name: 'Promos',
    href: '/admin/promos',
  },
  {
    name: 'Referrals',
    href: '/admin/referrals',
  },
];


const userLinks = [
  {
    name: 'Dashboard',
    href: '/dashboard',
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
  },
  {
    name: 'Purchases',
    href: '/dashboard/purchases',
  },
  {
    name: 'Referrals',
    href: '/dashboard/referrals',
  },
  {
    name: 'Subscriptions',
    href: '/dashboard/subscriptions',
  },
];


const socials = [
  {
    name: 'X',
    icon: FaXTwitter,
    href: process.env.NEXT_PUBLIC_TWITTER || '#',
  },
  {
    name: 'Facebook',
    icon: FaFacebookF,
    href: process.env.NEXT_PUBLIC_FACEBOOK || '#',
  },
  {
    name: 'Instagram',
    icon: FaInstagram,
    href: process.env.NEXT_PUBLIC_INSTAGRAM || '#',
  },
  {
    name: 'Telegram',
    icon: FaTelegram,
    href: process.env.NEXT_PUBLIC_TELEGRAM || '#',
  },
];


const acknowledgements = [
  'ESPNAPI',
  'The Odds API',
  'Youtube API Services',
  'footballdata.org',
  'groqAPI',
];


export default function Footer() {
  const { user } = useAuth();

  const accountLinks =
    user?.role === 'admin'
      ? adminLinks
      : user
        ? userLinks
        : [];


  return (
    <footer
      className="
        relative
        border-t
        border-border/60
        bg-background
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >

        {/* ============================================================
            MAIN FOOTER
        ============================================================ */}

        <div
          className="
            grid
            gap-8
            md:grid-cols-[1.2fr_1fr_1fr]
            lg:gap-12
          "
        >

          {/* ==========================================================
              BRAND + CONTACT
          ========================================================== */}

          <div className="min-w-0">

            <Link
              href="/"
              aria-label="HonestPredict home"
              className="
                inline-flex
                items-center
              "
            >
              <Image
                src="/logo.png"
                alt="HonestPredict"
                width={260}
                height={90}
                className="
                  h-auto
                  w-[190px]
                  object-contain
                  object-left
                  sm:w-[220px]
                "
              />
            </Link>


            <div
              className="
                mt-5
                space-y-2
              "
            >

              <a
                href="tel:+2348164580712"
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-muted-foreground
                  transition-colors
                  hover:text-foreground
                "
              >
                <Phone className="h-4 w-4 shrink-0" />
                +234 816 458 0712
              </a>


              <a
                href="mailto:contact@honestpredict.com"
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-muted-foreground
                  transition-colors
                  hover:text-foreground
                "
              >
                <Mail className="h-4 w-4 shrink-0" />
                contact@honestpredict.com
              </a>

            </div>


            {/* SOCIALS */}

            <div
              className="
                mt-5
                flex
                items-center
                gap-2
              "
            >

              {socials.map(
                ({
                  name,
                  icon: Icon,
                  href,
                }) => {

                  const disabled =
                    href === '#';

                  return (
                    <Link
                      key={name}
                      href={href}
                      target={
                        disabled
                          ? undefined
                          : '_blank'
                      }
                      rel={
                        disabled
                          ? undefined
                          : 'noopener noreferrer'
                      }
                      aria-label={name}
                      onClick={
                        disabled
                          ? (event) =>
                              event.preventDefault()
                          : undefined
                      }
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-border
                        bg-muted/30
                        text-muted-foreground
                        transition-all
                        duration-200
                        hover:border-primary/40
                        hover:bg-primary/10
                        hover:text-primary
                      "
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                },
              )}

            </div>

          </div>


          {/* ==========================================================
              NAVIGATION
          ========================================================== */}

          <div
            className="
              grid
              grid-cols-2
              gap-8
            "
          >

            <FooterColumn
              title="Explore"
              items={publicLinks}
            />


            {accountLinks.length > 0 && (
              <FooterColumn
                title={
                  user?.role === 'admin'
                    ? 'Administration'
                    : 'Account'
                }
                items={accountLinks}
              />
            )}


            {!user && (
              <div>
                <h3
                  className="
                    mb-3
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  Account
                </h3>

                <div className="space-y-2">

                  <Link
                    href="/login"
                    className="
                      inline-flex
                      items-center
                      rounded-lg
                      bg-primary
                      px-3
                      py-2
                      text-sm
                      font-semibold
                      text-primary-foreground
                      transition-opacity
                      hover:opacity-90
                    "
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="
                      block
                      text-sm
                      text-muted-foreground
                      transition-colors
                      hover:text-foreground
                    "
                  >
                    Register
                  </Link>

                </div>
              </div>
            )}

          </div>


          {/* ==========================================================
              CONTACT
          ========================================================== */}

          <div>

            <h3
              className="
                mb-3
                text-sm
                font-semibold
                text-foreground
              "
            >
              Contact Us
            </h3>

            <p
              className="
                mb-4
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              Have a question or need assistance?
            </p>


            <form
              action="mailto:contact@honestpredict.com"
              method="post"
              encType="text/plain"
              className="
                flex
                gap-2
              "
            >

              <input
                type="email"
                name="email"
                required
                placeholder="Your email"
                aria-label="Your email"
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-3
                  py-2.5
                  text-sm
                  outline-none
                  transition
                  placeholder:text-muted-foreground
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/15
                "
              />

              <button
                type="submit"
                aria-label="Contact us"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary
                  text-primary-foreground
                  transition-opacity
                  hover:opacity-90
                "
              >
                <ArrowRight className="h-4 w-4" />
              </button>

            </form>

          </div>

        </div>


        {/* ============================================================
            LOWER INFORMATION
        ============================================================ */}

        <div
          className="
            mt-8
            border-t
            border-border/60
            pt-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
            "
          >

            {/* TERMS + ACKNOWLEDGEMENTS */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-5
                gap-y-2
                text-xs
              "
            >

              <Link
                href="/terms-and-conditions"
                className="
                  font-medium
                  text-muted-foreground
                  transition-colors
                  hover:text-foreground
                "
              >
                Terms of Use
              </Link>


              <span className="text-border">
                •
              </span>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-muted-foreground
                "
              >

                <ShieldCheck className="h-4 w-4" />

                <span>
                  Data &amp; Service Acknowledgements:
                </span>

                <span className="font-medium text-foreground">
                  {acknowledgements.join(' · ')}
                </span>

              </div>

            </div>


              {/* 18+ DISCLAIMER */}

            <div
              className="
                rounded-xl
                border
                border-amber-500/80
                bg-amber-500/20
                px-3.5
                py-2.5
                dark:bg-amber-500/30
              "
            >
              <p
                className="
                  text-[11px]
                  leading-4.5
                  text-amber-950
                  dark:text-amber-100
                "
              >
                <strong className="font-semibold">
                  18+ only.
                </strong>{' '}
                HonestPredict is for users aged 18 and older. Our Predictions are not 100% guaranteed. Gamble wisely and responsibly.
              </p>
            </div>


            {/* COPYRIGHT */}
            <div
              className="
                flex
                flex-col
                gap-2
                text-xs
                text-muted-foreground
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <p>
                © 2026 HonestPredict. All rights reserved.
              </p>

              <p>
                Designed &amp; Developed by GrivitTechStudio{' '}
                <span className="mx-1">•</span>
                <a
                  href="https://wa.me/2348164580712"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    font-medium
                    text-foreground
                    transition-colors
                    hover:text-primary
                  "
                >
                  www.grivit.com
                </a>
              </p>
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

      <h3
        className="
          mb-3
          text-sm
          font-semibold
          text-foreground
        "
      >
        {title}
      </h3>


      <ul className="space-y-2">

        {items.map((item) => (

          <li key={item.href}>

            <Link
              href={item.href}
              className="
                group
                inline-flex
                items-center
                text-sm
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
            >

              {item.name}

              <ArrowRight
                className="
                  ml-1
                  h-3.5
                  w-3.5
                  -translate-x-1
                  opacity-0
                  transition-all
                  duration-200
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