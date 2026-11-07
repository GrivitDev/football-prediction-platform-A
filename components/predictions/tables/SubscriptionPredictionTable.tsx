'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  LockKeyhole,
  Loader2,
  RefreshCw,
} from 'lucide-react';

import { usePredictionTables } from '@/hooks/use-predictions';
import type {
  PredictionPlan,
  PredictionUserResponse,
} from '@/types/prediction.types';
import DateTabs from '@/components/predictions/public/DateTabs';
import LeagueSelector, { type LeagueOption } from '@/components/predictions/public/LeagueSelector';
import {
  dateKeyInLagos,
  getDateKeyInLagos,
} from '@/components/predictions/public/date-utils';
import {
  formatOdds,
  formatTime,
  getCombinedActualOdds,
  getGeneralOutcomes,
  getPredictionLabel,
  getPublicSettlementSummary,
  getTipLabel,
  getTopGeneralOutcome,
  LeagueCell,
  MarketResultBadge,
  ProbabilityBar,
  rowKey,
  SettlementStatusBadge,
} from '@/components/predictions/public/compact-prediction-utils';

const ALL_LEAGUES_ID = '__all_leagues__';

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

function MatchStatusCell({ row }: { row: PredictionUserResponse }) {
  const status = row.matchStatus ?? 'UNKNOWN';
  const styles: Record<string, string> = {
    UPCOMING: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    LIVE: 'bg-red-500/10 text-red-600 dark:text-red-400',
    FINISHED: 'bg-muted text-muted-foreground',
    POSTPONED: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    CANCELLED: 'bg-destructive/10 text-destructive',
    UNKNOWN: 'bg-muted text-muted-foreground',
  };
  const labels: Record<string, string> = {
    UPCOMING: 'UPCOMING',
    LIVE: row.matchClock ? `LIVE ${row.matchClock}` : 'LIVE',
    FINISHED: 'FINISHED',
    POSTPONED: 'POSTPONED',
    CANCELLED: 'CANCELLED',
    UNKNOWN: '—',
  };

  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <span
        title={row.matchStatusDetail ?? labels[status] ?? 'Status unavailable'}
        className={`inline-flex max-w-full items-center gap-1 truncate rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-tight ${styles[status] ?? styles.UNKNOWN}`}
      >
        {status === 'LIVE' && (
          <span
            aria-hidden="true"
            className="h-1 w-1 shrink-0 animate-pulse rounded-full bg-current"
          />
        )}
        <span className="truncate">{labels[status] ?? '—'}</span>
      </span>
      <span className="whitespace-nowrap text-[9px] font-medium tabular-nums text-muted-foreground">
        {formatTime(row.matchDate)}
      </span>
    </div>
  );
}

function TeamScoreLine({
  name,
  badge,
  score,
}: {
  name: string;
  badge?: string;
  score: number | null | undefined;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      <span className="w-3 shrink-0 text-right text-[9px] font-bold tabular-nums text-foreground">
        {typeof score === 'number' && Number.isFinite(score) ? score : '—'}
      </span>
      <span className="flex h-3 w-3 shrink-0 items-center justify-center overflow-hidden">
        {badge ? (
          <Image
            src={badge}
            alt=""
            width={12}
            height={12}
            unoptimized
            className="h-3 w-3 object-contain"
          />
        ) : (
          <span className="h-2 w-2 rounded-full bg-muted" />
        )}
      </span>
      <span className="min-w-0 truncate text-[9px] font-medium leading-tight text-foreground">
        {name}
      </span>
    </div>
  );
}

function MatchTeamsCell({ row }: { row: PredictionUserResponse }) {
  return (
    <div className="min-w-0 space-y-1">
      <TeamScoreLine
        name={row.homeTeam}
        badge={row.homeTeamBadge}
        score={row.matchScore?.home}
      />
      <TeamScoreLine
        name={row.awayTeam}
        badge={row.awayTeamBadge}
        score={row.matchScore?.away}
      />
    </div>
  );
}

