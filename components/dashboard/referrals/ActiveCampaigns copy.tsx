'use client';

import { useQuery } from '@tanstack/react-query';

import {
  CheckCircle2,
  Crown,
  Gift,
  Target,
  Trophy,
  Wallet,
} from 'lucide-react';

import {
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import {
  getMyPromoProgress,
} from '@/services/promos.service';

export function ActiveCampaigns() {
  const {
    data: campaigns = [],
    isLoading,
  } = useQuery({
    queryKey: ['promo-progress'],
    queryFn: getMyPromoProgress,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-16 items-center justify-center rounded-lg border border-border bg-card text-[10px] text-muted-foreground">
        Loading campaigns...
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 px-4 py-6 text-center">
        <Gift className="h-4 w-4 text-muted-foreground" />

        <p className="mt-1.5 text-xs font-semibold">
          No Active Campaigns
        </p>

        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Join a campaign to start tracking your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {campaigns.map((campaign: any) => {
        const percentage =
          campaign.targetCount > 0
            ? Math.min(
                100,
                Math.round(
                  (campaign.currentProgress /
                    campaign.targetCount) *
                    100,
                ),
              )
            : 0;

        const completed =
          Boolean(campaign.completed);

        return (
          <div
            key={campaign.promoId}
            className="overflow-hidden rounded-lg border border-border bg-card"
          >
            <CardHeader className="border-b border-border px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex min-w-0 items-center gap-2 text-xs font-semibold">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Gift className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate">
                      {campaign.name}
                    </p>

                    <p className="mt-0.5 text-[9px] font-normal text-muted-foreground">
                      Promotional campaign
                    </p>
                  </div>
                </CardTitle>

                <Badge
                  variant="outline"
                  className={`
                    shrink-0
                    rounded-md
                    px-1.5
                    py-0
                    text-[8px]
                    font-medium
                    ${
                      completed
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-primary/20 bg-primary/10 text-primary'
                    }
                  `}
                >
                  {completed
                    ? 'Completed'
                    : 'Active'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-2.5 p-3">
              <p className="line-clamp-2 text-[10px] leading-4 text-muted-foreground">
                {campaign.description ||
                  'Complete the campaign requirements to unlock your reward.'}
              </p>

              <div className="rounded-md border border-border bg-muted/10 px-2.5 py-2">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Target className="h-3 w-3 text-primary" />

                    <span className="text-[10px] font-medium text-muted-foreground">
                      Progress
                    </span>
                  </div>

                  <span className="text-xs font-semibold tabular-nums">
                    {campaign.currentProgress}
                    <span className="font-normal text-muted-foreground">
                      /{campaign.targetCount}
                    </span>
                  </span>
                </div>

                <div className="h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
                  <span>
                    {percentage}% complete
                  </span>

                  <span>
                    {campaign.remainingToNextReward}{' '}
                    remaining
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                <InfoCard
                  icon={Target}
                  title="Completed"
                  value={campaign.currentProgress}
                  iconClass="bg-primary/10 text-primary"
                />

                <InfoCard
                  icon={Trophy}
                  title="Claims"
                  value={campaign.completedClaims}
                  iconClass="bg-amber-500/10 text-amber-500"
                />

                <InfoCard
                  icon={
                    campaign.rewardType === 'cash'
                      ? Wallet
                      : Crown
                  }
                  title="Reward"
                  value={
                    campaign.rewardType === 'cash'
                      ? `₦${Number(
                          campaign.rewardAmount || 0,
                        ).toLocaleString('en-NG')}`
                      : campaign.rewardPlan ||
                        'Subscription'
                  }
                  iconClass="bg-emerald-500/10 text-emerald-500"
                />

                <InfoCard
                  icon={Gift}
                  title="To Next"
                  value={
                    campaign.remainingToNextReward
                  }
                  iconClass="bg-violet-500/10 text-violet-500"
                />
              </div>

              {completed && (
                <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold">
                      Campaign completed
                    </p>

                    <p className="text-[9px] text-muted-foreground">
                      Your reward has been unlocked.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        );
      })}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  value,
  iconClass,
}: {
  icon: any;
  title: string;
  value: string | number;
  iconClass: string;
}) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-muted/10 p-2">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-md ${iconClass}`}
      >
        <Icon className="h-3 w-3" />
      </div>

      <p className="mt-1.5 truncate text-[9px] font-medium text-muted-foreground">
        {title}
      </p>

      <p className="mt-0.5 truncate text-xs font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}