'use client';

import {
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock3,
  RefreshCw,
  RotateCcw,
  XCircle,
} from 'lucide-react';

import {
  useSportsSystemMonitor,
} from '@/hooks/use-sports-system-monitor';


// ============================================================
// HELPERS
// ============================================================

const formatDateTime = (
  value?: string,
): string => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};


const formatDateOnly = (
  value?: string,
): string => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
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

  const rounded = Math.ceil(seconds);

  const hours = Math.floor(
    rounded / 3600,
  );

  const minutes = Math.floor(
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


const formatSecondsPerUnit = (
  seconds?: number,
): string => {
  if (
    seconds === undefined ||
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return '—';
  }

  return `${seconds.toFixed(2)}s/u`;
};


const formatUnitsPerMinute = (
  units?: number,
): string => {
  if (
    units === undefined ||
    !Number.isFinite(units) ||
    units <= 0
  ) {
    return '—';
  }

  return `${units.toFixed(2)}/m`;
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


const formatSyncJobType = (
  jobType?: string,
): string => {
  switch (jobType) {
    case 'LEAGUE_REFRESH':
      return 'League Synchronization';

    case 'FIXTURE_RECOVERY':
      return 'Season Synchronization';

    case 'UPCOMING_MATCH':
      return 'Upcoming Match';

    case 'FINISHED_MATCH':
      return 'Finished Match';

    default:
      return jobType
        ? formatLabel(jobType)
        : 'Synchronization';
  }
};


const statusClass = (
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


const progressClass = (
  percent: number,
): string => {
  if (percent >= 95) {
    return 'bg-emerald-500';
  }

  if (percent >= 70) {
    return 'bg-amber-500';
  }

  return 'bg-primary';
};


const getUnitLabel = (
  dateUnits: number,
  stepUnits: number,
  total: number,
): string => {
  const parts: string[] = [];

  if (dateUnits > 0) {
    parts.push(
      `${dateUnits.toLocaleString()} ${
        dateUnits === 1 ? 'day' : 'days'
      }`,
    );
  }

  if (stepUnits > 0) {
    parts.push(
      `${stepUnits.toLocaleString()} ${
        stepUnits === 1 ? 'step' : 'steps'
      }`,
    );
  }

  return parts.length > 0
    ? parts.join(' · ')
    : `${total.toLocaleString()} ${
        total === 1 ? 'unit' : 'units'
      }`;
};


const getDateRangeLabel = (
  dateFrom?: string,
  dateTo?: string,
): string => {
  if (!dateFrom && !dateTo) {
    return 'No date window';
  }

  if (dateFrom && dateTo) {
    return `${formatDateOnly(dateFrom)} → ${formatDateOnly(dateTo)}`;
  }

  if (dateFrom) {
    return `From ${formatDateOnly(dateFrom)}`;
  }

  return `Through ${formatDateOnly(dateTo)}`;
};


const calculateEstimatedSeconds = (
  units: number,
  secondsPerUnit?: number,
): number | undefined => {
  if (
    !Number.isFinite(units) ||
    units < 0 ||
    secondsPerUnit === undefined ||
    !Number.isFinite(secondsPerUnit) ||
    secondsPerUnit <= 0
  ) {
    return undefined;
  }

  return units * secondsPerUnit;
};


// ============================================================
// SORTING
// ============================================================

const getSyncStateSortRank = (
  state: {
    status: string;
    unitProgress: {
      processing: number;
      pending: number;
      failed: number;
    };
  },
): number => {
  if (
    state.status === 'PROCESSING' ||
    state.unitProgress.processing > 0
  ) {
    return 0;
  }

  if (
    state.status === 'PENDING' ||
    state.unitProgress.pending > 0
  ) {
    return 1;
  }

  if (
    state.status === 'SUCCESS' ||
    state.status === 'COMPLETED'
  ) {
    return 2;
  }

  if (
    state.status === 'FAILED' ||
    state.status === 'PARTIAL' ||
    state.unitProgress.failed > 0
  ) {
    return 3;
  }

  return 4;
};


const getCompletionPercent = (
  state: {
    unitProgress: {
      total: number;
      completionPercent: number;
    };
  },
): number => {
  if (state.unitProgress.total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      state.unitProgress.completionPercent,
    ),
  );
};


const sortSyncStates = <
  T extends {
    status: string;
    unitProgress: {
      total: number;
      processing: number;
      pending: number;
      failed: number;
      completionPercent: number;
    };
  },
>(
  input: T[],
): T[] => {
  return [...input].sort(
    (a, b) => {
      const rank =
        getSyncStateSortRank(a) -
        getSyncStateSortRank(b);

      if (rank !== 0) {
        return rank;
      }

      if (
        getSyncStateSortRank(a) === 1
      ) {
        return (
          getCompletionPercent(b) -
          getCompletionPercent(a)
        );
      }

      return 0;
    },
  );
};


// ============================================================
// OVERALL SPEED
// ============================================================

const getCurrentSyncSpeed = (
  states: {
    status: string;
    timing: {
      averageSecondsPerUnit?: number;
    };
  }[],
): number | undefined => {
  const processingState =
    states.find(
      state =>
        state.status === 'PROCESSING' &&
        state.timing.averageSecondsPerUnit !== undefined &&
        state.timing.averageSecondsPerUnit > 0,
    );

  if (
    processingState?.timing.averageSecondsPerUnit !==
    undefined
  ) {
    return processingState.timing.averageSecondsPerUnit;
  }

  const measuredState =
    states.find(
      state =>
        state.timing.averageSecondsPerUnit !== undefined &&
        state.timing.averageSecondsPerUnit > 0,
    );

  return measuredState?.timing.averageSecondsPerUnit;
};


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorSync() {
  const monitorQuery =
    useSportsSystemMonitor();

  const sync =
    monitorQuery.data?.sync;

  const states =
    sync?.states ?? [];

  const sortedStates =
    sortSyncStates(states);

  const failures =
    sync?.failures ?? [];

  const currentSpeed =
    getCurrentSyncSpeed(states);

  const totalUnits =
    sync?.unitProgress.total ?? 0;

  const successfulUnits =
    sync?.unitProgress.success ?? 0;

  const remainingUnits =
    Math.max(
      0,
      totalUnits - successfulUnits,
    );

  const overallTotalEstimatedSeconds =
    calculateEstimatedSeconds(
      totalUnits,
      currentSpeed,
    );

  const overallRemainingSeconds =
    calculateEstimatedSeconds(
      remainingUnits,
      currentSpeed,
    );


  return (
    <div className="space-y-2">
      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Sports Synchronization
          </h2>

          <p className="text-xs text-muted-foreground">
            League synchronization progress, timing, and estimates.
          </p>
        </div>

        <RefreshCw
          className={`h-4 w-4 text-muted-foreground ${
            monitorQuery.isFetching
              ? 'animate-spin'
              : ''
          }`}
        />
      </div>


      {/* SUMMARY */}

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
        <SyncMetric
          label="States"
          value={sync?.totalStates ?? 0}
          icon={RotateCcw}
        />

        <SyncMetric
          label="Queue"
          value={sync?.queueStates ?? 0}
          icon={RefreshCw}
        />

        <SyncMetric
          label="Crons"
          value={sync?.cronStates ?? 0}
          icon={Clock3}
        />

        <SyncMetric
          label="Units"
          value={sync?.unitProgress.total ?? 0}
          icon={Activity}
        />

        <SyncMetric
          label="Success"
          value={sync?.unitProgress.success ?? 0}
          icon={CheckCircle2}
        />

        <SyncMetric
          label="Processing"
          value={sync?.unitProgress.processing ?? 0}
          icon={RefreshCw}
        />

        <SyncMetric
          label="Pending"
          value={sync?.unitProgress.pending ?? 0}
          icon={Clock3}
        />

        <SyncMetric
          label="Failed"
          value={sync?.unitProgress.failed ?? 0}
          icon={XCircle}
          danger={
            (sync?.unitProgress.failed ?? 0) > 0
          }
        />
      </div>


      {/* OVERALL */}

      <section className="rounded-xl border border-border bg-card/60 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Overall Synchronization
            </h3>

            <p className="text-[10px] text-muted-foreground">
              Based on the active synchronization speed.
            </p>
          </div>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              (sync?.unitProgress.completionPercent ?? 0) >= 95
                ? 'bg-emerald-500/10 text-emerald-600'
                : (sync?.unitProgress.completionPercent ?? 0) >= 70
                  ? 'bg-amber-500/10 text-amber-600'
                  : 'bg-primary/10 text-primary'
            }`}
          >
            {sync?.unitProgress.completionPercent ?? 0}%
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${progressClass(
              sync?.unitProgress.completionPercent ?? 0,
            )}`}
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  sync?.unitProgress.completionPercent ?? 0,
                ),
              )}%`,
            }}
          />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
          <CompactMetric
            label="Speed"
            value={
              currentSpeed !== undefined
                ? `${formatSecondsPerUnit(
                    currentSpeed,
                  )} · ${formatUnitsPerMinute(
                    currentSpeed > 0
                      ? 60 / currentSpeed
                      : undefined,
                  )}`
                : '—'
            }
          />

          <CompactMetric
            label="Total Time"
            value={
              overallTotalEstimatedSeconds !== undefined
                ? formatDuration(
                    overallTotalEstimatedSeconds,
                  )
                : '—'
            }
          />

          <CompactMetric
            label="Remaining"
            value={
              overallRemainingSeconds !== undefined
                ? formatDuration(
                    overallRemainingSeconds,
                  )
                : '—'
            }
          />

          <CompactMetric
            label="Units Left"
            value={remainingUnits.toLocaleString()}
          />
        </div>
      </section>


      {/* LEAGUE STATES */}

      <section className="overflow-hidden rounded-xl border border-border bg-card/60">
        <div className="border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                League Synchronization States
              </h3>

              <p className="text-[10px] text-muted-foreground">
                Processing → Pending by progress → Successful → Failed.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {sortedStates.map(
            state => (
              <SyncStateRow
                key={state.stateKey}
                state={state}
              />
            ),
          )}

          {sortedStates.length === 0 && (
            <div className="px-3 py-8 text-center text-xs text-muted-foreground">
              No league synchronization states are currently available.
            </div>
          )}
        </div>
      </section>


      {/* CRON */}

      <section className="overflow-hidden rounded-xl border border-border bg-card/60">
        <div className="border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />

            <h3 className="text-sm font-semibold text-foreground">
              Sports Cron Sync States
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground">
                <th className="px-3 py-2 font-medium">
                  Task
                </th>

                <th className="px-3 py-2 font-medium">
                  Status
                </th>

                <th className="px-3 py-2 font-medium">
                  Schedule
                </th>

                <th className="px-3 py-2 font-medium">
                  Last Success
                </th>

                <th className="px-3 py-2 font-medium">
                  Next Run
                </th>

                <th className="px-3 py-2 font-medium">
                  Failures
                </th>
              </tr>
            </thead>

            <tbody>
              {(sync?.cron ?? []).map(
                cron => (
                  <tr
                    key={cron.stateKey}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-3 py-2">
                      <p className="text-[11px] font-semibold text-foreground">
                        {cron.taskKey ?? cron.stateKey}
                      </p>

                      <p className="truncate font-mono text-[9px] text-muted-foreground">
                        {cron.stateKey}
                      </p>
                    </td>

                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${statusClass(
                          cron.status,
                        )}`}
                      >
                        {cron.status}
                      </span>
                    </td>

                    <td className="px-3 py-2">
                      <p className="font-mono text-[9px] text-foreground">
                        {cron.cronExpression ?? '—'}
                      </p>

                      <p className="text-[9px] text-muted-foreground">
                        {cron.timeZone ?? 'default'}
                      </p>
                    </td>

                    <td className="px-3 py-2 text-[10px] text-muted-foreground">
                      {formatDateTime(
                        cron.lastSuccessfulAt,
                      )}
                    </td>

                    <td className="px-3 py-2 text-[10px] text-muted-foreground">
                      {formatDateTime(
                        cron.nextRunAt,
                      )}
                    </td>

                    <td className="px-3 py-2">
                      <span
                        className={
                          cron.consecutiveFailures > 0
                            ? 'text-[10px] font-semibold text-red-600'
                            : 'text-[10px] text-muted-foreground'
                        }
                      >
                        {cron.consecutiveFailures}
                      </span>
                    </td>
                  </tr>
                ),
              )}

              {(sync?.cron ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-xs text-muted-foreground"
                  >
                    No sports cron sync states are currently available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>


      {/* FAILURES */}

      <section>
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />

          <h3 className="text-sm font-semibold text-foreground">
            Sync Failures
          </h3>
        </div>

        {failures.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />

            <span className="text-xs text-foreground">
              No sync failures reported.
            </span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {failures.map(
              failure => (
                <article
                  key={`${failure.stateKey}-${failure.at ?? 'none'}`}
                  className="rounded-xl border border-red-500/20 bg-card/60 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-foreground">
                        {failure.jobType ?? 'Unknown job'}
                      </p>

                      <p className="truncate font-mono text-[9px] text-muted-foreground">
                        {failure.stateKey}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[9px] text-muted-foreground">
                        {formatDateTime(failure.at)}
                      </p>

                      <p className="text-[9px] font-semibold text-red-600">
                        {failure.consecutiveFailures} failure
                        {failure.consecutiveFailures === 1
                          ? ''
                          : 's'}
                      </p>
                    </div>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-400">
                    {failure.error ??
                      'No error message recorded.'}
                  </p>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}


// ============================================================
// SYNC STATE ROW
// ============================================================

function SyncStateRow({
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
  const percent = Math.min(
    100,
    Math.max(
      0,
      state.unitProgress.completionPercent,
    ),
  );

  const isProcessing =
    state.status === 'PROCESSING' ||
    state.unitProgress.processing > 0;

  const remainingUnits =
    Math.max(
      0,
      state.unitProgress.total -
        state.unitProgress.success,
    );

  const stateSpeed =
    state.timing.averageSecondsPerUnit;

  const totalEstimatedSeconds =
    calculateEstimatedSeconds(
      state.unitProgress.total,
      stateSpeed,
    );

  const remainingSeconds =
    calculateEstimatedSeconds(
      remainingUnits,
      stateSpeed,
    );


  return (
    <div className="px-3 py-2.5">
      {/* TOP */}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h4 className="truncate text-xs font-bold text-foreground">
              {state.leagueName ??
                state.leagueId ??
                'Unknown League'}
            </h4>

            {state.season !== undefined && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                {state.season}
              </span>
            )}

            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${statusClass(
                state.status,
              )}`}
            >
              {state.status}
            </span>
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[9px] text-muted-foreground">
            <span>
              {formatSyncJobType(
                state.jobType,
              )}
            </span>

            {state.trackingMode && (
              <>
                <span>•</span>
                <span>
                  {formatLabel(
                    state.trackingMode,
                  )}
                </span>
              </>
            )}

            <span>•</span>

            <span className="font-mono">
              {state.stateKey}
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[9px] text-muted-foreground">
            Last completed
          </span>

          <p className="text-[10px] font-semibold text-foreground">
            {formatDateTime(
              state.lastCompletedAt,
            )}
          </p>
        </div>
      </div>


      {/* COMPACT DETAILS */}

      <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
        <CompactDetail
          label="Units"
          value={`${getUnitLabel(
            state.unitProgress.dateUnits,
            state.unitProgress.stepUnits,
            state.unitProgress.total,
          )} · ${remainingUnits} left`}
        />

        <CompactDetail
          label="Range"
          value={getDateRangeLabel(
            state.dateFrom,
            state.dateTo,
          )}
        />

        <CompactDetail
          label="Speed"
          value={`${formatSecondsPerUnit(
            stateSpeed,
          )} · ${formatUnitsPerMinute(
            state.timing.unitsPerMinute,
          )}`}
        />

        <CompactDetail
          label="Time"
          value={`Total ${formatDuration(
            totalEstimatedSeconds,
          )} · Left ${formatDuration(
            remainingSeconds,
          )}`}
        />
      </div>


      {/* PROGRESS */}

      <div className="mt-2">
        <div className="flex items-center justify-between gap-2 text-[9px] text-muted-foreground">
          <div className="flex flex-wrap gap-x-2">
            <span>
              {state.unitProgress.success} done
            </span>

            {state.unitProgress.processing > 0 && (
              <span className="text-blue-600">
                {state.unitProgress.processing} processing
              </span>
            )}

            {state.unitProgress.pending > 0 && (
              <span className="text-amber-600">
                {state.unitProgress.pending} pending
              </span>
            )}

            {state.unitProgress.failed > 0 && (
              <span className="text-red-600">
                {state.unitProgress.failed} failed
              </span>
            )}
          </div>

          <span className="font-semibold text-foreground">
            {percent}%
          </span>
        </div>

        <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${progressClass(
              percent,
            )}`}
            style={{
              width: `${percent}%`,
            }}
          />
        </div>
      </div>


      {/* LIVE */}

      {(
        isProcessing ||
        state.timing.currentProcessingElapsedSeconds !==
          undefined
      ) && (
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 rounded-lg bg-blue-500/5 px-2 py-1.5 text-[9px]">
          <span className="text-muted-foreground">
            Current:{' '}
            <span className="font-semibold text-blue-600">
              {formatDuration(
                state.timing.currentProcessingElapsedSeconds,
              )}
            </span>
          </span>

          <span className="text-muted-foreground">
            Started:{' '}
            <span className="font-semibold text-foreground">
              {formatDateTime(
                state.lastStartedAt,
              )}
            </span>
          </span>

          <span className="text-muted-foreground">
            ETA:{' '}
            <span className="font-semibold text-foreground">
              {remainingUnits > 0
                ? formatDateTime(
                    state.estimate
                      .estimatedCompletionAt,
                  )
                : 'Complete'}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}


// ============================================================
// UI
// ============================================================

function SyncMetric({
  label,
  value,
  icon: Icon,
  danger = false,
}: {
  label: string;
  value: number;
  icon: typeof RefreshCw;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 px-2.5 py-2">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />

        <span className="text-[9px]">
          {label}
        </span>
      </div>

      <p
        className={`mt-1 text-base font-bold ${
          danger
            ? 'text-red-600'
            : 'text-foreground'
        }`}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}


function CompactMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 px-2.5 py-2">
      <p className="text-[9px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[10px] font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}


function CompactDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/30 px-2 py-1.5">
      <span className="text-[8px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>

      <p className="mt-0.5 truncate text-[10px] font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}