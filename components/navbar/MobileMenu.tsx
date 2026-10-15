'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Menu,
  Home,
  Target,
  FileText,
  Newspaper,
  PlaySquare,
  LogOut,
} from 'lucide-react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/providers/auth-provider';
const publicLinks = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Predictions',
    href: '/predictions',
    icon: Target,
  },
  {
    name: 'Articles',
    href: '/articles',
    icon: FileText,
  },
  {
    name: 'News',
    href: '/news',
    icon: Newspaper,
  },
  {
    name: 'Highlights',
    href: '/highlights',
    icon: PlaySquare,
  },
];

const socials = [
  {
    name: 'X',
    href: process.env.NEXT_PUBLIC_TWITTER || '#',
  },
  {
    name: 'Facebook',
    href: process.env.NEXT_PUBLIC_FACEBOOK || '#',
  },
  {
    name: 'Instagram',
    href: process.env.NEXT_PUBLIC_INSTAGRAM || '#',
  },
  {
    name: 'Telegram',
    href: process.env.NEXT_PUBLIC_TELEGRAM || '#',
  },
];

function SocialIcon({
  name,
}: {
  name: string;
}) {
  if (name === 'X') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 fill-current"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.681l7.73-8.835L1.25 2.25h6.826l4.713 6.231 5.455-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
      </svg>
    );
  }

  if (name === 'Facebook') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 fill-current"
      >
        <path d="M13.5 22v-8h2.75l.417-3.11H13.5V8.904c0-.9.25-1.512 1.547-1.512H16.8V4.61c-.303-.04-1.343-.11-2.55-.11-2.523 0-4.25 1.54-4.25 4.37v2.02H7.25V14H10v8h3.5Z" />
      </svg>
    );
  }

  if (name === 'Instagram') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 fill-current"
      >
        <path
          fillRule="evenodd"
          d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M21.5 3.5 2.82 10.7c-.93.37-.92.88-.17 1.11l4.79 1.49 1.84 5.65c.22.62.11.87.75.87.5 0 .72-.23.99-.5l2.33-2.26 4.84 3.57c.89.49 1.53.24 1.75-.83l3.18-15.02c.31-1.32-.5-1.92-1.62-1.28ZM7.64 12.96l10.93-6.9c.55-.34 1.05-.16.64.21l-8.85 7.99-.34 3.63-1.48-4.93-.34 3.63-1.48-4.93-.9-.28Z" />
    </svg>
  );
}

export default function MobileMenu() {
  const pathname = usePathname();

  const { user, logout } = useAuth();

  const linkClass = (active: boolean) => `
    group
    flex
    items-center
    gap-3
    rounded-2xl
    px-4
    py-3
    text-sm
    font-medium
    transition-all
    duration-200

    ${
      active
        ? `
          border
          border-primary/20
          bg-primary/10
          text-primary
        `
        : `
          text-muted-foreground
          hover:bg-muted
          hover:text-foreground
        `
    }
  `;

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            className="
              h-10
              w-10
              rounded-xl
              border
              border-border/50
              bg-background/40
              backdrop-blur-md
              transition-all
              duration-200
              hover:border-primary/30
              hover:bg-primary/10
              hover:text-primary
            "
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="
            flex
            h-[100dvh]
            w-[340px]
            max-w-[90vw]
            flex-col
            overflow-hidden
            border-border/50
            bg-background/95
            p-0
            backdrop-blur-2xl
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-primary/10
              blur-3xl
            "
          />

          {/* ========================================================
              HEADER
          ======================================================== */}

          <SheetHeader
            className="
              relative
              shrink-0
              border-b
              border-border/50
              px-6
              py-5
            "
          >
            <SheetTitle
              className="
                text-left
                text-lg
                font-bold
              "
            >
              Navigation
            </SheetTitle>
          </SheetHeader>

          {/* ========================================================
              SCROLLABLE CONTENT
          ======================================================== */}

          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-5
              py-6
              scrollbar-hide
            "
          >
            {/* ======================================================
                PUBLIC LINKS
            ====================================================== */}

            <div className="space-y-2">
              <p
                className="
                  px-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-muted-foreground
                "
              >
                Explore
              </p>

              {publicLinks.map((link) => {
                const Icon = link.icon;

                const active =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                return (
                  <SheetClose
                    asChild
                    key={link.href}
                  >
                    <Link
                      href={link.href}
                      className={linkClass(active)}
                    >
                      <Icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  </SheetClose>
                );
              })}
            </div>

            {/* ======================================================
                SOCIAL MEDIA
                DIRECTLY AFTER THEME SWITCHER
            ====================================================== */}

            <div
              className="
                mt-6
                border-t
                border-border/50
                pt-5
              "
            >
              <p
                className="
                  mb-3
                  px-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-muted-foreground
                "
              >
                Connect
              </p>

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >
                {socials.map((social) => {
                  const disabled =
                    social.href === '#';

                  return (
                    <Link
                      key={social.name}
                      href={social.href}
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
                      aria-label={social.name}
                      aria-disabled={disabled}
                      onClick={
                        disabled
                          ? (event) =>
                              event.preventDefault()
                          : undefined
                      }
                      className="
                        flex
                        h-11
                        w-11
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
                      <SocialIcon name={social.name} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========================================================
              AUTH AREA
              STAYS VISIBLE AND RESPECTS MOBILE SAFE AREA
          ======================================================== */}

          <div
            className="
              shrink-0
              border-t
              border-border/50
              bg-background/95
              px-5
              pb-[calc(7.25rem+env(safe-area-inset-bottom))]

              backdrop-blur-xl
            "
          >
            {!user ? (
              <div className="grid grid-cols-2 gap-3">
                <SheetClose asChild>
                  <Link
                    href="/login"
                    className="
                      block
                      rounded-2xl
                      border
                      border-border
                      py-3
                      text-center
                      text-sm
                      font-medium
                      transition-colors
                      hover:bg-muted
                    "
                  >
                    Login
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    href="/register"
                    className="
                      block
                      rounded-2xl
                      bg-primary
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-primary-foreground
                      transition-opacity
                      hover:opacity-90
                    "
                  >
                    Register
                  </Link>
                </SheetClose>
              </div>
            ) : (
              <Button
                onClick={async () => {
                  await logout();
                }}
                variant="outline"
                className="
                  w-full
                  rounded-2xl
                  border-destructive/30
                  py-3
                  text-destructive
                  hover:bg-destructive/10
                  hover:text-destructive
                "
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}