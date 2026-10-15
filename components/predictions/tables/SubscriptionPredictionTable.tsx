'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown, LockKeyhole, Loader2, RefreshCw } from 'lucide-react';

import { usePredictionTables } from '@/hooks/use-predictions';
import type { PredictionPlan, PredictionUserResponse } from '@/types/prediction.types';
import DateTabs from '@/components/predictions/public/DateTabs';
import LeagueSelector from '@/components/predictions/public/LeagueSelector';
import { dateKeyInLagos, getDateKeyInLagos } from '@/components/predictions/public/date-utils';
import {
  formatOdds,
  formatTime,
  getCombinedActualOdds,
  getGeneralOutcomes,
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

export interface SubscriptionPredictionTableProps {
  plan: PredictionPlan;
  title?: string;
  className?: string;
  initialDate?: string;
  pastDays?: number;
  futureDays?: number;
  maxRows?: number;
}

function isUnauthorized(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const status = (error as { response?: { status?: unknown } }).response?.status;
  return status === 401 || status === 403;
}

function CompactPredictionCell({ data, row }: { data: PredictionData; row: PredictionUserResponse }) {
  const outcome = getTopGeneralOutcome(data);
  const label = getPredictionLabel(data, row.homeTeam, row.awayTeam);
  const probability = outcome?.probability ?? data.predictionProbability;

  return (
    <div className="min-w-0 space-y-1">
      <p className="truncate text-[9px] font-medium leading-tight sm:text-[10px]" title={label}>
        {label} <span className="font-semibold tabular-nums">{Math.round(probability)}%</span>
      </p>
      <ProbabilityBar probability={data.confidence} metric="confidence" />
    </div>
  );
}

function CompactTipsCell({ data }: { data: PredictionData }) {
  if (!data.markets?.length) return <span className="text-[9px] text-muted-foreground">—</span>;

  return (
    <div className="flex min-w-0 flex-wrap gap-0.5">
      {data.markets.map((market, index) => (
        <span
          key={`${market.market}-${market.selection}-${index}`}
          title={`${market.market}: ${market.selection}`}
          className="max-w-full truncate rounded-sm border border-border/60 bg-muted/40 px-1 py-0.5 text-[8px] font-medium leading-tight sm:text-[9px]"
        >
          {getTipLabel(market)}
        </span>
      ))}
    </div>
  );
}

function LockedContent({ plan }: { plan: PredictionPlan }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <span className="inline-flex items-center gap-1 text-[8px] text-muted-foreground">
        <LockKeyhole className="h-2.5 w-2.5 shrink-0" /> Locked
      </span>
      <Link
        href={plan === 'free' ? '/subscriptions' : '/subscriptions'}
        onClick={(event) => event.stopPropagation()}
        className="inline-flex max-w-full items-center gap-0.5 rounded border border-primary/30 bg-primary/5 px-1 py-0.5 text-[8px] font-semibold leading-tight text-primary hover:bg-primary/10"
      >
        <span className="truncate">{plan === 'free' ? 'View access' : `Upgrade ${PLAN_LABELS[plan]}`}</span>
        <ArrowUpRight className="h-2.5 w-2.5 shrink-0" />
      </Link>
    </div>
  );
}

function DetailCard({ label, odds, probability }: { label: string; odds?: number | null; probability: number }) {
  return (
    <div className="min-w-0 rounded border border-border/50 bg-card px-1 py-1">
      <p className="truncate text-[8px] leading-tight sm:text-[9px]" title={label}>
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground"> | </span>
        <span className="font-semibold tabular-nums">{formatOdds(odds)} odds</span>
        <span className="text-muted-foreground"> | </span>
        <span className="font-semibold tabular-nums">{Math.round(probability)}%</span>
      </p>
      <div className="mt-1">
        <ProbabilityBar probability={probability} metric="probability" />
      </div>
    </div>
  );
}

