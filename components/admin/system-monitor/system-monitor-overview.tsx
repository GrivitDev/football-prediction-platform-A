'use client';

import {
  Activity,
  AlertTriangle,
  Clock3,
  Database,
  File,
  ListChecks,
  Radio,
  RefreshCw,
  Server,
  Timer,
  Zap,
} from 'lucide-react';

import {
  useAdminEspnQueueSummary,
  useAdminProviderRateLimits,
} from '@/hooks/use-sports';

import {
  useSystemMonitorDashboard,
  useSystemMonitorStorage,
} from '@/hooks/use-system-monitor';

import { useSportsSystemMonitor } from '@/hooks/use-sports-system-monitor';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';


// ============================================================
// HELPERS
// ============================================================

const formatDuration = (
  seconds: number,
): string => {
  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return '—';
  }

  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }

  const minutes =
    Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours =
    Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};


const formatTime = (
  value?: string,
): string => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
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


const formatNumber = (
  value: number,
): string => {
  return new Intl.NumberFormat(
    'en-US',
  ).format(value);
};


const formatBytes = (
  bytes: number,
): string => {
  if (
    !Number.isFinite(bytes) ||
    bytes < 0
  ) {
    return '—';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) /
        Math.log(1024),
    ),
    units.length - 1,
  );

  const value =
    bytes /
    Math.pow(
      1024,
      index,
    );

  return `${value.toFixed(
    index === 0 ? 0 : 2,
  )} ${units[index]}`;
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


