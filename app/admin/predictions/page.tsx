'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getPredictions,
  deletePrediction,
  updatePrediction,
  settlePrediction,
} from '@/services/prediction.service';

import PredictionDetailsModal from '@/components/admin/predictions/PredictionDetailsModal';
import { getLeagueName } from '@/constants/leagues';

export default function AdminPredictionsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['predictions'],
    queryFn: getPredictions,
  });

  const [selectedPrediction, setSelectedPrediction] = useState<any | null>(
    null,
  );

  const [settlementResult, setSettlementResult] = useState<
    'HOME' | 'DRAW' | 'AWAY' | 'VOID' | ''
  >('');

  // =========================
  // HELPERS
  // =========================

  const getPredictionLabel = (p: any) => {
    if (!p?.prediction) return '-';

    if (p.prediction === 'DRAW') return 'Draw';

    if (p.prediction === 'HOME') {
      return `${p.homeTeam} to win`;
    }

    if (p.prediction === 'AWAY') {
      return `${p.awayTeam} to win`;
    }

    return p.prediction;
  };

  const openPrediction = (prediction: any) => {
    setSelectedPrediction({ ...prediction });
    setSettlementResult('');
  };

  // =========================
  // EDIT FUNCTIONS
  // =========================

  const updateProbability = (
    field: 'home' | 'draw' | 'away',
    value: number,
  ) => {
    setSelectedPrediction((prev: any) => ({
      ...prev,
      probabilities: {
        ...prev.probabilities,
        [field]: value,
      },
    }));
  };

  const updateMarketSelection = (
    index: number,
    value: string,
  ) => {
    setSelectedPrediction((prev: any) => {
      const updatedMarkets = [...prev.markets];

      updatedMarkets[index] = {
        ...updatedMarkets[index],
        selection: value,
      };

      return {
        ...prev,
        markets: updatedMarkets,
      };
    });
  };

  const probabilityTotal =
    Number(selectedPrediction?.probabilities?.home || 0) +
    Number(selectedPrediction?.probabilities?.draw || 0) +
    Number(selectedPrediction?.probabilities?.away || 0);

  // =========================
  // SAVE
  // =========================

  const saveEdit = async () => {
    if (!selectedPrediction) return;

    if (!settlementResult && probabilityTotal !== 100) {
      alert('Probabilities must total exactly 100%');
      return;
    }

    try {
      if (settlementResult) {
        await settlePrediction(
          selectedPrediction._id,
          settlementResult,
        );
      } else {
        const cleanedMarkets =
          selectedPrediction.markets?.map((market: any) => ({
            market: market.market,
            selection: market.selection,
          })) || [];

        await updatePrediction(selectedPrediction._id, {
          probabilities:
            selectedPrediction.probabilities,
          markets: cleanedMarkets,
        });
      }

      setSelectedPrediction(null);

      queryClient.invalidateQueries({
        queryKey: ['predictions'],
      });
    } catch (error) {
      console.error(error);
      alert('Failed to update prediction');
    }
  };

  // =========================
  // DELETE
  // =========================

  const deleteItem = async () => {
    if (!selectedPrediction) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this prediction?',
    );

    if (!confirmed) return;

    try {
      await deletePrediction(selectedPrediction._id);

      setSelectedPrediction(null);

      queryClient.invalidateQueries({
        queryKey: ['predictions'],
      });
    } catch (error) {
      console.error(error);
      alert('Failed to delete prediction');
    }
  };

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div className="text-white">
        Loading predictions...
      </div>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================

  if (!data?.length) {
    return (
      <div>
        <h1 className="text-4xl font-bold mb-6">
          Predictions
        </h1>

        <div className="bg-slate-900 rounded-xl p-8 text-center text-slate-400">
          No predictions found.
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <>
      <div>
        <h1 className="text-4xl font-bold mb-6">
          Predictions
        </h1>

        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-4">League</th>
                <th>Home Team</th>
                <th>Away Team</th>
                <th>Prediction</th>
                <th>Access</th>
                <th>Match Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data
                ?.filter((p: any) => !p.deleted)
                .map((p: any) => (
                  <tr
                    key={p._id}
                    onClick={() => openPrediction(p)}
                    className="cursor-pointer border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4">
                      {getLeagueName(p.leagueCode)}
                    </td>

                    <td className="font-medium">
                      {p.homeTeam}
                    </td>

                    <td className="font-medium">
                      {p.awayTeam}
                    </td>

                    <td className="text-green-400 font-semibold">
                      {getPredictionLabel(p)}
                    </td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs capitalize ${
                          p.accessType === 'vip'
                            ? 'bg-yellow-600'
                            : p.accessType === 'regular'
                            ? 'bg-blue-600'
                            : 'bg-green-600'
                        }`}
                      >
                        {p.accessType}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        p.matchDate,
                      ).toLocaleDateString()}
                    </td>

                    <td className="capitalize">
                      {p.status}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPrediction && (
        <PredictionDetailsModal
          prediction={selectedPrediction}
          onClose={() =>
            setSelectedPrediction(null)
          }
          settlementResult={settlementResult}
          setSettlementResult={
            setSettlementResult
          }
          probabilityTotal={probabilityTotal}
          updateProbability={
            updateProbability
          }
          updateMarketSelection={
            updateMarketSelection
          }
          saveEdit={saveEdit}
          deleteItem={deleteItem}
        />
      )}
    </>
  );
}