function CompactPredictionCell({
  data,
  row,
}: {
  data: PredictionData;
  row: PredictionUserResponse;
}) {
  const outcome = getTopGeneralOutcome(data);
  const label = getPredictionLabel(data, row.homeTeam, row.awayTeam);
  const probability = outcome?.probability ?? data.predictionProbability;
  const combinedOdds = getCombinedActualOdds(data);

  return (
    <div className="min-w-0 space-y-1">
      <p
        className="truncate text-[9px] font-semibold leading-tight text-foreground"
        title={label}
      >
        {label}
      </p>
      <div className="flex min-w-0 items-center gap-1 text-[9px] leading-tight text-muted-foreground">
        <span className="shrink-0 font-semibold tabular-nums text-foreground">
          {Math.round(probability)}%
        </span>
        <span className="shrink-0">·</span>
        <span className="truncate tabular-nums">
          {formatOdds(combinedOdds)} odds
        </span>
      </div>
      <ProbabilityBar probability={data.confidence} metric="confidence" />
    </div>
  );
}

function CompactTipsCell({ data }: { data: PredictionData }) {
  if (!data.markets?.length) {
    return <span className="text-[8px] text-muted-foreground">—</span>;
  }

  return (
    <div className="flex min-w-0 flex-wrap gap-0.5">
      {data.markets.map((market, index) => (
        <span
          key={`${market.market}-${market.selection}-${index}`}
          title={`${market.market}: ${market.selection} · ${market.status ?? 'pending'}`}
          className="inline-flex max-w-full min-w-0 items-center gap-0.5 rounded-sm border border-border/60 bg-muted/40 px-1 py-0.5 text-[9px] font-medium leading-tight"
        >
          <span className="min-w-0 truncate">{getTipLabel(market)}</span>
          <MarketResultBadge status={market.status} compact />
        </span>
      ))}
    </div>
  );
}

function LockedContent({
  plan,
  accessState,
}: {
  plan: PredictionPlan;
  accessState?: string;
}) {
  const loginRequired = accessState === 'login_required';

  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <span className="inline-flex items-center gap-1 text-[9px] text-muted-foreground">
        <LockKeyhole className="h-2.5 w-2.5 shrink-0" /> Locked
      </span>
      {loginRequired ? (
        <div className="flex flex-wrap gap-1">
          <Link
            href="/login"
            onClick={(event) => event.stopPropagation()}
            className="rounded border border-primary/30 bg-primary/5 px-1 py-0.5 text-[9px] font-semibold text-primary hover:bg-primary/10"
          >
            Log in
          </Link>
          <Link
            href="/register"
            onClick={(event) => event.stopPropagation()}
            className="rounded border border-border px-1 py-0.5 text-[9px] font-semibold hover:bg-muted"
          >
            register
          </Link>
        </div>
      ) : (
        <Link
          href="/pricing"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex max-w-full items-center gap-0.5 rounded border border-primary/30 bg-primary/5 px-1 py-0.5 text-[9px] font-semibold leading-tight text-primary hover:bg-primary/10"
        >
          <span className="truncate">
            {plan === 'free' ? 'View access' : `Upgrade ${PLAN_LABELS[plan]}`}
          </span>
          <ArrowUpRight className="h-2.5 w-2.5 shrink-0" />
        </Link>
      )}
    </div>
  );
}

