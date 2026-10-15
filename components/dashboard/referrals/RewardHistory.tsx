'use client';

import { useQuery } from '@tanstack/react-query';

import {
  CheckCircle2,
  Crown,
  Gift,
  Wallet,
} from 'lucide-react';

import { getMyRewards } from '@/services/promos.service';

export function RewardHistory() {
  const {
    data: rewards = [],
    isLoading,
  } = useQuery({
    queryKey: ['my-rewards'],
    queryFn: getMyRewards,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-16 items-center justify-center rounded-lg border border-border bg-card text-[10px] text-muted-foreground">
        Loading rewards...
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 px-4 py-6 text-center">
        <Gift className="h-4 w-4 text-muted-foreground" />

        <p className="mt-1.5 text-xs font-semibold">
          No Rewards Yet
        </p>

        <p className="mt-0.5 max-w-xs text-[10px] leading-4 text-muted-foreground">
          Complete referral campaigns to start earning rewards.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/20 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Gift className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold">
              Reward History
            </p>

            <p className="text-[9px] text-muted-foreground">
              Your earned rewards
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 text-[8px] font-medium text-primary">
          {rewards.length}
        </span>
      </div>

      <div className="divide-y divide-border">
        {rewards.map((reward: any) => {
          const isCash =
            reward.type === 'cash';

          const date = new Date(
            reward.createdAt,
          ).toLocaleDateString(
            'en-GB',
            {
              day: '2-digit',
              month: 'short',
            },
          );

          return (
            <div
              key={reward._id}
              className="flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    ${
                      isCash
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-primary/10 text-primary'
                    }
                  `}
                >
                  {isCash ? (
                    <Wallet className="h-3.5 w-3.5" />
                  ) : (
                    <Crown className="h-3.5 w-3.5" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[10px] font-medium">
                    {reward.promoId?.name ??
                      'Referral Reward'}
                  </p>

                  <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                    <p
                      className={`
                        truncate
                        text-[10px]
                        font-semibold
                        ${
                          isCash
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-primary'
                        }
                      `}
                    >
                      {isCash
                        ? `₦${Number(
                            reward.amount ?? 0,
                          ).toLocaleString(
                            'en-GB',
                          )}`
                        : `${reward.plan} Subscription`}
                    </p>

                    <span className="shrink-0 text-[8px] text-muted-foreground">
                      •
                    </span>

                    <span className="shrink-0 text-[8px] text-muted-foreground">
                      {isCash
                        ? date
                        : `${reward.durationDays} days`}
                    </span>
                  </div>

                  {!isCash && (
                    <p className="mt-0.5 flex items-center gap-1 text-[8px] text-muted-foreground">
                      <span>Earned</span>
                      <span>•</span>
                      <span>{date}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-1">
                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />

                <span className="text-[8px] font-medium text-emerald-600 dark:text-emerald-400">
                  Completed
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}