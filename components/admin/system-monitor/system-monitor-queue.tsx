'use client';

import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  Clock3,
  ListChecks,
  RefreshCw,
  RotateCcw,
  TimerReset,
  Workflow,
} from 'lucide-react';

import {
  useState,
} from 'react';

import {
  useAdminEspnQueueSummary,
  useAdminEspnQueues,
  useAdminSportsSyncStateSummary,
  useAdminSportsSyncStates,
} from '@/hooks/use-sports';


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
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );
};


const formatDateOnly = (
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
    Math.floor(
      rounded / 3600,
    );

  const minutes =
    Math.floor(
      (rounded % 3600) / 60,
    );

  const secondsRemaining =
    rounded % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secondsRemaining}s`;
  }

  return `${secondsRemaining}s`;
};


const statusClass = (
  status?: string,
): string => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-600';

    case 'PROCESSING':
      return 'bg-blue-500/10 text-blue-600';

    case 'COMPLETED':
    case 'SUCCESS':
      return 'bg-emerald-500/10 text-emerald-600';

    case 'FAILED':
      return 'bg-red-500/10 text-red-600';

    case 'PARTIAL':
      return 'bg-amber-500/10 text-amber-600';

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
    .replaceAll(
      '_',
      ' ',
    )
    .replace(
      /^./,
      char =>
        char.toUpperCase(),
    );
};


const getUnitDurationSamples = (
  units: Array<{
    status: string;
    startedAt?: string;
    completedAt?: string;
  }>,
): number[] => {
  return units
    .filter(
      unit =>
        unit.status === 'SUCCESS' &&
        unit.startedAt &&
        unit.completedAt,
    )
    .map(
      unit => {
        const started =
          new Date(
            unit.startedAt as string,
          ).getTime();

        const completed =
          new Date(
            unit.completedAt as string,
          ).getTime();

        return completed - started;
      },
    )
    .filter(
      duration =>
        Number.isFinite(duration) &&
        duration > 0,
    );
};


const getSyncTiming = (
  units: Array<{
    status: string;
    startedAt?: string;
    completedAt?: string;
  }>,
) => {
  const samples =
    getUnitDurationSamples(
      units,
    );

  const averageMilliseconds =
    samples.length > 0
      ? samples.reduce(
          (
            total,
            value,
          ) =>
            total + value,
          0,
        ) /
        samples.length
      : undefined;

  const averageSeconds =
    averageMilliseconds !==
      undefined
      ? averageMilliseconds /
        1000
      : undefined;

  const unitsPerMinute =
    averageSeconds !==
      undefined &&
    averageSeconds > 0
      ? 60 /
        averageSeconds
      : undefined;

  const processingUnits =
    units.filter(
      unit =>
        unit.status ===
        'PROCESSING',
    );

  const now =
    Date.now();

  const currentElapsedSeconds =
    processingUnits.length > 0
      ? Math.max(
          ...processingUnits
            .filter(
              unit =>
                Boolean(
                  unit.startedAt,
                ),
            )
            .map(
              unit =>
                Math.max(
                  0,
                  (
                    now -
                    new Date(
                      unit.startedAt as string,
                    ).getTime()
                  ) /
                    1000,
                ),
            ),
        )
      : undefined;

  const successful =
    units.filter(
      unit =>
        unit.status ===
        'SUCCESS',
    ).length;

  const pending =
    units.filter(
      unit =>
        unit.status ===
        'PENDING',
    ).length;

  const processing =
    units.filter(
      unit =>
        unit.status ===
        'PROCESSING',
    ).length;

  const failed =
    units.filter(
      unit =>
        unit.status ===
        'FAILED',
    ).length;

  const remaining =
    Math.max(
      0,
      units.length -
        successful,
    );

  const remainingSeconds =
    averageSeconds !==
        undefined &&
    remaining > 0
      ? remaining *
        averageSeconds
      : undefined;

  const estimatedCompletionAt =
    remainingSeconds !==
        undefined &&
    remainingSeconds > 0
      ? new Date(
          now +
            remainingSeconds *
              1000,
        ).toISOString()
      : undefined;

  return {
    total: units.length,
    successful,
    pending,
    processing,
    failed,
    remaining,
    sampleCount:
      samples.length,
    averageSeconds,
    unitsPerMinute,
    currentElapsedSeconds,
    remainingSeconds,
    estimatedCompletionAt,
  };
};


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorQueue() {
  const [
    expandedSyncState,
    setExpandedSyncState,
  ] = useState<string | null>(
    null,
  );

  const queueSummaryQuery =
    useAdminEspnQueueSummary();

  const queuesQuery =
    useAdminEspnQueues({
      page: 1,
      limit: 25,
      sortBy: 'scheduledFor',
      sortOrder: 'asc',
    });

  const syncSummaryQuery =
    useAdminSportsSyncStateSummary();

  const syncStatesQuery =
    useAdminSportsSyncStates({
      page: 1,
      limit: 20,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    });

  const queueSummary =
    queueSummaryQuery.data;

  const queues =
    queuesQuery.data?.data ?? [];

  const syncStates =
    syncStatesQuery.data?.data ?? [];


  // ==========================================================
  // QUEUE TOTALS
  // ==========================================================

  const queuePending =
    queueSummary?.status.pending ??
    0;

  const queueProcessing =
    queueSummary?.status.processing ??
    0;

  const queueCompleted =
    queueSummary?.status.completed ??
    0;

  const queueFailed =
    queueSummary?.status.failed ??
    0;

  const queueTotal =
    queueSummary?.total ??
    0;


  // ==========================================================
  // SYNC TOTALS
  // ==========================================================

  const totalSyncUnits =
    syncStates.reduce(
      (
        total,
        state,
      ) =>
        total +
        (Array.isArray(
          state.units,
        )
          ? state.units.length
          : 0),
      0,
    );

  const successfulSyncUnits =
    syncStates.reduce(
      (
        total,
        state,
      ) => {
        const units =
          Array.isArray(
            state.units,
          )
            ? state.units
            : [];

        return (
          total +
          units.filter(
            unit =>
              unit.status ===
              'SUCCESS',
          ).length
        );
      },
      0,
    );

  const processingSyncUnits =
    syncStates.reduce(
      (
        total,
        state,
      ) => {
        const units =
          Array.isArray(
            state.units,
          )
            ? state.units
            : [];

        return (
          total +
          units.filter(
            unit =>
              unit.status ===
              'PROCESSING',
          ).length
        );
      },
      0,
    );

  const pendingSyncUnits =
    syncStates.reduce(
      (
        total,
        state,
      ) => {
        const units =
          Array.isArray(
            state.units,
          )
            ? state.units
            : [];

        return (
          total +
          units.filter(
            unit =>
              unit.status ===
              'PENDING',
          ).length
        );
      },
      0,
    );

  const failedSyncUnits =
    syncStates.reduce(
      (
        total,
        state,
      ) => {
        const units =
          Array.isArray(
            state.units,
          )
            ? state.units
            : [];

        return (
          total +
          units.filter(
            unit =>
              unit.status ===
              'FAILED',
          ).length
        );
      },
      0,
    );

  const syncCoverage =
    totalSyncUnits > 0
      ? Number(
          (
            (
              successfulSyncUnits /
              totalSyncUnits
            ) *
            100
          ).toFixed(2),
        )
      : 0;


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="space-y-4">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Sports Queue & Synchronization
          </h2>

          <p className="text-sm text-muted-foreground">
            Queue workload, persistent sync states, unit timing, progress, and current execution state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-[10px] text-muted-foreground sm:inline">
            Auto-refreshing
          </span>

          <RefreshCw
            className={`h-4 w-4 text-muted-foreground ${
              queuesQuery.isFetching ||
              syncStatesQuery.isFetching ||
              queueSummaryQuery.isFetching ||
              syncSummaryQuery.isFetching
                ? 'animate-spin'
                : ''
            }`}
          />
        </div>
      </div>


      {/* ======================================================
          EXECUTIVE METRICS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <QueueMetric
          label="Pending"
          value={queuePending}
          tone="amber"
        />

        <QueueMetric
          label="Processing"
          value={queueProcessing}
          tone="blue"
        />

        <QueueMetric
          label="Completed"
          value={queueCompleted}
          tone="green"
        />

        <QueueMetric
          label="Failed"
          value={queueFailed}
          tone="red"
        />

        <QueueMetric
          label="Queue Total"
          value={queueTotal}
          tone="neutral"
        />

        <QueueMetric
          label="Sync States"
          value={
            syncSummaryQuery.data
              ?.total ?? 0
          }
          tone="neutral"
        />

        <QueueMetric
          label="Sync Units"
          value={
            totalSyncUnits
          }
          tone="neutral"
        />

        <QueueMetric
          label="Sync Coverage"
          value={`${syncCoverage}%`}
          tone={
            syncCoverage >= 95
              ? 'green'
              : syncCoverage >= 70
                ? 'amber'
                : 'red'
          }
        />
      </div>


      {/* ======================================================
          QUEUE HEALTH
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeader
          icon={ListChecks}
          title="Queue Health"
          description="Current workload distribution and retained queue state."
        />

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <QueueHealthCard
            title="Pending"
            value={queuePending}
            detail="Jobs waiting for execution."
            tone="warning"
          />

          <QueueHealthCard
            title="Processing"
            value={queueProcessing}
            detail="Jobs currently being executed."
            tone="info"
          />

          <QueueHealthCard
            title="Failed"
            value={queueFailed}
            detail="Jobs requiring attention or retry."
            tone="danger"
          />
        </div>

        <div className="mt-4">
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="bg-amber-500"
              style={{
                width:
                  queueTotal > 0
                    ? `${
                        (
                          queuePending /
                          queueTotal
                        ) *
                        100
                      }%`
                    : '0%',
              }}
            />

            <div
              className="bg-blue-500"
              style={{
                width:
                  queueTotal > 0
                    ? `${
                        (
                          queueProcessing /
                          queueTotal
                        ) *
                        100
                      }%`
                    : '0%',
              }}
            />

            <div
              className="bg-emerald-500"
              style={{
                width:
                  queueTotal > 0
                    ? `${
                        (
                          queueCompleted /
                          queueTotal
                        ) *
                        100
                      }%`
                    : '0%',
              }}
            />

            <div
              className="bg-red-500"
              style={{
                width:
                  queueTotal > 0
                    ? `${
                        (
                          queueFailed /
                          queueTotal
                        ) *
                        100
                      }%`
                    : '0%',
              }}
            />
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
          <span>
            {formatNumber(
              queuePending,
            )}{' '}
            pending
          </span>

          <span>
            {formatNumber(
              queueProcessing,
            )}{' '}
            processing
          </span>

          <span>
            {formatNumber(
              queueCompleted,
            )}{' '}
            completed
          </span>

          <span>
            {formatNumber(
              queueFailed,
            )}{' '}
            failed
          </span>
        </div>
      </section>


      {/* ======================================================
          QUEUE TYPES
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeader
          icon={Workflow}
          title="Queue Workload by Type"
          description="Current retained queue distribution across the two active operational job types."
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <QueueType
            label="Fixture Refresh"
            value={
              queueSummary
                ?.type.fixtureRefresh ??
              0
            }
          />

          <QueueType
            label="Summary Refresh"
            value={
              queueSummary
                ?.type.summaryRefresh ??
              0
            }
          />
        </div>
      </section>


      {/* ======================================================
          QUEUE TABLE
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-border bg-card/60">
        <div className="border-b border-border p-4">
          <SectionHeader
            icon={ListChecks}
            title="Queue Jobs"
            description="The next operational jobs currently visible through the queue API."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground">
                <th className="px-4 py-3 font-medium">
                  Job
                </th>

                <th className="px-4 py-3 font-medium">
                  Type
                </th>

                <th className="px-4 py-3 font-medium">
                  League
                </th>

                <th className="px-4 py-3 font-medium">
                  Priority
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>

                <th className="px-4 py-3 font-medium">
                  Scheduled
                </th>

                <th className="px-4 py-3 font-medium">
                  Attempts
                </th>

                <th className="px-4 py-3 font-medium">
                  State
                </th>
              </tr>
            </thead>

            <tbody>
              {queues.map(
                job => (
                  <tr
                    key={job.jobKey}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="max-w-[280px]">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {job.jobKey}
                        </p>

                        {job.eventId && (
                          <p className="mt-1 truncate text-[9px] text-muted-foreground">
                            Event{' '}
                            {job.eventId}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-foreground">
                      {job.type}
                    </td>

                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {job.leagueId}
                    </td>

                    <td className="px-4 py-3 text-xs font-semibold text-foreground">
                      {job.priority}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusClass(
                          job.status,
                        )}`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-xs tabular-nums text-foreground">
                        {formatDateTime(
                          job.scheduledFor,
                        )}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-foreground">
                        {job.attempts}
                      </span>

                      <span className="text-[10px] text-muted-foreground">
                        {' '}
                        / {job.maxAttempts}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusClass(
                          job.status,
                        )}`}
                      >
                        {formatLabel(
                          job.status,
                        )}
                      </span>
                    </td>
                  </tr>
                ),
              )}

              {queues.length ===
                0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-xs text-muted-foreground"
                  >
                    No queue jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>


      {/* ======================================================
          SYNC OVERVIEW
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <SectionHeader
          icon={RotateCcw}
          title="Synchronization Overview"
          description="Unit-level progress across the persistent sync states returned by the admin API."
        />

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
          <MiniMetric
            label="Total Units"
            value={
              totalSyncUnits
            }
          />

          <MiniMetric
            label="Successful"
            value={
              successfulSyncUnits
            }
            tone="success"
          />

          <MiniMetric
            label="Processing"
            value={
              processingSyncUnits
            }
            tone="info"
          />

          <MiniMetric
            label="Pending"
            value={
              pendingSyncUnits
            }
            tone="warning"
          />

          <MiniMetric
            label="Failed"
            value={
              failedSyncUnits
            }
            tone={
              failedSyncUnits >
              0
                ? 'danger'
                : 'success'
            }
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              Unit completion
            </span>

            <span className="text-xs font-bold text-foreground">
              {syncCoverage}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    syncCoverage,
                  ),
                )}%`,
              }}
            />
          </div>
        </div>
      </section>


      {/* ======================================================
          PERSISTENT SYNC STATES
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-border bg-card/60">
        <div className="border-b border-border p-4">
          <SectionHeader
            icon={RotateCcw}
            title="Persistent Sync States"
            description="Each state can be expanded to inspect units, date windows, observed timing, and estimated completion."
          />
        </div>

        <div className="divide-y divide-border">
          {syncStates.map(
            state => {
              const expanded =
                expandedSyncState ===
                state.stateKey;

              return (
                <div
                  key={
                    state.stateKey
                  }
                  className="bg-card/20"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedSyncState(
                        expanded
                          ? null
                          : state.stateKey,
                      )
                    }
                    className="w-full p-4 text-left transition-colors hover:bg-muted/20"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="max-w-[320px] truncate text-xs font-semibold text-foreground">
                            {state.jobType ??
                              state.taskKey ??
                              state.stateKey}
                          </p>

                          <span
                            className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusClass(
                              state.status,
                            )}`}
                          >
                            {state.status}
                          </span>

                          <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-medium text-muted-foreground">
                            {state.kind}
                          </span>
                        </div>

                        <p className="mt-1 max-w-[420px] truncate font-mono text-[9px] text-muted-foreground">
                          {state.stateKey}
                        </p>

                        <p className="mt-2 text-[10px] text-muted-foreground">
                          {state.leagueId ??
                            'No league'}
                          {state.season !==
                          undefined
                            ? ` · ${state.season}`
                            : ''}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <SyncHeaderMetric
                          label="Units"
                          value={formatNumber(
                            Array.isArray(
                              state.units,
                            )
                              ? state
                                  .units
                                  .length
                              : 0,
                          )}
                        />

                        <SyncHeaderMetric
                          label="Success"
                          value={formatNumber(
                            Array.isArray(
                              state.units,
                            )
                              ? state.units.filter(
                                  unit =>
                                    unit.status ===
                                    'SUCCESS',
                                ).length
                              : 0,
                          )}
                        />

                        <SyncHeaderMetric
                          label="Processing"
                          value={formatNumber(
                            Array.isArray(
                              state.units,
                            )
                              ? state.units.filter(
                                  unit =>
                                    unit.status ===
                                    'PROCESSING',
                                ).length
                              : 0,
                          )}
                        />

                        <SyncHeaderMetric
                          label="Failed"
                          value={formatNumber(
                            Array.isArray(
                              state.units,
                            )
                              ? state.units.filter(
                                  unit =>
                                    unit.status ===
                                    'FAILED',
                                ).length
                              : 0,
                          )}
                          danger={
                            Array.isArray(
                              state.units,
                            ) &&
                            state.units.some(
                              unit =>
                                unit.status ===
                                'FAILED',
                            )
                          }
                        />
                      </div>

                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                          expanded
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    </div>
                  </button>

                  {expanded && (
                    <SyncStateDetails
                      state={
                        state
                      }
                    />
                  )}
                </div>
              );
            },
          )}

          {syncStates.length ===
            0 && (
            <div className="px-4 py-10 text-center text-xs text-muted-foreground">
              No synchronization states found.
            </div>
          )}
        </div>
      </section>


      {/* ======================================================
          CURRENT STATE
      ====================================================== */}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={Clock3}
          label="Current State"
          value={
            syncSummaryQuery
              .data?.current
              ?.stateKey ??
            'No state processing'
          }
        />

        <InfoCard
          icon={RefreshCw}
          label="Current Status"
          value={
            syncSummaryQuery
              .data?.current
              ?.status ??
            'IDLE'
          }
        />

        <InfoCard
          icon={TimerReset}
          label="Queue Retention"
          value="—"
        />

        <InfoCard
          icon={BarChart3}
          label="Observed Sync Coverage"
          value={`${syncCoverage}%`}
        />
      </div>
    </div>
  );
}


