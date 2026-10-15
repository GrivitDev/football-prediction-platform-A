'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AlertCircle,
  History,
  LoaderCircle,
  Plus,
  Target,
  Trash2,
  Trophy,
  X,
} from 'lucide-react';

import { PredictionMarketOptions } from '@/lib/prediction-market-config';
import {
  calculatePrediction,
  getPredictionContext,
  type CalculatedPrediction,
  type CreatePredictionPayload,
  type PredictionCalculationContext,
  type PredictionFormGame,
} from '@/services/prediction.service';
import type { PredictionPlan } from '@/types/prediction.types';

interface PredictionModalMatch {
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamBadge?: string;
  awayTeamBadge?: string;
  fixtureDate: string;
  status: string;
}

interface MarketItem {
  market: string;
  selection: string;
}

interface PredictionModalProps {
  match: PredictionModalMatch;
  onClose: () => void;
  onSubmit: (payload: CreatePredictionPayload) => Promise<void>;
  loading: boolean;
}

const accessOptions: Array<{ value: PredictionPlan; label: string }> = [
  { value: 'free', label: 'Free' },
  { value: 'regular', label: 'Regular' },
  { value: 'vip', label: 'VIP' },
  { value: 'premium', label: 'Premium' },
];

const getMarketConfig = (market: string) =>
  PredictionMarketOptions.find((item) => item.value === market);

const getMarketLabel = (market: string) =>
  getMarketConfig(market)?.label ?? market.replace(/_/g, ' ');

const selectionKey = (value: string) =>
  value.trim().toUpperCase().replace(/(\d+)\.(\d+)/g, '$1_$2').replace(/[\s]+/g, '_');

const getSelectionLabel = (market: string, selection: string) =>
  getMarketConfig(market)?.selections.find((item) => selectionKey(item.value) === selectionKey(selection))?.label ??
  selection.replace(/_/g, ' ');

const money = (value?: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : '—';

const percent = (value?: number) =>
  typeof value === 'number' && Number.isFinite(value) ? `${value.toFixed(2)}%` : '—';

function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Unable to calculate this prediction.';
  const value = error as { response?: { data?: { message?: unknown; error?: unknown } }; message?: unknown };
  const message = value.response?.data?.message;
  if (Array.isArray(message)) {
    return message.filter((item): item is string => typeof item === 'string').join(', ');
  }
  if (typeof message === 'string') return message;
  if (typeof value.response?.data?.error === 'string') return value.response.data.error;
  return typeof value.message === 'string' ? value.message : 'Unable to calculate this prediction.';
}

function dateLabel(value: string): string {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
    : '—';
}

