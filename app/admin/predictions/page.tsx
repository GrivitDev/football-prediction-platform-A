'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FaArrowsRotate } from 'react-icons/fa6';

import {
  deletePrediction,
  getPrediction,
  settlePrediction,
  updatePrediction,
  voidPrediction,
  type UpdatePredictionPayload,
} from '@/services/prediction.service';
import PredictionDetailsModal from '@/components/admin/predictions/PredictionDetailsModal';
import PredictionsFilters from '@/components/admin/predictions/PredictionsFilters';
import PredictionsTable from '@/components/admin/predictions/PredictionsTable';
import {
  getAdminMatchStatus,
  getSettlementOverview,
} from '@/components/admin/predictions/settlement-utils';
import type { AdminPrediction } from '@/types/prediction.types';
import { predictionQueryKeys, usePredictions } from '@/hooks/use-predictions';

type SettlementAction = 'ESPN' | 'VOID';

function getPredictionId(prediction: AdminPrediction): string | null {
  const id = prediction._id ?? prediction.id;
  return typeof id === 'string' && id.trim() ? id.trim() : null;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback;

  const value = error as {
    response?: { data?: { message?: unknown } };
    message?: unknown;
  };
  const message = value.response?.data?.message;

  if (Array.isArray(message)) {
    return message
      .filter((item): item is string => typeof item === 'string')
      .join(', ');
  }
  if (typeof message === 'string') return message;
  return typeof value.message === 'string' ? value.message : fallback;
}

