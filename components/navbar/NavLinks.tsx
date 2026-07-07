'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Home', href: '/' },
  { name: 'Live Scores', href: '/livescore' },
  { name: 'Articles', href: '/articles' },
  { name: 'About', href: '/about' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="relative flex items-center gap-2">

      {links.map((link) => {

        const active =
          pathname === link.href ||
          pathname.startsWith('/livescore');

        return (

          <Link
            key={link.href}
            href={link.href}
            className={`
              relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
              ${
                active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >

            {active && (

              <span
                className="
                  absolute inset-0 rounded-full
                  bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-emerald-500/10
                  border border-border/60
                  backdrop-blur-md
                "
              />

            )}


            <span className="relative z-10">
              {link.name}
            </span>


          </Link>

        );

      })}

    </nav>
  );
}