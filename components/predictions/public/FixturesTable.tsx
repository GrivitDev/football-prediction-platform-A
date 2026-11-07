'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { CalendarDays, Loader2, RefreshCw } from 'lucide-react';

import sportsApi from '@/services/sports.service';
import type { ActiveCompetition, EspnFixtureRecord, EspnTeamRecord } from '@/types/sports';

import DateTabs from './DateTabs';
import LeagueSelector, { getCompetitionOptions, type LeagueOption } from './LeagueSelector';
import { getDateKeyInLagos, getLagosDayRange, formatDateTime } from './date-utils';

export interface FixturesTableProps {
  title?: string;
  initialDate?: string;
  /** Retained for compatibility. The table now defaults to All leagues. */
  initialCompetitionIds?: string[];
  dateTabsPastDays?: number;
  dateTabsFutureDays?: number;
  maxRows?: number;
  className?: string;
}

const ALL_LEAGUES_ID = '__all_leagues__';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

const UPCOMING_STATUSES = new Set([
  '',
  'PRE',
  'PREMATCH',
  'PRE_MATCH',
  'PRE_GAME',
  'PREGAME',
  'SCHEDULED',
  'STATUS_SCHEDULED',
  'STATUS_PRE',
  'STATUS_UPCOMING',
  'STATUS_NOT_STARTED',
  'UPCOMING',
  'NOT_STARTED',
  'NOTSTARTED',
  'NS',
  'FUTURE',
]);

const LIVE_STATUSES = new Set([
  'LIVE',
  'IN_PLAY',
  'INPLAY',
  'STATUS_IN_PROGRESS',
  'IN_PROGRESS',
  'INPROGRESS',
  'PAUSED',
  'HALFTIME',
  'HALF_TIME',
  'HT',
  '1H',
  '2H',
  'FIRST_HALF',
  'SECOND_HALF',
  '1ST_HALF',
  '2ND_HALF',
  'EXTRA_TIME',
  'ET',
  'PENALTIES',
  'PEN',
  'BREAK',
  'INTERMISSION',
]);

const FINISHED_STATUSES = new Set([
  'FINISHED',
  'FINAL',
  'FULL_TIME',
  'FULLTIME',
  'FT',
  'AET',
  'AFTER_EXTRA_TIME',
  'PENALTIES_FINISHED',
  'STATUS_FINAL',
  'COMPLETED',
]);

type FixtureDisplayState =
  | { kind: 'upcoming'; inferred: false }
  | { kind: 'live'; inferred: boolean; clock?: string }
  | { kind: 'finished'; inferred: boolean }
  | { kind: 'other'; inferred: false; label: string };

function normalizeFixtureStatus(status?: string | null): string {
  return String(status ?? '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');
}

function protectedStatusLabel(status: string): string | null {
  if (!status) return null;

  // These statuses must never be replaced by the local kickoff-time fallback.
  const protectedPatterns: Array<[RegExp, string]> = [
    [/CANCEL|CANCELL?ED|^CANC$/, 'Cancelled'],
    [/POSTPON|^PSTP?$/, 'Postponed'],
    [/ABANDON|^ABD$/, 'Abandoned'],
    [/SUSPEND|^SUSP$/, 'Suspended'],
    [/DELAY/, 'Delayed'],
    [/INTERRUPT/, 'Interrupted'],
    [/NO_CONTEST/, 'No contest'],
    [/WALKOVER/, 'Walkover'],
    [/AWARDED/, 'Awarded'],
    [/VOID/, 'Void'],
  ];

  for (const [pattern, label] of protectedPatterns) {
    if (pattern.test(status)) return label;
  }

  return null;
}

