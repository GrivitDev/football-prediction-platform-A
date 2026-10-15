'use client';

import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';

import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

export function DashboardCard({
  children,
  className,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        `
          border-border/70
          bg-card
          shadow-none
          transition-colors
          duration-200
          hover:border-primary/20
        `,
        className,
      )}
    >
      {children}
    </Card>
  );
}