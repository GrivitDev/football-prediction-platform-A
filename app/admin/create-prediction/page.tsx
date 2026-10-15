'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trophy,
  Users,
  WandSparkles,
  X,
} from 'lucide-react';

import {
  sportsApi,
} from '@/services/sports.service';

import {
  createPrediction,
  getPredictions,
  type CreatePredictionPayload,
} from '@/services/prediction.service';

import type {
  ActiveCompetition,
  EspnFixtureRecord,
  EspnTeamRecord,
} from '@/types/sports';

import PredictionModal from '@/components/admin/predictions/prediction-modal';

// ============================================================
// TYPES
// ============================================================

interface PredictionFixture {
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamBadge?: string;
  awayTeamBadge?: string;
  fixtureDate: string;
  status: string;
  live: boolean;
  completed: boolean;
}

interface LeagueSummary {
  teams: EspnTeamRecord[];
  teamCount: number;
  fixtures: EspnFixtureRecord[];
}

interface DayOption {
  key: string;
  index: number;
  label: string;
  shortLabel: string;
  dateLabel: string;
  weekdayLabel: string;
  from: Date;
  to: Date;
}

type PriorityFilter =
  | 'ALL'
  | 'ELITE'
  | 'HIGH'
  | 'REGIONAL'
  | 'SELECTIVE';

type DateFilter =
  | 'ALL'
  | string;

// ============================================================
// CONSTANTS
// ============================================================

const FINAL_STATUSES = new Set([
  'FT',
  'AET',
  'PEN',
  'FINAL',
  'FINISHED',
  'COMPLETED',
  'POST',
  'STATUS_FINAL',
]);

function normalizeDirectFixtureStatus(value: unknown): string | null {
  if (typeof value === 'string') {
    const status = value.trim();
    return status || null;
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const keys = [
    'shortDetail',
    'detail',
    'shortDescription',
    'description',
    'displayName',
    'name',
    'state',
    'status',
    'type',
  ];

  for (const key of keys) {
    const candidate = record[key];
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
    if (candidate && typeof candidate === 'object') {
      const nested = normalizeDirectFixtureStatus(candidate);
      if (nested) return nested;
    }
  }

  return null;
}

const PRIORITY_ORDER: Record<string, number> = {
  ELITE: 1,
  HIGH: 2,
  REGIONAL: 3,
  SELECTIVE: 4,
};

const PRIORITY_FILTERS: Array<{
  key: PriorityFilter;
  label: string;
}> = [
  {
    key: 'ALL',
    label: 'All',
  },
  {
    key: 'ELITE',
    label: 'Elite',
  },
  {
    key: 'HIGH',
    label: 'High',
  },
  {
    key: 'REGIONAL',
    label: 'Regional',
  },
  {
    key: 'SELECTIVE',
    label: 'Selective',
  },
];

// Today + 7 days = 8 calendar days.
const DAY_COUNT = 8;

// ============================================================
// ESPN IMAGE LOADER
// ============================================================

function espnImageLoader({
  src,
}: {
  src: string;
}) {
  return src;
}

// ============================================================
// DATE HELPERS
// ============================================================

function getDateKey(
  date: Date,
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, '0');

  const day =
    String(
      date.getDate(),
    ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDayStart(
  date: Date,
) {
  const result =
    new Date(date);

  result.setHours(
    0,
    0,
    0,
    0,
  );

  return result;
}

function getDayEnd(
  date: Date,
) {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() + 1,
  );

  result.setHours(
    0,
    0,
    0,
    0,
  );

  return result;
}

function addDays(
  date: Date,
  days: number,
) {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() + days,
  );

  return result;
}

function formatDate(
  value?: string | Date,
) {
  if (!value) {
    return '—';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '—';
  }

  return date.toLocaleDateString(
    'en-NG',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  );
}

function formatDateTime(
  value: string,
) {
  const date =
    new Date(value);

  return {
    date:
      date.toLocaleDateString(
        'en-NG',
        {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        },
      ),

    time:
      date.toLocaleTimeString(
        'en-NG',
        {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        },
      ),
  };
}

// ============================================================
// ACTIVE COMPETITION HELPERS
// ============================================================

function extractLeagueCountry(
  competition?: ActiveCompetition,
) {
  const payload =
    competition?.espnPayload;

  if (
    !payload ||
    typeof payload !== 'object'
  ) {
    return undefined;
  }

  const record =
    payload as Record<
      string,
      unknown
    >;

  const country =
    record.country;

  if (
    typeof country === 'string' &&
    country.trim()
  ) {
    return country.trim();
  }

  if (
    country &&
    typeof country === 'object' &&
    !Array.isArray(country)
  ) {
    const countryRecord =
      country as Record<
        string,
        unknown
      >;

    for (const key of [
      'name',
      'displayName',
      'abbreviation',
    ]) {
      const value =
        countryRecord[key];

      if (
        typeof value === 'string' &&
        value.trim()
      ) {
        return value.trim();
      }
    }
  }

  return undefined;
}

function extractLeagueLogo(
  competition?: ActiveCompetition,
) {
  const payload =
    competition?.espnPayload;

  if (
    !payload ||
    typeof payload !== 'object'
  ) {
    return undefined;
  }

  const record =
    payload as Record<
      string,
      unknown
    >;

  if (
    typeof record.logo === 'string'
  ) {
    return record.logo;
  }

  if (
    record.logo &&
    typeof record.logo === 'object' &&
    !Array.isArray(record.logo)
  ) {
    const logo =
      record.logo as Record<
        string,
        unknown
      >;

    if (
      typeof logo.href === 'string'
    ) {
      return logo.href;
    }
  }

  const logos =
    Array.isArray(record.logos)
      ? record.logos
      : [];

  const firstLogo =
    logos[0];

  if (
    firstLogo &&
    typeof firstLogo === 'object'
  ) {
    const logo =
      firstLogo as Record<
        string,
        unknown
      >;

    if (
      typeof logo.href === 'string'
    ) {
      return logo.href;
    }
  }

  return undefined;
}

function getPriorityLabel(
  priority?: string,
) {
  if (!priority) {
    return 'Selective';
  }

  return (
    priority.charAt(0) +
    priority
      .slice(1)
      .toLowerCase()
  );
}

function getStatusLabel(
  status?: string,
) {
  if (!status) {
    return 'Active';
  }

  return status
    .replace(/_/g, ' ')
    .replace(
      /\b\w/g,
      (value) =>
        value.toUpperCase(),
    );
}

