'use client';

import {
  CalendarDays,
  Crown,
  ShoppingBag,
  Sparkles,
  UserPlus,
} from 'lucide-react';

import { useMyReferrals } from '@/hooks/use-referrals';

export function ReferralActivity() {
  const {
    data: referrals = [],
    isLoading,
    isError,
  } = useMyReferrals();

  if (isLoading) {
    return (
      <div className="flex min-h-16 items-center justify-center border-y border-border text-[10px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-20 flex-col items-center justify-center border-y border-border px-3 py-5 text-center">
        <UserPlus className="h-4 w-4 text-muted-foreground" />

        <p className="mt-1 text-xs font-semibold">
          Unable to load referrals
        </p>

        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <div className="flex min-h-20 flex-col items-center justify-center border-y border-border px-3 py-5 text-center">
        <UserPlus className="h-4 w-4 text-muted-foreground" />

        <p className="mt-1 text-xs font-semibold">
          No Referrals Yet
        </p>

        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Share your referral link to invite users.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-2.5 py-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <UserPlus className="h-3 w-3" />
        </div>

        <span className="text-xs font-semibold">
          Referral Network
        </span>
      </div>

      <div className="divide-y divide-border">
        {referrals.map((referral) => {
          const user = referral.referredUserId;

          const initials = (
            user?.username || 'U'
          )
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={referral._id}
              className="px-2.5 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-semibold text-primary">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium">
                      {user?.username ??
                        'Unknown User'}
                    </p>

                    <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[9px] text-muted-foreground">
                      <span className="truncate">
                        {user?.email ?? 'No email'}
                      </span>

                      <span className="shrink-0">·</span>

                      <CalendarDays className="h-2.5 w-2.5 shrink-0" />

                      <span className="shrink-0">
                        {new Date(
                          referral.createdAt,
                        ).toLocaleDateString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: 'short',
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {referral.registered && (
                    <Status label="Registered" />
                  )}

                  {referral.regularSubscription && (
                    <Status label="Regular" />
                  )}

                  {referral.vipSubscription && (
                    <Status
                      label="VIP"
                      vip
                      icon={Crown}
                    />
                  )}

                  {referral.predictionPurchased && (
                    <Status
                      label="Purchased"
                      icon={ShoppingBag}
                    />
                  )}

                  {referral.vipSubscription && (
                    <Sparkles className="ml-0.5 h-3 w-3 text-primary" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Status({
  label,
  vip = false,
  icon: Icon,
}: {
  label: string;
  vip?: boolean;
  icon?: typeof Crown;
}) {
  return (
    <span
      className={`
        inline-flex
        h-5
        items-center
        gap-0.5
        rounded-md
        px-1.5
        text-[8px]
        font-medium
        ${
          vip
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            : 'bg-muted text-muted-foreground'
        }
      `}
    >
      {Icon && (
        <Icon className="h-2.5 w-2.5" />
      )}

      {label}
    </span>
  );
}