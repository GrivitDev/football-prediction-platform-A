'use client';

import {
  Badge,
} from '@/components/ui/badge';

interface StatusBadgeProps {
  status?: string;
}

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalized =
    status?.toLowerCase() ?? 'unknown';

  const label =
    normalized === 'vip'
      ? 'VIP'
      : normalized === 'premium'
        ? 'Premium'
        : normalized === 'regular'
          ? 'Regular'
          : normalized === 'free'
            ? 'Free'
            : normalized.charAt(0).toUpperCase() +
              normalized.slice(1);

  const baseClass = `
    rounded-md
    border
    px-2
    py-0.5
    text-[10px]
    font-medium
    uppercase
    tracking-wide
    shadow-none
  `;

  const statusStyles = {
    premium:
      'border-violet-500/20 bg-violet-500/10 text-violet-500',
    vip:
      'border-amber-500/20 bg-amber-500/10 text-amber-500',
    regular:
      'border-primary/20 bg-primary/10 text-primary',
    free:
      'border-border bg-muted text-muted-foreground',
    active:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
    paid:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
    completed:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
    approved:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
    success:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-600',
    pending:
      'border-amber-500/20 bg-amber-500/10 text-amber-600',
    processing:
      'border-amber-500/20 bg-amber-500/10 text-amber-600',
    waiting:
      'border-amber-500/20 bg-amber-500/10 text-amber-600',
    failed:
      'border-destructive/20 bg-destructive/10 text-destructive',
    cancelled:
      'border-destructive/20 bg-destructive/10 text-destructive',
    expired:
      'border-destructive/20 bg-destructive/10 text-destructive',
    rejected:
      'border-destructive/20 bg-destructive/10 text-destructive',
    inactive:
      'border-destructive/20 bg-destructive/10 text-destructive',
  } as const;

  const style =
    statusStyles[
      normalized as keyof typeof statusStyles
    ] ??
    'border-border bg-muted text-muted-foreground';

  return (
    <Badge
      variant="outline"
      className={`
        ${baseClass}
        ${style}
      `}
    >
      {label}
    </Badge>
  );
}