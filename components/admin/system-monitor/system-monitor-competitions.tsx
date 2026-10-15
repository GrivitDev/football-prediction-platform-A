// 'use client' marks this file as a client component so React state and
// the sports monitor query can run in the browser.
'use client';

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Database,
  FileCheck2,
  Layers3,
  RefreshCw,
  ShieldCheck,
  Trophy,
  XCircle,
} from 'lucide-react';

import {
  useState,
  type ReactNode,
} from 'react';

import {
  useSportsSystemMonitor,
} from '@/hooks/use-sports-system-monitor';


// ============================================================
// HELPERS
// ============================================================

const formatNumber = (
  value: number,
): string => {
  return value.toLocaleString();
};


const formatDate = (
  value?: string,
): string => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );
};


const formatDateTime = (
  value?: string,
): string => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  );
};


const freshnessLabel = (
  value?: string,
): string => {
  if (!value) {
    return 'No data';
  }

  const timestamp =
    new Date(value).getTime();

  if (!Number.isFinite(timestamp)) {
    return 'Unknown';
  }

  const seconds = Math.max(
    0,
    Math.floor(
      (Date.now() - timestamp) / 1000,
    ),
  );

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes =
    Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(hours / 24);

  return `${days}d ago`;
};


const coverageBadgeClass = (
  coverage: number,
): string => {
  if (coverage >= 95) {
    return 'bg-emerald-500/10 text-emerald-600';
  }

  if (coverage >= 80) {
    return 'bg-amber-500/10 text-amber-600';
  }

  return 'bg-red-500/10 text-red-600';
};


const statusClass = (
  status: string,
): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-500/10 text-emerald-600';

    case 'UPCOMING':
      return 'bg-blue-500/10 text-blue-600';

    case 'INACTIVE':
      return 'bg-muted text-muted-foreground';

    default:
      return 'bg-muted text-muted-foreground';
  }
};


const syncStatusClass = (
  status: string,
): string => {
  switch (status) {
    case 'SUCCESS':
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-600';

    case 'PROCESSING':
      return 'bg-blue-500/10 text-blue-600';

    case 'PENDING':
      return 'bg-amber-500/10 text-amber-600';

    case 'FAILED':
      return 'bg-red-500/10 text-red-600';

    case 'PARTIAL':
      return 'bg-amber-500/10 text-amber-600';

    default:
      return 'bg-muted text-muted-foreground';
  }
};


const priorityClass = (
  priority: string,
): string => {
  switch (priority.toUpperCase()) {
    case 'ELITE':
      return 'bg-blue-500/10 text-blue-600';

    case 'HIGH':
      return 'bg-indigo-500/10 text-indigo-600';

    case 'REGIONAL':
      return 'bg-amber-500/10 text-amber-600';

    case 'SELECTIVE':
      return 'bg-muted text-muted-foreground';

    default:
      return 'bg-muted text-muted-foreground';
  }
};


const readinessClass = (
  status: string,
): string => {
  switch (status) {
    case 'READY':
      return 'bg-emerald-500/10 text-emerald-600';

    case 'PARTIAL':
      return 'bg-amber-500/10 text-amber-600';

    case 'MISSING':
      return 'bg-red-500/10 text-red-600';

    default:
      return 'bg-muted text-muted-foreground';
  }
};


const formatLabel = (
  value: string,
): string => {
  return value
    .replace(
      /([a-z])([A-Z])/g,
      '$1 $2',
    )
    .replaceAll('_', ' ')
    .replace(
      /^./,
      char => char.toUpperCase(),
    );
};


const formatDuration = (
  seconds?: number,
): string => {
  if (
    seconds === undefined ||
    !Number.isFinite(seconds)
  ) {
    return '—';
  }

  if (seconds <= 0) {
    return 'Done';
  }

  const rounded =
    Math.ceil(seconds);

  const hours =
    Math.floor(rounded / 3600);

  const minutes =
    Math.floor(
      (rounded % 3600) / 60,
    );

  const remainingSeconds =
    rounded % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
};


const getLeagueExpectedWork = (
  league: {
    expectedWork: {
      finishedFixturesMissingSummary: number;
      standingsMissingTeams: number;
      upcomingFixturesMissingOdds: number;
      upcomingFixturesMissingSummary: number;
    };
  },
): number => {
  return Object.values(
    league.expectedWork,
  ).reduce(
    (sum, value) =>
      sum + Number(value ?? 0),
    0,
  );
};


const getSyncDisplayStatus = (
  league: {
    sync: {
      unitProgress: {
        processing: number;
        failed: number;
      };
      stateCompletionPercent: number;
    };
  },
): string => {
  if (
    league.sync.unitProgress.processing > 0
  ) {
    return 'PROCESSING';
  }

  if (
    league.sync.unitProgress.failed > 0
  ) {
    return 'PARTIAL';
  }

  if (
    league.sync.stateCompletionPercent >= 100
  ) {
    return 'SUCCESS';
  }

  return 'PENDING';
};


