'use client';

import { Loader2 } from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { cn } from '@/lib/utils';

interface LoadingCardProps {
  text?: string;
  className?: string;
}

export function LoadingCard({
  text = 'Loading...',
  className,
}: LoadingCardProps) {
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
          min-h-40
          flex-col
          items-center
          justify-center
          gap-2
        "
      >
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />

        <p className="text-xs font-medium">
          {text}
        </p>
      </CardContent>
    </Card>
  );
}