// ============================================================
// SYNC STATE DETAILS
// ============================================================

function SyncStateDetails({
  state,
}: {
  state: {
    stateKey: string;
    kind: string;
    leagueId?: string;
    season?: number;
    taskKey?: string;
    jobType?: string;
    status: string;
    lastError?: string;
    dateFrom?: string;
    dateTo?: string;
    units?: Array<{
      key: string;
      type: string;
      dateKey?: string;
      stepKey?: string;
      status: string;
      attempts: number;
      startedAt?: string;
      completedAt?: string;
      nextAttemptAt?: string;
      lastError?: string;
    }>;
  };
}) {
  const units =
    Array.isArray(
      state.units,
    )
      ? state.units
      : [];

  const timing =
    getSyncTiming(
      units,
    );

  const dateUnits =
    units.filter(
      unit =>
        String(
          unit.type,
        ).toUpperCase() ===
        'DATE',
    ).length;

  const stepUnits =
    units.filter(
      unit =>
        String(
          unit.type,
        ).toUpperCase() ===
        'STEP',
    ).length;

  const latestCompletedUnit =
    units
      .filter(
        unit =>
          Boolean(
            unit.completedAt,
          ),
      )
      .sort(
        (a, b) =>
          new Date(
            b.completedAt as string,
          ).getTime() -
          new Date(
            a.completedAt as string,
          ).getTime(),
      )[0];

  const currentProcessingUnit =
    units.find(
      unit =>
        unit.status ===
        'PROCESSING',
    );

  return (
    <div className="border-t border-border bg-background/30 p-4">
      {/* SUMMARY */}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DetailCard
          label="Date Units"
          value={formatNumber(
            dateUnits,
          )}
        />

        <DetailCard
          label="Step Units"
          value={formatNumber(
            stepUnits,
          )}
        />

        <DetailCard
          label="Timing Samples"
          value={formatNumber(
            timing.sampleCount,
          )}
        />

        <DetailCard
          label="Average Unit Time"
          value={
            timing.averageSeconds !==
            undefined
              ? `${timing.averageSeconds.toFixed(
                  2,
                )}s`
              : '—'
          }
        />

        <DetailCard
          label="Units / Minute"
          value={
            timing.unitsPerMinute !==
            undefined
              ? timing.unitsPerMinute.toFixed(
                  2,
                )
              : '—'
          }
        />

        <DetailCard
          label="Remaining Units"
          value={formatNumber(
            timing.remaining,
          )}
        />

        <DetailCard
          label="Estimated Remaining"
          value={formatDuration(
            timing.remainingSeconds,
          )}
        />

        <DetailCard
          label="Estimated Completion"
          value={
            timing.estimatedCompletionAt
              ? formatDateTime(
                  timing.estimatedCompletionAt,
                )
              : '—'
          }
        />
      </div>


      {/* DATE WINDOW */}

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <DetailCard
          label="Date From"
          value={formatDateOnly(
            state.dateFrom,
          )}
        />

        <DetailCard
          label="Date To"
          value={formatDateOnly(
            state.dateTo,
          )}
        />

        <DetailCard
          label="Last Completed Unit"
          value={
            latestCompletedUnit
              ?.completedAt
              ? formatDateTime(
                  latestCompletedUnit.completedAt,
                )
              : '—'
          }
        />
      </div>


      {/* CURRENT PROCESSING */}

      {currentProcessingUnit && (
        <div className="mt-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-blue-600">
                Current Unit
              </p>

              <p className="mt-1 font-mono text-[10px] text-foreground">
                {currentProcessingUnit.key}
              </p>

              <p className="mt-1 text-[10px] text-muted-foreground">
                {currentProcessingUnit.dateKey ??
                  currentProcessingUnit.stepKey ??
                  currentProcessingUnit.type}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">
                Elapsed
              </p>

              <p className="mt-1 text-sm font-bold text-blue-600">
                {formatDuration(
                  timing.currentElapsedSeconds,
                )}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <DetailCard
              label="Attempts"
              value={String(
                currentProcessingUnit.attempts,
              )}
            />

            <DetailCard
              label="Started"
              value={formatDateTime(
                currentProcessingUnit.startedAt,
              )}
            />

            <DetailCard
              label="Next Attempt"
              value={formatDateTime(
                currentProcessingUnit.nextAttemptAt,
              )}
            />

            <DetailCard
              label="Type"
              value={
                currentProcessingUnit.type
              }
            />
          </div>
        </div>
      )}


      {/* FAILURE */}

      {state.lastError && (
        <div className="mt-3 rounded-xl border border-red-500/10 bg-red-500/5 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

            <div>
              <p className="text-xs font-semibold text-red-600">
                State Error
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-400">
                {state.lastError}
              </p>
            </div>
          </div>
        </div>
      )}


      {/* UNITS */}

      <div className="mt-3 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-[9px] text-muted-foreground">
              <th className="px-3 py-2 font-medium">
                Unit
              </th>

              <th className="px-3 py-2 font-medium">
                Type
              </th>

              <th className="px-3 py-2 font-medium">
                Status
              </th>

              <th className="px-3 py-2 font-medium">
                Attempts
              </th>

              <th className="px-3 py-2 font-medium">
                Started
              </th>

              <th className="px-3 py-2 font-medium">
                Completed
              </th>

              <th className="px-3 py-2 font-medium">
                Duration
              </th>
            </tr>
          </thead>

          <tbody>
            {units.map(
              unit => {
                const duration =
                  unit.startedAt &&
                  unit.completedAt
                    ? Math.max(
                        0,
                        (
                          new Date(
                            unit.completedAt,
                          ).getTime() -
                          new Date(
                            unit.startedAt,
                          ).getTime()
                        ) /
                          1000,
                      )
                    : undefined;

                return (
                  <tr
                    key={
                      unit.key
                    }
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-3 py-2">
                      <p className="font-mono text-[9px] font-semibold text-foreground">
                        {unit.key}
                      </p>

                      {(unit.dateKey ??
                        unit.stepKey) && (
                        <p className="mt-1 text-[9px] text-muted-foreground">
                          {unit.dateKey ??
                            unit.stepKey}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-2 text-[9px] text-muted-foreground">
                      {unit.type}
                    </td>

                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusClass(
                          unit.status,
                        )}`}
                      >
                        {unit.status}
                      </span>
                    </td>

                    <td className="px-3 py-2 text-[9px] text-foreground">
                      {unit.attempts}
                    </td>

                    <td className="px-3 py-2 text-[9px] text-muted-foreground">
                      {formatDateTime(
                        unit.startedAt,
                      )}
                    </td>

                    <td className="px-3 py-2 text-[9px] text-muted-foreground">
                      {formatDateTime(
                        unit.completedAt,
                      )}
                    </td>

                    <td className="px-3 py-2 text-[9px] font-semibold text-foreground">
                      {formatDuration(
                        duration,
                      )}
                    </td>
                  </tr>
                );
              },
            )}

            {units.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-[10px] text-muted-foreground"
                >
                  This sync state contains no units.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ListChecks;
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
// QUEUE METRIC
// ============================================================

function QueueMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone:
    | 'amber'
    | 'blue'
    | 'green'
    | 'red'
    | 'neutral';
}) {
  const classes = {
    amber:
      'bg-amber-500/10 text-amber-600',

    blue:
      'bg-blue-500/10 text-blue-600',

    green:
      'bg-emerald-500/10 text-emerald-600',

    red:
      'bg-red-500/10 text-red-600',

    neutral:
      'bg-muted text-foreground',
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-3">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-2 inline-flex rounded-full px-2 py-1 text-lg font-bold ${classes[tone]}`}
      >
        {typeof value === 'number'
          ? formatNumber(value)
          : value}
      </p>
    </div>
  );
}


// ============================================================
// QUEUE HEALTH CARD
// ============================================================

function QueueHealthCard({
  title,
  value,
  detail,
  tone,
}: {
  title: string;
  value: number;
  detail: string;
  tone:
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';
}) {
  const classes = {
    success:
      'text-emerald-600',

    warning:
      'text-amber-600',

    danger:
      'text-red-600',

    info:
      'text-blue-600',
  };

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-xs text-muted-foreground">
        {title}
      </p>

      <p
        className={`mt-1 text-xl font-bold ${classes[tone]}`}
      >
        {formatNumber(
          value,
        )}
      </p>

      <p className="mt-1 text-[10px] text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}


// ============================================================
// QUEUE TYPE
// ============================================================

function QueueType({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-foreground">
        {formatNumber(
          value,
        )}
      </p>
    </div>
  );
}


// ============================================================
// MINI METRIC
// ============================================================

function MiniMetric({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: number;
  tone?:
    | 'neutral'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';
}) {
  const classes = {
    neutral:
      'text-foreground',

    success:
      'text-emerald-600',

    warning:
      'text-amber-600',

    danger:
      'text-red-600',

    info:
      'text-blue-600',
  };

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-[10px] text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-bold ${classes[tone]}`}
      >
        {formatNumber(
          value,
        )}
      </p>
    </div>
  );
}


// ============================================================
// SYNC HEADER METRIC
// ============================================================

function SyncHeaderMetric({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="text-right">
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
// DETAIL CARD
// ============================================================

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-2">
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
// INFO CARD
// ============================================================

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />

        <span className="text-xs text-muted-foreground">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}