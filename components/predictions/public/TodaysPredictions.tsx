'use client';

import Link from 'next/link';
import { ArrowUpRight, LockKeyhole, Loader2 } from 'lucide-react';

import { usePredictionTables } from '@/hooks/use-predictions';
import type { PredictionPlan, PredictionUserResponse } from '@/types/prediction.types';
import { dateKeyInLagos, getDateKeyInLagos } from '@/components/predictions/public/date-utils';
import {
  formatOdds,
  formatTime,
  getCombinedActualOdds,
  getPredictionLabel,
  getTipLabel,
  getTopGeneralOutcome,
  LeagueCell,
  ProbabilityBar,
  rowKey,
  TeamMatchCell,
} from '@/components/predictions/public/compact-prediction-utils';

const PLAN_LABELS: Record<PredictionPlan, string> = {
  free: 'Free',
  regular: 'Regular',
  vip: 'VIP',
  premium: 'Premium',
};

type PredictionData = NonNullable<PredictionUserResponse['data']>;

export interface TodaysPredictionsProps {
  className?: string;
  isAuthenticated: boolean;
  subscriptionPlan?: PredictionPlan | null;
  maxRows?: number;
}

function LockedPreview({ row, isAuthenticated }: { row: PredictionUserResponse; isAuthenticated: boolean }) {
  const href = isAuthenticated ? '/subscriptions' : '/register';
  const label = isAuthenticated ? `Upgrade ${PLAN_LABELS[row.accessType]}` : 'Register / Log in';

  return (
    <div className="flex min-w-0 flex-col items-start gap-0.5">
      <span className="inline-flex items-center gap-0.5 text-[8px] text-muted-foreground">
        <LockKeyhole className="h-2.5 w-2.5 shrink-0" /> Locked
      </span>
      <Link href={href} className="inline-flex max-w-full items-center gap-0.5 rounded border border-primary/30 bg-primary/5 px-1 py-0.5 text-[8px] font-semibold leading-tight text-primary hover:bg-primary/10">
        <span className="truncate">{label}</span>
        <ArrowUpRight className="h-2.5 w-2.5 shrink-0" />
      </Link>
    </div>
  );
}

function CompactPredictionCell({ data, row }: { data: PredictionData; row: PredictionUserResponse }) {
  const outcome = getTopGeneralOutcome(data);
  return (
    <div className="min-w-0 space-y-1">
      <p className="truncate text-[9px] font-medium leading-tight sm:text-[10px]" title={getPredictionLabel(data, row.homeTeam, row.awayTeam)}>
        {getPredictionLabel(data, row.homeTeam, row.awayTeam)}{' '}
        <span className="font-semibold tabular-nums">{Math.round(outcome?.probability ?? data.predictionProbability)}%</span>
      </p>
      <ProbabilityBar probability={data.confidence} metric="confidence" />
    </div>
  );
}

export function TodaysPredictions({
  className = '',
  isAuthenticated,
  maxRows = 10,
}: TodaysPredictionsProps) {
  const predictionsQuery = usePredictionTables();

  const todaysRows = (predictionsQuery.data ?? [])
    .filter((row) => dateKeyInLagos(row.matchDate) === getDateKeyInLagos())
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
    .slice(0, maxRows);

  return (
    <section className={`min-w-0 overflow-hidden rounded-lg border border-border/70 bg-card/60 ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-2 py-1.5 sm:px-3">
        <div className="min-w-0">
          <h2 className="text-xs font-bold sm:text-sm">Today&apos;s Predictions</h2>
          <p className="text-[8px] text-muted-foreground sm:text-[9px]">Today · Nigeria time</p>
        </div>
        <Link href="/predictions" className="shrink-0 text-[9px] font-semibold text-primary hover:underline sm:text-[10px]">View all</Link>
      </div>

      {predictionsQuery.isLoading ? (
        <div className="px-3 py-5 text-center text-[9px] text-muted-foreground"><Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />Loading predictions…</div>
      ) : predictionsQuery.isError ? (
        <div className="px-3 py-5 text-center text-[9px] text-destructive">Today&apos;s predictions could not be loaded.</div>
      ) : (
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[15%]" />
            <col className="w-[20%]" />
            <col className="w-[22%]" />
            <col className="w-[21%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead className="bg-muted/60 text-[7px] font-semibold uppercase tracking-tight text-muted-foreground sm:text-[9px]">
            <tr>
              <th className="px-1 py-1.5 sm:px-2">Time</th>
              <th className="px-1 py-1.5 sm:px-2">League</th>
              <th className="px-1 py-1.5 sm:px-2">Match</th>
              <th className="px-1 py-1.5 sm:px-2">Prediction</th>
              <th className="px-1 py-1.5 sm:px-2">Tips</th>
              <th className="px-1 py-1.5 text-right sm:px-2 sm:text-left">Odds</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {todaysRows.length === 0 ? (
              <tr><td colSpan={6} className="px-2 py-5 text-center text-[9px] text-muted-foreground">No predictions available for today.</td></tr>
            ) : todaysRows.map((row) => {
              const data = row.access?.allowed ? row.data : null;
              return (
                <tr key={rowKey(row)} className="align-middle">
                  <td className="break-words px-1 py-1.5 text-[8px] tabular-nums text-muted-foreground sm:px-2 sm:text-[10px]">{formatTime(row.matchDate)}</td>
                  <td className="min-w-0 px-1 py-1.5 sm:px-2"><LeagueCell row={row} /></td>
                  <td className="min-w-0 px-1 py-1.5 sm:px-2"><TeamMatchCell row={row} /></td>
                  <td className="min-w-0 px-1 py-1.5 sm:px-2">
                    {data ? <CompactPredictionCell data={data} row={row} /> : <LockedPreview row={row} isAuthenticated={isAuthenticated} />}
                  </td>
                  <td className="min-w-0 px-1 py-1.5 sm:px-2">
                    {data ? (
                      <div className="flex min-w-0 flex-wrap gap-0.5">
                        {data.markets.map((market, index) => (
                          <span key={`${market.market}-${market.selection}-${index}`} title={`${market.market}: ${market.selection}`} className="max-w-full truncate rounded-sm border border-border/60 bg-muted/40 px-1 py-0.5 text-[8px] font-medium leading-tight sm:text-[9px]">
                            {getTipLabel(market)}
                          </span>
                        ))}
                      </div>
                    ) : <span className="text-[8px] text-muted-foreground">Locked</span>}
                  </td>
                  <td className="min-w-0 px-1 py-1.5 text-right sm:px-2 sm:text-left">
                    <span className="whitespace-nowrap text-[8px] font-semibold tabular-nums sm:text-[10px]">{data ? `${formatOdds(getCombinedActualOdds(data))} odds` : '—'}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default TodaysPredictions;
