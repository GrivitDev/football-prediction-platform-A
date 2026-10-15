'use client';

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Play,
  RefreshCw,
  Timer,
  XCircle,
} from 'lucide-react';

import {
  useSystemMonitorCrons,
} from '@/hooks/use-system-monitor';


// ============================================================
// HELPERS
// ============================================================

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

  return date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: 'short',
  });
};


const formatDuration = (
  milliseconds?: number,
): string => {
  if (
    milliseconds === undefined ||
    milliseconds === null ||
    !Number.isFinite(milliseconds)
  ) {
    return '—';
  }

  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)} ms`;
  }

  const seconds =
    milliseconds / 1000;

  if (seconds < 60) {
    return `${seconds.toFixed(
      seconds < 10 ? 1 : 0,
    )}s`;
  }

  const minutes = Math.floor(
    seconds / 60,
  );

  const remainingSeconds = Math.floor(
    seconds % 60,
  );

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  const remainingMinutes =
    minutes % 60;

  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}m`
    : `${hours}h`;
};


const statusClass = (
  status: string,
): string => {
  switch (status) {
    case 'RUNNING':
      return 'bg-blue-500/10 text-blue-600';

    case 'SUCCESS':
      return 'bg-emerald-500/10 text-emerald-600';

    case 'FAILED':
      return 'bg-red-500/10 text-red-600';

    case 'IDLE':
      return 'bg-muted text-muted-foreground';

    default:
      return 'bg-amber-500/10 text-amber-600';
  }
};


const statusIconClass = (
  status: string,
): string => {
  switch (status) {
    case 'RUNNING':
      return 'bg-blue-500/10 text-blue-600';

    case 'SUCCESS':
      return 'bg-emerald-500/10 text-emerald-600';

    case 'FAILED':
      return 'bg-red-500/10 text-red-600';

    default:
      return 'bg-muted text-muted-foreground';
  }
};