function getFixtureDisplayState(
  fixture: EspnFixtureRecord,
  now: number,
): FixtureDisplayState {
  const status = normalizeFixtureStatus(fixture.status);
  const protectedLabel = protectedStatusLabel(status);

  if (protectedLabel) {
    return { kind: 'other', inferred: false, label: protectedLabel };
  }

  if (fixture.completed || FINISHED_STATUSES.has(status)) {
    return { kind: 'finished', inferred: false };
  }

  const kickoff = new Date(fixture.fixtureDate).getTime();
  const kickoffIsValid = Number.isFinite(kickoff);
  const elapsedMs = kickoffIsValid ? now - kickoff : -1;
  const isBackendLive = fixture.live || LIVE_STATUSES.has(status);
  const isBackendUpcoming = UPCOMING_STATUSES.has(status);

  // A live/upcoming fixture still unresolved six hours after kickoff is
  // displayed as finished locally. Its backend record is not modified.
  if (
    kickoffIsValid &&
    elapsedMs >= SIX_HOURS_MS &&
    (isBackendLive || isBackendUpcoming)
  ) {
    return { kind: 'finished', inferred: true };
  }

  if (isBackendLive) {
    const calculatedMinutes = kickoffIsValid && elapsedMs >= 0
      ? `${Math.floor(elapsedMs / 60_000)}'`
      : undefined;

    return {
      kind: 'live',
      inferred: false,
      clock: fixture.displayClock?.trim() || calculatedMinutes,
    };
  }

  if (isBackendUpcoming) {
    if (kickoffIsValid && elapsedMs >= 0) {
      return {
        kind: 'live',
        inferred: true,
        clock: `${Math.floor(elapsedMs / 60_000)}'`,
      };
    }

    return { kind: 'upcoming', inferred: false };
  }

  // Preserve unfamiliar provider statuses instead of incorrectly marking
  // those matches as live or finished.
  if (!status) return { kind: 'upcoming', inferred: false };

  const label = status
    .replace(/^STATUS_/, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return { kind: 'other', inferred: false, label: label || 'Unknown' };
}

function uniqueFixtures(fixtures: EspnFixtureRecord[]): EspnFixtureRecord[] {
  const byId = new Map<string, EspnFixtureRecord>();

  for (const fixture of fixtures) {
    const old = byId.get(fixture.eventId);
    if (!old || fixture.live || fixture.completed) {
      byId.set(fixture.eventId, fixture);
    }
  }

  return [...byId.values()].sort(
    (a, b) => new Date(a.fixtureDate).getTime() - new Date(b.fixtureDate).getTime(),
  );
}

function teamName(team: EspnTeamRecord | undefined, side: 'Home' | 'Away'): string {
  return team?.displayName?.trim() || team?.name?.trim() || `${side} team`;
}

function teamLogo(team: EspnTeamRecord | undefined): string | undefined {
  if (typeof team?.logo === 'string' && team.logo.trim()) return team.logo;
  if (Array.isArray(team?.logos)) {
    const firstLogo = team.logos[0];
    if (firstLogo && typeof firstLogo === 'object') {
      const href = (firstLogo as { href?: unknown }).href;
      if (typeof href === 'string' && href.trim()) return href;
    }
  }
  return undefined;
}

function competitionLogo(competition?: ActiveCompetition): string | undefined {
  const payload = competition?.espnPayload;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return undefined;

  const record = payload as Record<string, unknown>;
  if (typeof record.logo === 'string' && record.logo.trim()) return record.logo;

  if (record.logo && typeof record.logo === 'object' && !Array.isArray(record.logo)) {
    const href = (record.logo as Record<string, unknown>).href;
    if (typeof href === 'string' && href.trim()) return href;
  }

  if (Array.isArray(record.logos)) {
    const firstLogo = record.logos[0];
    if (firstLogo && typeof firstLogo === 'object') {
      const href = (firstLogo as Record<string, unknown>).href;
      if (typeof href === 'string' && href.trim()) return href;
    }
  }

  return undefined;
}

function TeamMark({ team, label }: { team?: EspnTeamRecord; label: string }) {
  const logo = teamLogo(team);

  return logo ? (
    <img
      src={logo}
      alt=""
      aria-hidden="true"
      className="h-3 w-3 shrink-0 object-contain sm:h-3.5 sm:w-3.5"
      loading="lazy"
    />
  ) : (
    <span
      aria-hidden="true"
      className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-muted text-[6px] font-bold text-muted-foreground sm:h-3.5 sm:w-3.5"
    >
      {label.slice(0, 1).toUpperCase()}
    </span>
  );
}

function FixtureStatus({ state }: { state: FixtureDisplayState }) {
  if (state.kind === 'live') {
    return (
      <span className="inline-flex max-w-full items-center gap-1 whitespace-nowrap rounded-full bg-red-500/10 px-1.5 py-0.5 text-[7px] font-bold leading-tight text-red-600 dark:text-red-400 sm:text-[8px]">
        <span className="h-1 w-1 shrink-0 animate-pulse rounded-full bg-red-500" />
        LIVE{state.clock ? ` ${state.clock}` : ''}
      </span>
    );
  }

  if (state.kind === 'finished') {
    return (
      <span className="inline-flex whitespace-nowrap rounded-full bg-muted px-1.5 py-0.5 text-[7px] font-semibold leading-tight text-muted-foreground sm:text-[8px]">
        Finished
      </span>
    );
  }

  if (state.kind === 'other') {
    return (
      <span
        className="inline-flex max-w-full whitespace-normal break-words rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[7px] font-semibold leading-tight text-amber-700 dark:text-amber-400 sm:text-[8px]"
        title={state.label}
      >
        {state.label}
      </span>
    );
  }

  return (
    <span className="inline-flex whitespace-nowrap rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[7px] font-semibold leading-tight text-emerald-700 dark:text-emerald-400 sm:text-[8px]">
      Upcoming
    </span>
  );
}

function LeagueCell({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      {logo ? (
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="h-3 w-3 shrink-0 object-contain sm:h-3.5 sm:w-3.5"
          loading="lazy"
        />
      ) : (
        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-muted" />
      )}
      <span
        className="min-w-0 break-words text-[8px] font-medium leading-tight text-foreground sm:text-[9px]"
        title={name}
      >
        {name}
      </span>
    </div>
  );
}

function MatchCell({
  fixture,
  home,
  away,
  displayState,
}: {
  fixture: EspnFixtureRecord;
  home?: EspnTeamRecord;
  away?: EspnTeamRecord;
  displayState: FixtureDisplayState;
}) {
  const homeFullName = teamName(home, 'Home');
  const awayFullName = teamName(away, 'Away');
  const hasScore =
    typeof fixture.homeScore === 'number' &&
    Number.isFinite(fixture.homeScore) &&
    typeof fixture.awayScore === 'number' &&
    Number.isFinite(fixture.awayScore);

  // When the status is inferred from kickoff time, use 0:0 if the provider
  // has not supplied a complete score yet.
  const scoreLabel = hasScore
    ? `${fixture.homeScore} : ${fixture.awayScore}`
    : displayState.inferred && (displayState.kind === 'live' || displayState.kind === 'finished')
      ? '0 : 0'
      : '- : -';

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1">
      <div className="flex min-w-0 items-center gap-0.5">
        <TeamMark team={home} label={homeFullName} />
        <span
          className="min-w-0 whitespace-normal break-words text-[7px] font-semibold leading-tight text-foreground sm:text-[9px]"
          title={homeFullName}
        >
          {homeFullName}
        </span>
      </div>

      <span
        className="shrink-0 whitespace-nowrap text-[8px] font-bold tabular-nums text-foreground sm:text-[9px]"
        aria-label={scoreLabel === '- : -' ? 'Score not available yet' : scoreLabel.replace(' : ', ' to ')}
      >
        {scoreLabel}
      </span>

      <div className="flex min-w-0 items-center justify-end gap-0.5">
        <span
          className="min-w-0 whitespace-normal break-words text-right text-[7px] font-medium leading-tight text-foreground sm:text-[9px]"
          title={awayFullName}
        >
          {awayFullName}
        </span>
        <TeamMark team={away} label={awayFullName} />
      </div>
    </div>
  );
}

