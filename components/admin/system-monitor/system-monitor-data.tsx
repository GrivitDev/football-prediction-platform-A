'use client';

import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Database,
  FileCheck2,
  Info,
  Layers3,
  ListChecks,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from 'lucide-react';

import {
  useSportsSystemMonitor,
} from '@/hooks/use-sports-system-monitor';


// ============================================================
// TYPES
// ============================================================

interface CoverageResult {
  covered: number;
  expected: number;
  missing: number;
  percent: number;
}


// ============================================================
// HELPERS
// ============================================================

const formatNumber = (
  value?: number | null,
): string => {
  if (
    value === undefined ||
    value === null ||
    !Number.isFinite(value)
  ) {
    return '0';
  }

  return value.toLocaleString();
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


const getLatestTimestamp = (
  values: Array<string | undefined>,
): string | undefined => {
  const valid =
    values
      .filter(Boolean)
      .map(value => ({
        value: value as string,
        timestamp: new Date(
          value as string,
        ).getTime(),
      }))
      .filter(item =>
        Number.isFinite(item.timestamp),
      )
      .sort(
        (a, b) =>
          b.timestamp - a.timestamp,
      );

  return valid[0]?.value;
};


const calculateCoverage = (
  covered: number,
  expected: number,
): CoverageResult => {
  const safeExpected = Math.max(
    0,
    expected,
  );

  const safeCovered = Math.max(
    0,
    Math.min(
      covered,
      safeExpected,
    ),
  );

  return {
    covered: safeCovered,

    expected: safeExpected,

    missing: Math.max(
      0,
      safeExpected - safeCovered,
    ),

    percent:
      safeExpected > 0
        ? Number(
            (
              (safeCovered / safeExpected) *
              100
            ).toFixed(2),
          )
        : 0,
  };
};


const coverageClass = (
  percent: number,
): string => {
  if (percent >= 95) {
    return 'text-emerald-600';
  }

  if (percent >= 80) {
    return 'text-amber-600';
  }

  return 'text-red-600';
};


const coverageBadgeClass = (
  percent: number,
): string => {
  if (percent >= 95) {
    return 'bg-emerald-500/10 text-emerald-600';
  }

  if (percent >= 80) {
    return 'bg-amber-500/10 text-amber-600';
  }

  return 'bg-red-500/10 text-red-600';
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


const getLeagueSyncStatus = (
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


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorData() {
  const monitorQuery =
    useSportsSystemMonitor();

  const data =
    monitorQuery.data;

  const inventory =
    data?.inventory;

  const notes =
    data?.architectureNotes;

  const leagues =
    data?.leagues ?? [];

  const expectedWork =
    data?.expectedWork;


  // ==========================================================
  // GLOBAL FIXTURE TOTALS
  // ==========================================================

  const totalFixtures =
    leagues.reduce(
      (sum, league) =>
        sum + league.fixtures.total,
      0,
    );

  const totalUpcoming =
    leagues.reduce(
      (sum, league) =>
        sum + league.fixtures.upcoming,
      0,
    );

  const totalLive =
    leagues.reduce(
      (sum, league) =>
        sum + league.fixtures.live,
      0,
    );

  const totalFinished =
    leagues.reduce(
      (sum, league) =>
        sum + league.fixtures.finished,
      0,
    );

  const totalFinishedWithSummary =
    leagues.reduce(
      (sum, league) =>
        sum + league.fixtures.finishedWithSummary,
      0,
    );

  const totalExpectedTeams =
    leagues.reduce(
      (sum, league) =>
        sum +
        (league.teams?.expectedCurrentSeasonTeams ?? 0),
      0,
    );

  const totalObservedTeams =
    leagues.reduce(
      (sum, league) =>
        sum +
        Math.max(
          0,
          (league.teams?.expectedCurrentSeasonTeams ?? 0) -
            (league.teams?.missingCurrentSeasonTeams ?? 0),
        ),
      0,
    );

  const totalStandingExpectedTeams =
    leagues.reduce(
      (sum, league) =>
        sum +
        (league.standings?.expectedTeams ?? 0),
      0,
    );

  const totalStandingCoveredTeams =
    leagues.reduce(
      (sum, league) =>
        sum +
        Math.max(
          0,
          (league.standings?.expectedTeams ?? 0) -
            (league.standings?.missingTeams ?? 0),
        ),
      0,
    );

  const fixtureSummaryCoverage =
    calculateCoverage(
      totalFinishedWithSummary,
      totalFinished,
    );

  const teamCoverage =
    calculateCoverage(
      totalObservedTeams,
      totalExpectedTeams,
    );

  const standingCoverage =
    calculateCoverage(
      totalStandingCoveredTeams,
      totalStandingExpectedTeams,
    );

  const upcomingSummaryCount =
    leagues.reduce(
      (sum, league) =>
        sum + league.upcoming.withSummary,
      0,
    );

  const totalUpcomingSummaryCoverage =
    calculateCoverage(
      upcomingSummaryCount,
      totalUpcoming,
    );


  // ==========================================================
  // FRESHNESS
  // ==========================================================

  const latestFixtureCollection =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.fixtures.latestCollectedAt,
      ),
    );

  const latestTeamCollection =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.teams?.latestCollectedAt,
      ),
    );

  const latestStandingCollection =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.standings?.latestCollectedAt,
      ),
    );

  const latestNewsCollection =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.news?.latestCollectedAt,
      ),
    );

  const latestSyncCompletion =
    getLatestTimestamp(
      leagues.flatMap(
        league =>
          league.sync.latestCompletedAt
            ? [league.sync.latestCompletedAt]
            : [],
      ),
    );

  const latestSummaryCollection =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.fixtures.latestCollectedAt,
      ),
    );


  // ==========================================================
  // EXPECTED WORK
  // ==========================================================

  const totalMissingWork =
    (expectedWork?.finishedFixturesMissingSummary ?? 0) +
    (expectedWork?.standingsMissingTeams ?? 0) +
    (expectedWork?.upcomingFixturesMissingOdds ?? 0) +
    (expectedWork?.upcomingFixturesMissingSummary ?? 0);


  return (
    <div className="space-y-4">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Sports Data Health & Inventory
          </h2>

          <p className="text-sm text-muted-foreground">
            Dataset inventory, coverage, freshness, missing work, and league-level data health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {data?.generatedAt && (
            <span className="hidden text-[10px] text-muted-foreground sm:inline">
              Generated {formatDateTime(data.generatedAt)}
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
          GLOBAL HEALTH
      ====================================================== */}

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <HealthMetric
          label="Active Leagues"
          value={
            inventory?.activeCompetitions ?? 0
          }
          icon={Layers3}
        />

        <HealthMetric
          label="Fixtures"
          value={totalFixtures}
          icon={CalendarDays}
        />

        <HealthMetric
          label="Upcoming"
          value={totalUpcoming}
          icon={Clock3}
        />

        <HealthMetric
          label="Live"
          value={totalLive}
          icon={TrendingUp}
        />

        <HealthMetric
          label="Finished"
          value={totalFinished}
          icon={FileCheck2}
        />

        <HealthMetric
          label="Summary Coverage"
          value={`${fixtureSummaryCoverage.percent}%`}
          icon={ShieldCheck}
          danger={
            fixtureSummaryCoverage.percent < 80
          }
        />

        <HealthMetric
          label="Upcoming Summary"
          value={`${totalUpcomingSummaryCoverage.percent}%`}
          icon={BarChart3}
          danger={
            totalUpcomingSummaryCoverage.percent < 80
          }
        />

        <HealthMetric
          label="Missing Work"
          value={totalMissingWork}
          icon={XCircle}
          danger={totalMissingWork > 0}
        />
      </section>


      {/* ======================================================
          INVENTORY
      ====================================================== */}

      <section>
        <SectionHeading
          icon={Database}
          title="Stored Dataset Inventory"
          description="Current document counts across the sports subsystem."
        />

        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
          <InventoryCard
            label="Active Competitions"
            value={
              inventory?.activeCompetitions ?? 0
            }
          />

          <InventoryCard
            label="ESPN Catalogue"
            value={
              inventory?.espnCatalogue ?? 0
            }
          />

          <InventoryCard
            label="ESPN Fixtures"
            value={
              inventory?.espnFixtures ?? 0
            }
          />

          <InventoryCard
            label="ESPN Teams"
            value={
              inventory?.espnTeams ?? 0
            }
          />

          <InventoryCard
            label="ESPN Standings"
            value={
              inventory?.espnStandings ?? 0
            }
          />

          <InventoryCard
            label="ESPN News"
            value={
              inventory?.espnNews ?? 0
            }
          />

          <InventoryCard
            label="ESPN Queue"
            value={
              inventory?.espnQueue ?? 0
            }
          />

          <InventoryCard
            label="Sports Sync States"
            value={
              inventory?.sportsSyncStates ?? 0
            }
          />

          <InventoryCard
            label="Football-Data Competitions"
            value={
              inventory?.footballDataCompetitions ?? 0
            }
          />

          <InventoryCard
            label="Football-Data Matches"
            value={
              inventory?.footballDataMatches ?? 0
            }
          />

          <InventoryCard
            label="Football-Data Standings"
            value={
              inventory?.footballDataStandings ?? 0
            }
          />

          <InventoryCard
            label="Football-Data Teams"
            value={
              inventory?.footballDataTeams ?? 0
            }
          />

          <InventoryCard
            label="Odds API Sports"
            value={
              inventory?.oddsApiSports ?? 0
            }
          />

          <InventoryCard
            label="Odds Snapshots"
            value={
              inventory?.sportsOddsSnapshots ?? 0
            }
          />

          <InventoryCard
            label="YouTube Highlights"
            value={
              inventory?.youtubeHighlights ?? 0
            }
          />
        </div>
      </section>


      {/* ======================================================
          COVERAGE
      ====================================================== */}

      <section>
        <SectionHeading
          icon={ShieldCheck}
          title="Data Coverage"
          description="Coverage is calculated from the operational leagues returned by the monitor."
        />

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <CoverageCard
            title="Finished Match Summaries"
            result={fixtureSummaryCoverage}
            detail={`${formatNumber(
              totalFinishedWithSummary,
            )} / ${formatNumber(
              totalFinished,
            )} finished fixtures`}
          />

          <CoverageCard
            title="Upcoming Match Summaries"
            result={totalUpcomingSummaryCoverage}
            detail={`${formatNumber(
              upcomingSummaryCount,
            )} / ${formatNumber(
              totalUpcoming,
            )} upcoming fixtures`}
          />

          <CoverageCard
            title="Current Season Teams"
            result={teamCoverage}
            detail={`${formatNumber(
              totalObservedTeams,
            )} / ${formatNumber(
              totalExpectedTeams,
            )} expected teams`}
          />

          <CoverageCard
            title="Standings"
            result={standingCoverage}
            detail={`${formatNumber(
              totalStandingCoveredTeams,
            )} / ${formatNumber(
              totalStandingExpectedTeams,
            )} expected teams`}
          />

          <CoverageCard
            title="Upcoming Fixture Readiness"
            result={calculateCoverage(
              leagues.reduce(
                (sum, league) =>
                  sum +
                  league.upcoming.ready,
                0,
              ),
              totalUpcoming,
            )}
            detail={`${formatNumber(
              leagues.reduce(
                (sum, league) =>
                  sum +
                  league.upcoming.ready,
                0,
              ),
            )} / ${formatNumber(
              totalUpcoming,
            )} ready fixtures`}
          />

          <CoverageCard
            title="Odds Availability"
            result={calculateCoverage(
              leagues.reduce(
                (sum, league) =>
                  sum +
                  league.upcoming.withOdds,
                0,
              ),
              totalUpcoming,
            )}
            detail={`${formatNumber(
              leagues.reduce(
                (sum, league) =>
                  sum +
                  league.upcoming.withOdds,
                0,
              ),
            )} / ${formatNumber(
              totalUpcoming,
            )} upcoming fixtures with odds`}
          />

          <CoverageCard
            title="Overall Sync"
            result={calculateCoverage(
              leagues.reduce(
                (sum, league) =>
                  sum +
                  league.sync
                    .unitProgress
                    .success,
                0,
              ),
              leagues.reduce(
                (sum, league) =>
                  sum +
                  league.sync
                    .unitProgress
                    .total,
                0,
              ),
            )}
            detail="Persistent synchronization unit success"
          />

          <CoverageCard
            title="Overall Work"
            result={calculateCoverage(
              totalMissingWork === 0
                ? 1
                : 0,
              1,
            )}
            detail={
              totalMissingWork === 0
                ? 'No outstanding expected work'
                : `${formatNumber(
                    totalMissingWork,
                  )} outstanding work items`
            }
            overrideValue={
              totalMissingWork === 0
                ? 'Clear'
                : 'Needs Work'
            }
          />
        </div>
      </section>


      {/* ======================================================
          FRESHNESS
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeading
          icon={Clock3}
          title="Data Freshness"
          description="Latest collection timestamps across the active competition set."
        />

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <FreshnessCard
            title="Fixtures"
            timestamp={
              latestFixtureCollection
            }
          />

          <FreshnessCard
            title="Summary Dataset"
            timestamp={
              latestSummaryCollection
            }
          />

          <FreshnessCard
            title="Teams"
            timestamp={
              latestTeamCollection
            }
          />

          <FreshnessCard
            title="Standings"
            timestamp={
              latestStandingCollection
            }
          />

          <FreshnessCard
            title="News"
            timestamp={
              latestNewsCollection
            }
          />

          <FreshnessCard
            title="Sync Completion"
            timestamp={
              latestSyncCompletion
            }
          />
        </div>
      </section>


      {/* ======================================================
          MISSING WORK
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeading
          icon={ListChecks}
          title="Outstanding Work"
          description="Expected operational data that is currently missing from the active league scope."
        />

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <WorkMetric
            label="Missing Finished Summaries"
            value={
              expectedWork
                ?.finishedFixturesMissingSummary ??
              0
            }
          />

          <WorkMetric
            label="Missing Standings"
            value={
              expectedWork
                ?.standingsMissingTeams ??
              0
            }
          />

          <WorkMetric
            label="Missing Upcoming Summaries"
            value={
              expectedWork
                ?.upcomingFixturesMissingSummary ??
              0
            }
          />

          <WorkMetric
            label="Missing Odds"
            value={
              expectedWork
                ?.upcomingFixturesMissingOdds ??
              0
            }
          />
        </div>
      </section>


      {/* ======================================================
          LEAGUE HEALTH MATRIX
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-border bg-card/60">
        <div className="border-b border-border p-4">
          <SectionHeading
            icon={BarChart3}
            title="League Data Health"
            description="Coverage and synchronization state for every active competition."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground">
                <th className="px-4 py-3 font-medium">
                  League
                </th>

                <th className="px-4 py-3 font-medium">
                  Priority
                </th>

                <th className="px-4 py-3 font-medium">
                  Fixtures
                </th>

                <th className="px-4 py-3 font-medium">
                  Summary
                </th>

                <th className="px-4 py-3 font-medium">
                  Teams
                </th>

                <th className="px-4 py-3 font-medium">
                  Standings
                </th>

                <th className="px-4 py-3 font-medium">
                  Upcoming
                </th>

                <th className="px-4 py-3 font-medium">
                  Sync
                </th>
              </tr>
            </thead>

            <tbody>
              {leagues.map(
                league => {
                  const summary =
                    league.fixtures.finished > 0
                      ? league.fixtures
                          .summaryCoveragePercent
                      : 0;

                  const syncPercent =
                    league.sync
                      .unitProgress
                      .completionPercent;

                  const syncStatus =
                    getLeagueSyncStatus(
                      league,
                    );

                  return (
                    <tr
                      key={
                        league.competitionId
                      }
                      className="border-b border-border/60 align-middle last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-foreground">
                          {league.name}
                        </p>

                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {league.espnLeagueSlug}
                          {league.season !== undefined
                            ? ` · ${league.season}`
                            : ''}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${priorityClass(
                            league.priority,
                          )}`}
                        >
                          {league.priority}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-foreground">
                          {formatNumber(
                            league.fixtures.total,
                          )}
                        </p>

                        <p className="mt-1 text-[9px] text-muted-foreground">
                          {formatNumber(
                            league.fixtures.finished,
                          )}{' '}
                          finished
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <CoverageBadge
                          value={summary}
                        />
                      </td>

                      <td className="px-4 py-3">
                        <CoverageBadge
                          value={
                            league.teams
                              ?.coveragePercent ??
                            0
                          }
                        />
                      </td>

                      <td className="px-4 py-3">
                        <CoverageBadge
                          value={
                            league.standings
                              ?.coveragePercent ??
                            0
                          }
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="min-w-[100px]">
                          <p className="text-xs font-semibold text-foreground">
                            {formatNumber(
                              league.upcoming.total,
                            )}
                          </p>

                          <p className="mt-1 text-[9px] text-muted-foreground">
                            {formatNumber(
                              league.upcoming.ready,
                            )}{' '}
                            ready
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="min-w-[100px]">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`rounded-full px-2 py-1 text-[9px] font-semibold ${syncStatusClass(
                                syncStatus,
                              )}`}
                            >
                              {syncStatus}
                            </span>

                            <span className="text-[9px] font-semibold text-foreground">
                              {syncPercent}%
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    syncPercent,
                                  ),
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}

              {leagues.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-xs text-muted-foreground"
                  >
                    No active league data is currently available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>


      {/* ======================================================
          LEAGUE DETAILS
      ====================================================== */}

      <section>
        <SectionHeading
          icon={Layers3}
          title="League Detail"
          description="Expanded operational view of each active competition."
        />

        <div className="mt-3 space-y-3">
          {leagues.map(
            league => (
              <details
                key={`${league.competitionId}-detail`}
                className="group rounded-2xl border border-border bg-card/60"
              >
                <summary className="cursor-pointer list-none px-4 py-4 [&::-webkit-details-marker]:hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {league.name}
                        </span>

                        {league.season !== undefined && (
                          <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-medium text-muted-foreground">
                            {league.season}
                          </span>
                        )}

                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${priorityClass(
                            league.priority,
                          )}`}
                        >
                          {league.priority}
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {league.espnLeagueSlug}
                        {' · '}
                        {league.region}
                        {' · '}
                        {league.type}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[9px] text-muted-foreground">
                          Summary
                        </p>

                        <p
                          className={`mt-1 text-xs font-bold ${coverageClass(
                            league.fixtures
                              .summaryCoveragePercent,
                          )}`}
                        >
                          {league.fixtures
                            .summaryCoveragePercent}%
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] text-muted-foreground">
                          Sync
                        </p>

                        <p className="mt-1 text-xs font-bold text-foreground">
                          {league.sync
                            .unitProgress
                            .completionPercent}%
                        </p>
                      </div>

                      <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
                        ▼
                      </span>
                    </div>
                  </div>
                </summary>

                <div className="border-t border-border p-4">
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <DetailPanel
                      title="Fixtures & Summary"
                      rows={[
                        [
                          'Total',
                          formatNumber(
                            league.fixtures.total,
                          ),
                        ],
                        [
                          'Upcoming',
                          formatNumber(
                            league.fixtures.upcoming,
                          ),
                        ],
                        [
                          'Live',
                          formatNumber(
                            league.fixtures.live,
                          ),
                        ],
                        [
                          'Finished',
                          formatNumber(
                            league.fixtures.finished,
                          ),
                        ],
                        [
                          'With Summary',
                          formatNumber(
                            league.fixtures.finishedWithSummary,
                          ),
                        ],
                        [
                          'Missing Summary',
                          formatNumber(
                            league.fixtures.finishedMissingSummary,
                          ),
                        ],
                        [
                          'Summary Coverage',
                          `${league.fixtures.summaryCoveragePercent}%`,
                        ],
                        [
                          'Latest Collection',
                          freshnessLabel(
                            league.fixtures
                              .latestCollectedAt,
                          ),
                        ],
                      ]}
                    />

                    <DetailPanel
                      title="Teams & Standings"
                      rows={[
                        [
                          'Teams',
                          formatNumber(
                            league.teams
                              ?.distinctTeams ??
                              0,
                          ),
                        ],
                        [
                          'Expected Teams',
                          formatNumber(
                            league.teams
                              ?.expectedCurrentSeasonTeams ??
                              0,
                          ),
                        ],
                        [
                          'Missing Teams',
                          formatNumber(
                            league.teams
                              ?.missingCurrentSeasonTeams ??
                              0,
                          ),
                        ],
                        [
                          'Team Coverage',
                          `${league.teams
                            ?.coveragePercent ?? 0}%`,
                        ],
                        [
                          'Standings Teams',
                          formatNumber(
                            league.standings
                              ?.teams ??
                              0,
                          ),
                        ],
                        [
                          'Expected Standing Teams',
                          formatNumber(
                            league.standings
                              ?.expectedTeams ??
                              0,
                          ),
                        ],
                        [
                          'Standing Coverage',
                          `${league.standings
                            ?.coveragePercent ?? 0}%`,
                        ],
                      ]}
                    />

                    <DetailPanel
                      title="Upcoming & Providers"
                      rows={[
                        [
                          'Upcoming',
                          formatNumber(
                            league.upcoming.total,
                          ),
                        ],
                        [
                          'Ready',
                          formatNumber(
                            league.upcoming.ready,
                          ),
                        ],
                        [
                          'Partial',
                          formatNumber(
                            league.upcoming.partial,
                          ),
                        ],
                        [
                          'Missing',
                          formatNumber(
                            league.upcoming.missing,
                          ),
                        ],
                        [
                          'With Summary',
                          formatNumber(
                            league.upcoming.withSummary,
                          ),
                        ],
                        [
                          'With Odds',
                          formatNumber(
                            league.upcoming.withOdds,
                          ),
                        ],
                        [
                          'Missing Summary',
                          formatNumber(
                            league.upcoming.missingSummary,
                          ),
                        ],
                      ]}
                    />

                    <DetailPanel
                      title="Operations"
                      rows={[
                        [
                          'Queue Total',
                          formatNumber(
                            league.queue.total,
                          ),
                        ],
                        [
                          'Queue Pending',
                          formatNumber(
                            league.queue.pending,
                          ),
                        ],
                        [
                          'Queue Processing',
                          formatNumber(
                            league.queue.processing,
                          ),
                        ],
                        [
                          'Queue Failed',
                          formatNumber(
                            league.queue.failed,
                          ),
                        ],
                        [
                          'Sync States',
                          formatNumber(
                            league.sync.totalStates,
                          ),
                        ],
                        [
                          'Sync Processing',
                          formatNumber(
                            league.sync
                              .unitProgress
                              .processing,
                          ),
                        ],
                        [
                          'Sync Failed',
                          formatNumber(
                            league.sync
                              .unitProgress
                              .failed,
                          ),
                        ],
                      ]}
                    />
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
                          ?.latestCollectedAt
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

                    <FreshnessCard
                      title="Latest Sync"
                      timestamp={
                        league.sync
                          .latestCompletedAt
                      }
                    />
                  </div>

                  <div className="mt-3 rounded-xl border border-border bg-background/40 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Expected Work
                        </p>

                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Outstanding operational work for this league.
                        </p>
                      </div>

                      <span
                        className={
                          (
                            league.expectedWork
                              .finishedFixturesMissingSummary +
                            league.expectedWork
                              .standingsMissingTeams +
                            league.expectedWork
                              .upcomingFixturesMissingOdds +
                            league.expectedWork
                              .upcomingFixturesMissingSummary
                          ) === 0
                            ? 'rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-600'
                            : 'rounded-full bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-600'
                        }
                      >
                        {(
                          league.expectedWork
                            .finishedFixturesMissingSummary +
                          league.expectedWork
                            .standingsMissingTeams +
                          league.expectedWork
                            .upcomingFixturesMissingOdds +
                          league.expectedWork
                            .upcomingFixturesMissingSummary
                        ).toLocaleString()}{' '}
                        outstanding
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                      <MiniWork
                        label="Finished Summaries"
                        value={
                          league.expectedWork
                            .finishedFixturesMissingSummary
                        }
                      />

                      <MiniWork
                        label="Standings"
                        value={
                          league.expectedWork
                            .standingsMissingTeams
                        }
                      />

                      <MiniWork
                        label="Upcoming Summaries"
                        value={
                          league.expectedWork
                            .upcomingFixturesMissingSummary
                        }
                      />

                      <MiniWork
                        label="Odds"
                        value={
                          league.expectedWork
                            .upcomingFixturesMissingOdds
                        }
                      />
                    </div>
                  </div>
                </div>
              </details>
            ),
          )}

          {leagues.length === 0 && (
            <div className="rounded-2xl border border-border bg-card/60 p-8 text-center text-xs text-muted-foreground">
              No league detail is currently available.
            </div>
          )}
        </div>
      </section>


      {/* ======================================================
          COLLECTION ROLES
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeading
          icon={Database}
          title="Collection Roles"
          description="How the stored datasets participate in the sports architecture."
        />

        <div className="mt-4 space-y-2">
          <RoleCard
            title="Active Competition Registry"
            value="sports_active_competitions"
            description={
              notes?.activeCompetitionSourceOfTruth ??
              'Operational competition source of truth.'
            }
          />

          <RoleCard
            title="ESPN Catalogue"
            value="sports_espn_leagues"
            description={
              notes?.catalogueRole ??
              'Complete ESPN catalogue/reference.'
            }
          />

          <RoleCard
            title="Fixture + Match Summary"
            value="sports_espn_fixtures"
            description={
              notes?.summaryStorageModel ??
              'Canonical ESPN fixture dataset with the stored match Summary inside payload.summary.'
            }
          />

          <RoleCard
            title="Queue Retention"
            value="sports_espn_queue"
            description={
              notes?.queueHistoryWindow ??
              'Completed queue history is retained only for the configured operational window.'
            }
          />

          <RoleCard
            title="Persistent Synchronization"
            value="sports_sync_states"
            description={
              notes?.syncProgressSource ??
              'Unit-level DATE/STEP progress source.'
            }
          />

          <RoleCard
            title="Provider Telemetry"
            value="sports_provider_rate_limits"
            description={
              notes?.providerTelemetryLimit ??
              'Current usage, endpoint state, locks and last-request telemetry.'
            }
          />

          <RoleCard
            title="Odds Identity"
            value="sports_odds_snapshots"
            description={
              notes?.oddsMatchingLimit ??
              'Odds remain a separate provider dataset and do not form part of the ESPN canonical match dataset.'
            }
          />
        </div>
      </section>


      {/* ======================================================
          DATA DOMAINS
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeading
          icon={Layers3}
          title="Sports Data Domains"
          description="Inventory grouped by provider and application role."
        />

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DomainCard
            title="ESPN"
            items={[
              [
                'Catalogue',
                inventory?.espnCatalogue ?? 0,
              ],
              [
                'Fixtures + Summary',
                inventory?.espnFixtures ?? 0,
              ],
              [
                'Teams',
                inventory?.espnTeams ?? 0,
              ],
              [
                'Standings',
                inventory?.espnStandings ?? 0,
              ],
              [
                'News',
                inventory?.espnNews ?? 0,
              ],
            ]}
          />

          <DomainCard
            title="External Providers"
            items={[
              [
                'Football-Data Competitions',
                inventory?.footballDataCompetitions ?? 0,
              ],
              [
                'Football-Data Matches',
                inventory?.footballDataMatches ?? 0,
              ],
              [
                'Football-Data Standings',
                inventory?.footballDataStandings ?? 0,
              ],
              [
                'Football-Data Teams',
                inventory?.footballDataTeams ?? 0,
              ],
              [
                'Odds Snapshots',
                inventory?.sportsOddsSnapshots ?? 0,
              ],
            ]}
          />

          <DomainCard
            title="Operations"
            items={[
              [
                'Queue',
                inventory?.espnQueue ?? 0,
              ],
              [
                'Sync States',
                inventory?.sportsSyncStates ?? 0,
              ],
              [
                'YouTube Highlights',
                inventory?.youtubeHighlights ?? 0,
              ],
              [
                'Active Competitions',
                inventory?.activeCompetitions ?? 0,
              ],
            ]}
          />

          <DomainCard
            title="Operational Health"
            items={[
              [
                'Finished Fixtures',
                totalFinished,
              ],
              [
                'Finished With Summary',
                totalFinishedWithSummary,
              ],
              [
                'Upcoming Fixtures',
                totalUpcoming,
              ],
              [
                'Upcoming With Summary',
                upcomingSummaryCount,
              ],
              [
                'Live Fixtures',
                totalLive,
              ],
            ]}
          />
        </div>
      </section>


      {/* ======================================================
          NOTE
      ====================================================== */}

      <div className="rounded-2xl border border-border bg-background/30 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

          <p className="text-xs leading-5 text-muted-foreground">
            Inventory values represent stored documents. Coverage values are
            derived from the active competition data returned by the monitor.
            ESPN fixtures are the canonical match dataset, with detailed ESPN
            Summary data stored inside each fixture document. Odds remain a
            separate provider dataset, and operational synchronization is
            tracked through the persistent sync-state collection.
          </p>
        </div>
      </div>
    </div>
  );
}


// ============================================================
// SECTION HEADING
// ============================================================

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Database;
  title: string;
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
// HEALTH METRIC
// ============================================================

function HealthMetric({
  label,
  value,
  icon: Icon,
  danger = false,
}: {
  label: string;
  value: number | string;
  icon: typeof Database;
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
// INVENTORY CARD
// ============================================================

function InventoryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Database className="h-4 w-4" />

        <span className="text-[10px] leading-4">
          {label}
        </span>
      </div>

      <p className="mt-2 text-lg font-bold text-foreground">
        {formatNumber(value)}
      </p>
    </div>
  );
}


// ============================================================
// COVERAGE CARD
// ============================================================

function CoverageCard({
  title,
  result,
  detail,
  overrideValue,
}: {
  title: string;
  result: CoverageResult;
  detail: string;
  overrideValue?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-foreground">
            {title}
          </p>

          <p className="mt-1 text-[10px] text-muted-foreground">
            {detail}
          </p>
        </div>

        <span
          className={`rounded-full px-2 py-1 text-[10px] font-bold ${coverageBadgeClass(
            result.percent,
          )}`}
        >
          {overrideValue ??
            `${result.percent}%`}
        </span>
      </div>

      {!overrideValue && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    result.percent,
                  ),
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>
          Covered {formatNumber(result.covered)}
        </span>

        <span>
          Missing {formatNumber(result.missing)}
        </span>
      </div>
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
// WORK
// ============================================================

function WorkMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const clear =
    value === 0;

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center gap-2">
        {clear ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <XCircle className="h-3.5 w-3.5 text-red-600" />
        )}

        <span className="text-[10px] text-muted-foreground">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 text-lg font-bold ${
          clear
            ? 'text-emerald-600'
            : 'text-red-600'
        }`}
      >
        {formatNumber(value)}
      </p>
    </div>
  );
}


// ============================================================
// COVERAGE BADGE
// ============================================================

function CoverageBadge({
  value,
}: {
  value: number;
}) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[9px] font-semibold ${coverageBadgeClass(
        value,
      )}`}
    >
      {value}%
    </span>
  );
}


// ============================================================
// DETAIL PANEL
// ============================================================

function DetailPanel({
  title,
  rows,
}: {
  title: string;
  rows: Array<
    [string, string]
  >;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <h4 className="text-xs font-semibold text-foreground">
        {title}
      </h4>

      <div className="mt-3 space-y-2">
        {rows.map(
          ([
            label,
            value,
          ]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-[10px] text-muted-foreground">
                {label}
              </span>

              <span className="text-right text-[10px] font-semibold text-foreground">
                {value}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}


// ============================================================
// MINI WORK
// ============================================================

function MiniWork({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-2">
      <p className="text-[9px] text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-bold ${
          value > 0
            ? 'text-amber-600'
            : 'text-emerald-600'
        }`}
      >
        {formatNumber(value)}
      </p>
    </div>
  );
}


// ============================================================
// ROLE
// ============================================================

function RoleCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />

        <span className="text-xs font-semibold text-foreground">
          {title}
        </span>

        <code className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
          {value}
        </code>
      </div>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}


// ============================================================
// DOMAIN
// ============================================================

function DomainCard({
  title,
  items,
}: {
  title: string;
  items: Array<
    [string, number]
  >;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <h4 className="text-xs font-semibold text-foreground">
        {title}
      </h4>

      <div className="mt-3 space-y-2">
        {items.map(
          ([
            label,
            value,
          ]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-[10px] text-muted-foreground">
                {label}
              </span>

              <span className="text-xs font-semibold text-foreground">
                {formatNumber(value)}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
