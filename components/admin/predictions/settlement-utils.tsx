import type {
  AdminPrediction,
  PredictionMatchStatus,
  PredictionSettlementState,
} from '@/types/prediction.types';

type SettlementOverview = {
  state: PredictionSettlementState;
  settledMarkets: number;
  totalMarkets: number;
  label: string;
  needsSettlement: boolean;
};

const MATCH_STATUS_LABELS: Record<PredictionMatchStatus, string> = {
  UPCOMING: 'Upcoming',
  LIVE: 'Live',
  FINISHED: 'Finished',
  POSTPONED: 'Postponed',
  CANCELLED: 'Cancelled',
  UNKNOWN: 'Unknown',
};

const MATCH_STATUS_TONES: Record<PredictionMatchStatus, string> = {
  UPCOMING: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  LIVE: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
  FINISHED: 'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300',
  POSTPONED: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  CANCELLED: 'border-destructive/20 bg-destructive/10 text-destructive',
  UNKNOWN: 'border-border bg-muted text-muted-foreground',
};

function scoreText(prediction: AdminPrediction): string | null {
  const home = prediction.matchScore?.home;
  const away = prediction.matchScore?.away;
  if (typeof home !== 'number' || typeof away !== 'number') return null;
  return `${home}–${away}`;
}

export function getAdminMatchStatus(
  prediction: AdminPrediction,
): PredictionMatchStatus {
  return prediction.matchStatus ?? 'UNKNOWN';
}

export function getSettlementOverview(
  prediction: AdminPrediction,
): SettlementOverview {
  const markets = Array.isArray(prediction.markets) ? prediction.markets : [];
  const calculatedSettledMarkets = markets.filter(
    (market) => market.status && market.status !== 'pending',
  ).length;
  const snapshot = prediction.settlementSnapshot;
  const totalMarkets = Math.max(0, snapshot?.totalMarkets ?? markets.length);
  const settledMarkets = Math.min(
    totalMarkets,
    Math.max(0, snapshot?.settledMarkets ?? calculatedSettledMarkets),
  );

  const state: PredictionSettlementState = prediction.settled
    ? 'SETTLED'
    : snapshot?.state ?? (settledMarkets > 0 ? 'PARTIAL' : 'PENDING');

  const matchStatus = getAdminMatchStatus(prediction);
  const kickoffTimestamp =
    typeof prediction.kickoffTimestamp === 'number' &&
    Number.isFinite(prediction.kickoffTimestamp)
      ? prediction.kickoffTimestamp
      : new Date(prediction.matchDate).getTime();
  const automaticSettlementEligible =
    Number.isFinite(kickoffTimestamp) &&
    Date.now() >= kickoffTimestamp + 3 * 60 * 60 * 1000;
  const needsSettlement =
    matchStatus === 'FINISHED' &&
    !prediction.settled &&
    automaticSettlementEligible;
  const finishedBeforeAutoWindow =
    matchStatus === 'FINISHED' &&
    !prediction.settled &&
    !automaticSettlementEligible;

  const label =
    state === 'SETTLED'
      ? 'Settled'
      : state === 'PARTIAL'
        ? `Partial · ${settledMarkets}/${totalMarkets}`
        : needsSettlement
          ? 'Awaiting settlement'
          : finishedBeforeAutoWindow
            ? 'Finished · within 3h window'
            : 'Pending';

  return {
    state,
    settledMarkets,
    totalMarkets,
    label,
    needsSettlement,
  };
}

export function MatchStatusBadge({
  prediction,
  compact = false,
}: {
  prediction: AdminPrediction;
  compact?: boolean;
}) {
  const status = getAdminMatchStatus(prediction);
  const score = scoreText(prediction);
  const label =
    status === 'LIVE'
      ? ['Live', prediction.matchClock, score].filter(Boolean).join(' · ')
      : status === 'FINISHED'
        ? [score, 'FT'].filter(Boolean).join(' · ')
        : MATCH_STATUS_LABELS[status];

  return (
    <span
      title={prediction.matchStatusDetail ?? MATCH_STATUS_LABELS[status]}
      className={`inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 font-semibold ${MATCH_STATUS_TONES[status]} ${compact ? 'text-[9px]' : 'text-[10px]'}`}
    >
      {status === 'LIVE' && (
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-current" />
      )}
      <span className="truncate">{label}</span>
    </span>
  );
}

export function SettlementStatusBadge({
  prediction,
  compact = false,
}: {
  prediction: AdminPrediction;
  compact?: boolean;
}) {
  const settlement = getSettlementOverview(prediction);
  const tone =
    settlement.state === 'SETTLED'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      : settlement.state === 'PARTIAL'
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400'
        : settlement.needsSettlement
          ? 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400'
          : 'border-border bg-muted text-muted-foreground';

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 font-semibold ${tone} ${compact ? 'text-[9px]' : 'text-[10px]'}`}
    >
      {settlement.label}
    </span>
  );
}

export function marketStatusTone(status: string): string {
  switch (status) {
    case 'won':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    case 'lost':
      return 'bg-rose-500/10 text-rose-700 dark:text-rose-400';
    case 'void':
    case 'push':
      return 'bg-slate-500/10 text-slate-700 dark:text-slate-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function formatMatchStatusDetail(
  prediction: AdminPrediction,
): string {
  const status = getAdminMatchStatus(prediction);
  if (status === 'LIVE' && prediction.matchClock) {
    return `Live clock: ${prediction.matchClock}`;
  }
  return prediction.matchStatusDetail?.trim() || MATCH_STATUS_LABELS[status];
}
