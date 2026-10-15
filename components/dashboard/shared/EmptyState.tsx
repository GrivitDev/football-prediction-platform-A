'use client';

import type { LucideIcon } from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        `
          border-border/70
          bg-card
          shadow-none
        `,
        className,
      )}
    >
      <CardContent
        className="
          flex
          flex-col
          items-center
          justify-center
          px-4
          py-8
          text-center
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            bg-muted/50
            text-muted-foreground
          "
        >
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="mt-3 text-sm font-semibold">
          {title}
        </h3>

        <p
          className="
            mt-1
            max-w-sm
            text-xs
            leading-5
            text-muted-foreground
          "
        >
          {description}
        </p>

        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </CardContent>
    </Card>
  );
}