const usagePercent = (
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


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorOverview() {
  const [
    currentTime,
    setCurrentTime,
  ] = useState(
    () => Date.now(),
  );

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(
        Date.now(),
      );
    };

    updateCurrentTime();

    const interval =
      window.setInterval(
        updateCurrentTime,
        1000,
      );

    return () =>
      window.clearInterval(
        interval,
      );
  }, []);


  // ==========================================================
  // QUERIES
  // ==========================================================

  const dashboardQuery =
    useSystemMonitorDashboard();

  const sportsMonitorQuery = useSportsSystemMonitor();
  const providerSummaries = sportsMonitorQuery.data?.providers ?? [];

  const storageQuery =
    useSystemMonitorStorage();

  const queueSummaryQuery =
    useAdminEspnQueueSummary();

  const rateLimitsQuery =
    useAdminProviderRateLimits({
      page: 1,
      limit: 200,
    });


  const dashboard =
    dashboardQuery.data;

  const storage =
    storageQuery.data;

  const queueSummary =
    queueSummaryQuery.data;

  const rateLimits =
    useMemo(
      () =>
        rateLimitsQuery.data?.data ??
        [],
      [rateLimitsQuery.data?.data],
    );


  // ==========================================================
  // DERIVED STATE
  // ==========================================================

  const runningCrons =
    dashboard?.crons.filter(
      cron =>
        cron.status === 'RUNNING',
    ) ?? [];

  const failedCrons =
    dashboard?.crons.filter(
      cron =>
        cron.status === 'FAILED',
    ) ?? [];

  const lockedProviders =
    rateLimits.filter(
      item =>
        item.lockedUntil &&
        new Date(
          item.lockedUntil,
        ).getTime() >
          currentTime,
    );

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

  const queueActive =
    queuePending +
    queueProcessing;

  const queueTotal =
    queuePending +
    queueProcessing +
    queueCompleted +
    queueFailed;

  const queueCompletionPercent =
    queueTotal > 0
      ? Math.round(
          (queueCompleted /
            queueTotal) *
            100,
        )
      : 0;


  // ==========================================================
  // PROVIDER USAGE
  // ==========================================================

  const providerUsage =
    useMemo(() => {
      const dailyUsed = providerSummaries.reduce(
        (total, provider) => total + (provider.usage.dailyRequests ?? 0),
        0,
      );
      const dailyLimit = providerSummaries.reduce(
        (total, provider) => total + (provider.limits.dailyRequestLimit ?? 0),
        0,
      );
      const monthlyUsed = providerSummaries.reduce(
        (total, provider) => total + (provider.usage.monthlyRequests ?? 0),
        0,
      );
      const monthlyLimit = providerSummaries.reduce(
        (total, provider) => total + (provider.limits.monthlyRequestLimit ?? 0),
        0,
      );

      return {
        dailyUsed,
        dailyLimit,
        monthlyUsed,
        monthlyLimit,
        dailyPercent: usagePercent(dailyUsed, dailyLimit),
        monthlyPercent: usagePercent(monthlyUsed, monthlyLimit),
      };
    }, [providerSummaries]);


  const recentActivity =
    dashboard?.recentActivity ??
    [];

  const recentErrors =
    dashboard?.summary.recentErrors ??
    0;

  const totalOperationalAlerts =
    recentErrors +
    failedCrons.length +
    queueFailed +
    lockedProviders.length;


  // ==========================================================
  // STORAGE
  // ==========================================================

  const databaseTotalSize =
    storage?.totals.totalSizeBytes ??
    0;

  const databaseFileSize =
    storage?.totals.dataSizeBytes ??
    0;

  const databaseDocuments =
    storage?.totals.documents ??
    0;

  const databaseCollections =
    storage?.totals.collections ??
    0;


  return (
    <div className="space-y-3">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            System Overview
          </h2>

          <p className="text-xs text-muted-foreground">
            Live operational view of the backend.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RefreshCw
            className={`h-4 w-4 text-muted-foreground ${
              dashboardQuery.isFetching ||
              storageQuery.isFetching
                ? 'animate-spin'
                : ''
            }`}
          />

          <span className="text-[10px] text-muted-foreground">
            Auto-refreshing
          </span>
        </div>
      </div>


      {/* ======================================================
          PRIMARY STATUS
      ====================================================== */}

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard
          icon={Server}
          label="Backend"
          value={
            dashboard?.system.status ??
            '—'
          }
          detail={
            dashboard?.system.status ===
            'ONLINE'
              ? 'Application responding'
              : 'Status unavailable'
          }
          valueClass={statusClass(
            dashboard?.system.status,
          )}
        />

        <MetricCard
          icon={Timer}
          label="Uptime"
          value={
            dashboard
              ? formatDuration(
                  dashboard.system
                    .uptimeSeconds,
                )
              : '—'
          }
          detail="Current process runtime"
        />

        <MetricCard
          icon={Activity}
          label="Active Work"
          value={formatNumber(
            queueActive,
          )}
          detail={`${runningCrons.length} cron${
            runningCrons.length ===
            1
              ? ''
              : 's'
          } running`}
          valueClass={
            queueActive > 0 ||
            runningCrons.length > 0
              ? 'bg-blue-500/10 text-blue-600'
              : ''
          }
        />

        <MetricCard
          icon={AlertTriangle}
          label="Alerts"
          value={formatNumber(
            totalOperationalAlerts,
          )}
          detail={
            totalOperationalAlerts >
            0
              ? 'Requires attention'
              : 'No active alerts'
          }
          valueClass={
            totalOperationalAlerts >
            0
              ? 'bg-red-500/10 text-red-600'
              : 'bg-emerald-500/10 text-emerald-600'
          }
        />

        <MetricCard
          icon={Database}
          label="DB Storage"
          value={formatBytes(
            databaseTotalSize,
          )}
          detail={
            storage
              ? `${formatNumber(
                  databaseDocuments,
                )} docs · ${formatNumber(
                  databaseCollections,
                )} collections`
              : 'Storage unavailable'
          }
          valueClass="bg-primary/10 text-primary"
        />

        <MetricCard
          icon={File}
          label="DB File Size"
          value={formatBytes(
            databaseFileSize,
          )}
          detail="Database data size"
          valueClass="bg-blue-500/10 text-blue-600"
        />
      </div>


      {/* ======================================================
          OPERATIONAL SNAPSHOT
      ====================================================== */}

      <div className="grid gap-3 xl:grid-cols-3">
        <Panel
          title="Queue Snapshot"
          icon={ListChecks}
        >
          <div className="grid grid-cols-4 gap-1.5">
            <MiniMetric
              label="Pending"
              value={queuePending}
            />

            <MiniMetric
              label="Processing"
              value={queueProcessing}
              valueClass={
                queueProcessing > 0
                  ? 'text-blue-600'
                  : undefined
              }
            />

            <MiniMetric
              label="Completed"
              value={queueCompleted}
              valueClass="text-emerald-600"
            />

            <MiniMetric
              label="Failed"
              value={queueFailed}
              valueClass={
                queueFailed > 0
                  ? 'text-red-600'
                  : undefined
              }
            />
          </div>

          <div className="mt-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">
                Queue completion
              </span>

              <span className="font-semibold text-foreground">
                {queueCompletionPercent}%
              </span>
            </div>

            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${queueCompletionPercent}%`,
                }}
              />
            </div>
          </div>
        </Panel>


        <Panel
          title="Cron State"
          icon={Radio}
        >
          <div className="grid grid-cols-4 gap-1.5">
            <MiniMetric
              label="Running"
              value={
                runningCrons.length
              }
              valueClass={
                runningCrons.length >
                0
                  ? 'text-blue-600'
                  : undefined
              }
            />

            <MiniMetric
              label="Failed"
              value={
                failedCrons.length
              }
              valueClass={
                failedCrons.length >
                0
                  ? 'text-red-600'
                  : undefined
              }
            />

            <MiniMetric
              label="Registered"
              value={
                dashboard?.crons
                  .length ?? 0
              }
            />

            <MiniMetric
              label="Errors"
              value={recentErrors}
              valueClass={
                recentErrors > 0
                  ? 'text-red-600'
                  : 'text-emerald-600'
              }
            />
          </div>

          <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-background/40 px-2.5 py-2">
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />

              <span className="text-[10px] text-muted-foreground">
                Runtime
              </span>
            </div>

            <span className="text-xs font-semibold text-foreground">
              {dashboard
                ? formatDuration(
                    dashboard.system
                      .uptimeSeconds,
                  )
                : '—'}
            </span>
          </div>
        </Panel>


        <Panel
          title="Provider Health"
          icon={Zap}
        >
          <div className="grid grid-cols-4 gap-1.5">
            <MiniMetric
              label="Endpoints"
              value={
                rateLimits.length
              }
            />

            <MiniMetric
              label="Locked"
              value={
                lockedProviders.length
              }
              valueClass={
                lockedProviders.length >
                0
                  ? 'text-red-600'
                  : 'text-emerald-600'
              }
            />

            <MiniMetric
              label="Daily"
              value={`${Math.round(
                providerUsage.dailyPercent,
              )}%`}
              valueClass={
                providerUsage.dailyPercent >=
                90
                  ? 'text-red-600'
                  : providerUsage.dailyPercent >=
                      75
                    ? 'text-amber-600'
                    : 'text-emerald-600'
              }
            />

            <MiniMetric
              label="Monthly"
              value={`${Math.round(
                providerUsage.monthlyPercent,
              )}%`}
              valueClass={
                providerUsage.monthlyPercent >=
                90
                  ? 'text-red-600'
                  : providerUsage.monthlyPercent >=
                      75
                    ? 'text-amber-600'
                    : 'text-emerald-600'
              }
            />
          </div>
        </Panel>
      </div>


      {/* ======================================================
          CURRENT OPERATIONS
      ====================================================== */}

      <Panel
        title="Current Operations"
        icon={Activity}
      >
        <div className="space-y-1.5">
          {runningCrons.length > 0 &&
            runningCrons.map(
              cron => (
                <OperationRow
                  key={cron.key}
                  title={cron.name}
                  detail={cron.module}
                  status="RUNNING"
                  tone="blue"
                />
              ),
            )}

          {queueProcessing >
            0 && (
            <OperationRow
              title="ESPN queue processing"
              detail={`${formatNumber(
                queueProcessing,
              )} job${
                queueProcessing ===
                1
                  ? ''
                  : 's'
              } currently processing`}
              status="PROCESSING"
              tone="blue"
            />
          )}

          {lockedProviders.length >
            0 && (
            <OperationRow
              title="Provider rate-limit lock"
              detail={`${lockedProviders.length} endpoint${
                lockedProviders.length ===
                1
                  ? ''
                  : 's'
              } currently locked`}
              status="LOCKED"
              tone="red"
            />
          )}

          {runningCrons.length ===
            0 &&
            queueProcessing ===
              0 &&
            lockedProviders.length ===
              0 && (
            <EmptyState>
              No active backend operation requires attention.
            </EmptyState>
          )}
        </div>
      </Panel>


      {/* ======================================================
          PROVIDER STATE
      ====================================================== */}

      <Panel
        title="Provider State"
        icon={Zap}
      >
        <div className="grid gap-1.5 md:grid-cols-2 xl:grid-cols-4">
          {rateLimits.length ===
          0 ? (
            <EmptyState>
              No provider rate-limit state available.
            </EmptyState>
          ) : (
            rateLimits.map(
              rateLimit => {
                const locked =
                  Boolean(
                    rateLimit.lockedUntil &&
                      new Date(
                        rateLimit.lockedUntil,
                      ).getTime() >
                        currentTime,
                  );

                const dailyPercent =
                  usagePercent(rateLimit.dailyRequests);

                const monthlyPercent =
                  usagePercent(rateLimit.monthlyRequests);

                return (
                  <div
                    key={`${rateLimit.provider}:${rateLimit.endpoint}`}
                    className="rounded-xl border border-border bg-background/40 p-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] font-semibold text-foreground">
                        {
                          rateLimit.provider
                        }
                      </span>

                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
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

                    <p className="mt-0.5 truncate text-[9px] text-muted-foreground">
                      {
                        rateLimit.endpoint
                      }
                    </p>

                    <QuotaRow
                      label="Daily"
                      used={
                        rateLimit.dailyRequests ??
                        0
                      }
                      percentage={
                        dailyPercent
                      }
                    />

                    <QuotaRow
                      label="Monthly"
                      used={
                        rateLimit.monthlyRequests ??
                        0
                      }
                      percentage={
                        monthlyPercent
                      }
                    />
                  </div>
                );
              },
            )
          )}
        </div>

        {lockedProviders.length >
          0 && (
          <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-2 text-[10px] text-red-600">
            {lockedProviders.length} provider endpoint
            {lockedProviders.length ===
            1
              ? ''
              : 's'} currently locked.
          </div>
        )}
      </Panel>


      {/* ======================================================
          RECENT ACTIVITY
      ====================================================== */}

      <Panel
        title="Recent Activity"
        icon={Database}
      >
        <div className="space-y-1.5">
          {recentActivity
            .slice(0, 6)
            .map(
              (
                item,
                index,
              ) => (
                <div
                  key={`${item.occurredAt}-${item.operation}-${index}`}
                  className="flex items-start justify-between gap-2 rounded-lg border border-border/60 bg-background/30 px-2.5 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-foreground">
                      {
                        item.operation
                      }
                    </p>

                    <p className="truncate text-[9px] text-muted-foreground">
                      {
                        item.module
                      }{' '}
                      ·{' '}
                      {
                        item.message
                      }
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${statusClass(
                        item.status,
                      )}`}
                    >
                      {
                        item.status
                      }
                    </span>

                    <p className="mt-0.5 text-[9px] text-muted-foreground">
                      {formatTime(
                        item.occurredAt,
                      )}
                    </p>
                  </div>
                </div>
              ),
            )}

          {recentActivity.length ===
            0 && (
            <EmptyState>
              No recent activity recorded.
            </EmptyState>
          )}
        </div>
      </Panel>
    </div>
  );
}