const getLatestTimestamp = (
  values: Array<
    string | undefined
  >,
): string | undefined => {
  const valid =
    values
      .filter(Boolean)
      .map(value => ({
        value: value as string,
        time: new Date(
          value as string,
        ).getTime(),
      }))
      .filter(item =>
        Number.isFinite(item.time),
      )
      .sort(
        (a, b) =>
          b.time - a.time,
      );

  return valid[0]?.value;
};


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorCompetitions() {
  const [
    expandedId,
    setExpandedId,
  ] = useState<string | null>(null);

  const monitorQuery =
    useSportsSystemMonitor();

  const leagues =
    monitorQuery.data?.leagues ?? [];

  const totalUpcoming =
    leagues.reduce(
      (total, league) =>
        total +
        league.upcoming.total,
      0,
    );

  const totalReady =
    leagues.reduce(
      (total, league) =>
        total +
        league.upcoming.ready,
      0,
    );

  const totalPartial =
    leagues.reduce(
      (total, league) =>
        total +
        league.upcoming.partial,
      0,
    );

  const totalMissing =
    leagues.reduce(
      (total, league) =>
        total +
        league.upcoming.missing,
      0,
    );

  const totalMissingWork =
    leagues.reduce(
      (total, league) =>
        total +
        getLeagueExpectedWork(
          league,
        ),
      0,
    );

  const totalFixtures =
    leagues.reduce(
      (total, league) =>
        total +
        league.fixtures.total,
      0,
    );

  const totalFinished =
    leagues.reduce(
      (total, league) =>
        total +
        league.fixtures.finished,
      0,
    );

  const totalLive =
    leagues.reduce(
      (total, league) =>
        total +
        league.fixtures.live,
      0,
    );

  const averageSyncCoverage =
    leagues.length > 0
      ? Number(
          (
            leagues.reduce(
              (total, league) =>
                total +
                league.sync
                  .unitProgress
                  .completionPercent,
              0,
            ) /
            leagues.length
          ).toFixed(2),
        )
      : 0;

  return (
    <div className="space-y-4">
      {monitorQuery.data?.snapshotPartial && (
        <div className="flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-muted-foreground">
          <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-blue-600" />
          <p>
            The live operational snapshot is loaded. Historical fixture, team coverage, and upcoming readiness metrics are still being calculated and will update automatically.
          </p>
        </div>
      )}
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Sports Competitions
          </h2>

          <p className="text-sm text-muted-foreground">
            Competition-level data health, readiness, synchronization, freshness, and outstanding work.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {monitorQuery.data?.generatedAt && (
            <span className="hidden text-[10px] text-muted-foreground sm:inline">
              Updated{' '}
              {formatDateTime(
                monitorQuery.data.generatedAt,
              )}
            </span>
          )}

          <RefreshCw
            className={`h-4 w-4 text-muted-foreground ${
              monitorQuery.isFetching
                ? 'animate-spin'
                : ''
            }`}
          />
        </div>
      </div>


      {/* ======================================================
          GLOBAL SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <SummaryCard
          label="Competitions"
          value={leagues.length}
          icon={Trophy}
        />

        <SummaryCard
          label="Fixtures"
          value={totalFixtures}
          icon={CalendarDays}
        />

        <SummaryCard
          label="Live"
          value={totalLive}
          icon={RefreshCw}
        />

        <SummaryCard
          label="Finished"
          value={totalFinished}
          icon={FileCheck2}
        />

        <SummaryCard
          label="Upcoming"
          value={totalUpcoming}
          icon={Clock3}
        />

        <SummaryCard
          label="Ready Upcoming"
          value={totalReady}
          icon={CheckCircle2}
        />

        <SummaryCard
          label="Sync Coverage"
          value={`${averageSyncCoverage}%`}
          icon={ShieldCheck}
        />

        <SummaryCard
          label="Missing Work"
          value={totalMissingWork}
          icon={AlertTriangle}
          danger={
            totalMissingWork > 0
          }
        />
      </div>


      {/* ======================================================
          UPCOMING HEALTH
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeader
          title="Upcoming Fixture Readiness"
          icon={CalendarDays}
          description="Readiness across the current operational fixture window."
        />

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <ReadinessMetric
            label="Total"
            value={totalUpcoming}
          />

          <ReadinessMetric
            label="Ready"
            value={totalReady}
            tone="success"
          />

          <ReadinessMetric
            label="Partial"
            value={totalPartial}
            tone="warning"
          />

          <ReadinessMetric
            label="Missing"
            value={totalMissing}
            tone="danger"
          />
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div className="flex h-full">
            <div
              className="bg-emerald-500"
              style={{
                width: totalUpcoming > 0
                  ? `${(
                      (totalReady /
                        totalUpcoming) *
                      100
                    )}%`
                  : '0%',
              }}
            />

            <div
              className="bg-amber-500"
              style={{
                width: totalUpcoming > 0
                  ? `${(
                      (totalPartial /
                        totalUpcoming) *
                      100
                    )}%`
                  : '0%',
              }}
            />

            <div
              className="bg-red-500"
              style={{
                width: totalUpcoming > 0
                  ? `${(
                      (totalMissing /
                        totalUpcoming) *
                      100
                    )}%`
                  : '0%',
              }}
            />
          </div>
        </div>

        <p className="mt-2 text-[10px] text-muted-foreground">
          A fixture is READY when the required stored fixture data and Summary data are available.
        </p>
      </section>


      {/* ======================================================
          COMPETITION LIST
      ====================================================== */}

      <div className="space-y-3">
        {leagues.map(
          league => {
            const expanded =
              expandedId ===
              league.competitionId;

            const syncStatus =
              getSyncDisplayStatus(
                league,
              );

            const expectedWork =
              getLeagueExpectedWork(
                league,
              );

            const nextFixture =
              league.upcoming.fixtures[0];

            const latestDataTimestamp =
              getLatestTimestamp([
                league.fixtures
                  .latestCollectedAt,

                league.teams
                  .latestCollectedAt,

                league.standings
                  ?.latestCollectedAt,

                league.news
                  ?.latestCollectedAt,

                league.sync
                  .latestCompletedAt,
              ]);

            return (
              <section
                key={
                  league.competitionId
                }
                className="overflow-hidden rounded-2xl border border-border bg-card/60"
              >
                {/* ==================================================
                    COLLAPSED HEADER
                ================================================== */}

                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(
                      expanded
                        ? null
                        : league.competitionId,
                    )
                  }
                  className="w-full p-4 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-bold text-foreground">
                          {league.name}
                        </h3>

                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusClass(
                            league.status,
                          )}`}
                        >
                          {league.status}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${priorityClass(
                            league.priority,
                          )}`}
                        >
                          {league.priority}
                        </span>

                        {league.season !== undefined && (
                          <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-medium text-muted-foreground">
                            {league.season}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                        {league.competitionId}
                        {' · '}
                        {league.espnLeagueSlug}
                      </p>

                      <p className="mt-2 text-[10px] text-muted-foreground">
                        {league.region}
                        {' · '}
                        {league.type}
                        {' · '}
                        Last data{' '}
                        {freshnessLabel(
                          latestDataTimestamp,
                        )}
                      </p>
                    </div>


                    {/* HEADER METRICS */}

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <HeaderMetric
                        label="Upcoming"
                        value={`${league.upcoming.ready}/${league.upcoming.total}`}
                      />

                      <HeaderMetric
                        label="Summary"
                        value={`${league.fixtures.summaryCoveragePercent}%`}
                      />

                      <HeaderMetric
                        label="Sync"
                        value={`${league.sync.unitProgress.completionPercent}%`}
                      />

                      <HeaderMetric
                        label="Missing"
                        value={formatNumber(
                          expectedWork,
                        )}
                        danger={
                          expectedWork > 0
                        }
                      />

                      <ChevronDown
                        className={`col-span-2 mx-auto h-4 w-4 text-muted-foreground transition-transform sm:hidden ${
                          expanded
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </div>

                    <div className="hidden shrink-0 sm:flex sm:items-center">
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform ${
                          expanded
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </div>
                  </div>
                </button>


                {/* ==================================================
                    EXPANDED CONTENT
                ================================================== */}

                {expanded && (
                  <div className="border-t border-border p-4">
                    {/* ==============================================
                        COMPETITION INFORMATION
                    ============================================== */}

                    <Section
                      title="Competition Information"
                      icon={Trophy}
                    >
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoBlock
                          label="Competition ID"
                          value={
                            league.competitionId
                          }
                        />

                        <InfoBlock
                          label="ESPN League"
                          value={
                            league.espnLeagueSlug
                          }
                        />

                        <InfoBlock
                          label="Region"
                          value={
                            league.region
                          }
                        />

                        <InfoBlock
                          label="Type"
                          value={
                            league.type
                          }
                        />

                        <InfoBlock
                          label="Priority"
                          value={
                            league.priority
                          }
                        />

                        <InfoBlock
                          label="Status"
                          value={
                            league.status
                          }
                        />

                        <InfoBlock
                          label="Season"
                          value={
                            league.season !==
                            undefined
                              ? String(
                                  league.season,
                                )
                              : '—'
                          }
                        />

                        <InfoBlock
                          label="Next Fixture"
                          value={formatDateTime(
                            league.nextFixtureDate,
                          )}
                        />

                        <InfoBlock
                          label="Season Start"
                          value={formatDate(
                            league.seasonStartDate,
                          )}
                        />

                        <InfoBlock
                          label="Season End"
                          value={formatDate(
                            league.seasonEndDate,
                          )}
                        />

                        <InfoBlock
                          label="Last Fixture"
                          value={formatDateTime(
                            league.lastFixtureDate,
                          )}
                        />

                        <InfoBlock
                          label="Latest Data"
                          value={freshnessLabel(
                            latestDataTimestamp,
                          )}
                        />
                      </div>
                    </Section>


                    {/* ==============================================
                        CATALOGUE
                    ============================================== */}

                    <Section
                      title="Catalogue State"
                      icon={Database}
                    >
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <StateBlock
                          label="Exists"
                          value={
                            league.catalogue.exists
                          }
                          trueLabel="Available"
                          falseLabel="Missing"
                        />

                        <StateBlock
                          label="Catalogue Active"
                          value={
                            Boolean(
                              league.catalogue
                                .isActive,
                            )
                          }
                          trueLabel="Active"
                          falseLabel="Inactive"
                        />

                        <StateBlock
                          label="Priority Catalogue"
                          value={
                            Boolean(
                              league.catalogue
                                .isPriority,
                            )
                          }
                          trueLabel="Priority"
                          falseLabel="Standard"
                        />

                        <InfoBlock
                          label="Catalogue Name"
                          value={
                            league.catalogue
                              .name ??
                            '—'
                          }
                        />

                        <InfoBlock
                          label="Country"
                          value={
                            league.catalogue
                              .country ??
                            '—'
                          }
                        />

                        <InfoBlock
                          label="Last Catalogue Sync"
                          value={formatDateTime(
                            league.catalogue
                              .lastSyncedAt,
                          )}
                        />

                        <InfoBlock
                          label="Detail Sync"
                          value={formatDateTime(
                            league.catalogue
                              .detailLastSyncedAt,
                          )}
                        />

                        <InfoBlock
                          label="Catalogue Freshness"
                          value={freshnessLabel(
                            league.catalogue
                              .detailLastSyncedAt ??
                              league.catalogue
                                .lastSyncedAt,
                          )}
                        />
                      </div>
                    </Section>


                    {/* ==============================================
                        FIXTURE DATA
                    ============================================== */}

                    <Section
                      title="Fixture Dataset"
                      icon={CalendarDays}
                    >
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
                        <MetricTile
                          label="Total"
                          value={
                            league.fixtures.total
                          }
                        />

                        <MetricTile
                          label="Upcoming"
                          value={
                            league.fixtures.upcoming
                          }
                        />

                        <MetricTile
                          label="Live"
                          value={
                            league.fixtures.live
                          }
                        />

                        <MetricTile
                          label="Finished"
                          value={
                            league.fixtures.finished
                          }
                        />

                        <MetricTile
                          label="Stored Seasons"
                          value={
                            league.fixtures
                              .storedSeasons
                          }
                        />

                        <MetricTile
                          label="Missing Summary"
                          value={
                            league.fixtures
                              .finishedMissingSummary
                          }
                          danger={
                            league.fixtures
                              .finishedMissingSummary >
                            0
                          }
                        />
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <CoverageCard
                          label="Fixture Summary"
                          coverage={
                            league.fixtures
                              .summaryCoveragePercent
                          }
                          detail={`${league.fixtures.finishedWithSummary}/${league.fixtures.finished} finished fixtures have summaries`}
                        />

                        <FreshnessCard
                          title="Latest Fixture Collection"
                          timestamp={
                            league.fixtures
                              .latestCollectedAt
                          }
                        />

                        <InfoBlock
                          label="Season Fixture Boundary"
                          value={`${formatDate(
                            league.seasonStartDate,
                          )} → ${formatDate(
                            league.seasonEndDate,
                          )}`}
                        />
                      </div>
                    </Section>


                    {/* ==============================================
                        DATA COVERAGE
                    ============================================== */}

                    <Section
                      title="Data Coverage"
                      icon={ShieldCheck}
                    >
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <CoverageCard
                          label="Teams"
                          coverage={
                            league.teams
                              ?.coveragePercent ??
                            0
                          }
                          detail={`${formatNumber(
                            league.teams
                              ?.distinctTeams ??
                              0,
                          )}/${formatNumber(
                            league.teams
                              ?.expectedCurrentSeasonTeams ??
                              0,
                          )} expected teams`}
                        />

                        <CoverageCard
                          label="Standings"
                          coverage={
                            league.standings
                              ?.coveragePercent ??
                            0
                          }
                          detail={`${formatNumber(
                            league.standings
                              ?.teams ??
                              0,
                          )}/${formatNumber(
                            league.standings
                              ?.expectedTeams ??
                              0,
                          )} expected teams`}
                        />

                        <CoverageCard
                          label="Fixture Summary"
                          coverage={
                            league.fixtures
                              .summaryCoveragePercent
                          }
                          detail={`${formatNumber(
                            league.fixtures.finishedWithSummary,
                          )}/${formatNumber(
                            league.fixtures.finished,
                          )} finished fixtures with Summary`}
                        />

                        <CoverageCard
                          label="Upcoming Ready"
                          coverage={
                            league.upcoming
                              .total > 0
                              ? (
                                  league.upcoming
                                    .ready /
                                  league.upcoming
                                    .total
                                ) *
                                100
                              : 0
                          }
                          detail={`${formatNumber(
                            league.upcoming
                              .ready,
                          )}/${formatNumber(
                            league.upcoming
                              .total,
                          )} fixtures ready`}
                        />

                        <CoverageCard
                          label="Upcoming Summary"
                          coverage={
                            league.upcoming
                              .total > 0
                              ? (
                                  league.upcoming
                                    .withSummary /
                                  league.upcoming
                                    .total
                                ) *
                                100
                              : 0
                          }
                          detail={`${formatNumber(
                            league.upcoming
                              .withSummary,
                          )}/${formatNumber(
                            league.upcoming
                              .total,
                          )} upcoming fixtures with Summary`}
                        />

                        <CoverageCard
                          label="Overall Sync"
                          coverage={
                            league.sync
                              .unitProgress
                              .completionPercent
                          }
                          detail={`${formatNumber(
                            league.sync
                              .unitProgress
                              .success,
                          )}/${formatNumber(
                            league.sync
                              .unitProgress
                              .total,
                          )} units successful`}
                        />
                      </div>
                    </Section>


                    {/* ==============================================
                        DATA FRESHNESS
                    ============================================== */}

                    <Section
                      title="Data Freshness"
                      icon={Clock3}
                    >
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <FreshnessCard
                          title="Fixtures"
                          timestamp={
                            league.fixtures
                              .latestCollectedAt
                          }
                        />

                        <FreshnessCard
                          title="Teams"
                          timestamp={
                            league.teams
                              .latestCollectedAt
                          }
                        />

                        <FreshnessCard
                          title="Standings"
                          timestamp={
                            league.standings
                              ?.latestCollectedAt
                          }
                        />

                        <FreshnessCard
                          title="News"
                          timestamp={
                            league.news
                              ?.latestCollectedAt
                          }
                        />
                      </div>
                    </Section>


                    {/* ==============================================
                        UPCOMING FIXTURES
                    ============================================== */}

                    <Section
                      title="Upcoming Fixture Readiness"
                      icon={CalendarDays}
                    >
                      {league.upcoming
                        .fixtures.length === 0 ? (
                        <EmptyState>
                          No fixtures are currently inside the operational monitor window.
                        </EmptyState>
                      ) : (
                        <div className="space-y-2">
                          {league.upcoming
                            .fixtures.map(
                              fixture => (
                                <UpcomingFixtureCard
                                  key={
                                    fixture.eventId
                                  }
                                  fixture={
                                    fixture
                                  }
                                />
                              ),
                            )}
                        </div>
                      )}

                      {nextFixture && (
                        <div className="mt-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-3">
                          <p className="text-[10px] text-muted-foreground">
                            Next monitored fixture
                          </p>

                          <p className="mt-1 text-xs font-semibold text-foreground">
                            {nextFixture
                              .homeTeamName ??
                              nextFixture.homeTeamId ??
                              'Home'}
                            {' vs '}
                            {nextFixture
                              .awayTeamName ??
                              nextFixture.awayTeamId ??
                              'Away'}
                          </p>

                          <p className="mt-1 text-[10px] text-muted-foreground">
                            {formatDateTime(
                              nextFixture.fixtureDate,
                            )}
                          </p>
                        </div>
                      )}
                    </Section>


                    {/* ==============================================
                        OPERATIONS
                    ============================================== */}

                    <Section
                      title="Operational State"
                      icon={RefreshCw}
                    >
                      <div className="grid gap-3 lg:grid-cols-2">
                        <OperationCard
                          title="Queue"
                          values={[
                            [
                              'Total',
                              league.queue.total,
                            ],
                            [
                              'Pending',
                              league.queue.pending,
                            ],
                            [
                              'Processing',
                              league.queue.processing,
                            ],
                            [
                              'Failed',
                              league.queue.failed,
                            ],
                            [
                              'Stale',
                              league.queue.staleProcessing,
                            ],
                          ]}
                        />

                        <OperationCard
                          title="Synchronization"
                          values={[
                            [
                              'States',
                              league.sync.totalStates,
                            ],
                            [
                              'Queue States',
                              league.sync.queueStates,
                            ],
                            [
                              'Processing',
                              league.sync.unitProgress.processing,
                            ],
                            [
                              'Pending',
                              league.sync.unitProgress.pending,
                            ],
                            [
                              'Failed',
                              league.sync.unitProgress.failed,
                            ],
                          ]}
                        />
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <InfoBlock
                          label="Sync Status"
                          value={
                            syncStatus
                          }
                        />

                        <InfoBlock
                          label="State Completion"
                          value={`${league.sync.stateCompletionPercent}%`}
                        />

                        <InfoBlock
                          label="Latest Success"
                          value={formatDateTime(
                            league.sync
                              .latestSuccessfulAt,
                          )}
                        />

                        <InfoBlock
                          label="Latest Completion"
                          value={formatDateTime(
                            league.sync
                              .latestCompletedAt,
                          )}
                        />
                      </div>
                    </Section>


                    {/* ==============================================
                        INDIVIDUAL SYNC STATES
                    ============================================== */}

                    <Section
                      title="Persistent Sync States"
                      icon={Layers3}
                    >
                      {league.sync.states.length ===
                      0 ? (
                        <EmptyState>
                          No league-specific persistent synchronization states are currently available.
                        </EmptyState>
                      ) : (
                        <div className="space-y-2">
                          {league.sync.states.map(
                            state => (
                              <SyncStateCard
                                key={
                                  state.stateKey
                                }
                                state={
                                  state
                                }
                              />
                            ),
                          )}
                        </div>
                      )}
                    </Section>


                    {/* ==============================================
                        EXPECTED WORK
                    ============================================== */}

                    <Section
                      title="Outstanding Expected Work"
                      icon={AlertTriangle}
                    >
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(
                          league.expectedWork,
                        ).map(
                          ([
                            key,
                            value,
                          ]) => (
                            <div
                              key={key}
                              className="rounded-xl border border-border bg-background/40 p-3"
                            >
                              <p className="text-[10px] text-muted-foreground">
                                {formatLabel(
                                  key,
                                )}
                              </p>

                              <p
                                className={`mt-1 text-lg font-bold ${
                                  value > 0
                                    ? 'text-amber-600'
                                    : 'text-emerald-600'
                                }`}
                              >
                                {formatNumber(
                                  value,
                                )}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </Section>
                  </div>
                )}
              </section>
            );
          },
        )}

        {leagues.length === 0 && (
          <EmptyState>
            No active competitions are currently exposed by the sports monitor.
          </EmptyState>
        )}
      </div>
    </div>
  );
}


// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  label,
  value,
  icon: Icon,
  danger = false,
}: {
  label: string;
  value: number | string;
  icon: typeof Trophy;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <span className="text-[10px]">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 text-lg font-bold ${
          danger
            ? 'text-red-600'
            : 'text-foreground'
        }`}
      >
        {typeof value === 'number'
          ? formatNumber(value)
          : value}
      </p>
    </div>
  );
}


// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  title,
  icon: Icon,
  description,
}: {
  title: string;
  icon: typeof Trophy;
  description: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />

      <div>
        <h3 className="text-sm font-semibold text-foreground">
          {title}
        </h3>

        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}


// ============================================================
// HEADER METRIC
// ============================================================

function HeaderMetric({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="min-w-[72px] text-right">
      <p className="text-[9px] text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-bold ${
          danger
            ? 'text-red-600'
            : 'text-foreground'
        }`}
      >
        {value}
      </p>
    </div>
  );
}


// ============================================================
// READINESS METRIC
// ============================================================

function ReadinessMetric({
  label,
  value,
  tone = 'normal',
}: {
  label: string;
  value: number;
  tone?: 'normal' | 'success' | 'warning' | 'danger';
}) {
  const toneClass =
    tone === 'success'
      ? 'text-emerald-600'
      : tone === 'warning'
        ? 'text-amber-600'
        : tone === 'danger'
          ? 'text-red-600'
          : 'text-foreground';

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-bold ${toneClass}`}
      >
        {formatNumber(value)}
      </p>
    </div>
  );
}