function DetailCard({
  label,
  odds,
  probability,
}: {
  label: string;
  odds?: number | null;
  probability: number;
}) {
  return (
    <div className="min-w-0 rounded border border-border/50 bg-card px-1 py-1">
      <p className="truncate text-[9px] leading-tight" title={label}>
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
  const settlement = getPublicSettlementSummary(row);
  const hasSettlementProgress =
    settlement.state !== 'PENDING' || row.matchStatus === 'FINISHED';

  return (
    <div className="space-y-2 border-t border-border/50 bg-muted/20 p-1.5">
      {hasSettlementProgress && (
        <section className="flex flex-wrap items-center gap-1.5 rounded border border-border/50 bg-card/70 px-2 py-1.5">
          <span className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">
            Match result
          </span>
          <SettlementStatusBadge row={row} />
          {settlement.totalMarkets > 0 && (
            <span className="text-[8px] text-muted-foreground">
              {settlement.settledMarkets} of {settlement.totalMarkets} selected markets resolved
            </span>
          )}
          {settlement.scoreLabel && (
            <span className="ml-auto text-[9px] font-bold tabular-nums">
              Final score {settlement.scoreLabel}
            </span>
          )}
        </section>
      )}

      {outcomes.length > 0 && (
        <section className="space-y-1">
          <h4 className="px-0.5 text-[8px] font-semibold text-muted-foreground">
            General probability
          </h4>
          <div className="grid grid-cols-3 gap-1">
            {outcomes.map((outcome) => (
              <DetailCard
                key={outcome.key}
                label={outcome.label}
                odds={outcome.odds}
                probability={outcome.probability}
              />
            ))}
          </div>
        </section>
      )}

      {data.markets?.length > 0 && (
        <section className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-1 px-0.5">
            <h4 className="text-[8px] font-semibold text-muted-foreground">
              Selected tips and results
            </h4>
            <span className="text-[8px] text-muted-foreground">
              Each market is settled independently
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {data.markets.map((market, index) => (
              <div
                key={`${market.market}-${market.selection}-${index}`}
                className="flex min-w-0 items-center justify-between gap-1 rounded border border-border/50 bg-card px-1.5 py-1"
              >
                <div className="min-w-0">
                  <p
                    className="truncate text-[8px] font-medium leading-tight"
                    title={getTipLabel(market)}
                  >
                    {getTipLabel(market)}
                  </p>
                  <p className="mt-0.5 text-[7px] text-muted-foreground">
                    {formatOdds(market.odds)} odds · {Math.round(market.probability)}%
                  </p>
                </div>
                <MarketResultBadge status={market.status} />
              </div>
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
  const [selectedDate, setSelectedDate] = useState(
    initialDate ?? getDateKeyInLagos(),
  );
  const [selectedLeagueCodes, setSelectedLeagueCodes] = useState<string[]>([ALL_LEAGUES_ID]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(() => new Set());
  const predictionsQuery = usePredictionTables();

  // Fully settled predictions leave the active prediction tables. They are
  // presented separately in Recent Wins when their aggregate result is Won.
  // PARTIAL predictions remain here until every selected market is resolved.
  const planRows = useMemo(
    () =>
      (predictionsQuery.data ?? [])
        .filter(
          (row) =>
            row.accessType === plan &&
            row.settled !== true &&
            row.settlement?.state !== 'SETTLED',
        )
        .slice()
        .sort(
          (a, b) =>
            new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime(),
        ),
    [predictionsQuery.data, plan],
  );

  // Build this table's league selector from the active predictions for the
  // currently selected date and plan only. Other tiers and dates never leak
  // into this table's league list.
  const datedRows = useMemo(
    () => planRows.filter((row) => dateKeyInLagos(row.matchDate) === selectedDate),
    [planRows, selectedDate],
  );

  const leagueOptions = useMemo<LeagueOption[]>(() => {
    const byCode = new Map<string, string>();
    for (const row of datedRows) {
      const code = row.leagueCode || row.league?.code || 'OTHER';
      if (!byCode.has(code)) byCode.set(code, row.league?.name || code);
    }

    if (byCode.size === 0) return [];

    return [
      { id: ALL_LEAGUES_ID, label: 'All leagues', code: 'ALL', isAll: true },
      ...[...byCode.entries()].map(([id, label]) => ({ id, label })),
    ];
  }, [datedRows]);

  const availableLeagueIds = useMemo(
    () => new Set(leagueOptions.filter((league) => !league.isAll).map((league) => league.id)),
    [leagueOptions],
  );
  const resolvedSelectedLeagueCodes = selectedLeagueCodes.includes(ALL_LEAGUES_ID)
    ? [ALL_LEAGUES_ID]
    : selectedLeagueCodes.filter((code) => availableLeagueIds.has(code)).length > 0
      ? selectedLeagueCodes.filter((code) => availableLeagueIds.has(code))
      : [ALL_LEAGUES_ID];

  const filteredRows = resolvedSelectedLeagueCodes.includes(ALL_LEAGUES_ID)
    ? datedRows
    : datedRows.filter((row) =>
        resolvedSelectedLeagueCodes.includes(row.leagueCode || row.league?.code || 'OTHER'),
      );
  const visibleRows = maxRows ? filteredRows.slice(0, maxRows) : filteredRows;

  function toggleRow(id: string) {
    setExpandedRows((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleRowKeyDown(
    event: React.KeyboardEvent<HTMLTableRowElement>,
    id: string,
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target as HTMLElement;
      if (target.closest('a, button')) return;
      event.preventDefault();
      toggleRow(id);
    }
  }

  return (
    <section
      className={`min-w-0 overflow-hidden rounded-lg border border-border/70 bg-card/60 ${className}`}
    >
      <div className="flex min-w-0 items-center gap-1.5 border-b border-border/60 px-2 py-1.5">
        <span className="shrink-0 rounded bg-primary/10 px-1 py-0.5 text-[8px] font-bold uppercase text-primary">
          {PLAN_LABELS[plan]}
        </span>
        {plan === 'free' && (
          <span className="shrink-0 rounded border border-emerald-500/30 bg-emerald-500/10 px-1 py-0.5 text-[7px] font-semibold uppercase text-emerald-700 dark:text-emerald-400">
            Open to everyone
          </span>
        )}
        <h2 className="min-w-0 truncate text-[11px] font-bold">{title}</h2>
        <button
          type="button"
          onClick={() => void predictionsQuery.refetch()}
          aria-label={`Refresh ${title}`}
          className="ml-auto inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted"
        >
          <RefreshCw
            className={`h-3 w-3 ${predictionsQuery.isFetching ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {predictionsQuery.isLoading ? (
        <div className="px-3 py-6 text-center text-[10px] text-muted-foreground">
          <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />
          Loading predictions…
        </div>
      ) : predictionsQuery.isError ? (
        <div className="px-3 py-6 text-center text-[10px] text-destructive">
          Predictions could not be loaded. Try refreshing.
        </div>
      ) : (
        <>
          <div className="space-y-2 px-2 py-2">
            <DateTabs
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedLeagueCodes([ALL_LEAGUES_ID]);
                setExpandedRows(new Set());
              }}
              pastDays={pastDays}
              futureDays={futureDays}
            />
            {leagueOptions.length > 0 && (
              <LeagueSelector
                leagues={leagueOptions}
                selectedIds={resolvedSelectedLeagueCodes}
                onChange={setSelectedLeagueCodes}
                multiple
              />
            )}
          </div>

          {/* Five fixed columns are retained at every viewport width. */}
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[14%]" />
              <col className="w-[16%]" />
              <col className="w-[27%]" />
              <col className="w-[19%]" />
              <col className="w-[24%]" />
            </colgroup>
            <thead className="bg-muted/60 text-[9px] font-semibold uppercase tracking-tight text-muted-foreground">
              <tr>
                <th className="px-1 py-1.5">Status / Time</th>
                <th className="px-1 py-1.5">League</th>
                <th className="px-1 py-1.5">Match</th>
                <th className="px-1 py-1.5">Prediction</th>
                <th className="px-1 py-1.5">Tips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-2 py-5 text-center text-[9px] text-muted-foreground"
                  >
                    No unsettled {PLAN_LABELS[plan].toLowerCase()} predictions for this date.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => {
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
                        <td className="min-w-0 px-1 py-1.5 align-middle">
                          <MatchStatusCell row={row} />
                        </td>
                        <td className="min-w-0 px-1 py-1.5 align-middle">
                          <LeagueCell row={row} />
                        </td>
                        <td className="min-w-0 px-1 py-1.5 align-middle">
                          <MatchTeamsCell row={row} />
                        </td>
                        <td className="min-w-0 px-1 py-1.5 align-middle">
                          {data ? (
                            <CompactPredictionCell data={data} row={row} />
                          ) : (
                            <LockedContent
                              plan={row.accessType}
                              accessState={row.access?.state}
                            />
                          )}
                        </td>
                        <td className="min-w-0 px-1 py-1.5 align-middle">
                          {data ? (
                            <CompactTipsCell data={data} />
                          ) : (
                            <span className="text-[7px] text-muted-foreground">Locked</span>
                          )}
                        </td>
                      </tr>
                      {expanded && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            {data ? (
                              <ExpandedPredictionDetails row={row} />
                            ) : (
                              <div className="space-y-1 border-t border-border/50 bg-muted/20 p-2">
                                <p className="text-[9px] text-muted-foreground">
                                  {row.access?.state === 'login_required'
                                    ? 'Log in or create an account to access this subscription tier.'
                                    : 'Upgrade your subscription to access this prediction and its individual market results.'}
                                </p>
                                <SettlementStatusBadge row={row} />
                                <LockedContent
                                  plan={row.accessType}
                                  accessState={row.access?.state}
                                />
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between gap-2 border-t border-border/60 px-2 py-1.5 text-[8px] text-muted-foreground">
            <span>
              {filteredRows.length} active match{filteredRows.length === 1 ? '' : 'es'}
            </span>
            <span>{plan === 'free' ? 'Public access' : `${PLAN_LABELS[plan]} access`}</span>
          </div>
        </>
      )}
    </section>
  );
}

export default SubscriptionPredictionTable;
