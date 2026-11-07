'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { CheckCircle2, Loader2, Trophy } from 'lucide-react';

import { useSportsCompetitions } from '@/hooks/use-sports';
import { useSettledWins } from '@/hooks/use-predictions';
import type { SettledWinPrediction } from '@/types/prediction.types';
import DateTabs from './DateTabs';
import LeagueSelector, { getCodeLeagueOptions } from './LeagueSelector';
import { dateKeyInLagos, getDateKeyInLagos } from './date-utils';
import { formatTime } from './compact-prediction-utils';

export interface RecentWinsTableProps {
  title?: string;
  initialDate?: string;
  pastDays?: number;
  maxRows?: number;
  className?: string;
}

const ALL_LEAGUES_ID = '__ALL_LEAGUES__';

type SettlementScore = {
  home?: number;
  away?: number;
};

type SettledWinWithScore = SettledWinPrediction & {
  settlementSnapshot?: {
    score?: SettlementScore | null;
  };
};

function readableSelection(prediction: SettledWinPrediction): string {
  const selected = prediction.data?.prediction?.selection ?? prediction.prediction?.selection ?? '';
  const market = prediction.data?.prediction?.market ?? prediction.prediction?.market ?? '';
  const known: Record<string, string> = {
    HOME: 'Home', 1: 'Home', DRAW: 'Draw', X: 'Draw', AWAY: 'Away', 2: 'Away',
    YES: 'Yes', NO: 'No', OVER: 'Over', UNDER: 'Under',
  };
  let selection = known[selected.toUpperCase()];
  if (!selection) {
    selection = selected
      .replace(/^HOME_/, 'Home ')
      .replace(/^AWAY_/, 'Away ')
      .replace(/_/g, ' ')
      .replace(/\bOVER\b/g, 'Over')
      .replace(/\bUNDER\b/g, 'Under')
      .trim();
  }
  if (!market || ['MATCH_RESULT', 'RESULT', '1X2'].includes(market.toUpperCase())) return selection || '—';
  const marketLabel = market.toLowerCase().split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  return selection ? `${marketLabel}: ${selection}` : marketLabel;
}

function predictionLeagueCode(prediction: SettledWinPrediction): string {
  return String(prediction.leagueCode || prediction.league?.code || 'OTHER');
}

function MatchStatusCell({ prediction }: { prediction: SettledWinPrediction }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-1">
      <span className="inline-flex max-w-full items-center truncate rounded-full bg-muted px-1 py-0.5 text-[6px] font-bold leading-tight text-muted-foreground">
        FINISHED
      </span>
      <span className="whitespace-nowrap text-[8px] font-medium tabular-nums text-muted-foreground">
        {formatTime(prediction.matchDate)}
      </span>
    </div>
  );
}

