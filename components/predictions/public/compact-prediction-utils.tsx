import Image from 'next/image';

import type {
  PredictionMarketResult,
  PredictionUserResponse,
} from '@/types/prediction.types';

export type PredictionData = NonNullable<PredictionUserResponse['data']>;

export interface GeneralOutcome {
  key: 'home' | 'draw' | 'away';
  label: string;
  probability: number;
  odds?: number;
}

export function rowKey(row: PredictionUserResponse): string {
  return String(row.id ?? row._id ?? row.matchId);
}

export function formatTime(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Lagos',
  }).format(date);
}

export function formatOdds(value?: number | null): string {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 1) {
    return '—';
  }
  return value.toFixed(2);
}

export function getGeneralOutcomes(data: PredictionData): GeneralOutcome[] {
  const general = data.generalPrediction;
  if (!general) return [];

  return [
    { key: 'home', label: 'Home win', probability: general.home.probability, odds: general.home.odds },
    { key: 'draw', label: 'Draw', probability: general.draw.probability, odds: general.draw.odds },
    { key: 'away', label: 'Away win', probability: general.away.probability, odds: general.away.odds },
  ];
}

export function getTopGeneralOutcome(data: PredictionData): GeneralOutcome | null {
  const outcomes = getGeneralOutcomes(data);
  if (!outcomes.length) return null;
  return outcomes.reduce((best, current) => current.probability > best.probability ? current : best);
}

export function getPredictionLabel(
  data: PredictionData,
  homeTeam: string,
  awayTeam: string,
): string {
  const outcome = getTopGeneralOutcome(data);
  if (!outcome) return 'Prediction unavailable';
  if (outcome.key === 'home') return `Home win (${homeTeam})`;
  if (outcome.key === 'away') return `Away win (${awayTeam})`;
  return 'Draw';
}

export function getTipLabel(market: PredictionMarketResult): string {
  const marketName = String(market.market).toUpperCase();
  const selection = String(market.selection).toUpperCase();

  if (marketName === 'DOUBLE_CHANCE') {
    const labels: Record<string, string> = {
      HOME_DRAW: '1X', '1X': '1X', DRAW_AWAY: 'X2', X2: 'X2', HOME_AWAY: '12', '12': '12',
    };
    return labels[selection] ?? selection.replace(/_/g, ' ');
  }

  if (marketName === 'BOTH_TEAMS_TO_SCORE') {
    if (selection === 'YES') return 'BTTS';
    if (selection === 'NO') return 'No BTTS';
    return `BTTS ${selection.replace(/_/g, ' ')}`;
  }

  if (marketName === 'MATCH_RESULT') {
    const labels: Record<string, string> = { HOME: 'Home', DRAW: 'Draw', AWAY: 'Away' };
    return labels[selection] ?? selection.replace(/_/g, ' ');
  }

  if (marketName === 'TOTAL_GOALS') {
    const match = selection.match(/^(OVER|UNDER)[_ ]?(\d+(?:\.\d+)?)$/);
    if (match) return `${match[1] === 'OVER' ? 'Over' : 'Under'} ${match[2]}`;
    if (typeof market.line === 'number') return `${selection.includes('UNDER') ? 'Under' : 'Over'} ${market.line}`;
  }

  if (marketName === 'TEAM_TOTAL_GOALS') {
    const match = selection.match(/^(HOME|AWAY)[_ ](OVER|UNDER)[_ ]?(\d+(?:\.\d+)?)$/);
    if (match) return `${match[1] === 'HOME' ? 'Home' : 'Away'} ${match[2] === 'OVER' ? 'O' : 'U'}${match[3]}`;
    if (typeof market.line === 'number') {
      const team = market.scope === 'HOME' ? 'Home ' : market.scope === 'AWAY' ? 'Away ' : '';
      return `${team}${selection.includes('UNDER') ? 'Under' : 'Over'} ${market.line}`.trim();
    }
  }

  const readable = selection.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  return typeof market.line === 'number' ? `${readable} ${market.line}` : readable;
}

