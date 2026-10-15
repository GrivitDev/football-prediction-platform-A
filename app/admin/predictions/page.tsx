'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
  deletePrediction,
  getPrediction,
  getPredictions,
  settlePrediction,
  updatePrediction,
  voidPrediction,
  type UpdatePredictionPayload,
} from '@/services/prediction.service';
import PredictionDetailsModal from '@/components/admin/predictions/PredictionDetailsModal';
import PredictionsFilters from '@/components/admin/predictions/PredictionsFilters';
import PredictionsTable from '@/components/admin/predictions/PredictionsTable';
import { getMatchStatus } from '@/utils/prediction.utils';
import type { AdminPrediction } from '@/types/prediction.types';

type SettlementAction = 'ESPN' | 'VOID';

function getPredictionId(prediction: AdminPrediction): string | null {
  const id = prediction._id ?? prediction.id;
  return typeof id === 'string' && id.trim() ? id.trim() : null;
}

export default function AdminPredictionsPage() {
  const queryClient = useQueryClient();

  const { data: predictions = [], isLoading, isError } = useQuery({
    queryKey: ['predictions'],
    queryFn: getPredictions,
  });

  const [selectedPrediction, setSelectedPrediction] = useState<AdminPrediction | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settling, setSettling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [access, setAccess] = useState('all');
  const [league, setLeague] = useState('all');

  const leagueOptions = Array.from(
    new Map(
      predictions.map((prediction) => [
        prediction.leagueCode,
        {
          code: prediction.leagueCode,
          name: prediction.league?.name ?? prediction.leagueCode,
        },
      ]),
    ).values(),
  );

  const filteredPredictions = predictions.filter((prediction) => {
    const query = `${prediction.homeTeam} ${prediction.awayTeam} ${prediction.league?.name ?? ''} ${prediction.leagueCode}`.toLowerCase();
    return (
      query.includes(search.trim().toLowerCase()) &&
      (status === 'all' || getMatchStatus(prediction) === status) &&
      (access === 'all' || prediction.accessType === access) &&
      (league === 'all' || prediction.leagueCode === league)
    );
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ['predictions'] });

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
      toast.error('Unable to load prediction.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const closePrediction = () => {
    if (!saving && !settling && !deleting) setSelectedPrediction(null);
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
    } catch (error: any) {
      const message = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error?.response?.data?.message ?? error?.message ?? 'Failed to update prediction.';
      toast.error(message);
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

      if (action === 'VOID') {
        await voidPrediction(predictionId);
        toast.success('Prediction voided.');
      } else {
        await settlePrediction(predictionId);
        toast.success('Prediction settled.');
      }

      setSelectedPrediction(null);
      await refresh();
    } catch (error: any) {
      const message = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error?.response?.data?.message ?? error?.message ?? 'Failed to settle prediction.';
      toast.error(message);
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

    if (selectedPrediction.settled) {
      toast.error('Settled predictions cannot be deleted.');
      return;
    }

    if (!window.confirm('Delete this prediction?')) return;

    try {
      setDeleting(true);
      await deletePrediction(predictionId);
      toast.success('Prediction deleted.');
      setSelectedPrediction(null);
      await refresh();
    } catch (error: any) {
      const message = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(', ')
        : error?.response?.data?.message ?? error?.message ?? 'Failed to delete prediction.';
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-40 rounded-md bg-muted" />
        <div className="h-10 rounded-lg bg-muted" />
        <div className="h-72 rounded-lg bg-muted" />
      </div>
    );
  }

  if (isError) {
    return <div className="rounded-lg border border-destructive/25 bg-destructive/10 p-3 text-xs text-destructive">Unable to load predictions.</div>;
  }

  return (
    <div className="space-y-3">
      <PredictionsFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        access={access}
        setAccess={setAccess}
        league={league}
        setLeague={setLeague}
        leagues={leagueOptions}
      />

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

