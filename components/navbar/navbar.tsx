'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaTelegram,
} from 'react-icons/fa6';

import NavLinks from './NavLinks';
import ThemeSwitcher from './ThemeSwitcher';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import MobilePublicTabs from './MobilePublicTabs';

import { useAuth } from '@/providers/auth-provider';

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

export default function Navbar() {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <header
        className="
          fixed
          inset-x-0
          top-0
          z-[9999]
          px-3
          pt-3
          sm:px-5
        "
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-emerald-500/35
              bg-background/90
              shadow-lg
              shadow-emerald-950/10
              backdrop-blur-2xl
              supports-[backdrop-filter]:bg-background/75
            "
          >
            {/* ======================================================
                MAIN NAVBAR
            ====================================================== */}

            <div
              className="
                flex
                h-16
                items-center
                justify-between
                gap-3
                px-3
                sm:px-5
              "
            >
              {/* ====================================================
                  LOGO
              ==================================================== */}

              <Link
                href="/"
                aria-label="HonestPredict home"
                className="
                  flex
                  h-14
                  w-32
                  shrink-0
                  items-center
                  justify-start
                  overflow-hidden
                  sm:w-36
                "
              >
                <Image
                  src="/logo.png"
                  alt="HonestPredict"
                  width={180}
                  height={180}
                  priority
                  className="
                    h-auto
                    w-full
                    object-contain
                  "
                />
              </Link>

              {/* ====================================================
                  DESKTOP PRIMARY NAVIGATION
              ==================================================== */}

              <div
                className="
                  hidden
                  min-w-0
                  flex-1
                  items-center
                  justify-center
                  lg:flex
                "
              >
                <NavLinks />
              </div>

              {/* ====================================================
                  DESKTOP CONTROLS
              ==================================================== */}

              <div
                className="
                  hidden
                  shrink-0
                  items-center
                  gap-1
                  lg:flex
                "
              >
                <ThemeSwitcher />

                <UserMenu />

                <div
                  className="
                    ml-6
                    flex
                    items-center
                    gap-1.5
                    border-l
                    border-border/60
                    pl-6
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
                          aria-disabled={disabled}
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
                            border-border/60
                            bg-background/40
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

              {/* ====================================================
                  MOBILE CONTROLS
              ==================================================== */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                  lg:hidden
                "
              >
                <ThemeSwitcher />

                <UserMenu />

                <MobileMenu />
              </div>
            </div>

            {/* ======================================================
                MOBILE PUBLIC TABS
            ====================================================== */}

            {!isAdmin && <MobilePublicTabs />}
          </div>
        </div>
      </header>

      {/* ============================================================
          NAVBAR SPACER
      ============================================================ */}


<div
  aria-hidden="true"
  className={`
    shrink-0
    ${isAdmin ? 'h-20' : 'h-28 lg:h-20'}
  `}
/>
    </>
  );
}