'use client';

import { useState } from 'react';
import { PredictionMarkets } from '@/lib/prediction-enums';

interface MarketItem {
  market: string;
  selection: string;
}

interface PredictionModalProps {
  match: any;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  loading: boolean;
}

// =========================
// CONFIDENCE ENGINE
// =========================
const calculateConfidence = (home: number, draw: number, away: number) => {
  const probs = [home, draw, away].sort((a, b) => b - a);
  const highest = probs[0];
  const second = probs[1];
  const gap = highest - second;

  return Math.min(95, Math.round(55 + gap + highest * 0.3));
};

// =========================
// AUTO PREDICTION
// =========================
const getAutoPrediction = (
  home: number,
  draw: number,
  away: number,
) => {
  const max = Math.max(home, draw, away);

  if (max === draw) return 'DRAW';
  if (max === home) return 'HOME';

  return 'AWAY';
};

export default function PredictionModal({
  match,
  onClose,
  onSubmit,
  loading,
}: PredictionModalProps) {
  const [homeProb, setHomeProb] = useState('');
  const [drawProb, setDrawProb] = useState('');
  const [awayProb, setAwayProb] = useState('');

  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [accessType, setAccessType] = useState<'free' | 'regular' | 'vip'>('free');
  const [price, setPrice] = useState('');

  // =========================
  // MARKET HANDLERS
  // =========================
  const addMarket = () =>
    setMarkets([...markets, { market: '', selection: '' }]);

const updateMarket = (
  index: number,
  field: keyof MarketItem,
  value: string
) => {
  const updated = [...markets];
  updated[index][field] = value;
  setMarkets(updated);
};

  const removeMarket = (index: number) => {
    setMarkets(markets.filter((_, i) => i !== index));
  };

  // =========================
  // CALCULATIONS
  // =========================
  const home = Number(homeProb) || 0;
  const draw = Number(drawProb) || 0;
  const away = Number(awayProb) || 0;

  const total = home + draw + away;

  const confidence = total === 100 ? calculateConfidence(home, draw, away) : 0;

 const autoPrediction = getAutoPrediction(
  home,
  draw,
  away,
);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = () => {
  if (total !== 100) return alert('Probabilities must equal 100%');

  const numericPrice = Number(price);

  // ✅ FREE = no price needed
  if (accessType !== 'free' && (!price || numericPrice <= 0)) {
    return alert('Price is required for paid predictions');
  }

  const cleanedMarkets = markets
    .filter((m) => m.market)
    .map((m) => ({
      market: m.market.trim(),
      selection: m.selection?.trim() || '',
    }));

    const handleAccessChange = (value: 'free' | 'regular' | 'vip') => {
  setAccessType(value);

  if (value === 'free') setPrice('0');
};

  onSubmit({
    prediction: autoPrediction,
    confidence,
    probabilities: { home, draw, away },
    markets: cleanedMarkets,
    accessType,
    price: accessType === 'free' ? 0 : numericPrice,
  });
  };

  return (
     <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
      <div className="bg-slate-900 w-full max-w-5xl mx-auto my-8 rounded-xl border border-slate-800">

        {/* HEADER */}
        <div className="p-5 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-bold">Create Prediction</h2>
          <p className="text-slate-400 text-sm">
            {match.homeTeam} vs {match.awayTeam}
          </p>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">

          {/* AUTO PREDICTION */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <p className="text-xs text-slate-400">Auto Prediction</p>
            <p className="text-green-400 font-bold">{autoPrediction}</p>
          </div>

          {/* PROBABILITIES */}
          <div className="space-y-3">
            <input
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded"
              placeholder={`${match.homeTeam} %`}
              value={homeProb}
              onChange={(e) => setHomeProb(e.target.value)}
            />

            <input
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded"
              placeholder="Draw %"
              value={drawProb}
              onChange={(e) => setDrawProb(e.target.value)}
            />

            <input
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded"
              placeholder={`${match.awayTeam} %`}
              value={awayProb}
              onChange={(e) => setAwayProb(e.target.value)}
            />
          </div>

          {/* SUMMARY */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex justify-between">
              <span>Total</span>
              <span className={total === 100 ? 'text-green-400' : 'text-red-400'}>
                {total}%
              </span>
            </div>

            <div className="flex justify-between mt-2">
              <span>Confidence</span>
              <span className="text-green-400 font-bold">
                {confidence}%
              </span>
            </div>
          </div>

         {/* MARKETS */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">
                Markets
              </h3>

              <button
                type="button"
                onClick={addMarket}
                className="text-green-400 text-sm"
              >
                + Add Market
              </button>
            </div>

            {markets.map((m, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3"
              >
                {/* MARKET */}
                <select
                  className="p-2 bg-slate-950 border border-slate-800 rounded"
                  value={m.market}
                  onChange={(e) =>
                    updateMarket(
                      i,
                      'market',
                      e.target.value,
                    )
                  }
                >
                  <option value="">
                    Select Market
                  </option>

                  {Object.values(
                    PredictionMarkets,
                  ).map((market) => (
                    <option
                      key={market}
                      value={market}
                    >
                      {market.replaceAll(
                        '_',
                        ' ',
                      )}
                    </option>
                  ))}
                </select>

                {/* SELECTION */}
                <input
                  type="text"
                  className="p-2 bg-slate-950 border border-slate-800 rounded"
                  placeholder="Selection (optional)"
                  value={m.selection}
                  onChange={(e) =>
                    updateMarket(
                      i,
                      'selection',
                      e.target.value,
                    )
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    removeMarket(i)
                  }
                  className="col-span-full text-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* ACCESS */}
          <select
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded"
            value={accessType}
            onChange={(e) =>
              setAccessType(e.target.value as 'free' | 'regular' | 'vip')
            }
          >
            <option value="free">Free</option>
            <option value="regular">Regular</option>
            <option value="vip">VIP</option>
          </select>

          {/* PRICE */}
          <input
            type="number"
            className="w-full p-2 bg-slate-950 border border-slate-800 rounded"
            placeholder="Price (required)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t border-slate-800 flex gap-3 bg-slate-900">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-green-600 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Create'}
          </button>
        </div>

      </div>
    </div>
  );
}