export function FixturesTable({
  title = 'Fixtures',
  initialDate,
  dateTabsPastDays = 1,
  dateTabsFutureDays = 6,
  maxRows,
  className = '',
}: FixturesTableProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? getDateKeyInLagos());
  const [selectedLeagueId, setSelectedLeagueId] = useState(ALL_LEAGUES_ID);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

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
  const competitions = competitionsQuery.data ?? [];

  const competitionById = useMemo(
    () => new Map(competitions.map((competition) => [competition.competitionId, competition])),
    [competitions],
  );

  // Build league buttons from competitions that actually have fixtures for this date.
  // All is kept as the first option and is the default selection.
  const leagueOptions = useMemo((): LeagueOption[] => {
    const options = getCompetitionOptions(competitions);
    const leagueIdsWithFixtures = new Set(
      fixtures.map((fixture) => fixture.leagueId).filter((leagueId): leagueId is string => Boolean(leagueId)),
    );

    return [
      { id: ALL_LEAGUES_ID, label: 'All leagues', code: 'ALL', isAll: true },
      ...options.filter((league) => leagueIdsWithFixtures.has(league.id)),
    ];
  }, [competitions, fixtures]);

  const resolvedLeagueId =
    selectedLeagueId === ALL_LEAGUES_ID || leagueOptions.some((league) => league.id === selectedLeagueId)
      ? selectedLeagueId
      : ALL_LEAGUES_ID;

  const filtered = useMemo(
    () => resolvedLeagueId === ALL_LEAGUES_ID
      ? fixtures
      : fixtures.filter((fixture) => fixture.leagueId === resolvedLeagueId),
    [fixtures, resolvedLeagueId],
  );

  const visibleFixtures = maxRows ? filtered.slice(0, maxRows) : filtered;

  // Team records are stored per competition. In All mode, query only the
  // competitions represented in this date's fixtures; React Query caches each result.
  const teamCompetitionIds = useMemo(
    () => [...new Set(filtered.map((fixture) => fixture.leagueId).filter(Boolean))].sort(),
    [filtered],
  );

  const teamQueries = useQueries({
    queries: teamCompetitionIds.map((competitionId) => ({
      queryKey: ['public-football', 'teams-for-fixtures', competitionId],
      queryFn: () => sportsApi.getCompetitionTeams(competitionId),
      staleTime: 5 * 60_000,
    })),
  });

  const teamMap = useMemo(() => {
    const map = new Map<string, EspnTeamRecord>();
    teamQueries.forEach((query, index) => {
      const competitionId = teamCompetitionIds[index];
      for (const team of query.data ?? []) {
        map.set(`${competitionId}:${team.teamId}`, team);
      }
    });
    return map;
  }, [teamQueries, teamCompetitionIds]);

  const teamFor = (competitionId: string, teamId: string) =>
    teamMap.get(`${competitionId}:${teamId}`);

  return (
    <section className={`relative isolate min-w-0 rounded-lg border border-border/70 bg-card/60 ${className}`}>
      <div className="relative z-10 flex min-h-10 items-center justify-center border-b border-border/60 px-9 py-2">
        <h2 className="flex items-center gap-1.5 text-center text-xs font-bold sm:text-sm">
          <CalendarDays className="h-3.5 w-3.5 text-primary" />
          {title}
        </h2>

        <button
          type="button"
          onClick={() => {
            void fixturesQuery.refetch();
            void competitionsQuery.refetch();
          }}
          aria-label="Refresh fixtures"
          className="absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted"
        >
          <RefreshCw className={`h-3 w-3 ${fixturesQuery.isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative z-30 space-y-2 overflow-visible border-b border-border/60 px-2 py-2 sm:px-3">
        <DateTabs
          value={selectedDate}
          onChange={setSelectedDate}
          pastDays={dateTabsPastDays}
          futureDays={dateTabsFutureDays}
        />

        <div className="relative z-40 min-h-7 overflow-visible">
          <LeagueSelector
            leagues={leagueOptions}
            selectedIds={[resolvedLeagueId]}
            onChange={(ids) => setSelectedLeagueId(ids[0] ?? ALL_LEAGUES_ID)}
          />
        </div>
      </div>

      <div className="relative z-0 w-full">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[22%]" />
            <col className="w-[45%]" />
            <col className="w-[18%]" />
          </colgroup>

          <thead className="bg-muted/60 text-[7px] font-semibold uppercase tracking-tight text-muted-foreground sm:text-[8px]">
            <tr>
              <th className="px-1 py-1.5 font-semibold sm:px-2">Time</th>
              <th className="px-1 py-1.5 font-semibold sm:px-2">League</th>
              <th className="px-1 py-1.5 font-semibold sm:px-2">Match</th>
              <th className="px-1 py-1.5 font-semibold sm:px-2">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/50">
            {fixturesQuery.isLoading || competitionsQuery.isLoading ? (
              <tr>
                <td colSpan={4} className="px-2 py-5 text-center text-[9px] text-muted-foreground">
                  <Loader2 className="mr-1.5 inline h-3.5 w-3.5 animate-spin" />
                  Loading fixtures…
                </td>
              </tr>
            ) : fixturesQuery.isError ? (
              <tr>
                <td colSpan={4} className="px-2 py-5 text-center text-[9px] text-destructive">
                  Fixtures could not be loaded. Try refreshing.
                </td>
              </tr>
            ) : competitionsQuery.isError ? (
              <tr>
                <td colSpan={4} className="px-2 py-5 text-center text-[9px] text-destructive">
                  League information could not be loaded.
                </td>
              </tr>
            ) : visibleFixtures.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-2 py-5 text-center text-[9px] text-muted-foreground">
                  No fixtures scheduled for this date.
                </td>
              </tr>
            ) : (
              visibleFixtures.map((fixture) => {
                const home = teamFor(fixture.leagueId, fixture.homeTeamId);
                const away = teamFor(fixture.leagueId, fixture.awayTeamId);
                const competition = competitionById.get(fixture.leagueId);
                const displayState = getFixtureDisplayState(fixture, currentTime);

                return (
                  <tr key={fixture.eventId} className="transition-colors hover:bg-muted/30">
                    <td className="min-w-0 whitespace-nowrap px-1 py-2 text-[8px] tabular-nums text-muted-foreground sm:px-2 sm:text-[9px]">
                      {formatDateTime(fixture.fixtureDate)}
                    </td>

                    <td className="min-w-0 px-1 py-2 sm:px-2">
                      <LeagueCell
                        name={competition?.name || fixture.leagueId || 'Other'}
                        logo={competitionLogo(competition)}
                      />
                    </td>

                    <td className="min-w-0 px-1 py-2 sm:px-2">
                      <MatchCell fixture={fixture} home={home} away={away} displayState={displayState} />
                    </td>

                    <td className="min-w-0 px-1 py-2 sm:px-2">
                      <FixtureStatus state={displayState} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 px-2 py-1.5 text-[9px] text-muted-foreground sm:px-3">
        <span>
          {filtered.length} fixture{filtered.length === 1 ? '' : 's'}
        </span>
        {teamQueries.some((query) => query.isFetching) && <span>Loading teams…</span>}
      </div>
    </section>
  );
}

export default FixturesTable;
