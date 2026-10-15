'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
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

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      className="
        flex
        min-w-0
        items-center
        justify-center
        gap-0.5
      "
      aria-label="Primary navigation"
    >
      {links.map((link) => {
        const active =
          link.href === '/'
            ? pathname === '/'
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`
              group
              relative
              flex
              items-center
              justify-center
              whitespace-nowrap
              rounded-xl
              px-3
              py-2
              text-sm
              font-semibold
              transition-all
              duration-200
              xl:px-4

              ${
                active
                  ? `
                    bg-primary/10
                    text-primary
                  `
                  : `
                    text-muted-foreground
                    hover:bg-muted/60
                    hover:text-foreground
                  `
              }
            `}
          >
            <span className="relative z-10">
              {link.name}
            </span>

            {active && (
              <span
                className="
                  absolute
                  inset-x-3
                  bottom-0.5
                  h-0.5
                  rounded-full
                  bg-primary
                "
              />
            )}

            {!active && (
              <span
                className="
                  absolute
                  inset-x-3
                  bottom-0.5
                  h-0.5
                  scale-x-0
                  rounded-full
                  bg-primary/60
                  transition-transform
                  duration-200
                  group-hover:scale-x-100
                "
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}