function LeagueCell({ prediction }: { prediction: SettledWinPrediction }) {
  const league = prediction.league;
  const leagueName = league?.name || prediction.leagueCode || 'Other';

  return (
    <div className="flex min-w-0 items-center gap-1">
      <span className="flex h-3 w-3 shrink-0 items-center justify-center overflow-hidden">
        {league?.emblem ? (
          <Image
            src={league.emblem}
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
      <span
        className="line-clamp-2 min-w-0 break-words text-[8px] font-medium leading-tight"
        title={leagueName}
      >
        {leagueName}
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
  score?: number;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      <span className="w-3 shrink-0 text-right text-[8px] font-bold tabular-nums text-foreground">
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
      <span className="min-w-0 truncate text-[8px] font-medium leading-tight text-foreground" title={name}>
        {name}
      </span>
    </div>
  );
}

function HomeCell({ prediction }: { prediction: SettledWinPrediction }) {
  const score = (prediction as SettledWinWithScore).settlementSnapshot?.score;

  return (
    <div className="min-w-0 space-y-1">
      <TeamScoreLine
        name={prediction.homeTeam}
        badge={prediction.homeTeamBadge}
        score={score?.home}
      />
      <TeamScoreLine
        name={prediction.awayTeam}
        badge={prediction.awayTeamBadge}
        score={score?.away}
      />
    </div>
  );
}

function TipsCell({ prediction }: { prediction: SettledWinPrediction }) {
  const tip = readableSelection(prediction);

  return (
    <div className="flex min-w-0 flex-col items-start gap-0.5">
      <span className="inline-flex max-w-full items-center gap-0.5 whitespace-nowrap rounded-full bg-emerald-500/10 px-0.5 py-0.5 text-[7px] font-bold uppercase leading-tight text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />WON
      </span>
      <span className="block max-w-full truncate text-[8px] font-semibold leading-tight" title={tip}>
        {tip}
      </span>
    </div>
  );
}

export function RecentWinsTable({
  title = 'Recent Wins',
  initialDate,
  pastDays = 6,
  maxRows,
  className = '',
}: RecentWinsTableProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? getDateKeyInLagos());
  const [selectedLeagueCodes, setSelectedLeagueCodes] = useState<string[]>([ALL_LEAGUES_ID]);

  // Uses the shared query key and refresh policy so Recent Wins stays aligned
  // with the public prediction tables after automatic or manual settlement.
  const winsQuery = useSettledWins();
  const competitionsQuery = useSportsCompetitions({ activeOnly: true });

  const wonPredictions = useMemo(() => (winsQuery.data ?? [])
    .filter((prediction) => prediction.status === 'won' && prediction.settled === true && prediction.deleted !== true)
    .sort((a, b) => new Date(b.settledAt ?? b.matchDate).getTime() - new Date(a.settledAt ?? a.matchDate).getTime()), [winsQuery.data]);

  // Only leagues with at least one settled win on the selected date are
  // offered in this table's selector.
  const datedWins = useMemo(
    () => wonPredictions.filter(
      (prediction) => dateKeyInLagos(prediction.settledAt ?? prediction.matchDate) === selectedDate,
    ),
    [wonPredictions, selectedDate],
  );

  const leagueOptions = useMemo(() => [
    { id: ALL_LEAGUES_ID, label: 'All leagues', code: 'ALL', isAll: true },
    ...getCodeLeagueOptions(datedWins.map(predictionLeagueCode), competitionsQuery.data ?? []),
  ], [datedWins, competitionsQuery.data]);

  const availableLeagueCodes = useMemo(
    () => new Set(leagueOptions.filter((league) => !league.isAll).map((league) => league.id)),
    [leagueOptions],
  );

  const resolvedSelectedLeagueCodes = selectedLeagueCodes.includes(ALL_LEAGUES_ID)
    ? [ALL_LEAGUES_ID]
    : selectedLeagueCodes.filter((code) => availableLeagueCodes.has(code)).length > 0
      ? selectedLeagueCodes.filter((code) => availableLeagueCodes.has(code))
      : [ALL_LEAGUES_ID];

  const filtered = resolvedSelectedLeagueCodes.includes(ALL_LEAGUES_ID)
    ? datedWins
    : datedWins.filter((prediction) =>
        resolvedSelectedLeagueCodes.includes(predictionLeagueCode(prediction)),
      );
  const visible = maxRows ? filtered.slice(0, maxRows) : filtered;

  return (
    <section className={`min-w-0 overflow-hidden rounded-lg border border-border/70 bg-card/60 ${className}`}>
      <div className="flex min-h-10 items-center justify-center gap-1.5 border-b border-border/60 px-2 py-2">
        <Trophy className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-center text-xs font-bold sm:text-sm">{title}</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-2.5 w-2.5" />Settled
        </span>
      </div>

      <div className="space-y-2 px-2 py-2 sm:px-3">
        <DateTabs
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setSelectedLeagueCodes([ALL_LEAGUES_ID]);
          }}
          pastDays={pastDays}
          futureDays={0}
        />
        <LeagueSelector
          leagues={leagueOptions}
          selectedIds={resolvedSelectedLeagueCodes}
          onChange={setSelectedLeagueCodes}
          multiple
        />
      </div>

      <table className="w-full table-fixed border-collapse text-left">
        <colgroup>
          <col className="w-[15%]" />
          <col className="w-[22%]" />
          <col className="w-[35%]" />
          <col className="w-[28%]" />
        </colgroup>
        <thead className="bg-muted/60 text-[7px] font-semibold uppercase tracking-tight text-muted-foreground">
          <tr>
            <th className="py-0.5">Status</th>
            <th className="py-0.5">League</th>
            <th className="py-0.5">Home</th>
            <th className="py-0.5">Tips</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {winsQuery.isLoading ? (
            <tr><td colSpan={4} className="px-2 py-5 text-center text-[9px] text-muted-foreground"><Loader2 className="mr-1.5 inline h-3.5 w-3.5 animate-spin" />Loading recent wins…</td></tr>
          ) : winsQuery.isError ? (
            <tr><td colSpan={4} className="px-2 py-5 text-center text-[9px] text-destructive">Recent wins could not be loaded.</td></tr>
          ) : visible.length === 0 ? (
            <tr><td colSpan={4} className="px-2 py-5 text-center text-[9px] text-muted-foreground">No won predictions for this league and date.</td></tr>
          ) : visible.map((prediction) => (
            <tr key={prediction.id ?? prediction._id ?? prediction.matchId} className="align-middle hover:bg-muted/30">
              <td className="min-w-0 py-0.5 align-middle">
                <MatchStatusCell prediction={prediction} />
              </td>
              <td className="min-w-0 py-0.5 align-middle">
                <LeagueCell prediction={prediction} />
              </td>
              <td className="min-w-0 py-0.5 align-middle">
                <HomeCell prediction={prediction} />
              </td>
              <td className="min-w-0 py-0.5 align-middle">
                <TipsCell prediction={prediction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-border/60 px-2 py-1.5 text-[9px] text-muted-foreground sm:px-3">
        {filtered.length} win{filtered.length === 1 ? '' : 's'} on the selected date
      </div>
    </section>
  );
}

export default RecentWinsTable;