// ============================================================
// INFO BLOCK
// ============================================================

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}


// ============================================================
// STATE BLOCK
// ============================================================

function StateBlock({
  label,
  value,
  trueLabel,
  falseLabel,
}: {
  label: string;
  value: boolean;
  trueLabel: string;
  falseLabel: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-2">
        {value ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <XCircle className="h-3.5 w-3.5 text-red-600" />
        )}

        <span
          className={`text-xs font-semibold ${
            value
              ? 'text-emerald-600'
              : 'text-red-600'
          }`}
        >
          {value
            ? trueLabel
            : falseLabel}
        </span>
      </div>
    </div>
  );
}


// ============================================================
// SECTION
// ============================================================

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Trophy;
  children: ReactNode;
}) {
  return (
    <section className="mt-4 rounded-xl border border-border/70 bg-background/20 p-3">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />

        <h4 className="text-xs font-semibold text-foreground">
          {title}
        </h4>
      </div>

      {children}
    </section>
  );
}


// ============================================================
// COVERAGE
// ============================================================

function CoverageCard({
  label,
  coverage,
  detail,
}: {
  label: string;
  coverage: number;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <span
          className={`rounded-full px-2 py-1 text-[9px] font-bold ${coverageBadgeClass(
            coverage,
          )}`}
        >
          {coverage.toFixed(1)}%
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: `${Math.min(
              100,
              Math.max(
                0,
                coverage,
              ),
            )}%`,
          }}
        />
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}


