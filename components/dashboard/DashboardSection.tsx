'use client';

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import type { ReactNode } from 'react';

interface DashboardSectionProps {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
}

export function DashboardSection({
  title,
  subtitle,
  actionHref,
  actionLabel,
  children,
}: DashboardSectionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-3">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="
              inline-flex
              h-7
              w-fit
              shrink-0
              items-center
              gap-1
              rounded-md
              border
              border-border
              bg-background
              px-2.5
              text-[10px]
              font-medium
              text-muted-foreground
              hover:border-primary/30
              hover:text-primary
            "
          >
            {actionLabel}

            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}