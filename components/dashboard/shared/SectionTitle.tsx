'use client';

import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function SectionTitle({
  title,
  description,
  action,
  icon: Icon,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        `
          flex
          flex-col
          gap-2
          sm:flex-row
          sm:items-center
          sm:justify-between
        `,
        className,
      )}
    >
      <div
        className="
          flex
          min-w-0
          items-center
          gap-2
        "
      >
        {Icon && (
          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              bg-muted/50
              text-muted-foreground
            "
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}

        <div className="min-w-0">
          <h2
            className="
              truncate
              text-sm
              font-semibold
            "
          >
            {title}
          </h2>

          {description && (
            <p
              className="
                mt-0.5
                text-xs
                leading-4
                text-muted-foreground
              "
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}