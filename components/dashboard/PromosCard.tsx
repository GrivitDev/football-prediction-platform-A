import {
  Clock,
  Crown,
  Gift,
  Sparkles,
  Wallet,
} from 'lucide-react';

import type { PromoItem } from './dashboard.types';

import {
  daysLeft,
  fmtDate,
} from './dashboard.utils';

export function PromosCard({
  items = [],
}: {
  items?: PromoItem[];
}) {
  return (
    <div className="space-y-2">
      {items
        .slice(0, 3)
        .map((item, index) => {
          const left =
            daysLeft(item.endDate);

          const isCash =
            item.rewardType === 'cash';

          return (
            <div
              key={
                item._id ||
                `${item.name}-${index}`
              }
              className="rounded-lg border border-border bg-card p-3"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-xs font-semibold">
                      {item.name || 'Promotion'}
                    </h3>

                    <Sparkles className="h-3 w-3 shrink-0 text-primary" />
                  </div>

                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground">
                    {item.description ||
                      'Available promotion'}
                  </p>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Gift className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                <div className="rounded-md border border-border bg-background/50 p-2">
                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                    {isCash ? (
                      <Wallet className="h-3 w-3" />
                    ) : (
                      <Crown className="h-3 w-3" />
                    )}

                    Reward
                  </div>

                  <p className="mt-0.5 truncate text-xs font-semibold">
                    {isCash
                      ? `₦${item.rewardAmount?.toLocaleString(
                          'en-GB',
                        ) || 0}`
                      : item.rewardPlan ||
                        'Subscription'}
                  </p>
                </div>

                <div className="rounded-md border border-border bg-background/50 p-2">
                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Expiry
                  </div>

                  <p className="mt-0.5 truncate text-xs font-semibold">
                    {left === null
                      ? fmtDate(item.endDate)
                      : `${left} day${
                          left === 1
                            ? ''
                            : 's'
                        } left`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

      {!items.length && (
        <div className="rounded-lg border border-dashed border-border bg-muted/10 px-3 py-5 text-center text-xs text-muted-foreground">
          No active promos right now.
        </div>
      )}
    </div>
  );
}