'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { AnimatedCounter } from './AnimatedCounter';

import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | ReactNode;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: StatCardProps) {
  const isNumber =
    typeof value === 'number';

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
      <CardContent className="p-3">
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <div className="min-w-0">
            <p
              className="
                truncate
                text-[10px]
                font-medium
                uppercase
                tracking-wider
                text-muted-foreground
              "
            >
              {title}
            </p>

            <p
              className="
                mt-1
                truncate
                text-lg
                font-semibold
                tracking-tight
              "
            >
              {isNumber ? (
                <AnimatedCounter
                  value={value as number}
                />
              ) : (
                value
              )}
            </p>

            {description && (
              <p
                className="
                  mt-0.5
                  truncate
                  text-[10px]
                  text-muted-foreground
                "
              >
                {description}
              </p>
            )}
          </div>

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              bg-muted/40
              text-muted-foreground
            "
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}