// ============================================================
// FRESHNESS
// ============================================================

function FreshnessCard({
  title,
  timestamp,
}: {
  title: string;
  timestamp?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock3 className="h-3.5 w-3.5" />

        <span className="text-[10px]">
          {title}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold text-foreground">
        {freshnessLabel(timestamp)}
      </p>

      <p className="mt-1 text-[9px] text-muted-foreground">
        {formatDateTime(timestamp)}
      </p>
    </div>
  );
}


// ============================================================
// METRIC TILE
// ============================================================

function MetricTile({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-bold ${
          danger
            ? 'text-red-600'
            : 'text-foreground'
        }`}
      >
        {formatNumber(value)}
      </p>
    </div>
  );
}


// ============================================================
// UPCOMING FIXTURE
// ============================================================

function UpcomingFixtureCard({
  fixture,
}: {
  fixture: {
    eventId: string;
    fixtureDate: string;
    homeTeamId?: string;
    awayTeamId?: string;
    homeTeamName?: string;
    awayTeamName?: string;

    sources: {
      espnFixture: boolean;
      odds: boolean;
      oddsMatchable: boolean;
      summary: boolean;
    };

    status:
      | 'READY'
      | 'PARTIAL'
      | 'MISSING';

    missingSources: string[];
  };
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {fixture.homeTeamName ??
              fixture.homeTeamId ??
              'Home'}
            {' vs '}
            {fixture.awayTeamName ??
              fixture.awayTeamId ??
              'Away'}
          </p>

          <p className="mt-1 text-[10px] text-muted-foreground">
            {formatDateTime(
              fixture.fixtureDate,
            )}
            {' · '}
            {fixture.eventId}
          </p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${readinessClass(
            fixture.status,
          )}`}
        >
          {fixture.status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <SourceFlag
          label="ESPN"
          value={
            fixture.sources
              .espnFixture
          }
        />

        <SourceFlag
          label="Summary"
          value={
            fixture.sources
              .summary
          }
        />

        <SourceFlag
          label="Odds"
          value={
            fixture.sources.odds
          }
        />

        <SourceFlag
          label="Odds Matchable"
          value={
            fixture.sources.oddsMatchable
          }
        />
      </div>

      {fixture.missingSources.length > 0 && (
        <div className="mt-3 rounded-lg border border-amber-500/10 bg-amber-500/5 px-3 py-2">
          <p className="text-[9px] font-semibold text-amber-600">
            Missing sources
          </p>

          <p className="mt-1 text-[10px] text-muted-foreground">
            {fixture.missingSources
              .map(formatLabel)
              .join(' · ')}
          </p>
        </div>
      )}
    </div>
  );
}


