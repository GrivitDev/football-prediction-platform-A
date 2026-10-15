'use client';

import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Database,
  FileCheck2,
  Layers3,
  ListChecks,
  RefreshCw,
  ShieldCheck,
  Trophy,
  Users,
  Workflow,
  XCircle,
  Zap,
} from 'lucide-react';

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

  return `${Math.floor(hours / 24)}d ago`;
};


const getLatestTimestamp = (
  values: Array<
    string | undefined
  >,
): string | undefined => {
  return values
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
    )[0]?.value;
};


const coverageBadgeClass = (
  value: number,
): string => {
  if (value >= 95) {
    return 'bg-emerald-500/10 text-emerald-600';
  }

  if (value >= 80) {
    return 'bg-amber-500/10 text-amber-600';
  }

  return 'bg-red-500/10 text-red-600';
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


const syncStatusClass = (
  status: string,
): string => {
  switch (status) {
    case 'SUCCESS':
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


const providerStatusClass = (
  healthy: boolean,
): string => {
  return healthy
    ? 'bg-emerald-500/10 text-emerald-600'
    : 'bg-red-500/10 text-red-600';
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


const getExpectedWorkTotal = (
  expectedWork?: object,
): number => {
  return Object.values(
    expectedWork ?? {},
  ).reduce(
    (total, value) =>
      total + Number(value ?? 0),
    0,
  );
};


const getSyncDisplayStatus = (
  sync?: {
    unitProgress: {
      processing: number;
      failed: number;
    };
    stateCompletionPercent: number;
  },
): string => {
  if (!sync) {
    return 'UNKNOWN';
  }

  if (sync.unitProgress.processing > 0) {
    return 'PROCESSING';
  }

  if (sync.unitProgress.failed > 0) {
    return 'PARTIAL';
  }

  if (sync.stateCompletionPercent >= 100) {
    return 'SUCCESS';
  }

  return 'PENDING';
};


const formatJobType = (
  value: string,
): string => {
  return value
    .replaceAll(
      '_',
      ' ',
    )
    .toLowerCase()
    .replace(
      /^./,
      char =>
        char.toUpperCase(),
    );
};


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorSportsData() {
  const monitorQuery =
    useSportsSystemMonitor();

  const monitor =
    monitorQuery.data;

  const inventory =
    monitor?.inventory;

  const queue =
    monitor?.queue;

  const sync =
    monitor?.sync;

  const expectedWork =
    monitor?.expectedWork;

  const providers =
    monitor?.providers ?? [];

  const pipeline =
    monitor?.pipeline ?? {};

  const leagues =
    monitor?.leagues ?? [];


  // ==========================================================
  // GLOBAL FIXTURE TOTALS
  // ==========================================================

  const totalFixtures =
    leagues.reduce(
      (total, league) =>
        total +
        league.fixtures.total,
      0,
    );

  const totalUpcoming =
    leagues.reduce(
      (total, league) =>
        total +
        league.fixtures.upcoming,
      0,
    );

  const totalLive =
    leagues.reduce(
      (total, league) =>
        total +
        league.fixtures.live,
      0,
    );

  const totalFinished =
    leagues.reduce(
      (total, league) =>
        total +
        league.fixtures.finished,
      0,
    );

  const totalSummaries =
    leagues.reduce(
      (total, league) =>
        total +
        league.fixtures.finishedWithSummary,
      0,
    );

  const totalUpcomingReady =
    leagues.reduce(
      (total, league) =>
        total +
        league.upcoming.ready,
      0,
    );

  const totalUpcomingPartial =
    leagues.reduce(
      (total, league) =>
        total +
        league.upcoming.partial,
      0,
    );

  const totalUpcomingMissing =
    leagues.reduce(
      (total, league) =>
        total +
        league.upcoming.missing,
      0,
    );


  // ==========================================================
  // GLOBAL COVERAGE
  // ==========================================================

  const summaryCoverage =
    totalFinished > 0
      ? Number(
          (
            (totalSummaries /
              totalFinished) *
            100
          ).toFixed(2),
        )
      : 0;

  const upcomingCoverage =
    totalUpcoming > 0
      ? Number(
          (
            (totalUpcomingReady /
              totalUpcoming) *
            100
          ).toFixed(2),
        )
      : 0;

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

  const totalExpectedTeams =
    leagues.reduce(
      (total, league) =>
        total +
        league.teams
          .expectedCurrentSeasonTeams,
      0,
    );

  const totalMissingTeams =
    leagues.reduce(
      (total, league) =>
        total +
        league.teams
          .missingCurrentSeasonTeams,
      0,
    );

  const teamCoverage =
    totalExpectedTeams > 0
      ? Number(
          (
            ((totalExpectedTeams -
              totalMissingTeams) /
              totalExpectedTeams) *
            100
          ).toFixed(2),
        )
      : 0;


  // ==========================================================
  // EXPECTED WORK
  // ==========================================================

  const totalExpectedWork =
    getExpectedWorkTotal(
      expectedWork,
    );


  // ==========================================================
  // FRESHNESS
  // ==========================================================

  const latestFixtureCollection =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.fixtures
            ?.latestCollectedAt,
      ),
    );

  const latestSummaryCollection =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.fixtures
            ?.latestCollectedAt,
      ),
    );

  const latestTeamCollection =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.teams
            ?.latestCollectedAt,
      ),
    );

  const latestStandingCollection =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.standings
            ?.latestCollectedAt,
      ),
    );

  const latestNewsCollection =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.news
            ?.latestCollectedAt,
      ),
    );

  const latestSyncCompletion =
    getLatestTimestamp(
      leagues.map(
        league =>
          league.sync
            ?.latestCompletedAt,
      ),
    );


  // ==========================================================
  // PROVIDER HEALTH
  // ==========================================================

  const providersWithLimits =
    providers.filter(
      provider =>
        provider.limits
          .dailyRequestLimit !== null ||
        provider.limits
          .monthlyRequestLimit !== null,
    );

  const providerFailureCount =
    providers.filter(
      provider => {
        const usage =
          provider.usage;

        const dailyExceeded =
          usage.remainingDailyRequests !== null &&
          usage.remainingDailyRequests <= 0;

        const monthlyExceeded =
          usage.remainingMonthlyRequests !== null &&
          usage.remainingMonthlyRequests <= 0;

        return (
          dailyExceeded ||
          monthlyExceeded
        );
      },
    ).length;


  // ==========================================================
  // PIPELINE COUNTS
  // ==========================================================

  const pipelineDefinitions =
    Object.entries(
      pipeline,
    ).filter(
      ([jobType]) =>
        jobType === 'FIXTURE_REFRESH' ||
        jobType === 'SUMMARY_REFRESH',
    );

  const pipelineStateSummary =
    pipelineDefinitions.map(
      ([jobType, definition]) => {
        const counts =
          definition.stateCounts;

        const total =
          Object.values(
            counts,
          ).reduce(
            (sum, value) =>
              sum + Number(value ?? 0),
            0,
          );

        return {
          jobType,
          total,
          counts,
        };
      },
    );


  return (
    <div className="space-y-4">
      {monitor?.snapshotPartial && (
        <div className="flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-muted-foreground">
          <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-blue-600" />
          <p>
            Live queue, provider, and synchronization status is available. Historical fixture totals, summary coverage, and per-competition readiness are being calculated and will update automatically.
          </p>
        </div>
      )}
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Sports Overview
          </h2>

          <p className="text-sm text-muted-foreground">
            System-wide sports inventory, operational health, coverage, freshness, providers, and active competitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-[10px] text-muted-foreground sm:inline">
            {monitor
              ? `Updated ${formatDateTime(
                  monitor.generatedAt,
                )}`
              : 'Loading'}
          </span>

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
          EXECUTIVE METRICS
      ====================================================== */}

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <MetricCard
          label="Competitions"
          value={
            inventory?.activeCompetitions ?? 0
          }
          icon={Trophy}
        />

        <MetricCard
          label="Fixtures"
          value={totalFixtures}
          icon={CalendarDays}
        />

        <MetricCard
          label="Upcoming"
          value={totalUpcoming}
          icon={Clock3}
        />

        <MetricCard
          label="Live"
          value={totalLive}
          icon={Zap}
        />

        <MetricCard
          label="Finished"
          value={totalFinished}
          icon={FileCheck2}
        />

        <MetricCard
          label="Teams"
          value={
            inventory?.espnTeams ?? 0
          }
          icon={Users}
        />
      </section>


      {/* ======================================================
          SYSTEM HEALTH
      ====================================================== */}

      <section>
        <SectionHeader
          icon={ShieldCheck}
          title="System Health"
          description="Current operational state across queues, synchronization, readiness, and expected work."
        />

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            label="Queue"
            value={
              queue
                ? `${formatNumber(
                    queue.pending,
                  )} pending`
                : '—'
            }
            detail={
              queue
                ? `${formatNumber(
                    queue.processing,
                  )} processing · ${formatNumber(
                    queue.failed,
                  )} failed · ${formatNumber(
                    queue.staleProcessing,
                  )} stale`
                : ''
            }
            icon={ListChecks}
            tone={
              (queue?.failed ?? 0) > 0
                ? 'danger'
                : (queue?.staleProcessing ?? 0) > 0
                  ? 'warning'
                  : 'success'
            }
          />

          <StatusCard
            label="Synchronization"
            value={
              sync
                ? `${sync.unitProgress.completionPercent}%`
                : '—'
            }
            detail={
              sync
                ? `${formatNumber(
                    sync.unitProgress.processing,
                  )} processing · ${formatNumber(
                    sync.unitProgress.pending,
                  )} pending · ${formatNumber(
                    sync.unitProgress.failed,
                  )} failed`
                : ''
            }
            icon={RefreshCw}
            tone={
              (sync?.unitProgress.failed ?? 0) > 0
                ? 'danger'
                : (sync?.unitProgress.processing ?? 0) > 0
                  ? 'warning'
                  : 'success'
            }
          />

          <StatusCard
            label="Upcoming Readiness"
            value={
              totalUpcoming > 0
                ? `${upcomingCoverage}%`
                : '—'
            }
            detail={
              totalUpcoming > 0
                ? `${formatNumber(
                    totalUpcomingReady,
                  )}/${formatNumber(
                    totalUpcoming,
                  )} ready · ${formatNumber(
                    totalUpcomingPartial,
                  )} partial · ${formatNumber(
                    totalUpcomingMissing,
                  )} missing`
                : 'No upcoming fixtures in monitor window'
            }
            icon={Zap}
            tone={
              upcomingCoverage >= 95
                ? 'success'
                : upcomingCoverage >= 80
                  ? 'warning'
                  : 'danger'
            }
          />

          <StatusCard
            label="Expected Work"
            value={formatNumber(
              totalExpectedWork,
            )}
            detail={
              totalExpectedWork > 0
                ? 'Known missing operational work'
                : 'No explicitly known missing work'
            }
            icon={
              totalExpectedWork > 0
                ? AlertTriangle
                : CheckCircle2
            }
            tone={
              totalExpectedWork > 0
                ? 'warning'
                : 'success'
            }
          />
        </div>
      </section>


      {/* ======================================================
          DATA COVERAGE
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeader
          icon={BarChart3}
          title="Data Coverage"
          description="Aggregated coverage across the active competition set."
        />

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <CoverageCard
            title="Finished Summaries"
            value={summaryCoverage}
            detail={`${formatNumber(
              totalSummaries,
            )}/${formatNumber(
              totalFinished,
            )} finished fixtures`}
          />

          <CoverageCard
            title="Team Coverage"
            value={teamCoverage}
            detail={`${formatNumber(
              totalExpectedTeams -
                totalMissingTeams,
            )}/${formatNumber(
              totalExpectedTeams,
            )} expected teams`}
          />

          <CoverageCard
            title="Upcoming Readiness"
            value={upcomingCoverage}
            detail={`${formatNumber(
              totalUpcomingReady,
            )}/${formatNumber(
              totalUpcoming,
            )} ready`}
          />

          <CoverageCard
            title="Sync Coverage"
            value={averageSyncCoverage}
            detail="Average active-league unit completion"
          />
        </div>
      </section>


      {/* ======================================================
          DATA FRESHNESS
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeader
          icon={Clock3}
          title="Data Freshness"
          description="Latest persisted collection and synchronization timestamps across active competitions."
        />

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <FreshnessCard
            title="Fixtures"
            timestamp={
              latestFixtureCollection
            }
          />

          <FreshnessCard
            title="Match Summary"
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
            title="Sync"
            timestamp={
              latestSyncCompletion
            }
          />
        </div>
      </section>


      {/* ======================================================
          OPERATIONAL WORK
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeader
          icon={ListChecks}
          title="Known Missing Work"
          description="Explicit missing operational data identified from the current monitor state."
        />

        <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
          <WorkMetric
            label="Missing Finished Summaries"
            value={
              expectedWork
                ?.finishedFixturesMissingSummary ?? 0
            }
          />

          <WorkMetric
            label="Missing Standings Teams"
            value={
              expectedWork
                ?.standingsMissingTeams ?? 0
            }
          />

          <WorkMetric
            label="Missing Upcoming Summaries"
            value={
              expectedWork
                ?.upcomingFixturesMissingSummary ?? 0
            }
          />

          <WorkMetric
            label="Missing Upcoming Odds"
            value={
              expectedWork
                ?.upcomingFixturesMissingOdds ?? 0
            }
          />
        </div>
      </section>


      {/* ======================================================
          PROVIDERS
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-border bg-card/60">
        <div className="border-b border-border p-4">
          <SectionHeader
            icon={Zap}
            title="Provider Status"
            description="Current provider usage, request limits, locks, and endpoint telemetry."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground">
                <th className="px-4 py-3 font-medium">
                  Provider
                </th>

                <th className="px-4 py-3 font-medium">
                  Daily Usage
                </th>

                <th className="px-4 py-3 font-medium">
                  Monthly Usage
                </th>

                <th className="px-4 py-3 font-medium">
                  Remaining
                </th>

                <th className="px-4 py-3 font-medium">
                  Active Locks
                </th>

                <th className="px-4 py-3 font-medium">
                  Endpoints
                </th>

                <th className="px-4 py-3 font-medium">
                  Last Request
                </th>

                <th className="px-4 py-3 font-medium">
                  Telemetry
                </th>
              </tr>
            </thead>

            <tbody>
              {providers.map(
                provider => {
                  const dailyLimited =
                    provider.limits
                      .dailyRequestLimit !== null;

                  const monthlyLimited =
                    provider.limits
                      .monthlyRequestLimit !== null;

                  const dailyExhausted =
                    provider.usage
                      .remainingDailyRequests !== null &&
                    provider.usage
                      .remainingDailyRequests <= 0;

                  const monthlyExhausted =
                    provider.usage
                      .remainingMonthlyRequests !== null &&
                    provider.usage
                      .remainingMonthlyRequests <= 0;

                  const healthy =
                    !dailyExhausted &&
                    !monthlyExhausted;

                  return (
                    <tr
                      key={
                        provider.provider
                      }
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              healthy
                                ? 'bg-emerald-500'
                                : 'bg-red-500'
                            }`}
                          />

                          <span className="text-xs font-semibold text-foreground">
                            {provider.provider}
                          </span>
                        </div>

                        <p className="mt-1 text-[9px] text-muted-foreground">
                          Min interval{' '}
                          {provider.limits
                            .minIntervalSeconds}
                          s
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-foreground">
                          {formatNumber(
                            provider.usage
                              .dailyRequests,
                          )}
                        </p>

                        <p className="mt-1 text-[9px] text-muted-foreground">
                          {dailyLimited
                            ? `/ ${formatNumber(
                                provider.limits
                                  .dailyRequestLimit ??
                                  0,
                              )}`
                            : 'No daily limit'}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-foreground">
                          {formatNumber(
                            provider.usage
                              .monthlyRequests,
                          )}
                        </p>

                        <p className="mt-1 text-[9px] text-muted-foreground">
                          {monthlyLimited
                            ? `/ ${formatNumber(
                                provider.limits
                                  .monthlyRequestLimit ??
                                  0,
                              )}`
                            : 'No monthly limit'}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <p
                            className={`text-[10px] font-semibold ${
                              dailyExhausted
                                ? 'text-red-600'
                                : 'text-foreground'
                            }`}
                          >
                            Daily:{' '}
                            {provider.usage
                              .remainingDailyRequests ??
                              '∞'}
                          </p>

                          <p
                            className={`text-[10px] font-semibold ${
                              monthlyExhausted
                                ? 'text-red-600'
                                : 'text-foreground'
                            }`}
                          >
                            Monthly:{' '}
                            {provider.usage
                              .remainingMonthlyRequests ??
                              '∞'}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[9px] font-semibold ${providerStatusClass(
                            provider.usage
                              .activeLocks ===
                              0,
                          )}`}
                        >
                          {provider.usage
                            .activeLocks}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-foreground">
                          {provider.endpoints.length}
                        </p>

                        <p className="mt-1 text-[9px] text-muted-foreground">
                          endpoint records
                        </p>
                      </td>

                      <td className="px-4 py-3 text-[10px] text-muted-foreground">
                        {formatDateTime(
                          provider.usage
                            .lastRequestAt,
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-semibold text-muted-foreground">
                          Current-period
                        </span>
                      </td>
                    </tr>
                  );
                },
              )}

              {providers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-xs text-muted-foreground"
                  >
                    No provider telemetry is currently available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {providersWithLimits.length > 0 && (
          <div className="border-t border-border px-4 py-3 text-[10px] text-muted-foreground">
            {providerFailureCount > 0
              ? `${providerFailureCount} provider limit state requires attention.`
              : 'No provider quota is currently exhausted.'}
          </div>
        )}
      </section>


      {/* ======================================================
          PIPELINE
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeader
          icon={Workflow}
          title="Sports Pipeline"
          description="Current state distribution across the two operational queue job types."
        />

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {pipelineStateSummary.map(
            pipelineItem => (
              <PipelineCard
                key={
                  pipelineItem.jobType
                }
                jobType={
                  pipelineItem.jobType
                }
                total={
                  pipelineItem.total
                }
                counts={
                  pipelineItem.counts
                }
              />
            ),
          )}

          {pipelineStateSummary.length ===
            0 && (
            <div className="md:col-span-2">
              <EmptyState>
                No pipeline definitions are currently available.
              </EmptyState>
            </div>
          )}
        </div>
      </section>


      {/* ======================================================
          ACTIVE COMPETITION SNAPSHOT
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-border bg-card/60">
        <div className="border-b border-border p-4">
          <SectionHeader
            icon={Trophy}
            title="Active Competition Snapshot"
            description="System-wide operational picture of every active competition."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground">
                <th className="px-4 py-3 font-medium">
                  Competition
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

                <th className="px-4 py-3 font-medium">
                  Queue
                </th>

                <th className="px-4 py-3 font-medium">
                  Missing
                </th>
              </tr>
            </thead>

            <tbody>
              {leagues.map(
                league => {
                  const syncStatus =
                    getSyncDisplayStatus(
                      league.sync,
                    );

                  const leagueMissingWork =
                    getExpectedWorkTotal(
                      league.expectedWork,
                    );

                  const upcomingStatus =
                    league.upcoming
                      .total === 0
                      ? 'MISSING'
                      : league.upcoming
                            .ready ===
                          league.upcoming
                            .total
                        ? 'READY'
                        : 'PARTIAL';

                  return (
                    <tr
                      key={
                        league.competitionId
                      }
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="max-w-[160px] truncate text-xs font-semibold text-foreground">
                          {league.name}
                        </p>

                        <p className="mt-1 max-w-[160px] truncate font-mono text-[9px] text-muted-foreground">
                          {league.espnLeagueSlug}
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
                            league.fixtures.live,
                          )}{' '}
                          live ·{' '}
                          {formatNumber(
                            league.fixtures.finished,
                          )}{' '}
                          finished
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <CoverageBadge
                          value={
                            league.fixtures
                              .summaryCoveragePercent ??
                            0
                          }
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
                        <div className="flex flex-col gap-1">
                          <span
                            className={`w-fit rounded-full px-2 py-1 text-[9px] font-semibold ${readinessClass(
                              upcomingStatus,
                            )}`}
                          >
                            {formatNumber(
                              league.upcoming
                                .ready,
                            )}
                            /
                            {formatNumber(
                              league.upcoming
                                .total,
                            )}
                          </span>

                          <span className="text-[9px] text-muted-foreground">
                            {league.upcoming
                              .total > 0
                              ? `${Math.round(
                                  (
                                    league.upcoming
                                      .ready /
                                    league.upcoming
                                      .total
                                  ) *
                                    100,
                                )}% ready`
                              : 'No upcoming'}
                          </span>
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
                              {
                                league.sync
                                  .unitProgress
                                  .completionPercent
                              }%
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
                                    league.sync
                                      .unitProgress
                                      .completionPercent,
                                  ),
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-foreground">
                          {formatNumber(
                            league.queue
                              .pending,
                          )}
                        </p>

                        <p className="mt-1 text-[9px] text-muted-foreground">
                          {formatNumber(
                            league.queue
                              .processing,
                          )}{' '}
                          processing
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            leagueMissingWork >
                            0
                              ? 'text-xs font-bold text-amber-600'
                              : 'text-xs font-bold text-emerald-600'
                          }
                        >
                          {formatNumber(
                            leagueMissingWork,
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                },
              )}

              {leagues.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-10 text-center text-xs text-muted-foreground"
                  >
                    No active competitions are currently exposed by the sports monitor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>


      {/* ======================================================
          ARCHITECTURE SCOPE
      ====================================================== */}

      <section className="grid gap-3 md:grid-cols-2">
        <ScopeCard
          title="Operational Scope"
          icon={Layers3}
          rows={[
            [
              'Active competitions',
              formatNumber(
                monitor?.scope
                  .activeCompetitions ??
                0,
              ),
            ],
            [
              'Catalogue competitions',
              formatNumber(
                monitor?.scope
                  .catalogueCompetitions ??
                0,
              ),
            ],
            [
              'Operational season scope',
              monitor?.scope
                .operationalSeasonScope
                ? 'Enabled'
                : 'Disabled',
            ],
          ]}
        />

        <ScopeCard
          title="Inventory Snapshot"
          icon={Database}
          rows={[
            [
              'ESPN catalogue',
              formatNumber(
                inventory?.espnCatalogue ??
                0,
              ),
            ],
            [
              'ESPN fixtures',
              formatNumber(
                inventory?.espnFixtures ??
                0,
              ),
            ],
            [
              'ESPN teams',
              formatNumber(
                inventory?.espnTeams ??
                0,
              ),
            ],
            [
              'Sync states',
              formatNumber(
                inventory?.sportsSyncStates ??
                0,
              ),
            ],
            [
              'Queue documents',
              formatNumber(
                inventory?.espnQueue ??
                0,
              ),
            ],
          ]}
        />
      </section>
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
  icon: typeof Database;
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
// METRIC CARD
// ============================================================

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Database;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <span className="text-[10px]">
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
// STATUS CARD
// ============================================================

function StatusCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon:
    | typeof CheckCircle2
    | typeof AlertTriangle
    | typeof ListChecks
    | typeof RefreshCw
    | typeof Zap;
  tone:
    | 'success'
    | 'warning'
    | 'danger';
}) {
  const toneClass =
    tone === 'success'
      ? 'bg-emerald-500/10 text-emerald-600'
      : tone === 'warning'
        ? 'bg-amber-500/10 text-amber-600'
        : 'bg-red-500/10 text-red-600';

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p
        className={`mt-3 inline-flex rounded-full px-2 py-1 text-sm font-bold ${toneClass}`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}


// ============================================================
// COVERAGE CARD
// ============================================================

function CoverageCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-foreground">
          {title}
        </p>

        <span
          className={`rounded-full px-2 py-1 text-[9px] font-bold ${coverageBadgeClass(
            value,
          )}`}
        >
          {value}%
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
                value,
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
// FRESHNESS CARD
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
// WORK METRIC
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
          <XCircle className="h-3.5 w-3.5 text-amber-600" />
        )}

        <span className="text-[10px] text-muted-foreground">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 text-lg font-bold ${
          clear
            ? 'text-emerald-600'
            : 'text-amber-600'
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
// PIPELINE CARD
// ============================================================

function PipelineCard({
  jobType,
  total,
  counts,
}: {
  jobType: string;
  total: number;
  counts: Record<
    string,
    number
  >;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-foreground">
            {formatJobType(jobType)}
          </p>

          <p className="mt-1 text-[10px] text-muted-foreground">
            {formatNumber(total)} state units
          </p>
        </div>

        <Workflow className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="mt-3 space-y-2">
        {Object.entries(
          counts,
        ).map(
          ([
            status,
            count,
          ]) => (
            <div
              key={status}
              className="flex items-center justify-between gap-3"
            >
              <span
                className={`rounded-full px-2 py-1 text-[9px] font-semibold ${syncStatusClass(
                  status,
                )}`}
              >
                {status}
              </span>

              <span className="text-xs font-semibold text-foreground">
                {formatNumber(
                  count,
                )}
              </span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}


// ============================================================
// SCOPE CARD
// ============================================================

function ScopeCard({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: typeof Database;
  rows: Array<
    [string, string]
  >;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />

        <h3 className="text-sm font-semibold text-foreground">
          {title}
        </h3>
      </div>

      <div className="mt-4 space-y-2">
        {rows.map(
          ([
            label,
            value,
          ]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2"
            >
              <span className="text-[10px] text-muted-foreground">
                {label}
              </span>

              <span className="text-xs font-semibold text-foreground">
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
// EMPTY
// ============================================================

function EmptyState({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
      {children}
    </div>
  );
}
