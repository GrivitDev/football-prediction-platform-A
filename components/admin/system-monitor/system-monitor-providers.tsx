'use client';

import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Globe2,
  Info,
  Lock,
  RefreshCw,
  ShieldCheck,
  TimerReset,
  TrendingUp,
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
      second: '2-digit',
    },
  );
};


const formatFreshness = (
  value?: string,
): string => {
  if (!value) {
    return 'No request recorded';
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


const formatLimit = (
  value: number | null,
): string => {
  return value == null
    ? 'Unlimited'
    : formatNumber(value);
};


const providerClass = (
  provider: string,
): string => {
  switch (provider) {
    case 'espn':
      return 'bg-blue-500/10 text-blue-600';

    case 'odds-api':
      return 'bg-amber-500/10 text-amber-600';

    case 'youtube':
      return 'bg-red-500/10 text-red-600';

    case 'football-data':
      return 'bg-emerald-500/10 text-emerald-600';

    default:
      return 'bg-muted text-muted-foreground';
  }
};


const coverageClass = (
  percentage: number,
): string => {
  if (percentage >= 90) {
    return 'text-emerald-600';
  }

  if (percentage >= 70) {
    return 'text-amber-600';
  }

  return 'text-red-600';
};


const quotaPercentage = (
  used: number,
  limit: number | null,
): number | null => {
  if (
    limit === null ||
    limit <= 0
  ) {
    return null;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (used / limit) * 100,
    ),
  );
};


const quotaBarClass = (
  percentage: number,
): string => {
  if (percentage >= 90) {
    return 'bg-red-500';
  }

  if (percentage >= 70) {
    return 'bg-amber-500';
  }

  return 'bg-primary';
};


const providerHealthy = (
  provider: {
    usage: {
      remainingDailyRequests: number | null;
      remainingMonthlyRequests: number | null;
      activeLocks: number;
    };
  },
): boolean => {
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

  return (
    !dailyExhausted &&
    !monthlyExhausted &&
    provider.usage.activeLocks === 0
  );
};


const telemetryAvailability =
  (
    provider: {
      telemetry: {
        historicalRequestEventsAvailable: boolean;
        historicalRateByHourAvailable: boolean;
        historicalRateByLeagueAvailable: boolean;
      };
    },
  ) => {
    return [
      provider.telemetry
        .historicalRequestEventsAvailable,

      provider.telemetry
        .historicalRateByHourAvailable,

      provider.telemetry
        .historicalRateByLeagueAvailable,
    ].filter(Boolean).length;
  };


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorProviders() {
  const monitorQuery =
    useSportsSystemMonitor();

  const providers =
    monitorQuery.data?.providers ?? [];


  // ==========================================================
  // GLOBAL TOTALS
  // ==========================================================

  const totalLocks =
    providers.reduce(
      (
        total,
        provider,
      ) =>
        total +
        provider.usage
          .activeLocks,
      0,
    );

  const totalEndpoints =
    providers.reduce(
      (
        total,
        provider,
      ) =>
        total +
        provider.endpoints.length,
      0,
    );

  const totalDailyRequests =
    providers.reduce(
      (
        total,
        provider,
      ) =>
        total +
        provider.usage
          .dailyRequests,
      0,
    );

  const totalMonthlyRequests =
    providers.reduce(
      (
        total,
        provider,
      ) =>
        total +
        provider.usage
          .monthlyRequests,
      0,
    );

  const providersHealthy =
    providers.filter(
      provider =>
        providerHealthy(
          provider,
        ),
    ).length;

  const quotaLimitedProviders =
    providers.filter(
      provider =>
        provider.limits
          .dailyRequestLimit !== null ||
        provider.limits
          .monthlyRequestLimit !== null,
    ).length;

  const exhaustedProviders =
    providers.filter(
      provider => {
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

        return (
          dailyExhausted ||
          monthlyExhausted
        );
      },
    ).length;

  const historicalTelemetryProviders =
    providers.filter(
      provider =>
        provider.telemetry
          .historicalRequestEventsAvailable,
    ).length;


  return (
    <div className="space-y-4">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Sports Providers
          </h2>

          <p className="text-sm text-muted-foreground">
            Provider quota, pacing, request activity, endpoint state, locks, and telemetry availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {monitorQuery.data?.generatedAt && (
            <span className="hidden text-[10px] text-muted-foreground sm:inline">
              Updated{' '}
              {formatDateTime(
                monitorQuery.data
                  .generatedAt,
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

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <ProviderMetric
          label="Providers"
          value={providers.length}
          icon={Globe2}
        />

        <ProviderMetric
          label="Healthy"
          value={providersHealthy}
          icon={ShieldCheck}
        />

        <ProviderMetric
          label="Daily Requests"
          value={totalDailyRequests}
          icon={RefreshCw}
        />

        <ProviderMetric
          label="Monthly Requests"
          value={totalMonthlyRequests}
          icon={TrendingUp}
        />

        <ProviderMetric
          label="Endpoints"
          value={totalEndpoints}
          icon={Zap}
        />

        <ProviderMetric
          label="Locks"
          value={totalLocks}
          icon={Lock}
          danger={
            totalLocks > 0
          }
        />

        <ProviderMetric
          label="Quota Limited"
          value={quotaLimitedProviders}
          icon={BarChart3}
        />

        <ProviderMetric
          label="Exhausted"
          value={exhaustedProviders}
          icon={XCircle}
          danger={
            exhaustedProviders > 0
          }
        />
      </section>


      {/* ======================================================
          GLOBAL STATUS
      ====================================================== */}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          title="Provider Health"
          value={
            providers.length > 0
              ? `${providersHealthy}/${providers.length}`
              : '—'
          }
          detail="Providers with no exhausted quota and no active locks."
          icon={ShieldCheck}
          tone={
            providersHealthy ===
            providers.length
              ? 'success'
              : 'warning'
          }
        />

        <StatusCard
          title="Quota Exhaustion"
          value={
            exhaustedProviders > 0
              ? `${exhaustedProviders} affected`
              : 'Clear'
          }
          detail="Daily or monthly provider limits currently exhausted."
          icon={
            exhaustedProviders > 0
              ? AlertTriangle
              : CheckCircle2
          }
          tone={
            exhaustedProviders > 0
              ? 'danger'
              : 'success'
          }
        />

        <StatusCard
          title="Active Locks"
          value={
            totalLocks > 0
              ? `${totalLocks} locked`
              : 'None'
          }
          detail="Endpoint locks currently active in rate-limit state."
          icon={Lock}
          tone={
            totalLocks > 0
              ? 'danger'
              : 'success'
          }
        />

        <StatusCard
          title="Historical Telemetry"
          value={
            historicalTelemetryProviders > 0
              ? `${historicalTelemetryProviders}/${providers.length}`
              : 'Not stored'
          }
          detail="Providers with immutable request-event telemetry."
          icon={Clock3}
          tone={
            historicalTelemetryProviders > 0
              ? 'success'
              : 'warning'
          }
        />
      </section>


      {/* ======================================================
          PROVIDER CARDS
      ====================================================== */}

      <div className="space-y-3">
        {providers.map(
          provider => {
            const healthy =
              providerHealthy(
                provider,
              );

            const dailyPercentage =
              quotaPercentage(
                provider.usage
                  .dailyRequests,
                provider.limits
                  .dailyRequestLimit,
              );

            const monthlyPercentage =
              quotaPercentage(
                provider.usage
                  .monthlyRequests,
                provider.limits
                  .monthlyRequestLimit,
              );

            const telemetryCount =
              telemetryAvailability(
                provider,
              );

            return (
              <section
                key={
                  provider.provider
                }
                className="overflow-hidden rounded-2xl border border-border bg-card/60"
              >
                {/* ==================================================
                    PROVIDER HEADER
                ================================================== */}

                <div className="border-b border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${providerClass(
                          provider.provider,
                        )}`}
                      >
                        <Globe2 className="h-4 w-4" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground">
                            {provider.provider}
                          </h3>

                          <span
                            className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                              healthy
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-red-500/10 text-red-600'
                            }`}
                          >
                            {healthy
                              ? 'HEALTHY'
                              : 'ATTENTION'}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Minimum interval{' '}
                          <span className="font-semibold text-foreground">
                            {provider.limits.minIntervalSeconds}s
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {provider.usage
                        .activeLocks > 0 && (
                        <span className="rounded-full bg-red-500/10 px-2 py-1 text-[9px] font-semibold text-red-600">
                          {
                            provider.usage
                              .activeLocks
                          }{' '}
                          ACTIVE LOCK
                          {provider.usage
                            .activeLocks === 1
                            ? ''
                            : 'S'}
                        </span>
                      )}

                      {provider.limits
                        .dailyRequestLimit !==
                        null && (
                        <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-semibold text-muted-foreground">
                          Daily quota
                        </span>
                      )}

                      {provider.limits
                        .monthlyRequestLimit !==
                        null && (
                        <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-semibold text-muted-foreground">
                          Monthly quota
                        </span>
                      )}
                    </div>
                  </div>
                </div>


                {/* ==================================================
                    PROVIDER BODY
                ================================================== */}

                <div className="p-4">
                  {/* USAGE */}

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <QuotaCard
                      title="Daily Requests"
                      used={
                        provider.usage
                          .dailyRequests
                      }
                      limit={
                        provider.limits
                          .dailyRequestLimit
                      }
                      percentage={
                        dailyPercentage
                      }
                    />

                    <QuotaCard
                      title="Monthly Requests"
                      used={
                        provider.usage
                          .monthlyRequests
                      }
                      limit={
                        provider.limits
                          .monthlyRequestLimit
                      }
                      percentage={
                        monthlyPercentage
                      }
                    />

                    <RemainingCard
                      title="Remaining Daily"
                      value={
                        provider.usage
                          .remainingDailyRequests
                      }
                    />

                    <RemainingCard
                      title="Remaining Monthly"
                      value={
                        provider.usage
                          .remainingMonthlyRequests
                      }
                    />
                  </div>


                  {/* REQUEST STATE */}

                  <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <InfoCard
                      icon={Clock3}
                      label="Last Request"
                      value={formatDateTime(
                        provider.usage
                          .lastRequestAt,
                      )}
                      detail={formatFreshness(
                        provider.usage
                          .lastRequestAt,
                      )}
                    />

                    <InfoCard
                      icon={TimerReset}
                      label="Daily Period"
                      value={
                        provider.usage
                          .dailyPeriod ??
                        '—'
                      }
                    />

                    <InfoCard
                      icon={TimerReset}
                      label="Monthly Period"
                      value={
                        provider.usage
                          .monthlyPeriod ??
                        '—'
                      }
                    />

                    <InfoCard
                      icon={Lock}
                      label="Active Locks"
                      value={formatNumber(
                        provider.usage
                          .activeLocks,
                      )}
                      detail={
                        provider.usage
                          .activeLocks > 0
                          ? 'Provider pacing currently locked'
                          : 'No endpoint locks'
                      }
                    />
                  </div>


                  {/* ENDPOINT STATE */}

                  <div className="mt-4 overflow-hidden rounded-xl border border-border">
                    <div className="border-b border-border bg-background/30 px-3 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            Endpoint State
                          </p>

                          <p className="text-[10px] text-muted-foreground">
                            Current endpoint-level usage and pacing state.
                          </p>
                        </div>

                        <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-semibold text-muted-foreground">
                          {provider.endpoints.length}{' '}
                          endpoint
                          {provider.endpoints.length ===
                          1
                            ? ''
                            : 's'}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1050px] text-left">
                        <thead>
                          <tr className="border-b border-border text-[9px] text-muted-foreground">
                            <th className="px-3 py-3 font-medium">
                              Endpoint
                            </th>

                            <th className="px-3 py-3 font-medium">
                              Daily
                            </th>

                            <th className="px-3 py-3 font-medium">
                              Monthly
                            </th>

                            <th className="px-3 py-3 font-medium">
                              Last Request
                            </th>

                            <th className="px-3 py-3 font-medium">
                              Freshness
                            </th>

                            <th className="px-3 py-3 font-medium">
                              Lock
                            </th>

                            <th className="px-3 py-3 font-medium">
                              State
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {provider.endpoints.map(
                            endpoint => {
                              const locked =
                                Boolean(
                                  endpoint.lockedUntil &&
                                  new Date(
                                    endpoint.lockedUntil,
                                  ).getTime() >
                                    Date.now(),
                                );

                              return (
                                <tr
                                  key={
                                    endpoint.endpoint
                                  }
                                  className="border-b border-border/60 last:border-0"
                                >
                                  <td className="px-3 py-3">
                                    <p className="max-w-[340px] truncate font-mono text-[9px] font-semibold text-foreground">
                                      {endpoint.endpoint}
                                    </p>
                                  </td>

                                  <td className="px-3 py-3">
                                    <p className="text-xs font-semibold text-foreground">
                                      {formatNumber(
                                        endpoint.dailyRequests,
                                      )}
                                    </p>

                                    {provider.limits
                                      .dailyRequestLimit !==
                                      null && (
                                      <p className="mt-1 text-[9px] text-muted-foreground">
                                        /{' '}
                                        {formatNumber(
                                          provider
                                            .limits
                                            .dailyRequestLimit ??
                                            0,
                                        )}
                                      </p>
                                    )}
                                  </td>

                                  <td className="px-3 py-3">
                                    <p className="text-xs font-semibold text-foreground">
                                      {formatNumber(
                                        endpoint.monthlyRequests,
                                      )}
                                    </p>

                                    {provider.limits
                                      .monthlyRequestLimit !==
                                      null && (
                                      <p className="mt-1 text-[9px] text-muted-foreground">
                                        /{' '}
                                        {formatNumber(
                                          provider
                                            .limits
                                            .monthlyRequestLimit ??
                                            0,
                                        )}
                                      </p>
                                    )}
                                  </td>

                                  <td className="px-3 py-3 text-[10px] text-muted-foreground">
                                    {formatDateTime(
                                      endpoint.lastRequestAt,
                                    )}
                                  </td>

                                  <td className="px-3 py-3 text-[10px] text-muted-foreground">
                                    {formatFreshness(
                                      endpoint.lastRequestAt,
                                    )}
                                  </td>

                                  <td className="px-3 py-3">
                                    {locked ? (
                                      <div>
                                        <span className="rounded-full bg-red-500/10 px-2 py-1 text-[9px] font-semibold text-red-600">
                                          LOCKED
                                        </span>

                                        <p className="mt-1 text-[9px] text-muted-foreground">
                                          Until{' '}
                                          {formatDateTime(
                                            endpoint.lockedUntil,
                                          )}
                                        </p>
                                      </div>
                                    ) : (
                                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-600">
                                        READY
                                      </span>
                                    )}
                                  </td>

                                  <td className="px-3 py-3">
                                    <span
                                      className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                                        locked
                                          ? 'bg-red-500/10 text-red-600'
                                          : 'bg-emerald-500/10 text-emerald-600'
                                      }`}
                                    >
                                      {locked
                                        ? 'BLOCKED'
                                        : 'AVAILABLE'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            },
                          )}

                          {provider.endpoints.length ===
                            0 && (
                            <tr>
                              <td
                                colSpan={
                                  7
                                }
                                className="px-3 py-8 text-center text-xs text-muted-foreground"
                              >
                                No endpoint records currently stored.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>


                  {/* TELEMETRY */}

                  <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
                    <div className="rounded-xl border border-border bg-background/30 p-3">
                      <div className="flex items-start gap-2">
                        {telemetryCount ===
                        3 ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        ) : (
                          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        )}

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground">
                            Telemetry availability
                          </p>

                          <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
                            {provider.telemetry.note}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <TelemetryFlag
                              label="Request Events"
                              value={
                                provider.telemetry
                                  .historicalRequestEventsAvailable
                              }
                            />

                            <TelemetryFlag
                              label="Hourly Rate"
                              value={
                                provider.telemetry
                                  .historicalRateByHourAvailable
                              }
                            />

                            <TelemetryFlag
                              label="League Rate"
                              value={
                                provider.telemetry
                                  .historicalRateByLeagueAvailable
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-background/30 p-3">
                      <p className="text-[10px] text-muted-foreground">
                        Telemetry Records
                      </p>

                      <p className="mt-2 text-2xl font-bold text-foreground">
                        {telemetryCount}/3
                      </p>

                      <p className="mt-1 text-[9px] text-muted-foreground">
                        historical capabilities available
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            );
          },
        )}

        {providers.length === 0 && (
          <EmptyState>
            No sports provider telemetry is currently available.
          </EmptyState>
        )}
      </div>


      {/* ======================================================
          ARCHITECTURE NOTE
      ====================================================== */}

      <section className="rounded-2xl border border-border bg-background/30 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

          <div>
            <p className="text-xs font-semibold text-foreground">
              Provider telemetry limitation
            </p>

            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
              The current provider rate-limit store exposes current-period usage,
              endpoint usage, last requests, and active locks. It does not retain
              immutable outbound request events, so historical request rates and
              league-level request attribution cannot be reconstructed from this
              monitor alone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


// ============================================================
// METRICS
// ============================================================

function ProviderMetric({
  label,
  value,
  icon: Icon,
  danger = false,
}: {
  label: string;
  value: number;
  icon: typeof Globe2;
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
        {formatNumber(
          value,
        )}
      </p>
    </div>
  );
}


// ============================================================
// STATUS CARD
// ============================================================

function StatusCard({
  title,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  icon:
    | typeof ShieldCheck
    | typeof AlertTriangle
    | typeof CheckCircle2
    | typeof Lock
    | typeof Clock3;
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
          {title}
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
// QUOTA CARD
// ============================================================

function QuotaCard({
  title,
  used,
  limit,
  percentage,
}: {
  title: string;
  used: number;
  limit: number | null;
  percentage: number | null;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-sm font-bold text-foreground">
            {formatNumber(
              used,
            )}
          </p>
        </div>

        <span className="text-[9px] font-semibold text-muted-foreground">
          {formatLimit(
            limit,
          )}
        </span>
      </div>

      {percentage !==
        null && (
        <>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span
              className={`text-[9px] font-semibold ${coverageClass(
                100 - percentage,
              )}`}
            >
              {percentage.toFixed(
                1,
              )}
              % used
            </span>

            <span className="text-[9px] text-muted-foreground">
              {(100 -
                percentage).toFixed(
                1,
              )}
              % remaining
            </span>
          </div>

          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${quotaBarClass(
                percentage,
              )}`}
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}


// ============================================================
// REMAINING CARD
// ============================================================

function RemainingCard({
  title,
  value,
}: {
  title: string;
  value: number | null;
}) {
  const unlimited =
    value === null;

  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-[10px] text-muted-foreground">
        {title}
      </p>

      <p className="mt-1 text-sm font-bold text-foreground">
        {unlimited
          ? 'Unlimited'
          : formatNumber(
              value,
            )}
      </p>

      <p className="mt-1 text-[9px] text-muted-foreground">
        {unlimited
          ? 'No configured quota'
          : 'Requests remaining'}
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
  detail,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />

        <span className="text-[10px]">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-xs font-semibold text-foreground">
        {value}
      </p>

      {detail && (
        <p className="mt-1 text-[9px] text-muted-foreground">
          {detail}
        </p>
      )}
    </div>
  );
}


// ============================================================
// TELEMETRY
// ============================================================

function TelemetryFlag({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
        value
          ? 'bg-emerald-500/10 text-emerald-600'
          : 'bg-muted text-muted-foreground'
      }`}
    >
      {label}:{' '}
      {value
        ? 'YES'
        : 'NO'}
    </span>
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
    <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
      {children}
    </div>
  );
}