function ExpandedPredictionDetails({ row }: { row: PredictionUserResponse }) {
  const data = row.data;
  if (!data) return null;

  const outcomes = getGeneralOutcomes(data);

  return (
    <div className="space-y-1.5 border-t border-border/50 bg-muted/20 p-1.5 sm:p-2">
      {outcomes.length > 0 && (
        <section className="space-y-1">
          <h4 className="px-0.5 text-[8px] font-semibold text-muted-foreground sm:text-[9px]">General probability</h4>
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
            {outcomes.map((outcome) => (
              <DetailCard key={outcome.key} label={outcome.label} odds={outcome.odds} probability={outcome.probability} />
            ))}
          </div>
        </section>
      )}

      {data.markets?.length > 0 && (
        <section className="space-y-1">
          <h4 className="px-0.5 text-[8px] font-semibold text-muted-foreground sm:text-[9px]">Selected tips</h4>
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
            {data.markets.map((market, index) => (
              <DetailCard
                key={`${market.market}-${market.selection}-${index}`}
                label={getTipLabel(market)}
                odds={market.odds}
                probability={market.probability}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function SubscriptionPredictionTable({
  plan,
  title = `${PLAN_LABELS[plan]} Predictions`,
  className = '',
  initialDate,
  pastDays = 1,
  futureDays = 7,
  maxRows,
}: SubscriptionPredictionTableProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? getDateKeyInLagos());
  const [selectedLeagueCodes, setSelectedLeagueCodes] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set());
  const predictionsQuery = usePredictionTables();

  const planRows = useMemo(
    () => (predictionsQuery.data ?? [])
      .filter((row) => row.accessType === plan)
      .slice()
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime()),
    [predictionsQuery.data, plan],
  );

  const leagueOptions = useMemo(() => {
    const byCode = new Map<string, string>();
    for (const row of planRows) {
      const code = row.leagueCode || row.league?.code || 'OTHER';
      if (!byCode.has(code)) byCode.set(code, row.league?.name || code);
    }
    return [...byCode.entries()].map(([id, label]) => ({ id, label }));
  }, [planRows]);

  const datedRows = planRows.filter((row) => dateKeyInLagos(row.matchDate) === selectedDate);
  const filteredRows = selectedLeagueCodes.length
    ? datedRows.filter((row) => selectedLeagueCodes.includes(row.leagueCode || row.league?.code || 'OTHER'))
    : datedRows;
  const visibleRows = maxRows ? filteredRows.slice(0, maxRows) : filteredRows;
  const unauthenticated = predictionsQuery.isError && isUnauthorized(predictionsQuery.error);

  function toggleRow(id: string) {
    setExpandedRows((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleRowKeyDown(event: React.KeyboardEvent<HTMLTableRowElement>, id: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleRow(id);
    }
  }

  return (
    <section className={`min-w-0 overflow-hidden rounded-lg border border-border/70 bg-card/60 ${className}`}>
      <div className="flex min-w-0 items-center gap-1.5 border-b border-border/60 px-2 py-1.5 sm:px-3">
        <span className="shrink-0 rounded bg-primary/10 px-1 py-0.5 text-[8px] font-bold uppercase text-primary">{PLAN_LABELS[plan]}</span>
        <h2 className="min-w-0 truncate text-[11px] font-bold sm:text-sm">{title}</h2>
        <button
          type="button"
          onClick={() => void predictionsQuery.refetch()}
          aria-label={`Refresh ${title}`}
          className="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted"
        >
          <RefreshCw className={`h-3 w-3 ${predictionsQuery.isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {unauthenticated ? (
        <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
          <LockKeyhole className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold">Log in to view {PLAN_LABELS[plan].toLowerCase()} predictions</p>
          <div className="flex gap-2">
            <Link href="/login" className="rounded bg-primary px-2.5 py-1.5 text-[10px] font-semibold text-primary-foreground">Log in</Link>
            <Link href="/register" className="rounded border border-border px-2.5 py-1.5 text-[10px] font-semibold">Create account</Link>
          </div>
        </div>
      ) : predictionsQuery.isLoading ? (
        <div className="px-3 py-6 text-center text-[10px] text-muted-foreground"><Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />Loading predictions…</div>
      ) : predictionsQuery.isError ? (
        <div className="px-3 py-6 text-center text-[10px] text-destructive">Predictions could not be loaded. Try refreshing.</div>
      ) : (
        <>
          <div className="space-y-2 px-2 py-2 sm:px-3">
            <DateTabs
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedLeagueCodes([]);
                setExpandedRows(new Set());
              }}
              pastDays={pastDays}
              futureDays={futureDays}
            />
            {leagueOptions.length > 0 && (
              <LeagueSelector leagues={leagueOptions} selectedIds={selectedLeagueCodes} onChange={setSelectedLeagueCodes} multiple />
            )}
          </div>

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
              {visibleRows.length === 0 ? (
                <tr><td colSpan={6} className="px-2 py-5 text-center text-[9px] text-muted-foreground">No {PLAN_LABELS[plan].toLowerCase()} predictions for this date.</td></tr>
              ) : visibleRows.map((row) => {
                const id = rowKey(row);
                const expanded = expandedRows.has(id);
                const data = row.access?.allowed ? row.data : null;

                return (
                  <React.Fragment key={id}>
                    <tr
                      tabIndex={0}
                      role="button"
                      aria-expanded={expanded}
                      aria-label={`${row.homeTeam} versus ${row.awayTeam}. ${expanded ? 'Collapse' : 'Expand'} prediction details`}
                      onClick={() => toggleRow(id)}
                      onKeyDown={(event) => handleRowKeyDown(event, id)}
                      className="cursor-pointer align-middle hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary"
                    >
                      <td className="break-words px-1 py-1.5 text-[8px] tabular-nums text-muted-foreground sm:px-2 sm:text-[10px]">{formatTime(row.matchDate)}</td>
                      <td className="min-w-0 px-1 py-1.5 sm:px-2"><LeagueCell row={row} /></td>
                      <td className="min-w-0 px-1 py-1.5 sm:px-2"><TeamMatchCell row={row} /></td>
                      <td className="min-w-0 px-1 py-1.5 sm:px-2">
                        {data ? <CompactPredictionCell data={data} row={row} /> : <LockedContent plan={row.accessType} />}
                      </td>
                      <td className="min-w-0 px-1 py-1.5 sm:px-2">
                        {data ? <CompactTipsCell data={data} /> : <span className="text-[8px] text-muted-foreground">Locked</span>}
                      </td>
                      <td className="min-w-0 px-1 py-1.5 sm:px-2">
                        <div className="flex items-center justify-end gap-0.5 sm:justify-between">
                          <span className="whitespace-nowrap text-[8px] font-semibold tabular-nums sm:text-[10px]">{data ? `${formatOdds(getCombinedActualOdds(data))} odds` : '—'}</span>
                          {expanded ? <ChevronDown className="h-2.5 w-2.5 shrink-0 rotate-180 text-muted-foreground" /> : <ChevronDown className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />}
                        </div>
                      </td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={6} className="p-0">
                          {data ? <ExpandedPredictionDetails row={row} /> : (
                            <div className="border-t border-border/50 bg-muted/20 p-2">
                              <p className="mb-1 text-[9px] text-muted-foreground">Subscribe to access this prediction and its tips.</p>
                              <LockedContent plan={row.accessType} />
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between gap-2 border-t border-border/60 px-2 py-1.5 text-[8px] text-muted-foreground sm:px-3 sm:text-[9px]">
            <span>{filteredRows.length} match{filteredRows.length === 1 ? '' : 'es'}</span>
            <span>{PLAN_LABELS[plan]} access</span>
          </div>
        </>
      )}
    </section>
  );
}

export default SubscriptionPredictionTable;
