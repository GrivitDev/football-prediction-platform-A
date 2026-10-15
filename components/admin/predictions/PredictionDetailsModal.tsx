'use client';

import Image from 'next/image';
import { useMemo, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  LoaderCircle,
  Save,
  Target,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';

import { PredictionMarketOptions } from '@/lib/prediction-market-config';
import {
  calculatePrediction,
  type CalculatedPrediction,
  type UpdatePredictionPayload,
} from '@/services/prediction.service';
import type {
  AdminPrediction,
  PredictionPlan,
} from '@/types/prediction.types';

type SettlementAction = 'ESPN' | 'VOID';
type MarketItem = { market: string; selection: string };

type Props = {
  prediction: AdminPrediction;
  onClose: () => void;
  onSave: (payload: UpdatePredictionPayload) => Promise<void>;
  onSettle: (action: SettlementAction) => Promise<void>;
  onDelete: () => Promise<void>;
  saving?: boolean;
  settling?: boolean;
  deleting?: boolean;
};

const accessOptions: Array<{ value: PredictionPlan; label: string }> = [
  { value: 'free', label: 'Free' },
  { value: 'regular', label: 'Regular' },
  { value: 'vip', label: 'VIP' },
  { value: 'premium', label: 'Premium' },
];

const getMarketConfig = (market: string) =>
  PredictionMarketOptions.find((item) => item.value === market);

const marketLabel = (market: string) =>
  getMarketConfig(market)?.label ?? market.replace(/_/g, ' ');

const selectionKey = (value: string) =>
  value.trim().toUpperCase().replace(/(\d+)\.(\d+)/g, '$1_$2').replace(/[\s]+/g, '_');

const selectionLabel = (market: string, selection: string) =>
  getMarketConfig(market)?.selections.find(
    (item) => selectionKey(item.value) === selectionKey(selection),
  )?.label ?? selection.replace(/_/g, ' ');

const money = (value?: number) =>
  typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(2)
    : '—';

function errorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Unable to calculate this prediction.';
  }

  const value = error as {
    response?: { data?: { message?: unknown; error?: unknown } };
    message?: unknown;
  };

  const message = value.response?.data?.message;

  if (Array.isArray(message)) {
    return message
      .filter((item): item is string => typeof item === 'string')
      .join(', ');
  }

  if (typeof message === 'string') return message;

  if (typeof value.response?.data?.error === 'string') {
    return value.response.data.error;
  }

  return typeof value.message === 'string'
    ? value.message
    : 'Unable to calculate this prediction.';
}

function settlementState(prediction: AdminPrediction) {
  if (prediction.settled) {
    return {
      label: 'Settled',
      tone: 'bg-emerald-500/10 text-emerald-600',
    };
  }

  const matchTime = new Date(prediction.matchDate).getTime();
  const ready =
    Number.isFinite(matchTime) &&
    Date.now() >= matchTime + 2 * 60 * 60 * 1000;

  return ready
    ? {
        label: 'Needs settlement',
        tone: 'bg-amber-500/10 text-amber-600',
      }
    : {
        label: 'Scheduled',
        tone: 'bg-muted text-muted-foreground',
      };
}

