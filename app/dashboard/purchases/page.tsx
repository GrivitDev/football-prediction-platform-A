'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

import { Card } from '@/components/ui/card';
import Spinner from '@/components/spinner';

type Prediction = {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  leagueCode: string;
  prediction: string;
  confidence: number;
  matchDate: string;
  status: string;
};

type Purchase = {
  _id: string;
  predictionId: Prediction;
  amount: number;
  createdAt: string;
};

export default function PurchasesPage() {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await axios.get('/purchases/me');

      setPurchases(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          My Predictions
        </h1>
        <p className="text-gray-500">
          All predictions you have access to
        </p>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {purchases.length === 0 && (
          <Card className="p-6 text-center text-gray-500">
            No predictions purchased yet
          </Card>
        )}

        {purchases.map((p) => (
          <Card
            key={p._id}
            className="p-5 flex flex-col md:flex-row md:items-center justify-between"
          >
            {/* MATCH INFO */}
            <div>
              <h2 className="font-semibold text-lg">
                {p.predictionId?.homeTeam} vs{' '}
                {p.predictionId?.awayTeam}
              </h2>

              <p className="text-sm text-gray-500">
                {p.predictionId?.leagueCode}
              </p>

              <p className="text-sm mt-1">
                Prediction:{' '}
                <span className="font-bold">
                  {p.predictionId?.prediction}
                </span>
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="text-right mt-3 md:mt-0">
              <p className="text-sm text-gray-500">
                Confidence
              </p>

              <p className="font-bold">
                {p.predictionId?.confidence}%
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(
                  p.createdAt,
                ).toDateString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}