'use client';

import Image from 'next/image';
import Link from 'next/link';

import NavLinks from './NavLinks';
import ThemeSwitcher from './ThemeSwitcher';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">

      {/* soft colorful ambient layer (NO glow) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[280px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/15 via-sky-500/10 to-emerald-500/10 blur-2xl" />
      </div>

      <div className="mx-auto mt-3 max-w-7xl px-4">

        {/* gradient frame (subtle animation) */}
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-indigo-400/40 via-sky-400/30 via-purple-400/30 to-emerald-400/40">

          {/* animated slow shift */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-400/20 via-sky-400/10 via-purple-400/10 to-emerald-400/20 blur-md animate-pulse" />

          {/* glass body */}
          <div className="relative flex h-16 items-center justify-between rounded-2xl bg-background/80 backdrop-blur-xl px-6">

            {/* LEFT - LOGO */}
            <Link href="/" className="flex items-center gap-3">

              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="PredictPro"
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              </div>

              {/* gradient text (subtle but dramatic) */}
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                PredictPro
              </span>
            </Link>

            {/* CENTER NAV */}
            <div className="hidden md:block">
              <div className="rounded-full border border-border/60 bg-muted/30 backdrop-blur-md px-6 py-2">

                {/* NavLinks should ideally support active state underline */}
                <NavLinks />

              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

              <div className="hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-2 backdrop-blur-md">

                <ThemeSwitcher />
                <UserMenu />

              </div>

              <MobileMenu />
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}