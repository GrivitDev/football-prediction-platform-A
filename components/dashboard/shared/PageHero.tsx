'use client';

import { cn } from '@/lib/utils';

interface PageHeroProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHero({
  title,
  description,
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        `
          rounded-xl
          border
          border-border/70
          bg-card
          px-4
          py-3
        `,
        className,
      )}
    >
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <h1
            className="
              truncate
              text-lg
              font-semibold
              tracking-tight
              sm:text-xl
            "
          >
            {title}
          </h1>

          <p
            className="
              mt-0.5
              text-xs
              leading-5
              text-muted-foreground
            "
          >
            {description}
          </p>
        </div>

        {children && (
          <div className="shrink-0">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}