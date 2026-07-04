'use client';
import { getLeagueName } from '@/constants/leagues';

type Props = {
  prediction: any;
  onClose: () => void;

  settlementResult: string;
  setSettlementResult: (value: any) => void;

  probabilityTotal: number;

  updateProbability: (
    field: 'home' | 'draw' | 'away',
    value: number,
  ) => void;

  updateMarketSelection: (
    index: number,
    value: string,
  ) => void;

  saveEdit: () => void;
  deleteItem: () => void;
};

export default function PredictionDetailsModal({
  prediction,
  onClose,
  settlementResult,
  setSettlementResult,
  probabilityTotal,
  updateProbability,
  updateMarketSelection,
  saveEdit,
  deleteItem,
}: Props) {
  if (!prediction) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-5xl mx-auto my-8 rounded-xl border border-slate-800">
        {/* HEADER */}
        <div className="border-b border-slate-800 p-5 flex justify-between items-center">          
          <div>
            <h2 className="text-2xl font-bold">
              {prediction.homeTeam} vs {prediction.awayTeam}
            </h2>

              <p className="text-slate-400 text-sm">
                {getLeagueName(prediction.leagueCode)}
              </p>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-800 px-4 py-2 rounded"
          >
            Close
          </button>
        </div>

        <div className="p-5 space-y-6">

          {/* MATCH INFO */}
          <section>
            <h3 className="font-bold mb-3">
              Match Information
            </h3>

            <div className="grid md:grid-cols-2 gap-3">
              <Info label="Match ID" value={prediction.matchId} />
              <Info
                label="League"
                value={getLeagueName(prediction.leagueCode)}
              />
              <Info label="Home Team" value={prediction.homeTeam} />
              <Info label="Away Team" value={prediction.awayTeam} />

              <Info
                label="Match Date"
                value={new Date(
                  prediction.matchDate,
                ).toLocaleString()}
              />
            </div>
          </section>

          {/* PREDICTION INFO */}
          <section>
            <h3 className="font-bold mb-3">
              Prediction Information
            </h3>

            <div className="grid md:grid-cols-3 gap-3">
              <Info
                label="Prediction"
                value={prediction.prediction}
              />

              <Info
                label="Confidence"
                value={`${prediction.confidence}%`}
              />

              <Info
                label="Access Type"
                value={prediction.accessType}
              />

              <Info
                label="Price"
                value={`₦${prediction.price}`}
              />

              <Info
                label="Status"
                value={prediction.status}
              />

              <Info
                label="Settled"
                value={prediction.settled ? 'Yes' : 'No'}
              />
            </div>
          </section>

          {/* PROBABILITIES */}
          <section>
            <h3 className="font-bold mb-3">
              Probabilities
            </h3>

            <div className="p-4 rounded border border-slate-800 bg-slate-950 mb-3">
              <div className="flex justify-between">
                <span>Total</span>

                <span
                  className={
                    probabilityTotal === 100
                      ? 'text-green-400'
                      : 'text-red-500'
                  }
                >
                  {probabilityTotal}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                value={prediction.probabilities.home}
                onChange={(e) =>
                  updateProbability(
                    'home',
                    Number(e.target.value),
                  )
                }
                className="p-2 bg-slate-950 border border-slate-800 rounded"
              />

              <input
                type="number"
                value={prediction.probabilities.draw}
                onChange={(e) =>
                  updateProbability(
                    'draw',
                    Number(e.target.value),
                  )
                }
                className="p-2 bg-slate-950 border border-slate-800 rounded"
              />

              <input
                type="number"
                value={prediction.probabilities.away}
                onChange={(e) =>
                  updateProbability(
                    'away',
                    Number(e.target.value),
                  )
                }
                className="p-2 bg-slate-950 border border-slate-800 rounded"
              />
            </div>
          </section>

          {/* MARKETS */}
          <section>
            <h3 className="font-bold mb-3">
              Markets ({prediction.markets?.length || 0})
            </h3>

            <div className="grid md:grid-cols-2 gap-3">
              {prediction.markets?.map(
                (market: any, index: number) => (
                  <div
                    key={index}
                    className="border border-slate-800 rounded-lg p-4"
                  >
                    <div className="text-slate-400 text-sm mb-2">
                      {market.market}
                    </div>

                    <input
                      value={market.selection}
                      onChange={(e) =>
                        updateMarketSelection(
                          index,
                          e.target.value,
                        )
                      }
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
                    />
                  </div>
                ),
              )}
            </div>
          </section>

          {/* SETTLEMENT */}
          <section>
            <h3 className="font-bold mb-3">
              Settlement
            </h3>

            <select
              value={settlementResult}
              onChange={(e) =>
                setSettlementResult(e.target.value)
              }
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded"
            >
              <option value="">
                Settle Match
              </option>

              <option value="HOME">
                {prediction.homeTeam} Won
              </option>

              <option value="DRAW">
                Draw
              </option>

              <option value="AWAY">
                {prediction.awayTeam} Won
              </option>

              <option value="VOID">
                Void
              </option>
            </select>

            {prediction.settledAt && (
              <div className="mt-3">
                <Info
                  label="Settled At"
                  value={new Date(
                    prediction.settledAt,
                  ).toLocaleString()}
                />
              </div>
            )}
          </section>

          {/* SYSTEM */}
          <section>
            <h3 className="font-bold mb-3">
              System Information
            </h3>

            <div className="grid md:grid-cols-2 gap-3">
              <Info
                label="Created At"
                value={new Date(
                  prediction.createdAt,
                ).toLocaleString()}
              />

              <Info
                label="Updated At"
                value={new Date(
                  prediction.updatedAt,
                ).toLocaleString()}
              />

              <Info
                label="Deleted"
                value={prediction.deleted ? 'Yes' : 'No'}
              />
            </div>
          </section>

          {/* FOOTER */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={saveEdit}
              disabled={
                !settlementResult &&
                probabilityTotal !== 100
              }
              className="flex-1 bg-green-600 py-3 rounded disabled:opacity-50"
            >
              Save
            </button>

            <button
              onClick={deleteItem}
              className="flex-1 bg-red-600 py-3 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="border border-slate-800 rounded p-3">
      <div className="text-slate-400 text-xs">
        {label}
      </div>

      <div className="font-medium">
        {value ?? '-'}
      </div>
    </div>
  );
}