const getNextRunTimestamp = (
  value?: string,
): number => {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? Number.POSITIVE_INFINITY
    : timestamp;
};


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorCrons() {
  const cronsQuery =
    useSystemMonitorCrons();

  const crons =
    cronsQuery.data ?? [];


  // ==========================================================
  // SUMMARY
  // ==========================================================

  const runningCrons =
    crons.filter(
      cron => cron.status === 'RUNNING',
    );

  const successfulCrons =
    crons.filter(
      cron => cron.status === 'SUCCESS',
    );

  const failedCrons =
    crons.filter(
      cron => cron.status === 'FAILED',
    );

  const idleCrons =
    crons.filter(
      cron => cron.status === 'IDLE',
    );

  const cronsWithFailures =
    crons.filter(
      cron =>
        cron.consecutiveFailures > 0,
    );

  const totalFailures =
    crons.reduce(
      (total, cron) =>
        total +
        (cron.consecutiveFailures ?? 0),
      0,
    );

  const durations =
    crons
      .map(
        cron => cron.lastDurationMs,
      )
      .filter(
        (
          value,
        ): value is number =>
          value !== undefined &&
          value !== null &&
          Number.isFinite(value) &&
          value >= 0,
      );

  const averageDurationMs =
    durations.length > 0
      ? durations.reduce(
          (total, value) =>
            total + value,
          0,
        ) / durations.length
      : undefined;

  const slowestCron =
    crons
      .filter(
        cron =>
          cron.lastDurationMs != null,
      )
      .sort(
        (a, b) =>
          (b.lastDurationMs ?? 0) -
          (a.lastDurationMs ?? 0),
      )[0];

  const upcomingCrons =
    [...crons]
      .sort(
        (a, b) =>
          getNextRunTimestamp(
            a.scheduler.nextRunAt,
          ) -
          getNextRunTimestamp(
            b.scheduler.nextRunAt,
          ),
      )
      .slice(0, 5);


  return (
    <div className="space-y-4">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Cron Jobs
          </h2>

          <p className="text-sm text-muted-foreground">
            Scheduler registration, execution state, runtime,
            failures, and upcoming jobs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {crons.length} jobs
          </span>

          <RefreshCw
            className={`h-4 w-4 text-muted-foreground ${
              cronsQuery.isFetching
                ? 'animate-spin'
                : ''
            }`}
          />
        </div>
      </div>


      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CronSummary
          label="Total"
          value={crons.length}
          icon={Clock3}
        />

        <CronSummary
          label="Running"
          value={runningCrons.length}
          icon={Play}
          tone={
            runningCrons.length > 0
              ? 'active'
              : 'neutral'
          }
        />

        <CronSummary
          label="Successful"
          value={successfulCrons.length}
          icon={CheckCircle2}
          tone="success"
        />

        <CronSummary
          label="Failed"
          value={failedCrons.length}
          icon={XCircle}
          tone={
            failedCrons.length > 0
              ? 'danger'
              : 'success'
          }
        />
      </div>


      {/* ======================================================
          RUNTIME SNAPSHOT
      ====================================================== */}

      <div className="grid gap-4 xl:grid-cols-3">
        <CronPanel
          title="Runtime Snapshot"
          icon={Activity}
        >
          <div className="grid grid-cols-2 gap-2">
            <MiniMetric
              label="Running"
              value={runningCrons.length}
              valueClass={
                runningCrons.length > 0
                  ? 'text-blue-600'
                  : undefined
              }
            />

            <MiniMetric
              label="Idle"
              value={idleCrons.length}
            />

            <MiniMetric
              label="Failures"
              value={totalFailures}
              valueClass={
                totalFailures > 0
                  ? 'text-red-600'
                  : 'text-emerald-600'
              }
            />

            <MiniMetric
              label="Affected Jobs"
              value={cronsWithFailures.length}
              valueClass={
                cronsWithFailures.length > 0
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }
            />
          </div>
        </CronPanel>


        <CronPanel
          title="Execution Timing"
          icon={Timer}
        >
          <div className="grid grid-cols-2 gap-2">
            <MiniMetric
              label="Measured Jobs"
              value={durations.length}
            />

            <MiniMetric
              label="Average Duration"
              value={formatDuration(
                averageDurationMs,
              )}
            />

            <MiniMetric
              label="Longest Job"
              value={
                slowestCron?.lastDurationMs !=
                null
                  ? formatDuration(
                      slowestCron.lastDurationMs,
                    )
                  : '—'
              }
            />

            <MiniMetric
              label="Latest Run"
              value={
                slowestCron
                  ? formatDateTime(
                      slowestCron.scheduler
                        .lastRunAt,
                    )
                  : '—'
              }
            />
          </div>
        </CronPanel>


        <CronPanel
          title="Attention"
          icon={AlertTriangle}
        >
          {cronsWithFailures.length === 0 ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                <span className="text-sm font-semibold text-foreground">
                  No cron failures
                </span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                No registered job currently has consecutive
                failures.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {cronsWithFailures
                .slice(0, 4)
                .map(cron => (
                  <div
                    key={cron.key}
                    className="flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {cron.name}
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        {cron.consecutiveFailures}{' '}
                        consecutive failure
                        {cron.consecutiveFailures === 1
                          ? ''
                          : 's'}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-600">
                      FAILED
                    </span>
                  </div>
                ))}

              {cronsWithFailures.length > 4 && (
                <p className="pt-1 text-[10px] text-muted-foreground">
                  +{cronsWithFailures.length - 4}{' '}
                  additional affected job
                  {cronsWithFailures.length - 4 ===
                  1
                    ? ''
                    : 's'}
                </p>
              )}
            </div>
          )}
        </CronPanel>
      </div>


      {/* ======================================================
          UPCOMING SCHEDULE
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-muted-foreground" />

            <h3 className="text-sm font-semibold text-foreground">
              Upcoming Schedule
            </h3>
          </div>

          <span className="text-xs text-muted-foreground">
            Next registered executions
          </span>
        </div>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
          {upcomingCrons.map(cron => (
            <div
              key={`upcoming-${cron.key}`}
              className="rounded-xl border border-border bg-background/40 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(
                    cron.status,
                  )}`}
                >
                  {cron.status}
                </span>

                <span className="text-[10px] text-muted-foreground">
                  {cron.timeZone ?? 'default'}
                </span>
              </div>

              <p className="mt-3 truncate text-xs font-semibold text-foreground">
                {cron.name}
              </p>

              <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                {cron.expression ?? '—'}
              </p>

              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Clock3 className="h-3 w-3" />

                {formatDateTime(
                  cron.scheduler.nextRunAt,
                )}
              </div>
            </div>
          ))}

          {upcomingCrons.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
              No upcoming cron executions available.
            </div>
          )}
        </div>
      </section>


      {/* ======================================================
          CRON TABLE
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-border bg-card/60">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Registered Cron Jobs
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Scheduler configuration and latest execution telemetry.
            </p>
          </div>

          <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">
            {crons.length} REGISTERED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">
                  Job
                </th>

                <th className="px-4 py-3 font-medium">
                  Module
                </th>

                <th className="px-4 py-3 font-medium">
                  Schedule
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>

                <th className="px-4 py-3 font-medium">
                  Last Run
                </th>

                <th className="px-4 py-3 font-medium">
                  Next Run
                </th>

                <th className="px-4 py-3 font-medium">
                  Duration
                </th>

                <th className="px-4 py-3 font-medium">
                  Failures
                </th>
              </tr>
            </thead>

            <tbody>
              {crons.map(cron => (
                <tr
                  key={cron.key}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${statusIconClass(
                          cron.status,
                        )}`}
                      >
                        {cron.status === 'RUNNING' ? (
                          <Play className="h-3.5 w-3.5" />
                        ) : cron.status === 'FAILED' ? (
                          <XCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                      </div>

                      <div className="max-w-[260px]">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {cron.name}
                        </p>

                        <p className="truncate text-[10px] text-muted-foreground">
                          {cron.key}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {cron.module}
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-xs font-mono text-foreground">
                      {cron.expression ?? '—'}
                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {cron.timeZone ?? 'default'}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(
                        cron.status,
                      )}`}
                    >
                      {cron.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDateTime(
                      cron.scheduler.lastRunAt,
                    )}
                  </td>

                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDateTime(
                      cron.scheduler.nextRunAt,
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-foreground">
                      {formatDuration(
                        cron.lastDurationMs,
                      )}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {cron.consecutiveFailures > 0 && (
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                      )}

                      <span
                        className={
                          cron.consecutiveFailures > 0
                            ? 'text-xs font-semibold text-red-600'
                            : 'text-xs text-muted-foreground'
                        }
                      >
                        {cron.consecutiveFailures}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}

              {crons.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-xs text-muted-foreground"
                  >
                    No cron jobs registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


// ============================================================
// SUMMARY CARD
// ============================================================

function CronSummary({
  label,
  value,
  icon: Icon,
  tone = 'neutral',
}: {
  label: string;
  value: number;
  icon: typeof Clock3;
  tone?:
    | 'neutral'
    | 'active'
    | 'success'
    | 'danger';
}) {
  const toneClasses = {
    neutral:
      'bg-muted text-foreground',

    active:
      'bg-blue-500/10 text-blue-600',

    success:
      'bg-emerald-500/10 text-emerald-600',

    danger:
      'bg-red-500/10 text-red-600',
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xl font-bold ${toneClasses[tone]}`}
      >
        {value}
      </p>
    </div>
  );
}


// ============================================================
// PANEL
// ============================================================

function CronPanel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Activity;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />

        <h3 className="text-sm font-semibold text-foreground">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}


// ============================================================
// MINI METRIC
// ============================================================

function MiniMetric({
  label,
  value,
  valueClass = '',
}: {
  label: string;
  value: number | string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-bold ${
          valueClass || 'text-foreground'
        }`}
      >
        {value}
      </p>
    </div>
  );
}