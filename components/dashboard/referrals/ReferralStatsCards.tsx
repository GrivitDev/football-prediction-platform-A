'use client';

import {
  Crown,
  ShoppingBag,
  UserCheck,
  Users,
} from 'lucide-react';

import { useReferralStats } from '@/hooks/use-referrals';

export function ReferralStatsCards() {
  const {
    data,
    isLoading,
    isError,
  } = useReferralStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-card p-3"
          >
            <div className="h-7 w-7 animate-pulse rounded-md bg-muted/50" />
            <div className="mt-2.5 h-2.5 w-16 animate-pulse rounded bg-muted/50" />
            <div className="mt-1.5 h-5 w-10 animate-pulse rounded bg-muted/40" />
            <div className="mt-1 h-2 w-20 animate-pulse rounded bg-muted/30" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-dashed border-destructive/30 bg-destructive/5 px-3 py-4 text-center">
        <p className="text-xs font-semibold">
          Unable to load referral statistics
        </p>

        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Referrals',
      value: data?.total ?? 0,
      icon: Users,
      description: 'People invited',
    },
    {
      title: 'Registered',
      value: data?.registered ?? 0,
      icon: UserCheck,
      description: 'Successful signups',
    },
    {
      title: 'Regular Subscribers',
      value: data?.regularSubscribers ?? 0,
      icon: Crown,
      description: 'Regular conversions',
    },
    {
      title: 'VIP Subscribers',
      value: data?.vipSubscribers ?? 0,
      icon: Crown,
      description: 'VIP conversions',
    },
    {
      title: 'Total Subscribers',
      value:
        (data?.regularSubscribers ?? 0) +
        (data?.vipSubscribers ?? 0),
      icon: Crown,
      description: 'Combined subscriptions',
    },
    {
      title: 'Predictions Purchased',
      value: data?.predictionPurchases ?? 0,
      icon: ShoppingBag,
      description: 'Referral sales',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-6">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="min-w-0 rounded-lg border border-border bg-card p-3"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-3.5 w-3.5" />
            </div>

            <p className="mt-2.5 truncate text-[9px] font-medium text-muted-foreground">
              {item.title}
            </p>

            <p className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight">
              {item.value}
            </p>

            <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}