export default function PredictionModal({ match, onClose, onSubmit, loading }: PredictionModalProps) {
  const [markets, setMarkets] = useState<MarketItem[]>([{ market: '', selection: '' }]);
  const [accessType, setAccessType] = useState<PredictionPlan>('free');
  const [preview, setPreview] = useState<CalculatedPrediction | null>(null);
  const [context, setContext] = useState<PredictionCalculationContext | null>(null);
  const [contextLoading, setContextLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  const cleanMarkets = useMemo(
    () => markets.map(({ market, selection }) => ({ market, selection })),
    [markets],
  );
  const marketSignature = JSON.stringify(cleanMarkets);
  const completeMarkets = cleanMarkets.length > 0 && cleanMarkets.every((item) => item.market && item.selection);
  const duplicateSelection = useMemo(() => {
    const keys = cleanMarkets.map((item) => `${item.market}:${item.selection}`);
    return new Set(keys).size !== keys.length;
  }, [marketSignature]);

  // Load the compact form, standings, H2H and odds context once when the modal opens.
  useEffect(() => {
    let active = true;
    setContext(null);
    setContextLoading(true);
    setError('');
    getPredictionContext(match.eventId)
      .then((result) => {
        if (active) setContext(result);
      })
      .catch((caughtError: unknown) => {
        if (active) setError(getErrorMessage(caughtError));
      })
      .finally(() => {
        if (active) setContextLoading(false);
      });
    return () => {
      active = false;
    };
  }, [match.eventId]);

  // Recalculate automatically whenever complete selections change. The backend
  // owns the calculation and uses a deterministic fallback when odds are absent.
  useEffect(() => {
    let active = true;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const currentMarkets = JSON.parse(marketSignature) as MarketItem[];

    if (!context || !currentMarkets.length || currentMarkets.some((item) => !item.market || !item.selection) || duplicateSelection) {
      setPreview(null);
      setCalculating(false);
      return () => {
        active = false;
        if (timeout) clearTimeout(timeout);
      };
    }

    setPreview(null);
    setError('');
    timeout = setTimeout(() => {
      setCalculating(true);
      calculatePrediction({
        matchId: match.eventId,
        accessType,
        markets: currentMarkets,
      })
        .then((result) => {
          if (active) setPreview(result);
        })
        .catch((caughtError: unknown) => {
          if (active) {
            setPreview(null);
            setError(getErrorMessage(caughtError));
          }
        })
        .finally(() => {
          if (active) setCalculating(false);
        });
    }, 300);

    return () => {
      active = false;
      if (timeout) clearTimeout(timeout);
    };
  }, [match.eventId, accessType, marketSignature, context, duplicateSelection]);

  const updateMarket = (index: number, patch: Partial<MarketItem>) => {
    setMarkets((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
    setPreview(null);
    setError('');
  };

  const addMarket = () => {
    setMarkets((current) => [...current, { market: '', selection: '' }]);
    setPreview(null);
    setError('');
  };

  const removeMarket = (index: number) => {
    setMarkets((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setPreview(null);
    setError('');
  };

  const validate = () => {
    if (!completeMarkets) {
      setError('Complete every market row before creating the prediction.');
      return false;
    }
    if (duplicateSelection) {
      setError('Each market selection must be unique.');
      return false;
    }
    if (!context) {
      setError('Match data is not ready. Check that the ESPN Summary has been collected.');
      return false;
    }
    if (!preview || calculating) {
      setError('The calculation is still running. Please wait for the preview to update.');
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    setError('');
    if (!validate()) return;
    await onSubmit({
      matchId: match.eventId,
      accessType,
      markets: cleanMarkets,
    });
  };

  const predictionLabel = preview
    ? `${getMarketLabel(preview.prediction.market)} · ${getSelectionLabel(preview.prediction.market, preview.prediction.selection)}`
    : 'Waiting for selections';
  const displayContext = preview?.calculationContext ?? context;

  return (
    <div className="fixed inset-0 z-[90000] flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-label="Create prediction" className="flex max-h-[96dvh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border bg-background shadow-2xl">
        <header className="flex shrink-0 items-center gap-2 border-b px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            {match.homeTeamBadge ? <Image src={match.homeTeamBadge} alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" unoptimized /> : <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-[9px] font-bold">H</span>}
            <span className="truncate text-xs font-semibold">
              {match.homeTeam} <span className="text-muted-foreground">vs</span> {match.awayTeam}
            </span>
            {match.awayTeamBadge ? <Image src={match.awayTeamBadge} alt="" width={24} height={24} className="h-6 w-6 shrink-0 object-contain" unoptimized /> : <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-[9px] font-bold">A</span>}
            <span className="hidden text-[10px] text-muted-foreground sm:inline">
              {new Date(match.fixtureDate).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
          <span className="ml-auto hidden rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground sm:inline">{contextLoading ? 'Loading match data…' : context ? 'Match data loaded' : 'Match data unavailable'}</span>
          <button type="button" onClick={onClose} disabled={loading || calculating} className="grid h-7 w-7 place-items-center rounded-md border text-muted-foreground hover:bg-muted disabled:opacity-50" aria-label="Close">
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-3 p-3">
            {error && <div className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-[11px] text-destructive"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{error}</span></div>}

            {contextLoading && <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" />Loading odds, recent form, standings and H2H data…</div>}

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_330px]">
              <div className="space-y-3">
                <section className="rounded-lg border">
                  <div className="flex items-center justify-between border-b px-3 py-2">
                    <span className="text-xs font-semibold">Selected markets</span>
                    <button type="button" onClick={addMarket} disabled={loading || contextLoading} className="inline-flex h-7 items-center gap-1 rounded-md bg-primary/10 px-2 text-[10px] font-semibold text-primary disabled:opacity-40"><Plus className="h-3 w-3" />Add market</button>
                  </div>
                  <div className="space-y-1.5 p-3">
                    {markets.map((item, index) => {
                      const config = getMarketConfig(item.market);
                      return (
                        <div key={`${index}-${item.market}`} className="grid grid-cols-[22px_minmax(0,1fr)_minmax(0,1fr)_28px] gap-1.5">
                          <span className="grid h-8 place-items-center rounded-md bg-muted text-[9px] font-bold">{index + 1}</span>
                          <select value={item.market} disabled={loading || contextLoading} onChange={(event) => updateMarket(index, { market: event.target.value, selection: '' })} className="h-8 min-w-0 rounded-md border bg-background px-2 text-[11px] outline-none focus:ring-1 focus:ring-primary/30">
                            <option value="">Market</option>
                            {PredictionMarketOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                          <select value={item.selection} disabled={loading || contextLoading || !item.market} onChange={(event) => updateMarket(index, { selection: event.target.value })} className="h-8 min-w-0 rounded-md border bg-background px-2 text-[11px] outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60">
                            <option value="">Selection</option>
                            {config?.selections.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                          <button type="button" onClick={() => removeMarket(index)} disabled={markets.length === 1 || loading || contextLoading} className="grid h-8 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-30" aria-label={`Remove market ${index + 1}`}><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      );
                    })}
                    {duplicateSelection && <p className="text-[10px] text-destructive">Duplicate market selection. Each selection must be unique.</p>}
                  </div>
                </section>

                {preview && (
                  <section className="rounded-lg border">
                    <div className="flex items-center gap-2 border-b bg-muted/20 px-3 py-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="min-w-0 flex-1 truncate text-xs font-bold text-primary">{predictionLabel}</span>
                      <span className="text-[10px] text-muted-foreground">Support confidence</span>
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{preview.confidence}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
                      <Metric label="Selection probability" value={percent(preview.predictionProbability)} />
                      <Metric label="Bookmaker odds" value={money(preview.predictionOdds)} />
                      <Metric label="Fair odds" value={money(preview.predictionFairOdds)} />
                      <Metric label="Probability source" value={preview.probabilitySource.replace(/_/g, ' ')} />
                    </div>
                    <div className="border-t px-3 py-2">
                      <p className="mb-2 text-[10px] font-semibold text-muted-foreground">Overall Home / Draw / Away</p>
                      <div className="grid grid-cols-3 gap-2">
                        <OutcomeMetric label={preview.homeTeam} value={preview.generalPrediction.home.probability} fairOdds={preview.generalPrediction.home.fairOdds} />
                        <OutcomeMetric label="Draw" value={preview.generalPrediction.draw.probability} fairOdds={preview.generalPrediction.draw.fairOdds} />
                        <OutcomeMetric label={preview.awayTeam} value={preview.generalPrediction.away.probability} fairOdds={preview.generalPrediction.away.fairOdds} />
                      </div>
                    </div>
                    <div className="border-t">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-2 bg-muted/20 px-3 py-1.5 text-[9px] font-semibold uppercase text-muted-foreground">
                        <span>Market / selection</span><span>Prob.</span><span>Odds</span><span>Fair</span>
                      </div>
                      {preview.markets.map((item, index) => (
                        <div key={`${item.market}-${item.selection}-${index}`} className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 border-t px-3 py-2">
                          <div className="min-w-0"><p className="truncate text-[10px] text-muted-foreground">{getMarketLabel(item.market)}</p><p className="truncate text-[11px] font-semibold">{getSelectionLabel(item.market, item.selection)}</p><p className="truncate text-[9px] text-muted-foreground">{item.probabilitySource.replace(/_/g, ' ')}</p></div>
                          <Metric label="" value={percent(item.probability)} /><Metric label="" value={money(item.odds)} /><Metric label="" value={money(item.fairOdds)} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {displayContext && <ContextData context={displayContext} homeTeam={preview?.homeTeam ?? match.homeTeam} awayTeam={preview?.awayTeam ?? match.awayTeam} />}
              </div>

              <aside className="space-y-3">
                <section className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold">Access settings</span><span className="text-[10px] capitalize text-muted-foreground">{accessType}</span></div>
                  <div className="grid grid-cols-4 gap-1">
                    {accessOptions.map((option) => <button key={option.value} type="button" disabled={loading} onClick={() => setAccessType(option.value)} className={`h-7 rounded-md border text-[9px] font-semibold ${accessType === option.value ? 'border-primary/30 bg-primary/10 text-primary' : 'bg-muted/30 text-muted-foreground'} disabled:opacity-40`}>{option.label}</button>)}
                  </div>
                  <div className="mt-3 rounded-md bg-muted/30 p-2 text-[10px] text-muted-foreground">
                    {contextLoading ? 'Loading match data…' : calculating ? 'Updating probabilities…' : preview ? 'Preview is up to date. The backend will recalculate before saving.' : 'Choose complete markets to calculate the preview automatically.'}
                  </div>
                </section>
                <section className="rounded-lg border p-3">
                  <p className="mb-1 text-[10px] font-semibold">Calculation notes</p>
                  <p className="text-[10px] leading-relaxed text-muted-foreground">Market probability uses matching bookmaker odds when available. If no matching price exists, a stable fallback estimate is clearly labelled. Home/Draw/Away probabilities are calculated separately and are not copied from ESPN predictor data.</p>
                </section>
              </aside>
            </div>
          </div>
        </main>

        <footer className="flex shrink-0 justify-end gap-2 border-t px-3 py-2.5">
          <button type="button" onClick={onClose} disabled={loading || calculating} className="h-8 rounded-md border px-3 text-[11px] font-semibold disabled:opacity-40">Cancel</button>
          <button type="button" onClick={handleCreate} disabled={loading || contextLoading || calculating || !preview || !completeMarkets || duplicateSelection} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[11px] font-semibold text-primary-foreground disabled:opacity-40">
            {loading ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Target className="h-3.5 w-3.5" />}
            {loading ? 'Creating…' : calculating ? 'Calculating…' : 'Create prediction'}
          </button>
        </footer>
      </div>
    </div>
  );
}

function ContextData({ context, homeTeam, awayTeam }: { context: PredictionCalculationContext; homeTeam: string; awayTeam: string }) {
  return (
    <div className="space-y-3">
      <section className="rounded-lg border">
        <div className="flex items-center gap-2 border-b px-3 py-2"><Trophy className="h-3.5 w-3.5 text-primary" /><span className="text-xs font-semibold">Standings and last five games</span></div>
        <div className="grid gap-2 p-2 sm:grid-cols-2">
          <TeamSnapshotCard name={homeTeam} side="home" snapshot={context.teamContext.home} />
          <TeamSnapshotCard name={awayTeam} side="away" snapshot={context.teamContext.away} />
        </div>
      </section>

      <section className="rounded-lg border">
        <div className="flex items-center gap-2 border-b px-3 py-2"><History className="h-3.5 w-3.5 text-primary" /><span className="text-xs font-semibold">Head-to-head</span><span className="ml-auto text-[10px] text-muted-foreground">{context.headToHead.matchesCount} completed matches</span></div>
        <div className="grid grid-cols-3 gap-2 p-3">
          <Metric label={`${homeTeam} wins`} value={context.headToHead.homeTeamWins} />
          <Metric label="Draws" value={context.headToHead.draws} />
          <Metric label={`${awayTeam} wins`} value={context.headToHead.awayTeamWins} />
        </div>
        {context.headToHead.matches.length > 0 ? <div className="border-t">
          {context.headToHead.matches.map((game, index) => <div key={`${game.date}-${index}`} className="flex items-center gap-2 border-t px-3 py-1.5 first:border-0 text-[10px]"><span className="w-14 shrink-0 text-muted-foreground">{dateLabel(game.date)}</span><span className="min-w-0 flex-1 truncate">{game.homeScore} – {game.awayScore}</span><span className="truncate text-muted-foreground">{game.homeTeamId === context.match.homeTeam.id ? homeTeam : game.homeTeamId === context.match.awayTeam.id ? awayTeam : 'Historical home'} vs {game.awayTeamId === context.match.homeTeam.id ? homeTeam : game.awayTeamId === context.match.awayTeam.id ? awayTeam : 'Historical away'}</span></div>)}
        </div> : <p className="px-3 py-2 text-[10px] text-muted-foreground">No completed H2H matches found before this kickoff.</p>}
      </section>

      <section className="rounded-lg border">
        <div className="border-b px-3 py-2"><span className="text-xs font-semibold">Available bookmaker odds</span></div>
        {context.odds.length ? <div className="divide-y">
          {context.odds.slice(0, 8).map((odd, index) => <div key={`${odd.source}-${odd.market}-${odd.selection}-${index}`} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 px-3 py-2 text-[10px]"><div className="min-w-0"><p className="truncate font-medium">{odd.market} · {odd.selection}</p><p className="truncate text-[9px] text-muted-foreground">{odd.provider ?? odd.source.replace(/_/g, ' ')}</p></div><span className="text-muted-foreground">{odd.line !== undefined ? `Line ${odd.line}` : ''}</span><span className="font-semibold">{odd.decimalOdds.toFixed(2)}</span></div>)}
        </div> : <p className="px-3 py-2 text-[10px] text-muted-foreground">No normalized bookmaker odds found. Selected markets will use the labelled fallback when no matching price is available.</p>}
        <div className="border-t px-3 py-1.5 text-[9px] text-muted-foreground">Collected — fixture: {context.collectedAt.fixture ? dateLabel(context.collectedAt.fixture) : 'unknown'} · Summary: {context.collectedAt.summary ? dateLabel(context.collectedAt.summary) : 'unknown'} · odds: {context.collectedAt.odds ? dateLabel(context.collectedAt.odds) : 'none'}</div>
      </section>
    </div>
  );
}

function TeamSnapshotCard({ name, side, snapshot }: { name: string; side: 'home' | 'away'; snapshot: { tablePosition?: number; lastFiveGames: PredictionFormGame[] } }) {
  const results = snapshot.lastFiveGames;
  return (
    <div className="rounded-md border bg-muted/10 p-2.5">
      <div className="flex items-center justify-between gap-2"><p className="truncate text-[11px] font-semibold">{name}</p><span className="text-[9px] text-muted-foreground">{side === 'home' ? 'Home' : 'Away'}</span></div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Metric label="Table position" value={snapshot.tablePosition !== undefined ? `#${snapshot.tablePosition}` : 'Not listed'} />
        <Metric label="Recent games" value={`${results.length}/5`} />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {results.length ? results.map((game, index) => <span key={`${game.date}-${index}`} title={`${game.opponent}: ${game.goalsFor}-${game.goalsAgainst}`} className={`grid h-6 min-w-6 place-items-center rounded px-1.5 text-[9px] font-bold ${game.result === 'W' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : game.result === 'D' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'}`}>{game.result}</span>) : <span className="text-[10px] text-muted-foreground">No recent form available</span>}
      </div>
      {results.length > 0 && <div className="mt-2 space-y-1 border-t pt-2">
        {results.map((game, index) => <div key={`${game.date}-details-${index}`} className="flex items-center gap-2 text-[9px]"><span className="w-14 shrink-0 text-muted-foreground">{dateLabel(game.date)}</span><span className="min-w-0 flex-1 truncate">vs {game.opponent}</span><span className="font-semibold">{game.goalsFor}–{game.goalsAgainst}</span><span className="w-3 font-bold">{game.result}</span></div>)}
      </div>}
    </div>
  );
}

function OutcomeMetric({ label, value, fairOdds }: { label: string; value: number; fairOdds: number }) {
  return <div className="rounded-md border bg-muted/10 p-2"><p className="truncate text-[9px] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-bold">{percent(value)}</p><p className="text-[9px] text-muted-foreground">Fair odds {money(fairOdds)}</p></div>;
}

function Metric({ label, value }: { label: string; value: ReactNode }) {
  return <div className="min-w-[44px]"><p className="truncate text-[8px] uppercase tracking-wide text-muted-foreground">{label || ' '}</p><p className="truncate text-[11px] font-semibold">{value}</p></div>;
}

