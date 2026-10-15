'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Loader2, RefreshCw } from 'lucide-react';

import sportsApi from '@/services/sports.service';
import type { EspnFixtureRecord, EspnTeamRecord } from '@/types/sports';

import DateTabs from './DateTabs';
import LeagueSelector, { getCompetitionOptions } from './LeagueSelector';
import { getDateKeyInLagos, getLagosDayRange, formatDateTime } from './date-utils';

export interface FixturesTableProps {
  title?: string;
  initialDate?: string;
  initialCompetitionIds?: string[];
  dateTabsPastDays?: number;
  dateTabsFutureDays?: number;
  maxRows?: number;
  className?: string;
}

function uniqueFixtures(fixtures: EspnFixtureRecord[]): EspnFixtureRecord[] {
  const byId = new Map<string, EspnFixtureRecord>();
  for (const fixture of fixtures) {
    const old = byId.get(fixture.eventId);
    if (!old || fixture.live || fixture.completed) byId.set(fixture.eventId, fixture);
  }
  return [...byId.values()].sort(
    (a, b) => new Date(a.fixtureDate).getTime() - new Date(b.fixtureDate).getTime(),
  );
}

function teamName(team: EspnTeamRecord | undefined, side: 'Home' | 'Away') {
  return team?.displayName || team?.name || team?.shortName || `${side} team`;
}

function TeamMark({ team, label }: { team?: EspnTeamRecord; label: string }) {
  const logo = team?.logo || (Array.isArray(team?.logos)
    ? (team.logos[0] as { href?: string } | undefined)?.href
    : undefined);

  return logo ? (
    <img src={logo} alt="" aria-hidden="true" className="h-3.5 w-3.5 shrink-0 object-contain" loading="lazy" />
  ) : (
    <span aria-hidden="true" className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-muted text-[7px] font-bold text-muted-foreground">
      {label.slice(0, 1).toUpperCase()}
    </span>
  );
}

function FixtureStatus({ fixture }: { fixture: EspnFixtureRecord }) {
  if (fixture.live || fixture.status?.toUpperCase() === 'IN_PLAY' || fixture.status?.toUpperCase() === 'PAUSED') {
    return (
      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-red-500/10 px-1.5 py-0.5 text-[8px] font-bold text-red-600 dark:text-red-400">
        <span className="h-1 w-1 animate-pulse rounded-full bg-red-500" />
        LIVE{fixture.displayClock ? ` ${fixture.displayClock}` : ''}
      </span>
    );
  }

  if (fixture.completed || fixture.status?.toUpperCase() === 'FINISHED') {
    return <span className="whitespace-nowrap rounded-full bg-muted px-1.5 py-0.5 text-[8px] font-semibold text-muted-foreground">FT</span>;
  }

  return <span className="whitespace-nowrap rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-700 dark:text-emerald-400">Upcoming</span>;
}

