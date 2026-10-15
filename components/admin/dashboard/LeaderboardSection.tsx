'use client';

import { useState } from 'react';
import LeaderboardTable from './LeaderboardTable';
import type { AnalyticsLeaderboards } from '@/types/analytics.types';

interface Props {
  leaderboards: AnalyticsLeaderboards;
}

type LeaderboardType = 'subscribers' | 'vip' | 'regular' | 'premium' | 'buyers' | 'referrals';
type ExtendedLeaderboards = AnalyticsLeaderboards & {
  topPremiumSubscribers?: AnalyticsLeaderboards['topSubscribers'];
};

export default function LeaderboardSection({ leaderboards }: Props) {
  const [activeLeaderboard, setActiveLeaderboard] = useState<LeaderboardType>('subscribers');
  const extended = leaderboards as ExtendedLeaderboards;
  const hasPremium = Array.isArray(extended.topPremiumSubscribers);

  const tabs: ReadonlyArray<{ label: string; value: LeaderboardType }> = [
    { label: 'Subscribers', value: 'subscribers' },
    { label: 'VIP', value: 'vip' },
    { label: 'Regular', value: 'regular' },
    ...(hasPremium ? [{ label: 'Premium', value: 'premium' as const }] : []),
    { label: 'Buyers', value: 'buyers' },
    { label: 'Referrals', value: 'referrals' },
  ];

  const tableByType = {
    subscribers: {
      title: 'Top Subscribers',
      users: leaderboards.topSubscribers,
      metric: 'totalSubscriptions' as const,
    },
    vip: {
      title: 'Top VIP Subscribers',
      users: leaderboards.topVipSubscribers,
      metric: 'totalVipSubscriptions' as const,
    },
    regular: {
      title: 'Top Regular Subscribers',
      users: leaderboards.topRegularSubscribers,
      metric: 'totalRegularSubscriptions' as const,
    },
    premium: {
      title: 'Top Premium Subscribers',
      users: extended.topPremiumSubscribers ?? [],
      metric: 'totalSubscriptions' as const,
    },
    buyers: {
      title: 'Top Prediction Buyers',
      users: leaderboards.topPredictionBuyers,
      metric: 'totalPurchases' as const,
    },
    referrals: {
      title: 'Top Referrers',
      users: leaderboards.topReferrers,
      metric: 'successfulReferrals' as const,
    },
  };

  const table = tableByType[activeLeaderboard];

  return (
    <section className="space-y-2">
      <div className="flex w-full flex-wrap gap-1 rounded-lg border bg-muted/30 p-1">
        {tabs.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            aria-pressed={activeLeaderboard === value}
            onClick={() => setActiveLeaderboard(value)}
            className={`min-w-0 flex-1 rounded-md px-2 py-1 text-[10px] font-medium leading-4 transition-colors ${
              activeLeaderboard === value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-background hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <LeaderboardTable title={table.title} users={table.users} metric={table.metric} />
    </section>
  );
}
