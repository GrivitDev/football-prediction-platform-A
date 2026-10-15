'use client';

import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';

import HeroSection from '@/components/home-sections/hero/HeroSection';
import LatestNewsPreviewSection from '@/components/home-sections/news-preview/LatestNewsPreviewSection';
import LatestHighlightsPreviewSection from '@/components/home-sections/highlights-preview/LatestHighlightsPreviewSection';
import { InternalAds } from '@/components/ads/IntAds/InternalAds';
import { AdPage } from '@/constants/ads/ad-page';
import { AdPosition } from '@/constants/ads/ad-position';
import LatestArticlesSection from '@/components/articles/LatestArticlesSection';
import PricingSection from '@/components/pricing/PricingSection';
import RecentWinsTable from '@/components/predictions/public/RecentWinsTable';
import StandingsTable from '@/components/predictions/public/StandingsTable';
import FixturesTable from '@/components/predictions/public/FixturesTable';
import TodaysPredictions from '@/components/predictions/public/TodaysPredictions';

export default function HomePage() {
  const { user } = useAuth();
  const isLoading = false;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-3">
        <div className="flex flex-col items-center gap-8">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 animate-pulse rounded-full border border-primary/10" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-primary/60 border-t-primary" />
            <div className="absolute inset-2 animate-[spin_2.5s_linear_infinite_reverse] rounded-full border border-transparent border-b-primary/40 border-l-primary/20" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/5 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)]">
              <Image
                src="/logo.png"
                alt="honestpredict"
                width={64}
                height={64}
                priority
                className="h-14 w-14 object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              Fetching the latest football data
            </p>
            <div className="flex items-center gap-1.5" aria-label="Loading">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background text-foreground">
      <HeroSection />
<div className="px-6">

<TodaysPredictions
  isAuthenticated={Boolean(user)}
  maxRows={10}
  className="w-full"
/>
        <FixturesTable />

      <RecentWinsTable />
      <StandingsTable />
        <LatestArticlesSection />

              <LatestHighlightsPreviewSection />

      <LatestNewsPreviewSection />

      <PricingSection />

      <section className="px-2 py-5 sm:px-3 lg:py-7">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-border/60 bg-card/40 p-3 shadow-sm backdrop-blur-sm sm:p-4">
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              About Honest Predict
            </h2>

            <div className="mt-2 space-y-1 text-sm leading-5 text-muted-foreground sm:text-base">
              <p>
                Honest Predict is a football prediction and analysis platform built
                to make match insights clearer, more transparent, and easier to
                understand.
              </p>

              <p>
                We combine football data, statistical analysis, match context, and
                carefully developed prediction models to provide structured insights
                across football fixtures and markets.
              </p>

              <p>
                Our approach is simple: present predictions honestly, explain the
                reasoning behind them, and let users make their own decisions. No
                prediction is guaranteed, and every match carries uncertainty.
              </p>

              <p>
                From match predictions and market analysis to football articles and
                educational insights, Honest Predict aims to build a reliable
                football intelligence platform where information comes before hype.
              </p>
            </div>

            <div className="mt-3 border-t border-border/60 pt-3">
              <p className="text-sm font-semibold text-foreground">
                Honest Predict
              </p>
              <p className="text-sm text-muted-foreground">
                Clearer analysis. More informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
</div>
      <InternalAds page={AdPage.HOME} position={AdPosition.BOTTOM} />
    </main>
  );
}

