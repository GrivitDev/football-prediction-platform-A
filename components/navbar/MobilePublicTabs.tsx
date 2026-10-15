'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BookOpenText,
  Newspaper,
  PlaySquare,
  Target,
} from 'lucide-react';

const publicTabs = [
  {
    name: 'Predictions',
    href: '/predictions',
    icon: Target,
  },
  {
    name: 'Articles',
    href: '/articles',
    icon: BookOpenText,
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

export default function MobilePublicTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Public navigation"
      className="
        border-t
        border-border/60
        lg:hidden
      "
    >
      <div className="grid grid-cols-4">
        {publicTabs.map(
          ({
            name,
            href,
            icon: Icon,
          }) => {
            const active =
              pathname === href ||
              pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative
                  flex
                  min-w-0
                  items-center
                  justify-center
                  gap-1.5
                  px-1
                  py-2
                  text-[10px]
                  font-semibold
                  transition-colors
                  duration-200

                  ${
                    href !== '/highlights'
                      ? 'border-r border-border/60'
                      : ''
                  }

                  ${
                    active
                      ? `
                        bg-primary/8
                        text-primary
                      `
                      : `
                        text-muted-foreground
                        hover:bg-muted/40
                        hover:text-foreground
                      `
                  }
                `}
              >
                <Icon
                  className="h-3.5 w-3.5 shrink-0"
                  strokeWidth={2}
                />

                <span className="truncate leading-none">
                  {name}
                </span>

                {active && (
                  <span
                    className="
                      absolute
                      inset-x-3
                      bottom-0
                      h-0.1
                      rounded-full
                      bg-primary
                    "
                  />
                )}
              </Link>
            );
          },
        )}
      </div>
    </nav>
  );
}