'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Loader2, Trophy } from 'lucide-react';

import { useSportsCompetitions } from '@/hooks/use-sports';
import { getSettledWins } from '@/services/prediction.service';
import type { SettledWinPrediction } from '@/types/prediction.types';

import DateTabs from './DateTabs';
import LeagueSelector, { getCodeLeagueOptions } from './LeagueSelector';
import { dateKeyInLagos, formatShortDate, getDateKeyInLagos } from './date-utils';

export interface RecentWinsTableProps {
  title?: string;
  initialDate?: string;
  pastDays?: number;
  maxRows?: number;
  className?: string;
}

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

export function RecentWinsTable({
  title = 'Recent Wins',
  initialDate,
  pastDays = 6,
  maxRows,
  className = '',
}: RecentWinsTableProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? getDateKeyInLagos());
  const [selectedLeagueCode, setSelectedLeagueCode] = useState('');
  const winsQuery = useQuery({
    queryKey: ['predictions', 'settled-wins'],
    queryFn: getSettledWins,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
  const competitionsQuery = useSportsCompetitions({ activeOnly: true });

  const wonPredictions = useMemo(() => (winsQuery.data ?? [])
    .filter((prediction) => prediction.status === 'won' && prediction.settled === true && prediction.deleted !== true)
    .sort((a, b) => new Date(b.settledAt ?? b.matchDate).getTime() - new Date(a.settledAt ?? a.matchDate).getTime()), [winsQuery.data]);

  const leagueOptions = useMemo(
    () => getCodeLeagueOptions(wonPredictions.map(predictionLeagueCode), competitionsQuery.data ?? []),
    [wonPredictions, competitionsQuery.data],
  );
  const resolvedLeagueCode = leagueOptions.some((league) => league.id === selectedLeagueCode)
    ? selectedLeagueCode
    : leagueOptions[0]?.id ?? '';
  const filtered = wonPredictions.filter((prediction) =>
    dateKeyInLagos(prediction.settledAt ?? prediction.matchDate) === selectedDate
      && predictionLeagueCode(prediction) === resolvedLeagueCode,
  );
  const visible = maxRows ? filtered.slice(0, maxRows) : filtered;

  return (
    <section className={`min-w-0 rounded-lg border border-border/70 bg-card/60 ${className}`}>
      <div className="flex min-h-10 items-center justify-center gap-1.5 border-b border-border/60 px-2 py-2">
        <Trophy className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-center text-xs font-bold sm:text-sm">{title}</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="h-2.5 w-2.5" />Settled</span>
      </div>
      <div className="space-y-2 px-2 py-2 sm:px-3">
        <DateTabs value={selectedDate} onChange={setSelectedDate} pastDays={pastDays} futureDays={0} />
        {leagueOptions.length > 0 && (
          <LeagueSelector
            leagues={leagueOptions}
            selectedIds={resolvedLeagueCode ? [resolvedLeagueCode] : []}
            onChange={(ids) => setSelectedLeagueCode(ids[0] ?? '')}
          />
        )}
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[450px] border-collapse text-left text-[10px] leading-4 sm:text-[11px]">
          <thead className="bg-muted/60 text-[8px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[9px]">
            <tr>
              <th className="w-[52px] px-2 py-1.5">Date</th>
              <th className="px-2 py-1.5">Home</th>
              <th className="px-2 py-1.5">Away</th>
              <th className="px-2 py-1.5">Pick</th>
              <th className="w-[44px] px-2 py-1.5 text-right">Conf.</th>
              <th className="w-[42px] px-2 py-1.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {winsQuery.isLoading ? (
              <tr><td colSpan={6} className="px-2 py-5 text-center text-muted-foreground"><Loader2 className="mr-1.5 inline h-3.5 w-3.5 animate-spin" />Loading recent wins…</td></tr>
            ) : winsQuery.isError ? (
              <tr><td colSpan={6} className="px-2 py-5 text-center text-destructive">Recent wins could not be loaded.</td></tr>
            ) : visible.length === 0 ? (
              <tr><td colSpan={6} className="px-2 py-5 text-center text-muted-foreground">No won predictions for this league and date.</td></tr>
            ) : visible.map((prediction) => (
              <tr key={prediction.id ?? prediction._id ?? prediction.matchId} className="hover:bg-muted/30">
                <td className="whitespace-nowrap px-2 py-1.5 tabular-nums text-muted-foreground">{formatShortDate(prediction.settledAt ?? prediction.matchDate)}</td>
                <td className="max-w-[105px] truncate px-2 py-1.5 font-medium" title={prediction.homeTeam}>{prediction.homeTeam}</td>
                <td className="max-w-[105px] truncate px-2 py-1.5" title={prediction.awayTeam}>{prediction.awayTeam}</td>
                <td className="max-w-[140px] truncate px-2 py-1.5 font-semibold" title={readableSelection(prediction)}>{readableSelection(prediction)}</td>
                <td className="px-2 py-1.5 text-right font-bold tabular-nums">{Math.round(prediction.confidence)}%</td>
                <td className="px-2 py-1.5"><span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="h-2.5 w-2.5" />Won</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border/60 px-2 py-1.5 text-[9px] text-muted-foreground sm:px-3">{filtered.length} win{filtered.length === 1 ? '' : 's'} on the selected date</div>
    </section>
  );
}

export default RecentWinsTable;