export default function AdminPredictionsPage() {
  const queryClient = useQueryClient();

  const predictionsQuery = usePredictions();
  const predictions = predictionsQuery.data ?? [];
  const { isLoading, isError, isFetching, refetch } = predictionsQuery;

  const [selectedPrediction, setSelectedPrediction] = useState<AdminPrediction | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settling, setSettling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const selectedPredictionId = selectedPrediction
    ? getPredictionId(selectedPrediction)
    : null;

  // The prediction list is refreshed every 60 seconds and whenever the page
  // regains focus. Keep an open detail modal synchronized with that refreshed
  // backend record so its match state and market settlement progress do not
  // remain stale while the administrator is reviewing it.
  useEffect(() => {
    if (!selectedPredictionId) return;

    const latest = predictions.find(
      (prediction) => getPredictionId(prediction) === selectedPredictionId,
    );
    if (!latest) return;

    setSelectedPrediction((current) => {
      if (!current || getPredictionId(current) !== selectedPredictionId) {
        return current;
      }

      const hasChanged =
        current.status !== latest.status ||
        current.settled !== latest.settled ||
        current.settledAt !== latest.settledAt ||
        current.matchStatus !== latest.matchStatus ||
        current.matchStatusDetail !== latest.matchStatusDetail ||
        current.matchClock !== latest.matchClock ||
        JSON.stringify(current.matchScore) !== JSON.stringify(latest.matchScore) ||
        JSON.stringify(current.settlementSnapshot) !== JSON.stringify(latest.settlementSnapshot) ||
        JSON.stringify(current.markets) !== JSON.stringify(latest.markets);

      return hasChanged ? { ...current, ...latest } : current;
    });
  }, [predictions, selectedPredictionId]);

  const [search, setSearch] = useState('');
  const [matchStatus, setMatchStatus] = useState('all');
  const [settlement, setSettlement] = useState('all');
  const [access, setAccess] = useState('all');
  const [league, setLeague] = useState('all');

  const leagueOptions = useMemo(
    () =>
      Array.from(
        new Map(
          predictions.map((prediction) => [
            prediction.leagueCode,
            {
              code: prediction.leagueCode,
              name: prediction.league?.name ?? prediction.leagueCode,
            },
          ]),
        ).values(),
      ).sort((a, b) => a.name.localeCompare(b.name)),
    [predictions],
  );

  const summary = useMemo(() => {
    return predictions.reduce(
      (result, prediction) => {
        const match = getAdminMatchStatus(prediction);
        const progress = getSettlementOverview(prediction);
        result.total += 1;
        if (match === 'LIVE') result.live += 1;
        if (progress.needsSettlement) result.awaiting += 1;
        if (progress.state === 'PARTIAL') result.partial += 1;
        if (progress.state === 'SETTLED') result.settled += 1;
        return result;
      },
      { total: 0, live: 0, awaiting: 0, partial: 0, settled: 0 },
    );
  }, [predictions]);

  const filteredPredictions = useMemo(
    () =>
      predictions.filter((prediction) => {
        const query = [
          prediction.homeTeam,
          prediction.awayTeam,
          prediction.league?.name,
          prediction.leagueCode,
          prediction.matchId,
          prediction.matchStatusDetail,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        const normalizedSearch = search.trim().toLowerCase();
        const progress = getSettlementOverview(prediction);

        return (
          query.includes(normalizedSearch) &&
          (matchStatus === 'all' || getAdminMatchStatus(prediction) === matchStatus) &&
          (settlement === 'all' ||
            (settlement === 'NEEDS_SETTLEMENT'
              ? progress.needsSettlement
              : progress.state === settlement)) &&
          (access === 'all' || prediction.accessType === access) &&
          (league === 'all' || prediction.leagueCode === league)
        );
      }),
    [predictions, search, matchStatus, settlement, access, league],
  );

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: predictionQueryKeys.all });
  };

  const openPrediction = async (prediction: AdminPrediction) => {
    const predictionId = getPredictionId(prediction);
    if (!predictionId) {
      toast.error('This prediction has no valid ID.');
      return;
    }

    setSelectedPrediction(prediction);
    setLoadingDetail(true);

    try {
      setSelectedPrediction(await getPrediction(predictionId));
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, 'Unable to load prediction details.'));
    } finally {
      setLoadingDetail(false);
    }
  };

  const closePrediction = () => {
    if (!saving && !settling && !deleting) {
      setSelectedPrediction(null);
    }
  };


  const saveEdit = async (payload: UpdatePredictionPayload) => {
    if (!selectedPrediction) return;
    const predictionId = getPredictionId(selectedPrediction);
    if (!predictionId) {
      toast.error('This prediction has no valid ID.');
      return;
    }

    try {
      setSaving(true);
      await updatePrediction(predictionId, payload);
      toast.success('Prediction updated.');
      setSelectedPrediction(null);
      await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update prediction.'));
    } finally {
      setSaving(false);
    }
  };

  const settle = async (action: SettlementAction) => {
    if (!selectedPrediction) return;
    const predictionId = getPredictionId(selectedPrediction);
    if (!predictionId) {
      toast.error('This prediction has no valid ID.');
      return;
    }

    try {
      setSettling(true);

      const result =
        action === 'VOID'
          ? await voidPrediction(predictionId)
          : await settlePrediction(predictionId);

      const updatedPrediction: AdminPrediction = {
        ...selectedPrediction,
        ...result,
        matchStatus: result.matchStatus ?? selectedPrediction.matchStatus,
        matchStatusDetail:
          result.matchStatusDetail ?? selectedPrediction.matchStatusDetail,
        matchClock: result.matchClock ?? selectedPrediction.matchClock,
        matchCompleted: result.matchCompleted ?? selectedPrediction.matchCompleted,
        matchScore:
          result.matchScore ??
          result.settlementSnapshot?.score ??
          selectedPrediction.matchScore,
        fixtureCollectedAt:
          result.fixtureCollectedAt ?? selectedPrediction.fixtureCollectedAt,
      };

      const progress = getSettlementOverview(updatedPrediction);
      await refresh();

      if (progress.state === 'SETTLED') {
        toast.success(
          action === 'VOID'
            ? 'Prediction voided and closed.'
            : 'All selected markets have been settled.',
        );
        setSelectedPrediction(null);
      } else {
        setSelectedPrediction(updatedPrediction);
        toast(
          progress.state === 'PARTIAL'
            ? `Partial settlement: ${progress.settledMarkets} of ${progress.totalMarkets} markets resolved. Unresolved markets remain pending.`
            : 'No markets were resolved. The prediction remains pending.',
        );
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to settle prediction.'));
    } finally {
      setSettling(false);
    }
  };

  const deleteItem = async () => {
    if (!selectedPrediction) return;
    const predictionId = getPredictionId(selectedPrediction);
    if (!predictionId) {
      toast.error('This prediction has no valid ID.');
      return;
    }

    const settlementProgress = getSettlementOverview(selectedPrediction);
    if (settlementProgress.state !== 'PENDING') {
      toast.error('Predictions with settlement activity cannot be deleted.');
      return;
    }

    if (!window.confirm('Delete this prediction?')) return;

    try {
      setDeleting(true);
      await deletePrediction(predictionId);
      toast.success('Prediction deleted.');
      setSelectedPrediction(null);
      await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete prediction.'));
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-7 w-44 rounded-md bg-muted" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-16 rounded-lg bg-muted" />
          ))}
        </div>
        <div className="h-10 rounded-lg bg-muted" />
        <div className="h-72 rounded-lg bg-muted" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2 rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-xs text-destructive">
        <p>Unable to load predictions.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-md border border-destructive/30 px-2.5 py-1.5 font-semibold hover:bg-destructive/10"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Predictions</h1>
          <p className="text-[10px] text-muted-foreground">
            ESPN match status and market-by-market settlement monitoring.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-card px-3 text-[11px] font-semibold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaArrowsRotate className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        <SummaryCard label="Total predictions" value={summary.total} />
        <SummaryCard label="Live matches" value={summary.live} tone="blue" />
        <SummaryCard label="Awaiting settlement" value={summary.awaiting} tone="rose" />
        <SummaryCard label="Partial settlement" value={summary.partial} tone="amber" />
        <SummaryCard label="Fully settled" value={summary.settled} tone="green" />
      </div>

      <PredictionsFilters
        search={search}
        setSearch={setSearch}
        matchStatus={matchStatus}
        setMatchStatus={setMatchStatus}
        settlement={settlement}
        setSettlement={setSettlement}
        access={access}
        setAccess={setAccess}
        league={league}
        setLeague={setLeague}
        leagues={leagueOptions}
      />

      <div className="flex items-center justify-between gap-2 px-0.5">
        <p className="text-[10px] text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredPredictions.length}</span> of {predictions.length} predictions
        </p>
        <p className="text-[9px] text-muted-foreground">Auto-refresh every 60 seconds</p>
      </div>

      <PredictionsTable predictions={filteredPredictions} onSelect={openPrediction} />

      {selectedPrediction && (
        <PredictionDetailsModal
          key={getPredictionId(selectedPrediction) ?? selectedPrediction.matchId}
          prediction={selectedPrediction}
          onClose={closePrediction}
          onSave={saveEdit}
          onSettle={settle}
          onDelete={deleteItem}
          saving={saving}
          settling={settling}
          deleting={deleting}
        />
      )}

      {loadingDetail && selectedPrediction && (
        <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[90010] flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-[11px] font-medium shadow-md">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            Loading…
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'blue' | 'rose' | 'amber' | 'green';
}) {
  const valueTone =
    tone === 'blue'
      ? 'text-blue-600 dark:text-blue-400'
      : tone === 'rose'
        ? 'text-rose-600 dark:text-rose-400'
        : tone === 'amber'
          ? 'text-amber-600 dark:text-amber-400'
          : tone === 'green'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-foreground';

  return (
    <div className="min-w-0 rounded-lg border bg-card px-3 py-2.5">
      <p className="truncate text-[9px] font-medium text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-bold tabular-nums ${valueTone}`}>{value.toLocaleString('en-NG')}</p>
    </div>
  );
}
