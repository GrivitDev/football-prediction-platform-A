'use client';

import Image from 'next/image';
import Link from 'next/link';

import NavLinks from './NavLinks';
import ThemeSwitcher from './ThemeSwitcher';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
      "
    >
      {/* subtle ambient background */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-1/2
            top-0
            h-[260px]
            w-[700px]
            -translate-x-1/2
            rounded-full
            bg-gradient-to-r
            from-indigo-500/10
            via-sky-500/10
            to-emerald-500/10
            blur-3xl
          "
        />
      </div>


      <div
        className="
          mx-auto
          mt-3
          max-w-7xl
          px-4
          sm:px-6
        "
      >

        {/* gradient border frame */}
        <div
          className="
            rounded-2xl
            bg-gradient-to-r
            from-indigo-400/30
            via-sky-400/20
            to-emerald-400/30
            p-[1px]
          "
        >

          {/* navbar body */}
          <div
            className="
              flex
              h-16
              items-center
              justify-between
              rounded-2xl
              border
              border-border/50
              bg-background/80
              px-4
              backdrop-blur-xl
              sm:px-6
            "
          >

            {/* LOGO */}
            <Link
              href="/"
              className="
                flex
                items-center
                gap-3
                transition-opacity
                duration-200
                hover:opacity-90
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  border
                  border-border/50
                  bg-background/60
                "
              >
                <Image
                  src="/logo.png"
                  alt="PredictPro"
                  width={40}
                  height={40}
                  className="
                    object-contain
                  "
                  priority
                />
              </div>


              <span
                className="
                  hidden
                  bg-gradient-to-r
                  from-foreground
                  via-indigo-500
                  to-emerald-500
                  bg-clip-text
                  text-xl
                  font-bold
                  tracking-tight
                  text-transparent
                  sm:block
                "
              >
                PredictPro
              </span>
            </Link>


            {/* CENTER NAV */}
            <div
              className="
                hidden
                md:block
              "
            >
              <div
                className="
                  rounded-full
                  border
                  border-border/50
                  bg-muted/30
                  px-6
                  py-2
                  backdrop-blur-md
                "
              >
                <NavLinks />
              </div>
            </div>


            {/* RIGHT ACTIONS */}
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  hidden
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-border/50
                  bg-muted/30
                  px-3
                  py-2
                  backdrop-blur-md
                  md:flex
                "
              >
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