export function FixturesTable({
  title = 'Fixtures',
  initialDate,
  initialCompetitionIds = [],
  dateTabsPastDays = 1,
  dateTabsFutureDays = 6,
  maxRows,
  className = '',
}: FixturesTableProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? getDateKeyInLagos());
  const [selectedLeagueId, setSelectedLeagueId] = useState(initialCompetitionIds[0] ?? '');

  const competitionsQuery = useQuery({
    queryKey: ['public-football', 'competitions'],
    queryFn: () => sportsApi.getCompetitions({ activeOnly: true }),
    staleTime: 5 * 60_000,
  });

  const fixturesQuery = useQuery({
    queryKey: ['public-football', 'fixtures', selectedDate],
    queryFn: async () => {
      const { from, to } = getLagosDayRange(selectedDate);
      const [upcoming, live] = await Promise.all([
        sportsApi.getUpcomingFixtures({ from, to }),
        sportsApi.getLiveFixtures({ from, to }),
      ]);
      return uniqueFixtures([...upcoming, ...live]);
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const fixtures = fixturesQuery.data ?? [];

  // Only offer competitions that actually have at least one fixture on the selected date.
  // The fixture query is date-scoped, so this list updates whenever the selected date changes.
  const leagueOptions = useMemo(() => {
    const options = getCompetitionOptions(competitionsQuery.data ?? []);
    const leagueIdsWithFixtures = new Set(
      fixtures.map((fixture) => fixture.leagueId).filter((leagueId): leagueId is string => Boolean(leagueId)),
    );

    return options.filter((league) => leagueIdsWithFixtures.has(league.id));
  }, [competitionsQuery.data, fixtures]);

  const resolvedLeagueId = leagueOptions.some((league) => league.id === selectedLeagueId)
    ? selectedLeagueId
    : leagueOptions[0]?.id ?? '';

  const teamMapsQuery = useQuery({
    queryKey: ['public-football', 'teams-for-fixtures', resolvedLeagueId],
    enabled: Boolean(resolvedLeagueId),
    queryFn: async () => sportsApi.getCompetitionTeams(resolvedLeagueId),
    staleTime: 5 * 60_000,
  });

  const filtered = useMemo(
    () => fixtures.filter((fixture) => fixture.leagueId === resolvedLeagueId),
    [fixtures, resolvedLeagueId],
  );
  const visibleFixtures = maxRows ? filtered.slice(0, maxRows) : filtered;
  const teams = teamMapsQuery.data ?? [];
  const teamFor = (teamId: string) => teams.find((team) => team.teamId === teamId);

  return (
    <section className={`min-w-0 rounded-lg border border-border/70 bg-card/60 ${className}`}>
      <div className="relative flex min-h-10 items-center justify-center border-b border-border/60 px-9 py-2">
        <h2 className="flex items-center gap-1.5 text-center text-xs font-bold sm:text-sm">
          <CalendarDays className="h-3.5 w-3.5 text-primary" />{title}
        </h2>
        <button
          type="button"
          onClick={() => { void fixturesQuery.refetch(); void competitionsQuery.refetch(); }}
          aria-label="Refresh fixtures"
          className="absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
        >
          <RefreshCw className={`h-3 w-3 ${fixturesQuery.isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2 px-2 py-2 sm:px-3">
        <DateTabs
          value={selectedDate}
          onChange={setSelectedDate}
          pastDays={dateTabsPastDays}
          futureDays={dateTabsFutureDays}
        />

        {fixturesQuery.isLoading || competitionsQuery.isLoading ? (
          <p className="py-1 text-center text-[10px] text-muted-foreground">
            <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />Loading leagues for this date…
          </p>
        ) : fixturesQuery.isError ? (
          <p className="py-1 text-center text-[10px] text-destructive">Fixtures could not be loaded.</p>
        ) : competitionsQuery.isError ? (
          <p className="py-1 text-center text-[10px] text-destructive">League information could not be loaded.</p>
        ) : leagueOptions.length > 0 ? (
          <LeagueSelector
            leagues={leagueOptions}
            selectedIds={resolvedLeagueId ? [resolvedLeagueId] : []}
            onChange={(ids) => setSelectedLeagueId(ids[0] ?? '')}
          />
        ) : (
          <p className="py-1 text-center text-[10px] text-muted-foreground">No leagues have matches on this date.</p>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[390px] border-collapse text-left text-[10px] leading-4 sm:text-[11px]">
          <thead className="bg-muted/60 text-[8px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[9px]">
            <tr>
              <th className="w-[58px] px-2 py-1.5 font-semibold">Time</th>
              <th className="px-2 py-1.5 font-semibold">Home</th>
              <th className="px-2 py-1.5 font-semibold">Away</th>
              <th className="w-[64px] px-2 py-1.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {fixturesQuery.isLoading ? (
              <tr><td colSpan={4} className="px-2 py-5 text-center text-muted-foreground"><Loader2 className="mr-1.5 inline h-3.5 w-3.5 animate-spin" />Loading fixtures…</td></tr>
            ) : fixturesQuery.isError ? (
              <tr><td colSpan={4} className="px-2 py-5 text-center text-destructive">Fixtures could not be loaded. Try refreshing.</td></tr>
            ) : !resolvedLeagueId ? (
              <tr><td colSpan={4} className="px-2 py-5 text-center text-muted-foreground">No fixtures scheduled for this date.</td></tr>
            ) : visibleFixtures.length === 0 ? (
              <tr><td colSpan={4} className="px-2 py-5 text-center text-muted-foreground">No fixtures for this league and date.</td></tr>
            ) : visibleFixtures.map((fixture) => {
              const home = teamFor(fixture.homeTeamId);
              const away = teamFor(fixture.awayTeamId);
              const homeName = teamName(home, 'Home');
              const awayName = teamName(away, 'Away');
              const hasScore = fixture.homeScore !== undefined && fixture.homeScore !== null && fixture.awayScore !== undefined && fixture.awayScore !== null;

              return (
                <tr key={fixture.eventId} className="transition-colors hover:bg-muted/30">
                  <td className="whitespace-nowrap px-2 py-1.5 tabular-nums text-muted-foreground">{formatDateTime(fixture.fixtureDate)}</td>
                  <td className="max-w-[150px] px-2 py-1.5">
                    <div className="flex min-w-0 items-center gap-1">
                      <TeamMark team={home} label={homeName} />
                      <span className="max-w-[120px] truncate font-medium" title={homeName}>{homeName}</span>
                      {hasScore && <span className="ml-auto font-bold tabular-nums">{fixture.homeScore}</span>}
                    </div>
                  </td>
                  <td className="max-w-[150px] px-2 py-1.5">
                    <div className="flex min-w-0 items-center gap-1">
                      <TeamMark team={away} label={awayName} />
                      <span className="max-w-[120px] truncate" title={awayName}>{awayName}</span>
                      {hasScore && <span className="ml-auto font-bold tabular-nums">{fixture.awayScore}</span>}
                    </div>
                  </td>
                  <td className="px-2 py-1.5"><FixtureStatus fixture={fixture} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 px-2 py-1.5 text-[9px] text-muted-foreground sm:px-3">
        <span>{filtered.length} fixture{filtered.length === 1 ? '' : 's'}</span>
        {teamMapsQuery.isFetching && <span>Loading teams…</span>}
      </div>
    </section>
  );
}

export default FixturesTable;
