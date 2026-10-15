'use client';

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  FileWarning,
  Hash,
  RefreshCw,
  Server,
  TerminalSquare,
} from 'lucide-react';

import {
  useSystemMonitorErrors,
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
    year: 'numeric',
  });
};


const formatTime = (
  value?: string,
): string => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};


const getErrorSource = (
  source?: string,
): string => {
  if (!source) {
    return 'Unknown';
  }

  return source;
};


const getErrorModule = (
  module?: string,
): string => {
  if (!module) {
    return 'Unknown';
  }

  return module;
};


const getErrorSignature = (
  error: {
    operation?: string;
    module?: string;
    source?: string;
    message?: string;
  },
): string => {
  return [
    error.source ?? 'unknown',
    error.module ?? 'unknown',
    error.operation ?? 'unknown',
    error.message ?? 'unknown',
  ]
    .join('|')
    .toLowerCase();
};


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorErrors() {
  const errorsQuery =
    useSystemMonitorErrors({
      limit: 100,
    });

  const errors =
    errorsQuery.data ?? [];


  // ==========================================================
  // SUMMARY
  // ==========================================================

  const sourceCounts =
    errors.reduce<Record<string, number>>(
      (accumulator, error) => {
        const source =
          getErrorSource(error.source);

        accumulator[source] =
          (accumulator[source] ?? 0) + 1;

        return accumulator;
      },
      {},
    );

  const moduleCounts =
    errors.reduce<Record<string, number>>(
      (accumulator, error) => {
        const errorModule =
          getErrorModule(error.module);

        accumulator[errorModule] =
          (accumulator[errorModule] ?? 0) + 1;

        return accumulator;
      },
      {},
    );

  const operationCounts =
    errors.reduce<Record<string, number>>(
      (accumulator, error) => {
        const operation =
          error.operation ?? 'Unknown';

        accumulator[operation] =
          (accumulator[operation] ?? 0) + 1;

        return accumulator;
      },
      {},
    );

  const uniqueErrors =
    new Set(
      errors.map(error =>
        getErrorSignature(error),
      ),
    ).size;

  const errorsWithStack =
    errors.filter(
      error => Boolean(error.stack),
    ).length;

  const errorsWithReference =
    errors.filter(
      error => Boolean(error.referenceKey),
    ).length;

  const latestError =
    errors.length > 0
      ? errors[0]
      : undefined;

  const topSources =
    Object.entries(sourceCounts)
      .sort(
        (a, b) => b[1] - a[1],
      )
      .slice(0, 5);

  const topModules =
    Object.entries(moduleCounts)
      .sort(
        (a, b) => b[1] - a[1],
      )
      .slice(0, 5);

  const topOperations =
    Object.entries(operationCounts)
      .sort(
        (a, b) => b[1] - a[1],
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
            Errors
          </h2>

          <p className="text-sm text-muted-foreground">
            Recent failures captured by the live system monitor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {errors.length} recent
          </span>

          <RefreshCw
            className={`h-4 w-4 text-muted-foreground ${
              errorsQuery.isFetching
                ? 'animate-spin'
                : ''
            }`}
          />
        </div>
      </div>


      {/* ======================================================
          HEALTH SUMMARY
      ====================================================== */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ErrorMetric
          label="Recorded Errors"
          value={errors.length}
          icon={AlertCircle}
          tone={
            errors.length > 0
              ? 'danger'
              : 'success'
          }
        />

        <ErrorMetric
          label="Unique Signatures"
          value={uniqueErrors}
          icon={Hash}
          tone="neutral"
        />

        <ErrorMetric
          label="With Stack Trace"
          value={errorsWithStack}
          icon={TerminalSquare}
          tone={
            errorsWithStack > 0
              ? 'warning'
              : 'success'
          }
        />

        <ErrorMetric
          label="With Reference Key"
          value={errorsWithReference}
          icon={Database}
          tone={
            errorsWithReference > 0
              ? 'neutral'
              : 'success'
          }
        />
      </div>


      {/* ======================================================
          LATEST ERROR
      ====================================================== */}

      {latestError && (
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                <AlertTriangle className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    Latest Error
                  </p>

                  <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-600">
                    {latestError.operation}
                  </span>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {latestError.module} ·{' '}
                  {latestError.source}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
              <Clock3 className="h-3 w-3" />

              {formatDateTime(
                latestError.occurredAt,
              )}
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-red-500/10 bg-background/40 p-3">
            <p className="text-sm leading-6 text-red-700 dark:text-red-400">
              {latestError.message}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <InfoBadge
              label="Module"
              value={
                latestError.module ??
                'Unknown'
              }
            />

            <InfoBadge
              label="Source"
              value={
                latestError.source ??
                'Unknown'
              }
            />

            <InfoBadge
              label="Time"
              value={formatTime(
                latestError.occurredAt,
              )}
            />

            {latestError.referenceKey && (
              <InfoBadge
                label="Reference"
                value={
                  latestError.referenceKey
                }
              />
            )}
          </div>
        </section>
      )}


      {/* ======================================================
          ERROR DISTRIBUTION
      ====================================================== */}

      {errors.length > 0 && (
        <div className="grid gap-4 xl:grid-cols-3">
          <DistributionPanel
            title="By Source"
            icon={Server}
            items={topSources}
          />

          <DistributionPanel
            title="By Module"
            icon={FileWarning}
            items={topModules}
          />

          <DistributionPanel
            title="By Operation"
            icon={ActivityIcon}
            items={topOperations}
          />
        </div>
      )}


      {/* ======================================================
          ERROR LIST
      ====================================================== */}

      {errors.length === 0 ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-600" />

          <p className="mt-3 text-sm font-semibold text-foreground">
            No recent errors
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            The current in-memory monitor has no recorded failures.
          </p>
        </div>
      ) : (
        <section className="rounded-2xl border border-border bg-card/60 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Recent Error Events
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Showing the latest captured failures.
              </p>
            </div>

            <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-600">
              {errors.length} EVENTS
            </span>
          </div>

          <div className="space-y-3">
            {errors.map(
              (error, index) => (
                <article
                  key={`${error.occurredAt}-${error.operation}-${index}`}
                  className="rounded-2xl border border-red-500/20 bg-background/30 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-foreground">
                            {error.operation}
                          </h3>

                          <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-600">
                            ERROR
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {error.module} ·{' '}
                          {error.source}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock3 className="h-3 w-3" />

                      {formatDateTime(
                        error.occurredAt,
                      )}
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-red-500/10 bg-red-500/5 p-3">
                    <p className="text-sm leading-6 text-red-700 dark:text-red-400">
                      {error.message}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <InfoBadge
                      label="Module"
                      value={
                        error.module ??
                        'Unknown'
                      }
                    />

                    <InfoBadge
                      label="Source"
                      value={
                        error.source ??
                        'Unknown'
                      }
                    />

                    {error.referenceKey && (
                      <InfoBadge
                        label="Reference"
                        value={
                          error.referenceKey
                        }
                      />
                    )}
                  </div>

                  {error.stack && (
                    <details className="mt-3">
                      <summary className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
                        <TerminalSquare className="h-3.5 w-3.5" />

                        Stack trace
                      </summary>

                      <pre className="mt-2 max-h-72 overflow-auto rounded-xl border border-border bg-background p-3 text-[10px] leading-5 text-muted-foreground">
                        {error.stack}
                      </pre>
                    </details>
                  )}

                  {!error.stack &&
                    !error.referenceKey && (
                      <p className="mt-3 text-[10px] text-muted-foreground">
                        No stack trace or reference key was
                        recorded for this event.
                      </p>
                    )}
                </article>
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}


// ============================================================
// METRIC
// ============================================================

function ErrorMetric({
  label,
  value,
  icon: Icon,
  tone = 'neutral',
}: {
  label: string;
  value: number;
  icon: typeof AlertCircle;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}) {
  const toneClasses = {
    neutral:
      'bg-muted text-foreground',

    success:
      'bg-emerald-500/10 text-emerald-600',

    warning:
      'bg-amber-500/10 text-amber-600',

    danger:
      'bg-red-500/10 text-red-600',
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p
        className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-lg font-bold ${toneClasses[tone]}`}
      >
        {value}
      </p>
    </div>
  );
}


// ============================================================
// DISTRIBUTION PANEL
// ============================================================

function DistributionPanel({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof Server;
  items: [string, number][];
}) {
  const total =
    items.reduce(
      (sum, [, count]) =>
        sum + count,
      0,
    );

  return (
    <section className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />

          <h3 className="text-sm font-semibold text-foreground">
            {title}
          </h3>
        </div>

        <span className="text-[10px] text-muted-foreground">
          Top {items.length}
        </span>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No distribution data.
          </div>
        ) : (
          items.map(
            ([label, count]) => {
              const percentage =
                total > 0
                  ? Math.round(
                      (count / total) *
                        100,
                    )
                  : 0;

              return (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-background/40 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-xs font-medium text-foreground">
                      {label}
                    </span>

                    <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-600">
                      {count}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-red-500 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {percentage}% of displayed events
                  </p>
                </div>
              );
            },
          )
        )}
      </div>
    </section>
  );
}


// ============================================================
// INFO BADGE
// ============================================================

function InfoBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="max-w-full rounded-lg border border-border bg-background/50 px-2.5 py-1.5">
      <div className="flex max-w-full items-center gap-1.5">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>

        <span className="truncate font-mono text-[10px] text-foreground">
          {value}
        </span>
      </div>
    </div>
  );
}


// ============================================================
// ICON ALIAS
// ============================================================

import {
  Activity as ActivityIcon,
} from 'lucide-react';