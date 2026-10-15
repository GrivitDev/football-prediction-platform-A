'use client';

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Globe2,
  RefreshCw,
  Server,
  ShieldCheck,
  Timer,
  XCircle,
  Zap,
} from 'lucide-react';

import {
  useState,
} from 'react';

import {
  useAdminProviderRateLimits,
} from '@/hooks/use-sports';

import {
  useSystemMonitorDashboard,
} from '@/hooks/use-system-monitor';

import { useSportsSystemMonitor } from '@/hooks/use-sports-system-monitor';


// ============================================================
// HELPERS
// ============================================================

const formatDuration = (
  seconds: number,
): string => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '—';
  }

  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }

  const minutes = Math.floor(
    seconds / 60,
  );

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
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

  return date.toLocaleTimeString(
    'en-GB',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  );
};


const getUsagePercent = (
  used?: number,
  limit?: number,
): number => {
  if (
    used === undefined ||
    limit === undefined ||
    limit <= 0
  ) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (used / limit) * 100,
    ),
  );
};


const getUsageTone = (
  percentage: number,
): 'success' | 'warning' | 'danger' => {
  if (percentage >= 90) {
    return 'danger';
  }

  if (percentage >= 75) {
    return 'warning';
  }

  return 'success';
};


const statusClass = (
  status?: string,
): string => {
  switch (status) {
    case 'ONLINE':
    case 'SUCCESS':
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-600';

    case 'RUNNING':
    case 'PROCESSING':
      return 'bg-blue-500/10 text-blue-600';

    case 'FAILED':
    case 'PARTIAL':
      return 'bg-red-500/10 text-red-600';

    default:
      return 'bg-muted text-muted-foreground';
  }
};


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorHealth() {
  const dashboardQuery =
    useSystemMonitorDashboard();

  const sportsMonitorQuery = useSportsSystemMonitor();
  const providerSummaries = sportsMonitorQuery.data?.providers ?? [];

  const providerQuery =
    useAdminProviderRateLimits({
      page: 1,
      limit: 200,
    });

  const dashboard =
    dashboardQuery.data;

  const providers =
    providerQuery.data?.data ?? [];

  const [now] = useState(() => Date.now());

  const failedCrons =
    dashboard?.crons.filter(
      cron => cron.status === 'FAILED',
    ).length ?? 0;

  const runningCrons =
    dashboard?.crons.filter(
      cron => cron.status === 'RUNNING',
    ).length ?? 0;

  const completedCrons =
    dashboard?.crons.filter(
      cron =>
        cron.status === 'SUCCESS',
    ).length ?? 0;

  const lockedProviders =
    providers.filter(
      provider =>
        provider.lockedUntil &&
        new Date(
          provider.lockedUntil,
        ).getTime() > now,
    );

  const lockedCount =
    lockedProviders.length;

  const recentErrors =
    dashboard?.summary.recentErrors ?? 0;

  const operationalIssues =
    failedCrons +
    recentErrors +
    lockedCount;


  // ==========================================================
  // PROVIDER USAGE
  // ==========================================================

  const totalDailyRequests =
    providerSummaries.reduce(
      (total, provider) => total + (provider.usage.dailyRequests ?? 0),
      0,
    );

  const totalDailyLimit =
    providerSummaries.reduce(
      (total, provider) => total + (provider.limits.dailyRequestLimit ?? 0),
      0,
    );

  const totalMonthlyRequests =
    providerSummaries.reduce(
      (total, provider) => total + (provider.usage.monthlyRequests ?? 0),
      0,
    );

  const totalMonthlyLimit =
    providerSummaries.reduce(
      (total, provider) => total + (provider.limits.monthlyRequestLimit ?? 0),
      0,
    );

  const dailyUsagePercent =
    getUsagePercent(
      totalDailyRequests,
      totalDailyLimit,
    );

  const monthlyUsagePercent =
    getUsagePercent(
      totalMonthlyRequests,
      totalMonthlyLimit,
    );


  // ==========================================================
  // RECENT ACTIVITY
  // ==========================================================

  const recentActivity =
    dashboard?.recentActivity
      ?.slice(0, 6) ?? [];


  return (
    <div className="space-y-4">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            System Health
          </h2>

          <p className="text-sm text-muted-foreground">
            Backend availability, runtime health, provider state,
            and operational alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RefreshCw
            className={`h-4 w-4 text-muted-foreground ${
              dashboardQuery.isFetching ||
              providerQuery.isFetching
                ? 'animate-spin'
                : ''
            }`}
          />

          <span className="text-xs text-muted-foreground">
            Live monitor
          </span>
        </div>
      </div>


      {/* ======================================================
          HEALTH SUMMARY
      ====================================================== */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <HealthMetric
          label="Backend Status"
          value={
            dashboard?.system.status ??
            'UNKNOWN'
          }
          icon={
            dashboard?.system.status === 'ONLINE'
              ? CheckCircle2
              : XCircle
          }
          tone={
            dashboard?.system.status === 'ONLINE'
              ? 'success'
              : 'danger'
          }
        />

        <HealthMetric
          label="Running Crons"
          value={String(runningCrons)}
          icon={Activity}
          tone={
            runningCrons > 0
              ? 'neutral'
              : 'success'
          }
        />

        <HealthMetric
          label="Provider Locks"
          value={String(lockedCount)}
          icon={ShieldCheck}
          tone={
            lockedCount > 0
              ? 'warning'
              : 'success'
          }
        />

        <HealthMetric
          label="Operational Issues"
          value={String(operationalIssues)}
          icon={AlertTriangle}
          tone={
            operationalIssues > 0
              ? 'danger'
              : 'success'
          }
        />
      </div>


      {/* ======================================================
          BACKEND
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                dashboard?.system.status === 'ONLINE'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-red-500/10 text-red-600'
              }`}
            >
              <Server className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                Backend Application
              </p>

              <p className="text-xs text-muted-foreground">
                {dashboard?.system.status === 'ONLINE'
                  ? 'Application process is online and responding'
                  : 'Backend status is unavailable'}
              </p>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
              dashboard?.system.status,
            )}`}
          >
            {dashboard?.system.status ?? 'UNKNOWN'}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <HealthMetric
            label="Uptime"
            value={
              dashboard
                ? formatDuration(
                    dashboard.system.uptimeSeconds,
                  )
                : '—'
            }
            icon={Clock3}
          />

          <HealthMetric
            label="Started"
            value={formatDateTime(
              dashboard?.system.startedAt,
            )}
            icon={Activity}
          />

          <HealthMetric
            label="Monitor Time"
            value={formatDateTime(
              dashboard?.system.currentTime,
            )}
            icon={Globe2}
          />

          <HealthMetric
            label="Recent Errors"
            value={String(recentErrors)}
            icon={
              recentErrors > 0
                ? AlertTriangle
                : CheckCircle2
            }
            tone={
              recentErrors > 0
                ? 'danger'
                : 'success'
            }
          />
        </div>
      </section>


      {/* ======================================================
          RUNTIME
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />

          <h3 className="text-sm font-semibold text-foreground">
            Runtime Health
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <HealthMetric
            label="Running Crons"
            value={String(runningCrons)}
            icon={Activity}
            tone={
              runningCrons > 0
                ? 'neutral'
                : 'success'
            }
          />

          <HealthMetric
            label="Completed Crons"
            value={String(completedCrons)}
            icon={CheckCircle2}
            tone="success"
          />

          <HealthMetric
            label="Failed Crons"
            value={String(failedCrons)}
            icon={
              failedCrons > 0
                ? XCircle
                : CheckCircle2
            }
            tone={
              failedCrons > 0
                ? 'danger'
                : 'success'
            }
          />
        </div>

        <div className="mt-4 space-y-2">
          {dashboard?.crons
            .slice(0, 8)
            .map(cron => (
              <div
                key={cron.key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/40 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${statusClass(
                      cron.status,
                    )}`}
                  >
                    {cron.status === 'FAILED' ? (
                      <XCircle className="h-4 w-4" />
                    ) : cron.status === 'RUNNING' ? (
                      <Activity className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {cron.name}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {cron.module}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(
                    cron.status,
                  )}`}
                >
                  {cron.status}
                </span>
              </div>
            ))}

          {dashboard?.crons.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
              No cron runtime records available.
            </div>
          )}
        </div>
      </section>


      {/* ======================================================
          PROVIDER OVERVIEW
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-muted-foreground" />

            <h3 className="text-sm font-semibold text-foreground">
              Provider Health
            </h3>
          </div>

          <span className="text-xs text-muted-foreground">
            {providers.length} endpoint
            {providers.length === 1
              ? ''
              : 's'}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ProviderSummaryMetric
            label="Daily Requests"
            value={`${totalDailyRequests}${
              totalDailyLimit
                ? ` / ${totalDailyLimit}`
                : ''
            }`}
            percentage={dailyUsagePercent}
            tone={getUsageTone(
              dailyUsagePercent,
            )}
          />

          <ProviderSummaryMetric
            label="Monthly Requests"
            value={`${totalMonthlyRequests}${
              totalMonthlyLimit
                ? ` / ${totalMonthlyLimit}`
                : ''
            }`}
            percentage={monthlyUsagePercent}
            tone={getUsageTone(
              monthlyUsagePercent,
            )}
          />

          <HealthMetric
            label="Locked Endpoints"
            value={String(lockedCount)}
            icon={ShieldCheck}
            tone={
              lockedCount > 0
                ? 'warning'
                : 'success'
            }
          />

          <HealthMetric
            label="Available Endpoints"
            value={String(
              Math.max(
                0,
                providers.length -
                  lockedCount,
              ),
            )}
            icon={Zap}
            tone="success"
          />
        </div>
      </section>


      {/* ======================================================
          PROVIDERS
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-muted-foreground" />

            <h3 className="text-sm font-semibold text-foreground">
              Provider Endpoints
            </h3>
          </div>

          <span className="text-xs text-muted-foreground">
            Daily / monthly quota state
          </span>
        </div>

        <div className="space-y-2">
          {providers.map(provider => {
            const locked =
              Boolean(
                provider.lockedUntil &&
                  new Date(
                    provider.lockedUntil,
                  ).getTime() > now,
              );

            const dailyPercentage =
              getUsagePercent(provider.dailyRequests);

            const monthlyPercentage =
              getUsagePercent(provider.monthlyRequests);

            return (
              <div
                key={`${provider.provider}:${provider.endpoint}`}
                className="rounded-xl border border-border bg-background/40 p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {provider.provider}
                      </p>

                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          locked
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }`}
                      >
                        {locked
                          ? 'LOCKED'
                          : 'READY'}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {provider.endpoint}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">
                      Lock state
                    </p>

                    <p className="mt-1 text-xs font-semibold text-foreground">
                      {locked
                        ? formatTime(
                            provider.lockedUntil,
                          )
                        : 'Available'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <QuotaRow
                    label="Daily"
                    used={
                      provider.dailyRequests ??
                      0
                    }
                    percentage={
                      dailyPercentage
                    }
                    tone={getUsageTone(
                      dailyPercentage,
                    )}
                  />

                  <QuotaRow
                    label="Monthly"
                    used={
                      provider.monthlyRequests ??
                      0
                    }
                    percentage={
                      monthlyPercentage
                    }
                    tone={getUsageTone(
                      monthlyPercentage,
                    )}
                  />
                </div>
              </div>
            );
          })}

          {providers.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
              No provider health records available.
            </div>
          )}
        </div>

        {lockedCount > 0 && (
          <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

              <div>
                <p className="text-xs font-semibold text-red-600">
                  Provider rate limiter active
                </p>

                <p className="mt-1 text-xs text-red-600/80">
                  {lockedCount} endpoint
                  {lockedCount === 1
                    ? ''
                    : 's'} currently locked.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>


      {/* ======================================================
          RECENT ACTIVITY
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-card/60 p-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />

            <h3 className="text-sm font-semibold text-foreground">
              Recent Monitor Activity
            </h3>
          </div>

          <span className="text-xs text-muted-foreground">
            Latest events
          </span>
        </div>

        <div className="space-y-2">
          {recentActivity.map(
            (item, index) => (
              <div
                key={`${item.occurredAt}-${item.operation}-${index}`}
                className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-background/40 p-3"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${statusClass(
                      item.status,
                    )}`}
                  >
                    {item.status === 'FAILED' ? (
                      <XCircle className="h-4 w-4" />
                    ) : item.status === 'STARTED' ? (
                      <Activity className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.operation}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {item.module} · {item.message}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>

                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {formatDateTime(
                      item.occurredAt,
                    )}
                  </p>
                </div>
              </div>
            ),
          )}

          {recentActivity.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
              No recent monitor activity recorded.
            </div>
          )}
        </div>
      </section>
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
  tone = 'neutral',
}: {
  label: string;
  value: string;
  icon: typeof Activity;
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
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 inline-flex rounded-full px-2 py-1 text-sm font-semibold ${toneClasses[tone]}`}
      >
        {value}
      </p>
    </div>
  );
}


// ============================================================
// PROVIDER SUMMARY METRIC
// ============================================================

function ProviderSummaryMetric({
  label,
  value,
  percentage,
  tone,
}: {
  label: string;
  value: string;
  percentage: number;
  tone: 'success' | 'warning' | 'danger';
}) {
  const toneClasses = {
    success: {
      text: 'text-emerald-600',
      background: 'bg-emerald-500/10',
      bar: 'bg-emerald-500',
    },
    warning: {
      text: 'text-amber-600',
      background: 'bg-amber-500/10',
      bar: 'bg-amber-500',
    },
    danger: {
      text: 'text-red-600',
      background: 'bg-red-500/10',
      bar: 'bg-red-500',
    },
  };

  const currentTone =
    toneClasses[tone];

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {label}
        </span>

        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${currentTone.background} ${currentTone.text}`}
        >
          {Math.round(percentage)}%
        </span>
      </div>

      <p className="mt-2 text-lg font-bold text-foreground">
        {value}
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${currentTone.bar}`}
          style={{
            width: `${Math.min(
              100,
              Math.max(0, percentage),
            )}%`,
          }}
        />
      </div>
    </div>
  );
}


// ============================================================
// QUOTA ROW
// ============================================================

function QuotaRow({
  label,
  used,
  limit,
  percentage,
  tone,
}: {
  label: string;
  used: number;
  limit?: number;
  percentage: number;
  tone: 'success' | 'warning' | 'danger';
}) {
  const toneClasses = {
    success:
      'bg-emerald-500',

    warning:
      'bg-amber-500',

    danger:
      'bg-red-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">
          {label}
        </span>

        <span className="font-semibold text-foreground">
          {used}
          {limit
            ? ` / ${limit}`
            : ''}
        </span>
      </div>

      {limit ? (
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${toneClasses[tone]}`}
            style={{
              width: `${Math.min(
                100,
                Math.max(0, percentage),
              )}%`,
            }}
          />
        </div>
      ) : (
        <p className="mt-1 text-[10px] text-muted-foreground">
          Provider quota is summarized above
        </p>
      )}
    </div>
  );
}
