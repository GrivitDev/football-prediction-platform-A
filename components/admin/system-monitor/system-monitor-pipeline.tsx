'use client';

import {
  Activity,
  ArrowDown,
  CheckCircle2,
  CircleDot,
  Clock3,
  Database,
  Info,
  Layers3,
  RefreshCw,
  RotateCcw,
  Workflow,
  XCircle,
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

  const date =
    new Date(value);

  if (Number.isNaN(
    date.getTime(),
  )) {
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


const sourceClass = (
  source: string,
): string => {
  switch (source) {
    case 'ESPN':
      return 'bg-blue-500/10 text-blue-600';

    case 'ODDS_API':
      return 'bg-amber-500/10 text-amber-600';

    case 'YOUTUBE':
      return 'bg-red-500/10 text-red-600';

    case 'QUEUE':
      return 'bg-violet-500/10 text-violet-600';

    case 'APPLICATION':
      return 'bg-emerald-500/10 text-emerald-600';

    default:
      return 'bg-muted text-muted-foreground';
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


const statusToneClass = (
  status: string,
): string => {
  switch (status) {
    case 'SUCCESS':
    case 'COMPLETED':
      return 'text-emerald-600';

    case 'PROCESSING':
      return 'text-blue-600';

    case 'PENDING':
      return 'text-amber-600';

    case 'FAILED':
      return 'text-red-600';

    case 'PARTIAL':
      return 'text-amber-600';

    default:
      return 'text-muted-foreground';
  }
};


const getProgressFromState = (
  state: {
    unitProgress: {
      total: number;
      success: number;
    };
  },
): number => {
  if (
    state.unitProgress.total <= 0
  ) {
    return 0;
  }

  return Number(
    (
      (
        state.unitProgress.success /
        state.unitProgress.total
      ) * 100
    ).toFixed(2),
  );
};


const getPipelineStates = <T extends {
    jobType?: string;
  }>(
  states: T[],
  jobType: string,
): T[] => {
  return states.filter(
    state =>
      state.jobType ===
      jobType,
  );
};


const getStateCounts = (
  states: Array<{
    status: string;
  }>,
): Record<string, number> => {
  return states.reduce(
    (
      result,
      state,
    ) => {
      result[state.status] =
        (result[state.status] ??
          0) + 1;

      return result;
    },
    {} as Record<
      string,
      number
    >,
  );
};


const getUnitTotals = (
  states: Array<{
    unitProgress: {
      total: number;
      success: number;
      processing: number;
      pending: number;
      failed: number;
    };
  }>,
) => {
  return states.reduce(
    (
      result,
      state,
    ) => {
      result.total +=
        state.unitProgress.total;

      result.success +=
        state.unitProgress.success;

      result.processing +=
        state.unitProgress.processing;

      result.pending +=
        state.unitProgress.pending;

      result.failed +=
        state.unitProgress.failed;

      return result;
    },
    {
      total: 0,
      success: 0,
      processing: 0,
      pending: 0,
      failed: 0,
    },
  );
};


const getAverageTiming = (
  states: Array<{
    timing: {
      sampleCount: number;
      averageSecondsPerUnit?: number;
      unitsPerMinute?: number;
    };
  }>,
) => {
  let weightedDuration = 0;
  let samples = 0;

  for (const state of states) {
    const count =
      state.timing
        .sampleCount;

    const average =
      state.timing
        .averageSecondsPerUnit;

    if (
      count <= 0 ||
      average === undefined ||
      !Number.isFinite(
        average,
      )
    ) {
      continue;
    }

    weightedDuration +=
      average * count;

    samples += count;
  }

  const averageSecondsPerUnit =
    samples > 0
      ? weightedDuration /
        samples
      : undefined;

  const unitsPerMinute =
    averageSecondsPerUnit !==
        undefined &&
    averageSecondsPerUnit > 0
      ? 60 /
        averageSecondsPerUnit
      : undefined;

  return {
    sampleCount: samples,
    averageSecondsPerUnit,
    unitsPerMinute,
  };
};


const getEarliestDate = (
  values: Array<
    string | undefined
  >,
): string | undefined => {
  return values
    .filter(Boolean)
    .map(
      value => ({
        value: value as string,
        time: new Date(
          value as string,
        ).getTime(),
      }),
    )
    .filter(
      item =>
        Number.isFinite(
          item.time,
        ),
    )
    .sort(
      (a, b) =>
        a.time - b.time,
    )[0]?.value;
};


const getLatestDate = (
  values: Array<
    string | undefined
  >,
): string | undefined => {
  return values
    .filter(Boolean)
    .map(
      value => ({
        value: value as string,
        time: new Date(
          value as string,
        ).getTime(),
      }),
    )
    .filter(
      item =>
        Number.isFinite(
          item.time,
        ),
    )
    .sort(
      (a, b) =>
        b.time - a.time,
    )[0]?.value;
};


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorPipeline() {
  const monitorQuery =
    useSportsSystemMonitor();

  const monitor =
    monitorQuery.data;

  const pipeline =
    monitor?.pipeline ?? {};

  const syncStates =
    monitor?.sync.states ?? [];

  const entries =
    Object.entries(
      pipeline,
    );


  return (
    <div className="space-y-4">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Sports Pipeline
          </h2>

          <p className="text-sm text-muted-foreground">
            Operational job flows, processing stages, live state distribution, and observed execution timing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {monitor?.generatedAt && (
            <span className="hidden text-[10px] text-muted-foreground sm:inline">
              Updated{' '}
              {formatDateTime(
                monitor.generatedAt,
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
          GLOBAL PIPELINE SUMMARY
      ====================================================== */}

      {entries.length > 0 && (
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
          <PipelineMetric
            label="Pipelines"
            value={
              entries.length
            }
            icon={Workflow}
          />

          <PipelineMetric
            label="Stages"
            value={
              entries.reduce(
                (
                  total,
                  [, definition],
                ) =>
                  total +
                  definition.stages.length,
                0,
              )
            }
            icon={Layers3}
          />

          <PipelineMetric
            label="Sync States"
            value={
              syncStates.length
            }
            icon={RotateCcw}
          />

          <PipelineMetric
            label="Processing"
            value={
              syncStates.filter(
                state =>
                  state.status ===
                  'PROCESSING',
              ).length
            }
            icon={RefreshCw}
          />

          <PipelineMetric
            label="Pending"
            value={
              syncStates.filter(
                state =>
                  state.status ===
                  'PENDING',
              ).length
            }
            icon={Clock3}
          />

          <PipelineMetric
            label="Failed"
            value={
              syncStates.filter(
                state =>
                  state.status ===
                  'FAILED',
              ).length
            }
            icon={XCircle}
            danger={
              syncStates.some(
                state =>
                  state.status ===
                  'FAILED',
              )
            }
          />

          <PipelineMetric
            label="Successful"
            value={
              syncStates.filter(
                state =>
                  state.status ===
                  'SUCCESS',
              ).length
            }
            icon={CheckCircle2}
          />

          <PipelineMetric
            label="Current Units"
            value={
              syncStates.reduce(
                (
                  total,
                  state,
                ) =>
                  total +
                  state.unitProgress
                    .total,
                0,
              )
            }
            icon={Database}
          />
        </section>
      )}


      {/* ======================================================
          PIPELINES
      ====================================================== */}

      {entries.length === 0 ? (
        <EmptyState>
          No sports pipeline definitions are currently available.
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {entries.map(
            (
              [
                jobType,
                definition,
              ],
            ) => {
              const states =
                getPipelineStates(
                  syncStates,
                  jobType,
                );

              const stateCounts =
                getStateCounts(
                  states,
                );

              const units =
                getUnitTotals(
                  states,
                );

              const timing =
                getAverageTiming(
                  states,
                );

              const successfulPercent =
                units.total > 0
                  ? Number(
                      (
                        (
                          units.success /
                          units.total
                        ) *
                        100
                      ).toFixed(2),
                    )
                  : 0;

              const totalRemaining =
                units.pending +
                units.processing +
                units.failed;

              const earliestStartedAt =
                getEarliestDate(
                  states.map(
                    state =>
                      state.lastStartedAt,
                  ),
                );

              const latestCompletedAt =
                getLatestDate(
                  states.map(
                    state =>
                      state.lastCompletedAt,
                  ),
                );

              return (
                <section
                  key={
                    jobType
                  }
                  className="overflow-hidden rounded-2xl border border-border bg-card/60"
                >
                  {/* ==================================================
                      PIPELINE HEADER
                  ================================================== */}

                  <div className="border-b border-border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground">
                            {formatLabel(
                              jobType,
                            )}
                          </h3>

                          <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-semibold text-muted-foreground">
                            {definition.stages.length}{' '}
                            stages
                          </span>

                          <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-semibold text-primary">
                            {states.length}{' '}
                            live states
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {states.length > 0
                            ? `${formatNumber(
                                totalRemaining,
                              )} units remaining across this pipeline`
                            : 'Pipeline definition available; no matching persistent queue states currently returned.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <HeaderMetric
                          label="Units"
                          value={formatNumber(
                            units.total,
                          )}
                        />

                        <HeaderMetric
                          label="Complete"
                          value={`${successfulPercent}%`}
                        />

                        <HeaderMetric
                          label="Samples"
                          value={formatNumber(
                            timing.sampleCount,
                          )}
                        />

                        <HeaderMetric
                          label="Speed"
                          value={
                            timing.averageSecondsPerUnit !==
                            undefined
                              ? `${timing.averageSecondsPerUnit.toFixed(
                                  2,
                                )}s`
                              : '—'
                          }
                        />
                      </div>
                    </div>

                    {states.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            Pipeline unit completion
                          </span>

                          <span className="text-xs font-bold text-foreground">
                            {successfulPercent}%
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
                                  successfulPercent,
                                ),
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>


                  {/* ==================================================
                      STATE DISTRIBUTION
                  ================================================== */}

                  <div className="border-b border-border p-4">
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                      {[
                        'PROCESSING',
                        'PENDING',
                        'FAILED',
                        'SUCCESS',
                      ].map(
                        status => (
                          <div
                            key={
                              status
                            }
                            className="rounded-xl border border-border bg-background/40 p-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusClass(
                                  status,
                                )}`}
                              >
                                {status}
                              </span>

                              <span
                                className={`text-lg font-bold ${statusToneClass(
                                  status,
                                )}`}
                              >
                                {formatNumber(
                                  stateCounts[
                                    status
                                  ] ??
                                    0,
                                )}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>


                  {/* ==================================================
                      PIPELINE METADATA
                  ================================================== */}

                  <div className="border-b border-border p-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                      <PipelineInfo
                        label="Current States"
                        value={formatNumber(
                          states.length,
                        )}
                      />

                      <PipelineInfo
                        label="Remaining Units"
                        value={formatNumber(
                          totalRemaining,
                        )}
                      />

                      <PipelineInfo
                        label="Observed Throughput"
                        value={
                          timing.unitsPerMinute !==
                          undefined
                            ? `${timing.unitsPerMinute.toFixed(
                                2,
                              )}/min`
                            : '—'
                        }
                      />

                      <PipelineInfo
                        label="First Started"
                        value={formatDateTime(
                          earliestStartedAt,
                        )}
                      />

                      <PipelineInfo
                        label="Latest Completed"
                        value={formatDateTime(
                          latestCompletedAt,
                        )}
                      />
                    </div>
                  </div>


                  {/* ==================================================
                      FLOW
                  ================================================== */}

                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-muted-foreground" />

                      <div>
                        <h4 className="text-xs font-semibold text-foreground">
                          Operational Flow
                        </h4>

                        <p className="text-[10px] text-muted-foreground">
                          Ordered stages exposed by the backend definition.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {definition.stages.map(
                        (
                          stage,
                          index,
                        ) => {
                          const operation =
                            definition
                              .operations[
                              stage
                            ];

                          return (
                            <div
                              key={
                                stage
                              }
                            >
                              <div className="flex items-stretch gap-2">
                                <div className="flex w-7 shrink-0 flex-col items-center">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    {index ===
                                    0 ? (
                                      <CircleDot className="h-3.5 w-3.5" />
                                    ) : (
                                      <Activity className="h-3.5 w-3.5" />
                                    )}
                                  </div>

                                  {index <
                                    definition
                                      .stages
                                      .length -
                                      1 && (
                                    <div className="mt-1 h-full min-h-5 w-px bg-border" />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1 rounded-xl border border-border bg-background/40 p-3">
                                  <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-semibold text-foreground">
                                          {formatLabel(
                                            stage,
                                          )}
                                        </span>

                                        {operation?.conditional && (
                                          <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-600">
                                            CONDITIONAL
                                          </span>
                                        )}

                                        {operation?.source && (
                                          <span
                                            className={`rounded-full px-2 py-1 text-[9px] font-semibold ${sourceClass(
                                              operation.source,
                                            )}`}
                                          >
                                            {
                                              operation.source
                                            }
                                          </span>
                                        )}
                                      </div>

                                      <p className="mt-1 text-[9px] text-muted-foreground">
                                        Stage {index + 1}{' '}
                                        of{' '}
                                        {definition
                                          .stages
                                          .length}
                                      </p>
                                    </div>
                                  </div>

                                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                    {operation?.operation ??
                                      'No operation description available.'}
                                  </p>

                                  {operation?.note && (
                                    <div className="mt-2 flex items-start gap-2 rounded-lg border border-border bg-card/50 p-2">
                                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                                      <p className="text-[10px] leading-5 text-muted-foreground">
                                        {
                                          operation.note
                                        }
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {index <
                                definition
                                  .stages
                                  .length -
                                  1 && (
                                <div className="flex items-center pl-3 pt-1 text-muted-foreground">
                                  <ArrowDown className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>


                  {/* ==================================================
                      LIVE STATE DETAILS
                  ================================================== */}

                  <div className="border-t border-border p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-muted-foreground" />

                      <div>
                        <h4 className="text-xs font-semibold text-foreground">
                          Live Persistent States
                        </h4>

                        <p className="text-[10px] text-muted-foreground">
                          Actual states currently returned for this pipeline.
                        </p>
                      </div>
                    </div>

                    {states.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
                        No persistent sync states currently match this pipeline.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {states.map(
                          state => (
                            <PipelineStateCard
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
                  </div>
                </section>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}


// ============================================================
// PIPELINE METRIC
// ============================================================

function PipelineMetric({
  label,
  value,
  icon: Icon,
  danger = false,
}: {
  label: string;
  value: number;
  icon: typeof Workflow;
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
// HEADER METRIC
// ============================================================

function HeaderMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="text-right">
      <p className="text-[9px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}


// ============================================================
// PIPELINE INFO
// ============================================================

function PipelineInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="text-[9px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}


// ============================================================
// PIPELINE STATE
// ============================================================

function PipelineStateCard({
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
  const progress =
    getProgressFromState(
      state,
    );

  const remaining =
    state.estimate.remainingUnits;

  return (
    <article className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold text-foreground">
              {state.leagueName ??
                state.leagueId ??
                'No league'}
            </p>

            {state.season !==
              undefined && (
              <span className="rounded-full bg-muted px-2 py-1 text-[9px] text-muted-foreground">
                {state.season}
              </span>
            )}

            <span
              className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusClass(
                state.status,
              )}`}
            >
              {state.status}
            </span>
          </div>

          <p className="mt-1 truncate font-mono text-[9px] text-muted-foreground">
            {state.stateKey}
          </p>

          <p className="mt-1 text-[9px] text-muted-foreground">
            {state.trackingMode
              ? formatLabel(
                  state.trackingMode,
                )
              : 'No tracking mode'}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-muted-foreground">
            Progress
          </p>

          <p className="mt-1 text-sm font-bold text-foreground">
            {progress}%
          </p>
        </div>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${Math.min(
              100,
              Math.max(
                0,
                progress,
              ),
            )}%`,
          }}
        />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <PipelineInfo
          label="Units"
          value={formatNumber(
            state.unitProgress.total,
          )}
        />

        <PipelineInfo
          label="Date Units"
          value={formatNumber(
            state.unitProgress
              .dateUnits,
          )}
        />

        <PipelineInfo
          label="Successful"
          value={formatNumber(
            state.unitProgress
              .success,
          )}
        />

        <PipelineInfo
          label="Remaining"
          value={formatNumber(
            remaining,
          )}
        />

        <PipelineInfo
          label="Average Speed"
          value={
            state.timing
              .averageSecondsPerUnit !==
            undefined
              ? `${state.timing.averageSecondsPerUnit.toFixed(
                  2,
                )}s/unit`
              : '—'
          }
        />

        <PipelineInfo
          label="Throughput"
          value={
            state.timing
              .unitsPerMinute !==
            undefined
              ? `${state.timing.unitsPerMinute.toFixed(
                  2,
                )}/min`
              : '—'
          }
        />

        <PipelineInfo
          label="Remaining Time"
          value={formatDuration(
            state.estimate
              .remainingSeconds,
          )}
        />

        <PipelineInfo
          label="ETA"
          value={formatDateTime(
            state.estimate
              .estimatedCompletionAt,
          )}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {state.unitProgress
          .processing > 0 && (
          <StateBadge
            label={`${formatNumber(
              state.unitProgress
                .processing,
            )} processing`}
            status="PROCESSING"
          />
        )}

        {state.unitProgress
          .pending > 0 && (
          <StateBadge
            label={`${formatNumber(
              state.unitProgress
                .pending,
            )} pending`}
            status="PENDING"
          />
        )}

        {state.unitProgress
          .failed > 0 && (
          <StateBadge
            label={`${formatNumber(
              state.unitProgress
                .failed,
            )} failed`}
            status="FAILED"
          />
        )}

        {state.timing
          .sampleCount > 0 && (
          <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-semibold text-muted-foreground">
            {formatNumber(
              state.timing
                .sampleCount,
            )}{' '}
            timing samples
          </span>
        )}
      </div>
    </article>
  );
}


// ============================================================
// STATE BADGE
// ============================================================

function StateBadge({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusClass(
        status,
      )}`}
    >
      {label}
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