/** Actual combined bookmaker odds are shown only when every selected market has actual odds. */
export function getCombinedActualOdds(data: PredictionData): number | null {
  const markets = data.markets ?? [];
  if (!markets.length || !markets.every((market) => typeof market.odds === 'number' && Number.isFinite(market.odds) && market.odds > 1)) {
    return null;
  }

  const total = markets.reduce((product, market) => product * (market.odds as number), 1);
  return Number.isFinite(total) ? total : null;
}

type ProbabilityBarMetric = 'confidence' | 'probability';

function getBarColor(value: number, metric: ProbabilityBarMetric): string {
  // Confidence measures how strongly the engine supports a prediction.
  if (metric === 'confidence') {
    if (value >= 70) return '#16a34a'; // green: 70–100
    if (value >= 50) return '#eab308'; // yellow: 50–69
    if (value >= 35) return '#f97316'; // orange: 35–49
    return '#dc2626'; // red: 0–34
  }

  // Match-outcome probabilities use a different scale: 60% is already strong.
  if (value >= 50) return '#16a34a'; // green: 60–100
  if (value >= 35) return '#eab308'; // yellow: 45–59
  if (value >= 25) return '#f97316'; // orange: 30–44
  return '#dc2626'; // red: 0–29
}

export function ProbabilityBar({
  probability,
  metric = 'probability',
}: {
  probability: number;
  metric?: ProbabilityBarMetric;
}) {
  const value = Number.isFinite(probability) ? Math.max(0, Math.min(100, probability)) : 0;
  const color = getBarColor(value, metric);

  return (
    <div className="flex min-w-0 items-center gap-1">
      <div
        className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full"
        style={{ backgroundColor: 'var(--muted)' }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${metric === 'confidence' ? 'Confidence' : 'Probability'} ${Math.round(value)}%`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span
        className="shrink-0 text-[8px] font-semibold leading-none tabular-nums"
        style={{ color }}
      >
        {Math.round(value)}%
      </span>
    </div>
  );
}

function getTeamLogo(row: PredictionUserResponse, side: 'home' | 'away'): string | null {
  const record = row as unknown as Record<string, unknown>;
  const keys = side === 'home'
    ? ['homeTeamBadge', 'homeTeamLogo', 'homeBadge', 'homeLogo']
    : ['awayTeamBadge', 'awayTeamLogo', 'awayBadge', 'awayLogo'];

  for (const key of keys) {
    const candidate = record[key];
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }
  return null;
}

export function TeamLine({ name, logo }: { name: string; logo: string | null }) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center overflow-hidden">
        {logo ? (
          <Image src={logo} alt="" width={14} height={14} unoptimized className="h-3.5 w-3.5 object-contain" />
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        )}
      </span>
      <span className="truncate text-[9px] font-medium leading-tight sm:text-[10px]">{name}</span>
    </div>
  );
}

export function TeamMatchCell({ row }: { row: PredictionUserResponse }) {
  return (
    <div className="min-w-0 space-y-1">
      <TeamLine name={row.homeTeam} logo={getTeamLogo(row, 'home')} />
      <TeamLine name={row.awayTeam} logo={getTeamLogo(row, 'away')} />
    </div>
  );
}

export function LeagueCell({ row }: { row: PredictionUserResponse }) {
  const league = row.league as (typeof row.league & { emblem?: string }) | undefined;
  return (
    <div className="flex min-w-0 items-center gap-1">
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center overflow-hidden">
        {league?.emblem ? (
          <Image src={league.emblem} alt="" width={14} height={14} unoptimized className="h-3.5 w-3.5 object-contain" />
        ) : (
          <span className="h-2.5 w-2.5 rounded-full bg-muted" />
        )}
      </span>
      <span className="line-clamp-2 min-w-0 break-words text-[8px] font-medium leading-tight sm:text-[9px]" title={league?.name || row.leagueCode}>
        {league?.name || row.leagueCode}
      </span>
    </div>
  );
}