// ============================================================
// UI
// ============================================================

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  valueClass = '',
}: {
  icon: typeof Server;
  label: string;
  value: string | number;
  detail: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />

        <span className="text-[10px] font-medium">
          {label}
        </span>
      </div>

      <span
        className={`mt-1.5 inline-flex rounded-full px-2 py-0.5 text-sm font-bold ${
          valueClass ||
          'text-foreground'
        }`}
      >
        {value}
      </span>

      <p className="mt-1 truncate text-[9px] text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}


function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Server;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card/60 p-3">
      <div className="mb-2.5 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />

        <h3 className="text-xs font-semibold text-foreground">
          {title}
        </h3>
      </div>

      {children}
    </section>
  );
}


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
    <div className="rounded-lg border border-border bg-background/40 px-2 py-1.5">
      <p className="text-[8px] text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-0.5 text-sm font-bold ${
          valueClass ||
          'text-foreground'
        }`}
      >
        {value}
      </p>
    </div>
  );
}


function OperationRow({
  title,
  detail,
  status,
  tone,
}: {
  title: string;
  detail: string;
  status: string;
  tone: 'blue' | 'red';
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/40 px-2.5 py-2">
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold text-foreground">
          {title}
        </p>

        <p className="truncate text-[9px] text-muted-foreground">
          {detail}
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
          tone === 'red'
            ? 'bg-red-500/10 text-red-600'
            : 'bg-blue-500/10 text-blue-600'
        }`}
      >
        {status}
      </span>
    </div>
  );
}


function QuotaRow({
  label,
  used,
  limit,
  percentage,
}: {
  label: string;
  used: number;
  limit?: number;
  percentage: number;
}) {
  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between text-[9px]">
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
        <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}


function EmptyState({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border px-3 py-3 text-center text-[10px] text-muted-foreground">
      {children}
    </div>
  );
}
