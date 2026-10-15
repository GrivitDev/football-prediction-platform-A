'use client';

import {
  Sparkles,
  TrendingUp,
} from 'lucide-react';

import { useDashboardStats } from '@/hooks/useDashboardStats';

import LoadingState from '@/components/dashboard/LoadingState';

import {
  DashboardSection,
  IdentityCard,
  PlanCard,
  TopPredictionsCard,
  PromosCard,
} from '@/components/dashboard';

import { InternalAds } from '@/components/ads/IntAds/InternalAds';
import { AdPage } from '@/constants/ads/ad-page';
import { AdPosition } from '@/constants/ads/ad-position';
import { DashboardAds } from '@/components/ads/ExtAds/positions/DashboardAds';

export default function DashboardPage() {
  const {
    loading,
    error,
    predictionError,
    promoError,
    user,
    subscription,
    topPredictions,
    availablePromos,
  } = useDashboardStats() as any;

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
        {error}
      </div>
    );
  }

  const currentPlan =
    subscription?.plan ?? 'free';

  return (
    <div className="min-w-0 max-w-full space-y-5 overflow-x-hidden">
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-primary">
              <Sparkles className="h-3 w-3" />
              Member Dashboard
            </div>

            <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              Welcome back, {user?.fullName || 'User'}
            </h1>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Manage your membership, predictions and account activity.
            </p>
          </div>

          <div className="flex w-fit shrink-0 items-center gap-2 rounded-md border border-border bg-background px-2.5 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>

            <div>
              <p className="text-[9px] text-muted-foreground">
                Account Status
              </p>

              <p className="text-xs font-medium capitalize">
                {currentPlan}
              </p>
            </div>
          </div>
        </div>
      </div>

      <IdentityCard
        name={user?.fullName}
        username={user?.username}
        email={user?.email}
        phoneNumber={user?.phoneNumber}
        plan={currentPlan}
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <PlanCard
          plan={currentPlan}
          startDate={subscription?.startDate}
          expiresAt={subscription?.expiryDate}
          revenue={subscription?.amount}
        />

        <DashboardSection
          title="Available Promos"
          subtitle="Campaigns available for your account"
        >
          {promoError ? (
            <div
              role="status"
              className="rounded-md border border-dashed border-border bg-muted/10 px-3 py-4 text-center text-[11px] text-muted-foreground"
            >
              {promoError}
            </div>
          ) : (
            <PromosCard items={availablePromos || []} />
          )}
        </DashboardSection>
      </div>

      <DashboardSection
        title="Top Predictions"
        subtitle="Highest confidence picks available today"
      >
        {predictionError ? (
          <div
            role="status"
            className="rounded-md border border-dashed border-border bg-muted/10 px-3 py-4 text-center text-[11px] text-muted-foreground"
          >
            {predictionError}
          </div>
        ) : (
          <TopPredictionsCard items={topPredictions || []} />
        )}
      </DashboardSection>

      <DashboardAds />

      <InternalAds
        page={AdPage.HOME}
        position={AdPosition.BOTTOM}
      />

      <InternalAds
        page={AdPage.HOME}
        position={AdPosition.POPUP}
      />
    </div>
  );
}