// ============================================================
// SOURCE FLAG
// ============================================================

function SourceFlag({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-2 py-2 ${
        value
          ? 'bg-emerald-500/10'
          : 'bg-red-500/10'
      }`}
    >
      <div className="flex items-center gap-1">
        {value ? (
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
        ) : (
          <XCircle className="h-3 w-3 text-red-600" />
        )}

        <span
          className={`text-[10px] font-semibold ${
            value
              ? 'text-emerald-600'
              : 'text-red-600'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}


// ============================================================
// OPERATION CARD
// ============================================================

function OperationCard({
  title,
  values,
}: {
  title: string;
  values: Array<
    [string, number]
  >;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="mb-2 text-xs font-semibold text-foreground">
        {title}
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {values.map(
          ([
            name,
            value,
          ]) => (
            <div
              key={name}
              className="rounded-lg border border-border bg-card/40 p-2"
            >
              <p className="text-[10px] text-muted-foreground">
                {name}
              </p>

              <p className="mt-1 text-sm font-bold text-foreground">
                {formatNumber(value)}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}


// ============================================================
// SYNC STATE CARD
// ============================================================

function SyncStateCard({
  state,
}: {
  state: {
    stateKey: string;
    kind: string;
    leagueId?: string;
    leagueName?: string;
    season?: number;
    jobType?: string;
    status: string;
    trackingMode?: string;
    dateFrom?: string;
    dateTo?: string;

    unitProgress: {
      total: number;
      dateUnits: number;
      stepUnits: number;
      success: number;
      processing: number;
      pending: number;
      failed: number;
      completionPercent: number;
    };

    timing: {
      sampleCount: number;
      averageSecondsPerUnit?: number;
      unitsPerMinute?: number;
      currentProcessingElapsedSeconds?: number;
    };

    estimate: {
      remainingUnits: number;
      remainingSeconds?: number;
      estimatedCompletionAt?: string;
    };

    lastStartedAt?: string;
    lastCompletedAt?: string;
  };
}) {
  const remaining =
    state.estimate.remainingUnits;

  const percent =
    Math.min(
      100,
      Math.max(
        0,
        state.unitProgress
          .completionPercent,
      ),
    );

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              {state.jobType
                ? formatLabel(
                    state.jobType,
                  )
                : 'Synchronization'}
            </span>

            <span
              className={`rounded-full px-2 py-1 text-[9px] font-semibold ${syncStatusClass(
                state.status,
              )}`}
            >
              {state.status}
            </span>

            {state.season !==
              undefined && (
              <span className="rounded-full bg-muted px-2 py-1 text-[9px] text-muted-foreground">
                {state.season}
              </span>
            )}
          </div>

          <p className="mt-1 font-mono text-[9px] text-muted-foreground">
            {state.stateKey}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-muted-foreground">
            Completion
          </p>

          <p className="mt-1 text-sm font-bold text-foreground">
            {percent}%
          </p>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <SyncInfo
          label="Units"
          value={`${formatNumber(
            state.unitProgress
              .total,
          )} total`}
        />

        <SyncInfo
          label="Successful"
          value={formatNumber(
            state.unitProgress
              .success,
          )}
        />

        <SyncInfo
          label="Remaining"
          value={formatNumber(
            remaining,
          )}
        />

        <SyncInfo
          label="Date Range"
          value={
            state.dateFrom &&
            state.dateTo
              ? `${formatDate(
                  state.dateFrom,
                )} → ${formatDate(
                  state.dateTo,
                )}`
              : 'No date window'
          }
        />

        <SyncInfo
          label="Average Speed"
          value={
            state.timing
              .averageSecondsPerUnit !==
            undefined
              ? `${state.timing.averageSecondsPerUnit}s/unit`
              : '—'
          }
        />

        <SyncInfo
          label="Throughput"
          value={
            state.timing
              .unitsPerMinute !==
            undefined
              ? `${state.timing.unitsPerMinute}/min`
              : '—'
          }
        />

        <SyncInfo
          label="Timing Samples"
          value={formatNumber(
            state.timing
              .sampleCount,
          )}
        />

        <SyncInfo
          label="ETA"
          value={
            remaining > 0
              ? formatDuration(
                  state.estimate
                    .remainingSeconds,
                )
              : 'Complete'
          }
        />
      </div>

      {(state.unitProgress
        .processing > 0 ||
        state.timing
          .currentProcessingElapsedSeconds !==
          undefined) && (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <SyncInfo
            label="Current Unit Elapsed"
            value={formatDuration(
              state.timing
                .currentProcessingElapsedSeconds,
            )}
          />

          <SyncInfo
            label="Estimated Complete At"
            value={formatDateTime(
              state.estimate
                .estimatedCompletionAt,
            )}
          />

          <SyncInfo
            label="Started"
            value={formatDateTime(
              state.lastStartedAt,
            )}
          />
        </div>
      )}

      {(state.unitProgress.pending > 0 ||
        state.unitProgress.failed > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {state.unitProgress.pending >
            0 && (
            <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-600">
              {formatNumber(
                state.unitProgress
                  .pending,
              )}{' '}
              pending
            </span>
          )}

          {state.unitProgress.failed >
            0 && (
            <span className="rounded-full bg-red-500/10 px-2 py-1 text-[9px] font-semibold text-red-600">
              {formatNumber(
                state.unitProgress
                  .failed,
              )}{' '}
              failed
            </span>
          )}
        </div>
      )}
    </div>
  );
}


// ============================================================
// SYNC INFO
// ============================================================

function SyncInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/30 p-2">
      <p className="text-[9px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-[10px] font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}


// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
      {children}
    </div>
  );
}