export default function PredictionDetailsModal({
  prediction,
  onClose,
  onSave,
  onSettle,
  onDelete,
  saving = false,
  settling = false,
  deleting = false,
}: Props) {
  const [markets, setMarkets] = useState<MarketItem[]>(
    (prediction.markets ?? []).map(({ market, selection }) => ({
      market,
      selection,
    })),
  );
  const [accessType, setAccessType] = useState<PredictionPlan>(
    prediction.accessType,
  );
  const [preview, setPreview] = useState<CalculatedPrediction | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  const storedMarkets = useMemo(
    () =>
      (prediction.markets ?? []).map(({ market, selection }) => ({
        market,
        selection,
      })),
    [prediction.markets],
  );

  const marketsChanged =
    JSON.stringify(markets) !== JSON.stringify(storedMarkets);

  const editable = !prediction.settled && !prediction.deleted;
  const settlement = settlementState(prediction);

  const displayedPrediction = preview?.prediction ?? prediction.prediction;
  const displayedProbability =
    preview?.predictionProbability ?? prediction.predictionProbability;
  const displayedConfidence = preview?.confidence ?? prediction.confidence;
  const displayedFairOdds =
    preview?.predictionFairOdds ?? prediction.predictionFairOdds;
  const displayedOdds = preview?.predictionOdds ?? prediction.predictionOdds;
  const displayedMarkets = preview?.markets ?? prediction.markets;
  const displayedGeneralPrediction = preview?.generalPrediction ?? prediction.generalPrediction;
  const displayedTeamContext = preview?.teamContext ?? prediction.teamContext;

  const updateMarket = (index: number, patch: Partial<MarketItem>) => {
    setMarkets((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
    setPreview(null);
    setError('');
  };

  const addMarket = () => {
    setMarkets((current) => [
      ...current,
      { market: '', selection: '' },
    ]);
    setPreview(null);
  };

  const removeMarket = (index: number) => {
    setMarkets((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
    setPreview(null);
  };

  const validate = () => {
    if (
      !markets.length ||
      markets.some((item) => !item.market || !item.selection)
    ) {
      setError('Complete every market row.');
      return false;
    }

    const seen = new Set<string>();

    for (const item of markets) {
      const key = `${item.market}:${item.selection}`;

      if (seen.has(key)) {
        setError('Duplicate market selection.');
        return false;
      }

      seen.add(key);
    }

    return true;
  };

  const handleCalculate = async () => {
    setError('');

    if (!validate()) return;

    try {
      setCalculating(true);

      const result = await calculatePrediction({
        matchId: prediction.matchId,
        accessType,
        markets,
      });

      setPreview(result);
    } catch (caughtError) {
      setPreview(null);
      setError(errorMessage(caughtError));
    } finally {
      setCalculating(false);
    }
  };

  const handleSave = async () => {
    setError('');

    if (!editable || !validate()) return;

    if (marketsChanged && !preview) {
      setError('Recalculate changed markets before saving.');
      return;
    }

    await onSave({
      accessType,
      markets,
    });
  };

  const canSettle =
    editable && settlement.label === 'Needs settlement';

  const targetSelection = displayedPrediction.selection.toUpperCase();
  const targetBadge =
    targetSelection === 'HOME'
      ? prediction.homeTeamBadge
      : targetSelection === 'AWAY'
        ? prediction.awayTeamBadge
        : undefined;

  return (
    <div className="fixed inset-0 z-[90000] flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Prediction details"
        className="flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border bg-background shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            {prediction.league?.emblem ? (
              <Image
                src={prediction.league.emblem}
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 shrink-0 object-contain"
                unoptimized
              />
            ) : (
              <Trophy className="h-4 w-4 shrink-0 text-primary" />
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {prediction.league?.name ?? prediction.leagueCode}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {prediction.homeTeam} vs {prediction.awayTeam}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${settlement.tone}`}
            >
              {settlement.label}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving || settling || deleting || calculating}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-muted-foreground hover:bg-muted disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-3 p-3">
            {error && (
              <div className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-3 lg:grid-cols-[1.25fr_.75fr]">
              <section className="rounded-xl border p-3">
                <div className="flex items-center justify-center gap-5">
                  <Team
                    name={prediction.homeTeam}
                    badge={prediction.homeTeamBadge}
                    align="right"
                  />
                  <span className="grid h-8 w-8 place-items-center rounded-full border bg-muted/40 text-[10px] font-black text-muted-foreground">
                    VS
                  </span>
                  <Team
                    name={prediction.awayTeam}
                    badge={prediction.awayTeamBadge}
                    align="left"
                  />
                </div>

                <div className="mt-3 rounded-lg border border-primary/15 bg-primary/[0.04] p-2.5">
                  <div className="flex items-center gap-2">
                    {targetBadge ? (
                      <Image
                        src={targetBadge}
                        alt=""
                        width={22}
                        height={22}
                        className="h-[22px] w-[22px] object-contain"
                        unoptimized
                      />
                    ) : (
                      <Target className="h-4 w-4 shrink-0 text-primary" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-primary">
                        {marketLabel(displayedPrediction.market)}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {selectionLabel(
                          displayedPrediction.market,
                          displayedPrediction.selection,
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                        Probability
                      </p>
                      <p className="text-lg font-black text-primary">
                        {displayedProbability}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <Metric label="Odds" value={money(displayedOdds)} />
                    <Metric label="Fair" value={money(displayedFairOdds)} />
                    <Metric
                      label="Support"
                      value={`${displayedConfidence}%`}
                    />
                  </div>

                  <p className="mt-2 text-[9px] text-muted-foreground">
                    {preview
                      ? `Source: ${preview.probabilitySource.replace(/_/g, ' ')}`
                      : `Source: ${prediction.probabilitySource.replace(/_/g, ' ')}`}
                  </p>
                </div>
              </section>

              <section className="rounded-xl border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold">Access</span>
                  <span className="text-[10px] capitalize text-muted-foreground">
                    {accessType}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {accessOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      disabled={!editable}
                      onClick={() => setAccessType(option.value)}
                      className={`h-8 rounded-md border px-1 text-[10px] font-semibold ${
                        accessType === option.value
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : 'bg-muted/30 text-muted-foreground'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <section className="rounded-xl border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold">Markets</span>
                <span className="text-[9px] text-muted-foreground">
                  {markets.length} selected
                </span>
              </div>

              <div className="space-y-2">
                {markets.map((item, index) => {
                  const itemConfig = getMarketConfig(item.market);

                  return (
                    <div
                      key={`${index}-${item.market}`}
                      className="grid grid-cols-[24px_minmax(0,1fr)_minmax(0,1fr)_28px] gap-2"
                    >
                      <span className="grid h-8 place-items-center rounded-md bg-muted text-[10px] font-bold">
                        {index + 1}
                      </span>

                      <select
                        value={item.market}
                        disabled={!editable}
                        onChange={(event) =>
                          updateMarket(index, {
                            market: event.target.value,
                            selection: '',
                          })
                        }
                        className="h-8 min-w-0 rounded-md border bg-background px-2 text-xs disabled:opacity-60"
                      >
                        <option value="">Market</option>
                        {PredictionMarketOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <select
                        value={item.selection}
                        disabled={!editable || !item.market}
                        onChange={(event) =>
                          updateMarket(index, {
                            selection: event.target.value,
                          })
                        }
                        className="h-8 min-w-0 rounded-md border bg-background px-2 text-xs disabled:opacity-60"
                      >
                        <option value="">Selection</option>
                        {itemConfig?.selections.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => removeMarket(index)}
                        disabled={!editable || markets.length === 1}
                        className="grid h-8 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-30"
                        aria-label={`Remove market ${index + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={addMarket}
                  disabled={!editable}
                  className="h-7 rounded-md bg-primary/10 px-2 text-[10px] font-semibold text-primary disabled:opacity-40"
                >
                  + Add
                </button>

                <button
                  type="button"
                  onClick={handleCalculate}
                  disabled={!editable || calculating}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-3 text-[11px] font-semibold text-primary disabled:opacity-40"
                >
                  {calculating ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Target className="h-3.5 w-3.5" />
                  )}
                  {calculating ? 'Checking…' : 'Check support'}
                </button>
              </div>
            </section>

            <section className="rounded-xl border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold">Market results</span>
                {marketsChanged && (
                  <span className="text-[10px] text-amber-600">
                    Unsaved changes
                  </span>
                )}
              </div>

              <div className="divide-y">
                {displayedMarkets.map((market, index) => (
                  <div
                    key={`${market.market}-${market.selection}-${index}`}
                    className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[10px] text-muted-foreground">
                        {marketLabel(market.market)}
                      </p>
                      <p className="truncate text-xs font-semibold">
                        {selectionLabel(market.market, market.selection)}
                      </p>
                    </div>

                    <Metric
                      label="Prob."
                      value={`${market.probability}%`}
                    />
                    <Metric label="Odds" value={money(market.odds)} />
                    <Metric label="Status" value={market.status ?? 'pending'} />
                  </div>
                ))}
              </div>
            </section>

            {displayedGeneralPrediction && (
              <section className="rounded-xl border p-3">
                <p className="mb-2 text-xs font-semibold">Overall Home / Draw / Away</p>
                <div className="grid grid-cols-3 gap-2">
                  <OutcomeMetric label={prediction.homeTeam} probability={displayedGeneralPrediction.home.probability} fairOdds={displayedGeneralPrediction.home.fairOdds} />
                  <OutcomeMetric label="Draw" probability={displayedGeneralPrediction.draw.probability} fairOdds={displayedGeneralPrediction.draw.fairOdds} />
                  <OutcomeMetric label={prediction.awayTeam} probability={displayedGeneralPrediction.away.probability} fairOdds={displayedGeneralPrediction.away.fairOdds} />
                </div>
              </section>
            )}

            {displayedTeamContext && (
              <section className="rounded-xl border p-3">
                <p className="mb-2 text-xs font-semibold">Stored team context</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <StoredTeamContext name={prediction.homeTeam} snapshot={displayedTeamContext.home} />
                  <StoredTeamContext name={prediction.awayTeam} snapshot={displayedTeamContext.away} />
                </div>
              </section>
            )}

            {canSettle && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="mr-auto text-xs text-amber-700">
                  Ready for settlement.
                </span>

                <button
                  type="button"
                  onClick={() => onSettle('ESPN')}
                  disabled={settling}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-[11px] font-semibold text-white disabled:opacity-40"
                >
                  {settling && (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Settle
                </button>

                <button
                  type="button"
                  onClick={() => onSettle('VOID')}
                  disabled={settling}
                  className="h-8 rounded-md border border-destructive/30 px-3 text-[11px] font-semibold text-destructive disabled:opacity-40"
                >
                  Void
                </button>
              </div>
            )}
          </div>
        </main>

        <footer className="flex shrink-0 justify-end gap-2 border-t px-3 py-2.5">
          {editable && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting || saving || settling}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-destructive/30 px-3 text-[11px] font-semibold text-destructive disabled:opacity-40"
            >
              {deleting ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Delete
            </button>
          )}

          <button
            type="button"
            onClick={editable ? handleSave : onClose}
            disabled={saving || deleting || settling || calculating}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[11px] font-semibold text-primary-foreground disabled:opacity-40"
          >
            {editable ? (
              <>
                {saving ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                {saving ? 'Saving…' : 'Save'}
              </>
            ) : (
              'Close'
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}

function OutcomeMetric({ label, probability, fairOdds }: { label: string; probability: number; fairOdds: number }) {
  return (
    <div className="rounded-lg border bg-muted/10 p-2">
      <p className="truncate text-[9px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-bold">{probability.toFixed(2)}%</p>
      <p className="text-[9px] text-muted-foreground">Fair odds {money(fairOdds)}</p>
    </div>
  );
}

function StoredTeamContext({ name, snapshot }: { name: string; snapshot: { tablePosition?: number; lastFiveGames: Array<{ date: string; opponent: string; goalsFor: number; goalsAgainst: number; result: 'W' | 'D' | 'L' }> } }) {
  return (
    <div className="rounded-lg border bg-muted/10 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11px] font-semibold">{name}</p>
        <span className="text-[10px] text-muted-foreground">{snapshot.tablePosition ? `Table #${snapshot.tablePosition}` : 'Position unavailable'}</span>
      </div>
      {snapshot.lastFiveGames.length ? (
        <div className="mt-2 space-y-1">
          {snapshot.lastFiveGames.map((game, index) => (
            <div key={`${game.date}-${index}`} className="flex items-center gap-2 text-[9px]">
              <span className={`w-4 font-bold ${game.result === 'W' ? 'text-emerald-600' : game.result === 'D' ? 'text-amber-600' : 'text-rose-600'}`}>{game.result}</span>
              <span className="min-w-0 flex-1 truncate">{game.opponent}</span>
              <span>{game.goalsFor}–{game.goalsAgainst}</span>
            </div>
          ))}
        </div>
      ) : <p className="mt-2 text-[10px] text-muted-foreground">No last-five data was saved.</p>}
    </div>
  );
}

function Team({
  name,
  badge,
  align,
}: {
  name: string;
  badge?: string;
  align: 'left' | 'right';
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-2 ${
        align === 'right' ? 'justify-end text-right' : ''
      }`}
    >
      {align === 'right' && (
        <p className="max-w-[130px] truncate text-sm font-semibold">{name}</p>
      )}

      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border bg-background">
        {badge ? (
          <Image
            src={badge}
            alt=""
            width={28}
            height={28}
            className="object-contain"
            unoptimized
          />
        ) : (
          <Trophy className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {align === 'left' && (
        <p className="max-w-[130px] truncate text-sm font-semibold">{name}</p>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-[44px] text-right">
      <p className="text-[8px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="truncate text-[11px] font-semibold">{value}</p>
    </div>
  );
}


