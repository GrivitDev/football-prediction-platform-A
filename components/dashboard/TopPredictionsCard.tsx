'use client';

import Image from 'next/image';

import {
  CalendarDays,
  ShieldCheck,
} from 'lucide-react';

import { DashboardCard } from '@/components/dashboard/shared/DashboardCard';

import { formatMatchTime } from '@/lib/formatMatchTime';

import type { PredictionItem } from './dashboard.types';

export function TopPredictionsCard({
  items = [],
}: {
  items?: PredictionItem[];
}) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/10 px-3 py-5 text-center text-xs text-muted-foreground">
        No predictions available today.
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => {
        const home =
          item.homeTeam || 'Home';

        const away =
          item.awayTeam || 'Away';

        return (
          <DashboardCard
            key={
              item.id ||
              item._id ||
              `${home}-${away}-${index}`
            }
            className="p-0"
          >
            <div className="p-3">
              <div className="flex items-center justify-center gap-2">
                {item.league?.emblem && (
                  <Image
                    src={item.league.emblem}
                    alt={
                      item.league.name ||
                      'League'
                    }
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                )}

                <div className="min-w-0 text-center">
                  <p className="truncate text-[10px] font-semibold">
                    {item.league?.name ||
                      'Football League'}
                  </p>

                  {item.league?.country && (
                    <p className="text-[9px] text-muted-foreground">
                      {item.league.country}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <TeamMini
                  name={home}
                  badge={item.homeTeamBadge}
                />

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-[9px] font-semibold text-muted-foreground">
                  VS
                </div>

                <TeamMini
                  name={away}
                  badge={item.awayTeamBadge}
                />
              </div>

              <div className="mt-3 space-y-2">
                <InfoCard
                  icon={
                    <CalendarDays className="h-3 w-3" />
                  }
                  label="Kickoff"
                  value={
                    item.matchDate
                      ? formatMatchTime(
                          item.matchDate,
                        )
                      : 'TBA'
                  }
                />

                <ConfidenceCard
                  confidence={Number(
                    item.confidence || 0,
                  )}
                />
              </div>
            </div>
          </DashboardCard>
        );
      })}
    </div>
  );
}

function TeamMini({
  name,
  badge,
}: {
  name: string;
  badge?: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
        {badge ? (
          <Image
            src={badge}
            alt={name}
            width={28}
            height={28}
            className="object-contain"
          />
        ) : (
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <p className="max-w-[80px] truncate text-center text-[10px] font-medium">
        {name}
      </p>
    </div>
  );
}

function ConfidenceCard({
  confidence,
}: {
  confidence: number;
}) {
  const value = Math.min(
    100,
    Math.max(0, confidence),
  );

  return (
    <div className="rounded-md border border-border bg-muted/20 p-2">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[9px] text-muted-foreground">
          Confidence
        </span>

        <span className="text-[10px] font-semibold text-emerald-500">
          {value}%
        </span>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-background/50 p-2">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] text-muted-foreground">
          {label}
        </p>

        <p className="truncate text-[10px] font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}