function getPriorityClasses(
  priority?: string,
) {
  switch (
    String(priority)
      .toUpperCase()
  ) {
    case 'ELITE':
      return 'bg-primary/10 text-primary border-primary/15';

    case 'HIGH':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/15';

    case 'REGIONAL':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/15';

    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

// ============================================================
// TEAM EXTRACTION
// ============================================================

function getTeamFromPayload(
  fixture: EspnFixtureRecord,
  side: 'home' | 'away',
) {
  const payload =
    fixture.payload as unknown as Record<
      string,
      unknown
    >;

  const competitions =
    Array.isArray(
      payload?.competitions,
    )
      ? payload.competitions
      : [];

  const competition =
    competitions[0] &&
    typeof competitions[0] ===
      'object'
      ? (
          competitions[0] as Record<
            string,
            unknown
          >
        )
      : undefined;

  const competitors =
    Array.isArray(
      competition?.competitors,
    )
      ? competition.competitors
      : [];

  const competitor =
    competitors.find(
      (item) =>
        item &&
        typeof item === 'object' &&
        (
          item as Record<
            string,
            unknown
          >
        ).homeAway === side,
    ) ??
    competitors[
      side === 'home'
        ? 0
        : 1
    ];

  if (
    !competitor ||
    typeof competitor !==
      'object'
  ) {
    return {
      name:
        side === 'home'
          ? 'Home Team'
          : 'Away Team',

      badge: undefined,
    };
  }

  const record =
    competitor as Record<
      string,
      unknown
    >;

  const team =
    record.team &&
    typeof record.team ===
      'object'
      ? (
          record.team as Record<
            string,
            unknown
          >
        )
      : record;

  const name =
    typeof team.displayName ===
    'string'
      ? team.displayName
      : typeof team.name ===
          'string'
        ? team.name
        : typeof team.shortDisplayName ===
            'string'
          ? team.shortDisplayName
          : side === 'home'
            ? 'Home Team'
            : 'Away Team';

  let badge:
    | string
    | undefined;

  if (
    typeof team.logo ===
    'string'
  ) {
    badge =
      team.logo;
  }

  if (
    !badge &&
    Array.isArray(
      team.logos,
    )
  ) {
    const firstLogo =
      team.logos[0];

    if (
      firstLogo &&
      typeof firstLogo ===
        'object' &&
      typeof (
        firstLogo as Record<
          string,
          unknown
        >
      ).href === 'string'
    ) {
      badge =
        (
          firstLogo as Record<
            string,
            unknown
          >
        ).href as string;
    }
  }

  return {
    name,
    badge,
  };
}

function buildTeamMap(
  teams: EspnTeamRecord[],
) {
  const map =
    new Map<
      string,
      {
        name: string;
        badge?: string;
      }
    >();

  for (const team of teams) {
    const id =
      String(
        team.teamId,
      );

    if (!id) {
      continue;
    }

    const name =
      team.name ||
      team.displayName ||
      team.shortName ||
      'Team';

    let badge =
      team.logo;

    if (
      !badge &&
      Array.isArray(
        team.logos,
      )
    ) {
      const firstLogo =
        team.logos[0];

      if (
        typeof firstLogo === 'object' &&
        firstLogo !== null &&
        'href' in firstLogo &&
        typeof (
          firstLogo as {
            href?: unknown;
          }
        ).href === 'string'
      ) {
        badge = (
          firstLogo as {
            href: string;
          }
        ).href;
      }
    }

    map.set(
      id,
      {
        name,
        badge,
      },
    );
  }

  return map;
}

function normalizeFixture(
  fixture: EspnFixtureRecord,
  teamMap: Map<
    string,
    {
      name: string;
      badge?: string;
    }
  >,
): PredictionFixture {
  const payloadHome =
    getTeamFromPayload(
      fixture,
      'home',
    );

  const payloadAway =
    getTeamFromPayload(
      fixture,
      'away',
    );

  const home =
    teamMap.get(
      String(
        fixture.homeTeamId,
      ),
    ) ??
    payloadHome;

  const away =
    teamMap.get(
      String(
        fixture.awayTeamId,
      ),
    ) ??
    payloadAway;

  return {
    eventId:
      fixture.eventId,

    homeTeam:
      home.name,

    awayTeam:
      away.name,

    homeTeamBadge:
      home.badge,

    awayTeamBadge:
      away.badge,

    fixtureDate:
      fixture.fixtureDate,

    status:
      fixture.statusShortDetail ??
      fixture.statusDetail ??
      'Scheduled',

    live:
      Boolean(
        fixture.live,
      ),

    completed:
      Boolean(
        fixture.completed,
      ) ||
      FINAL_STATUSES.has(
        String(
          fixture.status ??
            '',
        )
          .trim()
          .toUpperCase(),
      ),
  };
}

// ============================================================
// FIXTURE HELPERS
// ============================================================

function getFixtureState(
  fixture: PredictionFixture,
) {
  if (fixture.live) {
    return 'Live';
  }

  if (fixture.completed) {
    return 'Finished';
  }

  const kickoff =
    new Date(
      fixture.fixtureDate,
    );

  if (
    kickoff.getTime() >
    Date.now()
  ) {
    return 'Upcoming';
  }

  return 'In Play';
}

function getFixtureStateClasses(
  state: string,
) {
  if (state === 'Live') {
    return 'bg-blue-500/10 text-blue-600';
  }

  if (state === 'Finished') {
    return 'bg-muted text-muted-foreground';
  }

  if (state === 'Upcoming') {
    return 'bg-emerald-500/10 text-emerald-600';
  }

  return 'bg-amber-500/10 text-amber-600';
}

// ============================================================
// DIRECT UPCOMING FIXTURE FETCH
// ============================================================
//
// The public Sports contract already supports competition + date
// filtering. The UI therefore reads one league at a time instead of
// building a large admin fixture index.

async function fetchUpcomingFixturesForLeague({
  from,
  to,
  leagueId,
  teamId,
}: {
  from: Date;
  to: Date;
  leagueId: string;
  teamId?: string;
}) {
  return sportsApi.getUpcomingFixtures({
    competitionId: leagueId,
    teamId,
    from,
    to,
  });
}


async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
) {
  if (!items.length) {
    return;
  }

  let cursor = 0;

  const workerCount = Math.min(
    Math.max(1, concurrency),
    items.length,
  );

  await Promise.all(
    Array.from(
      { length: workerCount },
      async () => {
        while (true) {
          const index = cursor++;

          if (index >= items.length) {
            return;
          }

          await worker(items[index]);
        }
      },
    ),
  );
}

// ============================================================
// PAGE
// ============================================================

export default function CreatePredictionPage() {
  const todayKey =
    getDateKey(
      new Date(),
    );

  const [
    selectedLeague,
    setSelectedLeague,
  ] = useState('');

  const [
    selectedTeamId,
    setSelectedTeamId,
  ] = useState('');

  const [
    selectedDayKey,
    setSelectedDayKey,
  ] = useState<DateFilter>(
    todayKey,
  );

  const [
    priorityFilter,
    setPriorityFilter,
  ] =
    useState<PriorityFilter>(
      'ALL',
    );

  const [
    dateFilter,
    setDateFilter,
  ] =
    useState<DateFilter>(
      'ALL',
    );

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    generalTeamFilter,
    setGeneralTeamFilter,
  ] = useState('');

  const [
    selectedMatch,
    setSelectedMatch,
  ] =
    useState<PredictionFixture | null>(
      null,
    );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    existingPredictionMatchIds,
    setExistingPredictionMatchIds,
  ] = useState<Set<string>>(() => new Set());

  const [
    predictionLookupStatus,
    setPredictionLookupStatus,
  ] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;

    getPredictions()
      .then(predictions => {
        if (!active) return;

        setExistingPredictionMatchIds(
          new Set(
            predictions
              .map(prediction => String(prediction.matchId))
              .filter(Boolean),
          ),
        );
        setPredictionLookupStatus('ready');
      })
      .catch(error => {
        if (!active) return;

        console.error('Unable to check existing predictions:', error);
        setPredictionLookupStatus('error');
        toast.error(
          'Unable to verify existing predictions. Refresh the page and try again.',
        );
      });

    return () => {
      active = false;
    };
  }, []);

  // ==========================================================
  // DAY OPTIONS
  // ==========================================================

  const dayOptions =
    useMemo<DayOption[]>(
      () => {
        const today =
          getDayStart(
            new Date(),
          );

        return Array.from(
          {
            length:
              DAY_COUNT,
          },
          (_, index) => {
            const date =
              addDays(
                today,
                index,
              );

            const key =
              getDateKey(
                date,
              );

            const weekday =
              date.toLocaleDateString(
                'en-NG',
                {
                  weekday:
                    'long',
                },
              );

            const weekdayShort =
              date.toLocaleDateString(
                'en-NG',
                {
                  weekday:
                    'short',
                },
              );

            const dateLabel =
              date.toLocaleDateString(
                'en-NG',
                {
                  day: '2-digit',
                  month: 'short',
                },
              );

            const shortLabel = `${weekdayShort}, ${dateLabel}`;

            return {
              key,
              index,
              label:
                shortLabel,
              shortLabel,
              dateLabel,
              weekdayLabel:
                weekday,
              from:
                getDayStart(
                  date,
                ),
              to:
                getDayEnd(
                  date,
                ),
            };
          },
        );
      },
      [],
    );

  const selectedDay =
    dayOptions.find(
      (day) =>
        day.key ===
        selectedDayKey,
    ) ??
    dayOptions[0];

  // ==========================================================
  // ACTIVE COMPETITIONS
  // ==========================================================

  interface AsyncState<T> {
    data: T | null;
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
  }

  const [
    activeCompetitionsQuery,
    setActiveCompetitionsQuery,
  ] = useState<
    AsyncState<{
      data: ActiveCompetition[];
      total: number;
    }>
  >({
    data: null,
    isLoading: true,
    isFetching: true,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const loadActiveCompetitions = useCallback(async () => {
    setActiveCompetitionsQuery({
      data: null,
      isLoading: true,
      isFetching: true,
      isSuccess: false,
      isError: false,
      error: null,
    });

    try {
      const competitions =
        await sportsApi.getCompetitions({
          activeOnly: true,
          predictionEnabled: true,
        });

      setActiveCompetitionsQuery({
        data: {
          data: competitions,
          total: competitions.length,
        },
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        isError: false,
        error: null,
      });
    } catch (caughtError) {
      const normalized =
        caughtError instanceof Error
          ? caughtError
          : new Error('Unable to load active competitions.');

      setActiveCompetitionsQuery({
        data: null,
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: true,
        error: normalized,
      });
    }
  }, []);

  useEffect(() => {
    void loadActiveCompetitions();
  }, [loadActiveCompetitions]);

  const activeCompetitions =
    useMemo(
      () =>
        [
          ...(activeCompetitionsQuery.data?.data ?? []),
        ].sort(
          (a, b) =>
            (
              PRIORITY_ORDER[
                a.priority
              ] ?? 99
            ) -
              (
                PRIORITY_ORDER[
                  b.priority
                ] ?? 99
              ) ||
            a.name.localeCompare(
              b.name,
            ),
        ),
      [
        activeCompetitionsQuery.data?.data,
      ],
    );

  // ==========================================================
  // SEQUENTIAL 8-DAY LEAGUE AVAILABILITY
  // ==========================================================
  //
  // Each league gets its own direct public request.
  // League 1 completes -> its matches appear immediately.
  // League 2 starts only after League 1 finishes, and so on.

  const [
    leagueAvailability,
    setLeagueAvailability,
  ] = useState<
    Map<string, EspnFixtureRecord[]>
  >(new Map());

  const [
    availabilityState,
    setAvailabilityState,
  ] = useState<{
    isFetching: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
    completed: number;
    total: number;
  }>({
    isFetching: false,
    isSuccess: false,
    isError: false,
    error: null,
    completed: 0,
    total: 0,
  });

  const runAvailability = useCallback(async () => {
    const from = dayOptions[0]?.from;
    const to =
      dayOptions[
        dayOptions.length - 1
      ]?.to;

    if (!from || !to || !activeCompetitions.length) {
      setLeagueAvailability(new Map());
      setAvailabilityState({
        isFetching: false,
        isSuccess: true,
        isError: false,
        error: null,
        completed: 0,
        total: activeCompetitions.length,
      });
      return;
    }

    setLeagueAvailability(new Map());
    setAvailabilityState({
      isFetching: true,
      isSuccess: false,
      isError: false,
      error: null,
      completed: 0,
      total: activeCompetitions.length,
    });

    let firstError: Error | null = null;
    let completed = 0;

    await runWithConcurrency(
      activeCompetitions,
      6,
      async competition => {
        try {
          const fixtures =
            await fetchUpcomingFixturesForLeague({
              from,
              to,
              leagueId:
                competition.competitionId,
            });

          setLeagueAvailability(
            current => {
              const next =
                new Map(current);

              next.set(
                competition.competitionId,
                fixtures,
              );

              return next;
            },
          );
        } catch (caughtError) {
          const normalized =
            caughtError instanceof Error
              ? caughtError
              : new Error(
                  `Unable to load ${competition.name}.`,
                );

          firstError ??=
            normalized;

          setLeagueAvailability(
            current => {
              const next =
                new Map(current);

              next.set(
                competition.competitionId,
                [],
              );

              return next;
            },
          );
        } finally {
          completed += 1;

          setAvailabilityState(
            current => ({
              ...current,
              completed,
              isError:
                Boolean(firstError),
              error:
                firstError,
            }),
          );
        }
      },
    );

    setAvailabilityState(
      current => ({
        ...current,
        isFetching: false,
        isSuccess: true,
        isError: Boolean(firstError),
        error: firstError,
        completed,
      }),
    );
  }, [
    activeCompetitions,
    dayOptions,
  ]);

  useEffect(() => {
    if (activeCompetitions.length) {
      void runAvailability();
    }
  }, [
    activeCompetitions.length,
    todayKey,
    runAvailability,
  ]);

  const availabilityData =
    useMemo(() => {
      const unique = new Map<string, EspnFixtureRecord>();

      for (const fixture of [...leagueAvailability.values()].flat()) {
        unique.set(String(fixture.eventId), fixture);
      }

      return [...unique.values()];
    }, [leagueAvailability]);

  // Distinct teams with fixtures during the next eight days. This uses the
  // existing availability payload and avoids fetching every league roster.
  const generalTeamOptions =
    useMemo(() => {
      const teams = new Map<string, string>();

      for (const fixture of availabilityData) {
        const homeId = String(fixture.homeTeamId ?? '');
        const awayId = String(fixture.awayTeamId ?? '');
        const home = getTeamFromPayload(fixture, 'home').name;
        const away = getTeamFromPayload(fixture, 'away').name;

        if (homeId) teams.set(homeId, home !== 'Home Team' ? home : `Team ${homeId}`);
        if (awayId) teams.set(awayId, away !== 'Away Team' ? away : `Team ${awayId}`);
      }

      return [...teams.entries()]
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }, [availabilityData]);

  const leagueDayCounts =
    useMemo(() => {
      const map =
        new Map<
          string,
          Map<string, number>
        >();

      for (const [
        leagueId,
        fixtures,
      ] of leagueAvailability.entries()) {
        const dayMap =
          new Map<string, number>();

        for (const fixture of fixtures) {
          const dateKey =
            getDateKey(
              new Date(
                fixture.fixtureDate,
              ),
            );

          dayMap.set(
            dateKey,
            (dayMap.get(
              dateKey,
            ) ?? 0) + 1,
          );
        }

        map.set(
          leagueId,
          dayMap,
        );
      }

      return map;
    }, [leagueAvailability]);

  const availabilityReady =
    availabilityState.isSuccess;

  const dateFixtureTotals =
    useMemo(() => {
      const totals =
        new Map<string, number>();

      for (const fixture of availabilityData) {
        const key =
          getDateKey(
            new Date(
              fixture.fixtureDate,
            ),
          );

        totals.set(
          key,
          (totals.get(
            key,
          ) ?? 0) + 1,
        );
      }

      return totals;
    }, [availabilityData]);

  // ==========================================================
  // FILTERED LEAGUES
  // ==========================================================

  const filteredLeagues =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return activeCompetitions.filter(
        (competition) => {
          if (
            priorityFilter !==
              'ALL' &&
            String(
              competition.priority,
            ).toUpperCase() !==
              priorityFilter
          ) {
            return false;
          }

          if (query) {
            const country =
              extractLeagueCountry(
                competition,
              ) ?? '';

            const searchable =
              [
                competition.name,
                competition.espnLeagueSlug,
                country,
                String(
                  competition.region ??
                    '',
                ),
              ]
                .join(' ')
                .toLowerCase();

            if (
              !searchable.includes(
                query,
              )
            ) {
              return false;
            }
          }

          if (generalTeamFilter && availabilityReady) {
            const fixtures = leagueAvailability.get(competition.competitionId) ?? [];
            const hasTeam = fixtures.some(fixture =>
              String(fixture.homeTeamId ?? '') === generalTeamFilter ||
              String(fixture.awayTeamId ?? '') === generalTeamFilter,
            );

            if (!hasTeam) return false;
          }

          if (
            dateFilter !==
            'ALL' &&
            availabilityReady
          ) {
            const count =
              leagueDayCounts
                .get(
                  competition.competitionId,
                )
                ?.get(
                  dateFilter,
                ) ?? 0;

            if (
              count === 0
            ) {
              return false;
            }
          }

          return true;
        },
      );
    }, [
      activeCompetitions,
      priorityFilter,
      search,
      dateFilter,
      leagueDayCounts,
      availabilityReady,
      generalTeamFilter,
      leagueAvailability,
    ]);

  useEffect(() => {
    if (
      !selectedLeague ||
      dateFilter === 'ALL' ||
      !availabilityReady
    ) {
      return;
    }

    const count =
      leagueDayCounts
        .get(selectedLeague)
        ?.get(dateFilter) ??
      0;

    if (count === 0) {
      setSelectedLeague('');
      setSelectedTeamId('');
      setSelectedMatch(null);
    }
  }, [
    selectedLeague,
    dateFilter,
    availabilityReady,
    leagueDayCounts,
  ]);

  useEffect(() => {
    if (!selectedLeague || !generalTeamFilter || !availabilityReady) return;

    const fixtures = leagueAvailability.get(selectedLeague);
    if (!fixtures) return;

    const hasTeam = fixtures.some(fixture =>
      String(fixture.homeTeamId ?? '') === generalTeamFilter ||
      String(fixture.awayTeamId ?? '') === generalTeamFilter,
    );

    if (!hasTeam) {
      setSelectedLeague('');
      setSelectedTeamId('');
      setSelectedMatch(null);
    }
  }, [generalTeamFilter, selectedLeague, availabilityReady, leagueAvailability]);

  // ==========================================================
  // SELECTED LEAGUE — FILTERED DIRECT READS
  // ==========================================================
  //
  // The selected league is the server-side scope.
  // The selected day becomes the date range.
  // The optional team becomes teamId.
  //
  // Teams are fetched once per league and cached.
  // Fixture reads are cached per league + date + team.
  // Status reads remain sequential and progressive.

  const selectedLeagueRecord =
    activeCompetitions.find(
      (competition) =>
        competition.competitionId ===
        selectedLeague,
    );

  const selectedFixtureDay =
    selectedDay ??
    dayOptions[0];

  const selectedFixtureFrom =
    selectedFixtureDay?.from ??
    getDayStart(
      new Date(),
    );

  const selectedFixtureTo =
    selectedFixtureDay?.to ??
    getDayEnd(
      selectedFixtureFrom,
    );

  const teamsCacheRef =
    useRef(
      new Map<
        string,
        EspnTeamRecord[]
      >(),
    );

  const fixturesCacheRef =
    useRef(
      new Map<
        string,
        EspnFixtureRecord[]
      >(),
    );

  const selectedRequestIdRef =
    useRef(0);

  const [
    leagueSummaryQuery,
    setLeagueSummaryQuery,
  ] = useState<
    AsyncState<LeagueSummary>
  >({
    data: null,
    isLoading: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const getFixtureCacheKey = useCallback(
    (
      competitionId: string,
      dayKey: string,
      teamId?: string,
    ) =>
      [
        competitionId,
        dayKey,
        teamId ?? 'ALL',
      ].join(':'),
    [],
  );

  const loadSelectedLeague =
    useCallback(
      async (
        background = false,
      ) => {
        const competition =
          selectedLeagueRecord;

        if (!competition) {
          selectedRequestIdRef.current += 1;

          setLeagueSummaryQuery({
            data: null,
            isLoading: false,
            isFetching: false,
            isSuccess: false,
            isError: false,
            error: null,
          });

          return;
        }

        const requestId =
          ++selectedRequestIdRef.current;

        const dayKey =
          selectedFixtureDay?.key ??
          getDateKey(
            selectedFixtureFrom,
          );

        const cacheKey =
          getFixtureCacheKey(
            competition.competitionId,
            dayKey,
            selectedTeamId || undefined,
          );

        const cachedTeams =
          teamsCacheRef.current.get(
            competition.competitionId,
          );

        const cachedFixtures =
          !background
            ? fixturesCacheRef.current.get(
                cacheKey,
              )
            : undefined;

        if (
          cachedTeams &&
          cachedFixtures
        ) {
          setLeagueSummaryQuery({
            data: {
              teams: cachedTeams,
              teamCount:
                cachedTeams.length,
              fixtures:
                cachedFixtures,
            },
            isLoading: false,
            isFetching: false,
            isSuccess: true,
            isError: false,
            error: null,
          });

          return;
        }

        setLeagueSummaryQuery(
          current => ({
            data: {
              teams:
                cachedTeams ??
                current.data
                  ?.teams ??
                [],
              teamCount:
                cachedTeams?.length ??
                current.data
                  ?.teamCount ??
                0,
              fixtures:
                cachedFixtures ??
                current.data
                  ?.fixtures ??
                [],
            },
            isLoading:
              !cachedTeams &&
              !cachedFixtures &&
              !background,
            isFetching: true,
            isSuccess:
              Boolean(
                cachedTeams ||
                cachedFixtures ||
                current.data,
              ),
            isError: false,
            error: null,
          }),
        );

        let teams =
          cachedTeams;

        let fixtures =
          cachedFixtures;

        let firstError:
          Error | null = null;

        const reportError = (
          caughtError: unknown,
          fallback: string,
        ) => {
          const normalized =
            caughtError instanceof Error
              ? caughtError
              : new Error(fallback);

          firstError ??=
            normalized;
        };

        const commitTeams = (
          nextTeams: EspnTeamRecord[],
        ) => {
          if (
            requestId !==
            selectedRequestIdRef.current
          ) {
            return;
          }

          teamsCacheRef.current.set(
            competition.competitionId,
            nextTeams,
          );

          setLeagueSummaryQuery(
            current => ({
              data: {
                teams: nextTeams,
                teamCount:
                  nextTeams.length,
                fixtures:
                  current.data
                    ?.fixtures ??
                  fixtures ??
                  [],
              },
              isLoading: false,
              isFetching: true,
              isSuccess: true,
              isError: false,
              error: null,
            }),
          );
        };

        const commitFixtures = (
          nextFixtures: EspnFixtureRecord[],
        ) => {
          if (
            requestId !==
            selectedRequestIdRef.current
          ) {
            return;
          }

          fixturesCacheRef.current.set(
            cacheKey,
            nextFixtures,
          );

          setLeagueSummaryQuery(
            current => ({
              data: {
                teams:
                  teams ??
                  current.data
                    ?.teams ??
                  [],
                teamCount:
                  teams?.length ??
                  current.data
                    ?.teamCount ??
                  0,
                fixtures:
                  nextFixtures,
              },
              isLoading: false,
              isFetching: true,
              isSuccess: true,
              isError: false,
              error: null,
            }),
          );
        };

        const teamTask = teams
          ? Promise.resolve(
              teams,
            )
          : sportsApi
              .getCompetitionTeams(
                competition.competitionId,
              )
              .then(
                nextTeams => {
                  teams =
                    nextTeams;

                  commitTeams(
                    nextTeams,
                  );

                  return nextTeams;
                },
              )
              .catch(
                caughtError => {
                  reportError(
                    caughtError,
                    'The selected league teams could not be loaded.',
                  );

                  return null;
                },
              );

        const fixtureTask = fixtures
          ? Promise.resolve(
              fixtures,
            )
          : fetchUpcomingFixturesForLeague(
              {
                from:
                  selectedFixtureFrom,
                to:
                  selectedFixtureTo,
                leagueId:
                  competition.competitionId,
                teamId:
                  selectedTeamId ||
                  undefined,
              },
            )
              .then(
                nextFixtures => {
                  fixtures =
                    nextFixtures;

                  commitFixtures(
                    nextFixtures,
                  );

                  return nextFixtures;
                },
              )
              .catch(
                caughtError => {
                  reportError(
                    caughtError,
                    'The selected league fixtures could not be loaded.',
                  );

                  return null;
                },
              );

        const [
          teamResult,
          fixtureResult,
        ] = await Promise.all([
          teamTask,
          fixtureTask,
        ]);

        if (
          requestId !==
          selectedRequestIdRef.current
        ) {
          return;
        }

        if (!teams && teamResult) {
          teams =
            teamResult;
        }

        if (
          !fixtures &&
          fixtureResult
        ) {
          fixtures =
            fixtureResult;
        }

        if (!fixtures) {
          setLeagueSummaryQuery(
            current => ({
              ...current,
              isLoading: false,
              isFetching: false,
              isSuccess:
                Boolean(
                  current.data,
                ),
              isError: true,
              error:
                firstError ??
                new Error(
                  'The selected league fixtures could not be loaded.',
                ),
            }),
          );

          return;
        }

        // ------------------------------------------------------
        // 3. STATUS — independent requests with bounded concurrency
        // ------------------------------------------------------

        let progressiveFixtures =
          fixtures.slice();

        await runWithConcurrency(
          progressiveFixtures,
          6,
          async fixture => {
            if (
              requestId !==
              selectedRequestIdRef.current
            ) {
              return;
            }

            try {
              const directStatus =
                await sportsApi.getFixtureStatus(
                  fixture.eventId,
                );

              if (
                requestId !==
                selectedRequestIdRef.current
              ) {
                return;
              }

              const normalizedStatus =
                normalizeDirectFixtureStatus(
                  directStatus,
                );

              if (!normalizedStatus) {
                return;
              }

              progressiveFixtures =
                progressiveFixtures.map(
                  candidate =>
                    candidate.eventId ===
                    fixture.eventId
                      ? {
                          ...candidate,
                          status:
                            normalizedStatus,
                        }
                      : candidate,
                );

              setLeagueSummaryQuery(
                current => ({
                  data: current.data
                    ? {
                        ...current.data,
                        fixtures:
                          progressiveFixtures,
                      }
                    : {
                        teams:
                          teams ??
                          [],
                        teamCount:
                          teams?.length ??
                          0,
                        fixtures:
                          progressiveFixtures,
                      },
                  isLoading: false,
                  isFetching: true,
                  isSuccess: true,
                  isError: false,
                  error: null,
                }),
              );
            } catch {
              // One status failure never blocks the remaining fixtures.
            }
          },
        );

        if (
          requestId !==
          selectedRequestIdRef.current
        ) {
          return;
        }

        fixturesCacheRef.current.set(
          cacheKey,
          progressiveFixtures,
        );

        // Keep the fixture cache bounded.
        if (
          fixturesCacheRef.current.size >
          32
        ) {
          const firstKey =
            fixturesCacheRef.current
              .keys()
              .next()
              .value;

          if (firstKey) {
            fixturesCacheRef.current.delete(
              firstKey,
            );
          }
        }

        setLeagueSummaryQuery({
          data: {
            teams:
              teams ??
              [],
            teamCount:
              teams?.length ??
              0,
            fixtures:
              progressiveFixtures,
          },
          isLoading: false,
          isFetching: false,
          isSuccess: true,
          isError:
            Boolean(firstError),
          error: firstError,
        });
      },
      [
        selectedLeagueRecord,
        selectedFixtureDay,
        selectedFixtureFrom,
        selectedFixtureTo,
        selectedTeamId,
        getFixtureCacheKey,
      ],
    );

  useEffect(() => {
    void loadSelectedLeague();
  }, [loadSelectedLeague]);

  // ==========================================================
  // TEAM LOOKUP
  // ==========================================================

  const selectedTeams =
    leagueSummaryQuery.data
      ?.teams ?? [];

  const teamMap =
    useMemo(
      () =>
        buildTeamMap(
          selectedTeams,
        ),
      [selectedTeams],
    );

  const teamOptions =
    useMemo(
      () =>
        selectedTeams
          .map(team => ({
            id: String(
              team.teamId ??
              team.id ??
              '',
            ),
            name:
              team.name ??
              team.displayName ??
              team.shortName ??
              'Team',
          }))
          .filter(
            team =>
              Boolean(team.id),
          )
          .sort(
            (a, b) =>
              a.name.localeCompare(
                b.name,
              ),
          ),
      [selectedTeams],
    );

  // ==========================================================
  // SELECTED FIXTURES
  //
  // IMPORTANT:
  // No client-side date/team filtering happens here.
  // The backend already applied competition + date + team.
  // ==========================================================

  const dayFixtures =
    useMemo(
      () =>
        (
          leagueSummaryQuery
            .data?.fixtures ??
          []
        )
          .map(
            fixture =>
              normalizeFixture(
                fixture,
                teamMap,
              ),
          )
          .sort(
            (a, b) =>
              new Date(
                a.fixtureDate,
              ).getTime() -
              new Date(
                b.fixtureDate,
              ).getTime(),
          ),
      [
        leagueSummaryQuery
          .data?.fixtures,
        teamMap,
      ],
    );

  // ==========================================================
  // SUMMARY COUNTS
  // ==========================================================

  const summaryCounts =
    useMemo(() => {
      const fixtures = selectedLeague
        ? leagueAvailability.get(selectedLeague) ?? []
        : [];
      const now = Date.now();

      const live = fixtures.filter(
        fixture => Boolean(fixture.live),
      ).length;

      const upcoming = fixtures.filter(fixture => {
        const status = String(fixture.status ?? '')
          .trim()
          .toUpperCase();
        const time = new Date(fixture.fixtureDate).getTime();
        const completed =
          Boolean(fixture.completed) || FINAL_STATUSES.has(status);

        return time > now && !completed && !fixture.live;
      }).length;

      return {
        total: fixtures.length,
        live,
        upcoming,
      };
    }, [leagueAvailability, selectedLeague]);

  const selectedLeagueDayCounts =
    useMemo(() => {
      const counts = new Map<string, number>();
      const fixtures = selectedLeague
        ? leagueAvailability.get(selectedLeague) ?? []
        : [];
      const scopedFixtures = selectedTeamId
        ? fixtures.filter(fixture =>
            String(fixture.homeTeamId ?? '') === selectedTeamId ||
            String(fixture.awayTeamId ?? '') === selectedTeamId,
          )
        : fixtures;

      for (const fixture of scopedFixtures) {
        const key = getDateKey(new Date(fixture.fixtureDate));
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }

      return counts;
    }, [leagueAvailability, selectedLeague, selectedTeamId]);

  // ==========================================================
  // ACTIONS
  // ==========================================================

  const handleDateFilterChange =
    (
      value: DateFilter,
    ) => {
      setDateFilter(
        value,
      );

      if (
        value ===
        'ALL'
      ) {
        setSelectedDayKey(
          todayKey,
        );

        return;
      }

      setSelectedDayKey(
        value,
      );
    };

  const handleCalendarDayChange =
    (value: string) => {
      setSelectedDayKey(
        value,
      );
    };

  const handleTeamChange =
    (value: string) => {
      setSelectedTeamId(
        value,
      );

      setSelectedMatch(
        null,
      );
    };

  const handleLeagueChange =
    (value: string) => {
      setSelectedLeague(
        value,
      );

      setSelectedTeamId(
        '',
      );

      setSelectedDayKey(
        dateFilter !==
          'ALL'
          ? dateFilter
          : todayKey,
      );

      setSelectedMatch(
        null,
      );
    };

  const openModal = (
    fixture: PredictionFixture,
  ) => {
    if (
      fixture.completed ||
      fixture.live
    ) {
      return;
    }

    setSelectedMatch(
      fixture,
    );
  };

  const closeModal = () => {
    setSelectedMatch(
      null,
    );
  };
  const handleCreate = async (
    payload: CreatePredictionPayload,
  ) => {
    try {
      setSubmitting(
        true,
      );

      await createPrediction(
        payload,
      );

      setExistingPredictionMatchIds(current => {
        const next = new Set(current);
        next.add(String(payload.matchId));
        return next;
      });
      setPredictionLookupStatus('ready');

      toast.success(
        'Prediction created successfully.',
      );

      closeModal();

      await loadSelectedLeague(true);
    } catch (error: any) {
      console.error(
        error?.response?.data ??
          error,
      );

      const message =
        Array.isArray(
          error?.response?.data
            ?.message,
        )
          ? error.response.data.message.join(
              ', ',
            )
          : error?.response?.data
              ?.message ??
            error?.message ??
            'Failed to create prediction.';

      toast.error(
        message,
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  };

  const clearSearch = () => {
    setSearch('');
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    activeCompetitionsQuery.isLoading
  ) {
    return (
      <CreatePredictionSkeleton />
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    activeCompetitionsQuery.isError
  ) {
    return (
      <PageError
        title="Unable to load leagues"
        message={
          activeCompetitionsQuery.error
            ?.message ??
          'The active competitions could not be loaded.'
        }
        onRetry={() =>
          loadActiveCompetitions()
        }
      />
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[1500px]
        min-w-0
        space-y-3
        pb-4
      "
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        className="
          flex
          flex-col
          gap-3
          rounded-2xl
          border
          border-border
          bg-card
          p-1
          shadow-sm
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <WandSparkles className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-lg
                font-bold
                tracking-tight
                sm:text-xl
              "
            >
              Create Prediction
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-2.5 py-1.5 text-[10px] font-bold text-primary">
            <Trophy className="h-3.5 w-3.5" />
            <span>{activeCompetitions.length} Active Leagues</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1.5 text-[10px] font-semibold text-foreground">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{availabilityReady ? availabilityData.length : '…'} 8d Fixtures</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1.5 text-[10px] font-semibold text-foreground">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{availabilityReady ? generalTeamOptions.length : '…'} Teams (8d)</span>
          </div>

          {availabilityState.isFetching && (
            <div
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-border
                bg-muted/40
                px-2.5
                py-1.5
                text-[10px]
                font-medium
                text-muted-foreground
              "
            >
              <LoaderCircle className="h-3 w-3 animate-spin" />
              Checking fixtures{' '}
              {availabilityState.completed}/
              {availabilityState.total}
            </div>
          )}
        </div>
      </header>

      {/* ======================================================
          EXPLORER
      ====================================================== */}

      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-card
          shadow-sm
        "
      >
        {/* Search */}
        <div
          className="
            flex
            flex-col
            gap-2
            border-b
            border-border
            p-3
            lg:flex-row
          "
        >
          <div
            className="
              relative
              min-w-0
              flex-1
            "
          >
            <Search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search leagues..."
              className="
                h-8
                w-full
                rounded-xl
                border
                border-input
                bg-background
                pl-8
                pr-8
                text-sm
                outline-none
                transition
                placeholder:text-muted-foreground
                focus:border-primary/40
                focus:ring-2
                focus:ring-primary/10
              "
            />

            {search && (
              <button
                type="button"
                onClick={
                  clearSearch
                }
                className="
                  absolute
                  right-2
                  top-1/2
                  flex
                  h-6
                  w-6
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-lg
                  text-muted-foreground
                  hover:bg-muted
                  hover:text-foreground
                "
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Priority filters */}
          <div
            className="
              flex
              min-w-0
              gap-1
              overflow-x-auto
              rounded-xl
              bg-muted/40
              p-1
            "
          >
            {PRIORITY_FILTERS.map(
              (filter) => {
                const active =
                  priorityFilter ===
                  filter.key;

                return (
                  <button
                    key={
                      filter.key
                    }
                    type="button"
                    onClick={() =>
                      setPriorityFilter(
                        filter.key,
                      )
                    }
                    className={`
                      shrink-0
                      rounded-lg
                      px-1
                      py-0.5
                      text-[9px]
                      font-semibold
                      transition
                      ${
                        active
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {filter.label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Date availability filter */}
        <div
          className="
            flex
            items-center
            gap-1.5
            overflow-x-auto
            border-b
            border-border
            px-2
            py-1
            scrollbar-hide
          "
        >
          <span
            className="
              mr-1
              shrink-0
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-muted-foreground
            "
          >
            Date
          </span>

          <button
            type="button"
            onClick={() =>
              setDateFilter(
                'ALL',
              )
            }
            className={`
              inline-flex
              min-h-[46px]
              shrink-0
              items-center
              justify-center
              gap-1.5
              rounded-lg
              border
              px-2
              py-1
              text-[10px]
              font-bold
              transition
              ${
                dateFilter ===
                'ALL'
                  ? 'border-primary/20 bg-primary/10 text-primary'
                  : 'border-transparent bg-muted/40 text-muted-foreground hover:bg-muted'
              }
            `}
          >
            <span>All dates</span>
          </button>

          {dayOptions.map(
            (day) => {
              const active =
                dateFilter ===
                day.key;

              const count =
                dateFixtureTotals.get(
                  day.key,
                );

              return (
                <button
                  key={
                    day.key
                  }
                  type="button"
                  disabled={
                    !availabilityReady
                  }
                  onClick={() =>
                    handleDateFilterChange(
                      day.key,
                    )
                  }
                  className={`
                    inline-flex
                    min-w-[104px]
                    shrink-0
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    rounded-lg
                    border
                    px-2
                    py-1
                    text-center
                    transition
                    disabled:cursor-wait
                    disabled:opacity-60
                    ${
                      active
                        ? 'border-primary/20 bg-primary/10 text-primary'
                        : 'border-transparent bg-muted/40 text-muted-foreground hover:bg-muted'
                    }
                  `}
                >
                  <span className="whitespace-nowrap text-[8px] font-bold">
                    {day.shortLabel}
                  </span>
                  <span className="whitespace-nowrap text-[7px] font-semibold opacity-80">
                    {availabilityReady
                      ? `${count ?? 0} ${(count ?? 0) === 1 ? 'match' : 'matches'}`
                      : 'Loading matches…'}
                  </span>
                </button>
              );
            },
          )}
        </div>

        {/* Results summary */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            px-2
            py-1
          "
        >
          <div className="text-[9px] text-muted-foreground">
            <span className="font-semibold text-foreground">
              {
                filteredLeagues.length
              }
            </span>{' '}
            leagues
            {dateFilter !== 'ALL' &&
              availabilityReady && (
                <>
                  {' · '}
                  <span className="font-semibold text-foreground">
                    {dateFixtureTotals.get(
                      dateFilter,
                    ) ?? 0}
                  </span>{' '}
                  fixtures
                </>
              )}
          </div>

          {(search ||
            priorityFilter !==
              'ALL' ||
            dateFilter !==
              'ALL' ||
            generalTeamFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPriorityFilter(
                  'ALL',
                );
                setDateFilter(
                  'ALL',
                );
                setGeneralTeamFilter('');
                setSelectedDayKey(
                  todayKey,
                );
                setSelectedTeamId('');
              }}
              className="
                text-[9px]
                font-semibold
                text-primary
                hover:underline
              "
            >
              Reset filters
            </button>
          )}
        </div>

        {/* League availability notice */}
        {availabilityState.isError && (
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              border-t
              border-destructive/15
              bg-destructive/[0.04]
              px-2
              py-1
              text-[9px]
              text-destructive
            "
          >
            <div className="flex min-w-0 items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                Fixture counts are unavailable. Date filtering is temporarily disabled.
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                runAvailability()
              }
              className="
                inline-flex
                h-7
                shrink-0
                items-center
                gap-1
                rounded-lg
                bg-background
                px-2
                text-[10px]
                font-semibold
                text-foreground
                ring-1
                ring-border
                hover:bg-muted
              "
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          </div>
        )}

        {/* League list */}
        {filteredLeagues.length ===
          0 ? (
          <div
            className="
              flex
              min-h-22
              flex-col
              items-center
              justify-center
              gap-1
              border-t
              border-border
              px-1
              text-center
            "
          >
            <div
              className="
                rounded-full
                bg-muted
                p-1
                text-muted-foreground
              "
            >
              <Search className="h-4 w-4" />
            </div>

            <p className="text-sm font-semibold">
              No leagues found
            </p>

            <p className="text-xs text-muted-foreground">
              Try another search, category, or date.
            </p>
          </div>
        ) : (
          <div
            className="block w-full border-t border-border"
            style={{
              height: 228,
              minHeight: 228,
              maxHeight: 228,
              overflowX: 'hidden',
              overflowY: 'scroll',
              overscrollBehaviorY: 'contain',
              scrollbarGutter: 'stable',
            }}
            role="region"
            tabIndex={0}
            aria-label="League explorer. Scroll within this fixed-height list to see more leagues."
          >
            <div
              className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4"
              style={{ gridAutoRows: '75px' }}
            >
              {filteredLeagues.map(
                (
                  competition,
                ) => {
                  const selected =
                    selectedLeague ===
                    competition.competitionId;

                  const leagueLoaded =
                    leagueAvailability.has(
                      competition.competitionId,
                    );

                  const dayCount =
                    dateFilter !==
                    'ALL'
                      ? leagueDayCounts
                          .get(
                            competition.competitionId,
                          )
                          ?.get(
                            dateFilter,
                          ) ?? 0
                      : undefined;

                  const totalNextDays =
                    leagueLoaded
                      ? dayOptions.reduce(
                          (
                            total,
                            day,
                          ) =>
                            total +
                            (
                              leagueDayCounts
                                .get(
                                  competition.competitionId,
                                )
                                ?.get(
                                  day.key,
                                ) ?? 0
                            ),
                          0,
                        )
                      : null;

                  return (
                    <button
                      key={
                        competition.competitionId
                      }
                      type="button"
                      onClick={() =>
                        handleLeagueChange(
                          competition.competitionId,
                        )
                      }
                      className={`
                        group
                        flex
                        h-full
                        min-w-0
                        min-h-0
                        overflow-hidden
                        items-center
                        gap-1.5
                        bg-card
                        px-1
                        py-1
                        text-left
                        transition
                        hover:bg-primary/[0.03]
                        ${
                          selected
                            ? 'relative z-[1] bg-primary/[0.05] ring-1 ring-inset ring-primary/20'
                            : ''
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          h-6
                          w-6
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-border
                          bg-background
                        "
                      >
                        {extractLeagueLogo(
                          competition,
                        ) ? (
                          <Image
                            src={
                              extractLeagueLogo(
                                competition,
                              )!
                            }
                            alt={
                              competition.name
                            }
                            width={
                              24
                            }
                            height={
                              24
                            }
                            loader={
                              espnImageLoader
                            }
                            unoptimized
                            className="object-contain"
                          />
                        ) : (
                          <Trophy className="h-4 w-4 text-primary" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span
                            className="
                              truncate
                              text-xs
                              font-bold
                              text-foreground
                            "
                          >
                            {
                              competition.name
                            }
                          </span>

                          {selected && (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                          )}
                        </div>

                        <div className="mt-1 flex min-w-0 items-center gap-1.5">
                          <span
                            className={`
                              shrink-0
                              rounded-full
                              border
                              px-1.5
                              py-0.5
                              text-[8px]
                              font-bold
                              uppercase
                              tracking-wide
                              ${getPriorityClasses(
                                competition.priority,
                              )}
                            `}
                          >
                            {getPriorityLabel(
                              competition.priority,
                            )}
                          </span>

                          <span className="truncate text-[9px] text-muted-foreground">
                            {extractLeagueCountry(
                              competition,
                            ) ??
                              String(
                                competition.region ??
                                  '',
                              )}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <div className="text-right">
                          <div className="text-xs font-black">
                            {!leagueLoaded
                              ? '…'
                              : dateFilter !==
                                  'ALL'
                                ? dayCount
                                : totalNextDays}
                          </div>

                          <div className="flex items-center justify-end gap-1 text-[8px] text-muted-foreground">
                            {!leagueLoaded ? (
                              <>
                                <LoaderCircle className="h-2.5 w-2.5 animate-spin" />
                                loading
                              </>
                            ) : dateFilter !== 'ALL' ? (
                              `${dayCount ?? 0} ${(dayCount ?? 0) === 1 ? 'match' : 'matches'}`
                            ) : (
                              `${totalNextDays ?? 0} ${(totalNextDays ?? 0) === 1 ? 'match' : 'matches'} · 8d`
                            )}
                          </div>
                        </div>

                        <ChevronRight
                          className={`
                            h-4
                            w-4
                            text-muted-foreground
                            transition
                            group-hover:translate-x-0.5
                            ${
                              selected
                                ? 'text-primary'
                                : ''
                            }
                          `}
                        />
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        )}
      </section>

      {/* ======================================================
          SELECTED LEAGUE
      ====================================================== */}

      {!selectedLeagueRecord ? (
        <section
          className="
            flex
            min-h-40
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-border
            bg-muted/10
            px-4
            text-center
          "
        >
          <div
            className="
              rounded-full
              bg-primary/10
              p-3
              text-primary
            "
          >
            <WandSparkles className="h-5 w-5" />
          </div>

          <p className="mt-3 text-sm font-bold">
            Select a league
          </p>

          <p className="mt-1 max-w-md text-xs text-muted-foreground">
            Choose a competition above to load its teams. Dates and team
            changes query only the selected league slice.
          </p>
        </section>
      ) : (
        <>
          {/* League information */}
          <section
            className="
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-card
              shadow-sm
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                border-b
                border-border
                p-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-border
                    bg-background
                  "
                >
                  {extractLeagueLogo(
                    selectedLeagueRecord,
                  ) ? (
                    <Image
                      src={
                        extractLeagueLogo(
                          selectedLeagueRecord,
                        )!
                      }
                      alt={
                        selectedLeagueRecord.name
                      }
                      width={30}
                      height={30}
                      loader={
                        espnImageLoader
                      }
                      unoptimized
                      className="object-contain"
                    />
                  ) : (
                    <Trophy className="h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-sm font-bold sm:text-base">
                      {
                        selectedLeagueRecord.name
                      }
                    </h2>

                    <span
                      className="
                        rounded-full
                        border
                        border-emerald-500/15
                        bg-emerald-500/10
                        px-1.5
                        py-0.5
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-wide
                        text-emerald-600
                      "
                    >
                      {
                        getStatusLabel(
                          selectedLeagueRecord.status,
                        )
                      }
                    </span>

                    <span
                      className={`
                        rounded-full
                        border
                        px-1.5
                        py-0.5
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-wide
                        ${getPriorityClasses(
                          selectedLeagueRecord.priority,
                        )}
                      `}
                    >
                      {
                        getPriorityLabel(
                          selectedLeagueRecord.priority,
                        )
                      }
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                    {extractLeagueCountry(
                      selectedLeagueRecord,
                    ) && (
                      <span>
                        {
                          extractLeagueCountry(
                            selectedLeagueRecord,
                          )
                        }
                      </span>
                    )}

                    <span>
                      {
                        selectedLeagueRecord.type
                      }
                    </span>

                    {selectedLeagueRecord.season && (
                      <span>
                        Season{' '}
                        {
                          selectedLeagueRecord.season
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
                {leagueSummaryQuery.isFetching && (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin text-muted-foreground" aria-label="Loading league data" />
                )}

                <select
                  value={selectedTeamId}
                  onChange={event =>
                    handleTeamChange(event.target.value)
                  }
                  className="
                    h-8
                    min-w-0
                    max-w-[150px]
                    rounded-lg
                    border
                    border-border
                    bg-background
                    px-2
                    text-[10px]
                    font-semibold
                    outline-none
                    transition
                    focus:border-primary/40
                    focus:ring-2
                    focus:ring-primary/10
                  "
                  disabled={
                    leagueSummaryQuery.isLoading ||
                    teamOptions.length === 0
                  }
                  aria-label="Filter fixtures by team"
                >
                  <option value="">All teams</option>
                  {teamOptions.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    void loadSelectedLeague(true)
                  }
                  disabled={
                    leagueSummaryQuery.isFetching
                  }
                  className="
                    inline-flex
                    h-8
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-border
                    bg-background
                    px-2.5
                    text-[10px]
                    font-semibold
                    text-muted-foreground
                    transition
                    hover:bg-muted
                    hover:text-foreground
                    disabled:pointer-events-none
                    disabled:opacity-50
                  "
                >
                  <RefreshCw className="h-3 w-3" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Compact inline league stats and season details */}
            <div className="flex items-center gap-0 overflow-x-auto border-t border-border bg-card px-1 py-1.5 scrollbar-hide">
              <LeagueStat
                icon={<Users className="h-3.5 w-3.5" />}
                label="Teams"
                value={
                  leagueSummaryQuery.isLoading
                    ? '…'
                    : String(leagueSummaryQuery.data?.teamCount ?? 0)
                }
              />

              <LeagueStat
                icon={<CalendarDays className="h-3.5 w-3.5" />}
                label="8d Fixtures"
                value={
                  selectedLeague && leagueAvailability.has(selectedLeague)
                    ? String(summaryCounts.total)
                    : '…'
                }
              />

              <LeagueStat
                icon={<Clock3 className="h-3.5 w-3.5" />}
                label="Upcoming"
                value={
                  selectedLeague && leagueAvailability.has(selectedLeague)
                    ? String(summaryCounts.upcoming)
                    : '…'
                }
              />

              <LeagueStat
                icon={<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
                label="Live"
                value={
                  selectedLeague && leagueAvailability.has(selectedLeague)
                    ? String(summaryCounts.live)
                    : '…'
                }
              />

              <LeagueMeta
                label="Season Start"
                value={formatDate(selectedLeagueRecord.seasonStartDate)}
              />
              <LeagueMeta
                label="Season End"
                value={formatDate(selectedLeagueRecord.seasonEndDate)}
              />
              <LeagueMeta
                label="Next Fixture"
                value={formatDate(selectedLeagueRecord.nextFixtureDate)}
              />
            </div>
          </section>

          {/* Selected league error */}
          {leagueSummaryQuery.isError ? (
            <PageError
              title="Unable to load league data"
              message={
                leagueSummaryQuery.error
                  ?.message ??
                'The teams and fixture dataset could not be loaded.'
              }
              onRetry={() =>
                loadSelectedLeague(true)
              }
            />
          ) : (
            <>
              {/* Fixtures with compact, centered date navigation */}
              <section
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  shadow-sm
                "
              >
                <div className="border-b border-border px-2 py-2">
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="mx-auto flex w-max min-w-full items-center justify-center gap-1.5">
                      {dayOptions.map(day => {
                        const selected = day.key === selectedDayKey;

                        return (
                          <button
                            key={day.key}
                            type="button"
                            onClick={() => handleCalendarDayChange(day.key)}
                            aria-pressed={selected}
                            className={`
                              inline-flex
                              min-w-[104px]
                              shrink-0
                              flex-col
                              items-center
                              justify-center
                              gap-1
                              rounded-lg
                              border
                              px-2.5
                              py-1.5
                              text-center
                              transition
                              ${
                                selected
                                  ? 'border-primary/20 bg-primary text-primary-foreground shadow-sm'
                                  : 'border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
                              }
                            `}
                          >
                            <span className="whitespace-nowrap text-[10px] font-bold">
                              {day.shortLabel}
                            </span>
                            <span className="whitespace-nowrap text-[9px] font-semibold opacity-80">
                              {selectedLeague && leagueAvailability.has(selectedLeague)
                                ? `${selectedLeagueDayCounts.get(day.key) ?? 0} ${(selectedLeagueDayCounts.get(day.key) ?? 0) === 1 ? 'match' : 'matches'}`
                                : 'Loading matches…'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {leagueSummaryQuery.isLoading ? (
                  <FixtureSkeleton />
                ) : !dayFixtures.length ? (
                  <div
                    className="
                      flex
                      min-h-32
                      flex-col
                      items-center
                      justify-center
                      px-4
                      text-center
                    "
                  >
                    <div className="rounded-full bg-muted p-2.5 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                    </div>

                    <p className="mt-2 text-sm font-semibold">
                      No fixtures scheduled
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      There are no fixtures for this league on{' '}
                      {selectedDay.label.toLowerCase()}.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {dayFixtures.map(fixture => (
                      <FixtureRow
                        key={fixture.eventId}
                        fixture={fixture}
                        alreadyCreated={existingPredictionMatchIds.has(fixture.eventId)}
                        predictionLookupStatus={predictionLookupStatus}
                        onCreate={() => openModal(fixture)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </>
      )}

      {/* ========================================================
          PREDICTION MODAL
      ======================================================== */}

      {selectedMatch && (
        <PredictionModal
          match={{
            eventId:
              selectedMatch.eventId,

            homeTeam:
              selectedMatch.homeTeam,

            awayTeam:
              selectedMatch.awayTeam,

            homeTeamBadge:
              selectedMatch.homeTeamBadge,

            awayTeamBadge:
              selectedMatch.awayTeamBadge,

            fixtureDate:
              selectedMatch.fixtureDate,

            status:
              selectedMatch.status,
          }}
          onClose={
            closeModal
          }
          onSubmit={
            handleCreate
          }
          loading={
            submitting
          }
        />
      )}
    </div>
  );
}

// ============================================================
// UI COMPONENTS
// ============================================================

function LeagueStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap border-r border-border px-3 py-1 last:border-r-0">
      <span className="shrink-0 text-primary">{icon}</span>
      <span className="text-[9px] font-semibold text-muted-foreground">{label}</span>
      <span className="text-[10px] font-black text-foreground">{value}</span>
    </div>
  );
}

function LeagueMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap border-r border-border px-3 py-1 last:border-r-0">
      <span className="text-[9px] font-semibold text-muted-foreground">{label}</span>
      <span className="text-[10px] font-semibold text-foreground">{value}</span>
    </div>
  );
}

function FixtureRow({
  fixture,
  onCreate,
  alreadyCreated,
  predictionLookupStatus,
}: {
  fixture: PredictionFixture;
  onCreate: () => void;
  alreadyCreated: boolean;
  predictionLookupStatus: 'loading' | 'ready' | 'error';
}) {
  const state =
    getFixtureState(
      fixture,
    );

  const stateClasses =
    getFixtureStateClasses(
      state,
    );

  const canCreate =
    state === 'Upcoming';

  const formatted =
    formatDateTime(
      fixture.fixtureDate,
    );

  return (
    <div
      className="
        flex
        flex-col
        gap-2.5
        px-3
        py-2.5
        transition
        hover:bg-primary/[0.02]
        sm:flex-row
        sm:items-center
        sm:gap-4
      "
    >
      <div
        className="
          flex
          w-full
          shrink-0
          items-center
          justify-between
          text-[10px]
          text-muted-foreground
          sm:block
          sm:w-28
        "
      >
        <div className="font-semibold text-foreground">
          {
            formatted.date
          }
        </div>

        <div className="sm:mt-0.5">
          {
            formatted.time
          }
        </div>
      </div>

      <div
        className="
          grid
          min-w-0
          flex-1
          grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]
          items-center
          gap-2
          sm:gap-4
        "
      >
        <TeamCell
          name={
            fixture.homeTeam
          }
          badge={
            fixture.homeTeamBadge
          }
          align="right"
        />

        <span
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-border
            bg-muted/40
            text-[8px]
            font-black
            text-muted-foreground
          "
        >
          VS
        </span>

        <TeamCell
          name={
            fixture.awayTeam
          }
          badge={
            fixture.awayTeamBadge
          }
          align="left"
        />
      </div>

      <div
        className="
          flex
          items-center
          justify-between
          gap-2
          sm:w-40
          sm:justify-end
        "
      >
        <span
          className={`
            inline-flex
            items-center
            gap-1.5
            rounded-full
            px-2
            py-1
            text-[9px]
            font-bold
            uppercase
            tracking-wide
            ${stateClasses}
          `}
        >
          {state ===
            'Live' && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          )}

          {state}
        </span>

        {alreadyCreated ? (
          <button
            type="button"
            disabled
            aria-label={`Prediction already created for ${fixture.homeTeam} vs ${fixture.awayTeam}`}
            className="inline-flex h-8 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 text-[10px] font-bold text-white"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Created
          </button>
        ) : canCreate ? (
          <button
            type="button"
            onClick={onCreate}
            disabled={predictionLookupStatus !== 'ready'}
            title={
              predictionLookupStatus === 'error'
                ? 'Unable to verify existing predictions. Refresh the page and try again.'
                : undefined
            }
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-[10px] font-bold text-primary-foreground transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {predictionLookupStatus === 'loading' ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            {predictionLookupStatus === 'loading' ? 'Checking…' : 'Create'}
          </button>
        ) : (
          <span
            className="
              hidden
              text-[9px]
              font-medium
              text-muted-foreground
              sm:block
            "
          >
            {state ===
            'Finished'
              ? 'Completed'
              : 'Unavailable'}
          </span>
        )}
      </div>
    </div>
  );
}

function TeamCell({
  name,
  badge,
  align,
}: {
  name: string;
  badge?: string;
  align: 'left' | 'right';
}) {
  const right =
    align ===
    'right';

  return (
    <div
      className={`
        flex
        min-w-0
        items-center
        gap-2
        ${
          right
            ? 'justify-end text-right'
            : 'justify-start text-left'
        }
      `}
    >
      {right && (
        <span className="truncate text-[11px] font-bold sm:text-xs">
          {name}
        </span>
      )}

      <div
        className="
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-border
          bg-background
        "
      >
        {badge ? (
          <Image
            src={badge}
            alt={name}
            width={22}
            height={22}
            loader={
              espnImageLoader
            }
            unoptimized
            className="object-contain"
          />
        ) : (
          <Users className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {!right && (
        <span className="truncate text-[11px] font-bold sm:text-xs">
          {name}
        </span>
      )}
    </div>
  );
}

function CreatePredictionSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-16 animate-pulse rounded-2xl bg-muted" />

      <div className="h-40 animate-pulse rounded-2xl bg-muted" />

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 6,
        }).map(
          (_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-xl bg-muted"
            />
          ),
        )}
      </div>

      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

function FixtureSkeleton() {
  return (
    <div className="space-y-1.5 p-2">
      {Array.from({
        length: 5,
      }).map(
        (_, index) => (
          <div
            key={index}
            className="
              h-16
              animate-pulse
              rounded-xl
              bg-muted/40
            "
          />
        ),
      )}
    </div>
  );
}

function PageError({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="
        flex
        min-h-40
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-destructive/20
        bg-destructive/[0.04]
        px-5
        py-8
        text-center
      "
    >
      <div
        className="
          rounded-full
          bg-destructive/10
          p-2.5
          text-destructive
        "
      >
        <RefreshCw className="h-4 w-4" />
      </div>

      <h3 className="mt-3 text-sm font-bold">
        {title}
      </h3>

      <p className="mt-1 max-w-lg text-xs text-muted-foreground">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="
          mt-3
          inline-flex
          h-8
          items-center
          gap-1.5
          rounded-lg
          bg-primary
          px-3
          text-xs
          font-semibold
          text-primary-foreground
          transition
          hover:brightness-110
        "
      >
        <RefreshCw className="h-3 w-3" />
        Try again
      </button>
    </div>
  );
}

