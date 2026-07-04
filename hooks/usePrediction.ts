'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import api from '@/lib/axios';
import { usePurchase } from '@/hooks/usePurchases';
import { usePredictionCountdown } from '@/hooks/usePredictionCountdown';

import type { PredictionAccess } from '@/types/prediction';

export function usePrediction(predictionId: string) {
  const router = useRouter();

  const { initializePurchase, loading: buying } = usePurchase();

  const [access, setAccess] = useState<PredictionAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrediction = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/predictions/user/${predictionId}`);

      setAccess(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load prediction');
    } finally {
      setLoading(false);
    }
  }, [predictionId]);

  useEffect(() => {
    loadPrediction();
  }, [loadPrediction]);

  const buyPrediction = useCallback(async () => {
    try {
      await initializePurchase(predictionId);
      await loadPrediction();
    } catch (err) {
      console.error(err);
    }
  }, [initializePurchase, predictionId, loadPrediction]);

  const upgradePlan = useCallback(() => {
    router.push('/subscriptions');
  }, [router]);

  const countdown = usePredictionCountdown(
    access?.matchDate ?? '',
    access?.accessType ?? 'free',
  );

  return {
    access,
    loading,
    buying,
    error,

    countdown,

    buyPrediction,
    upgradePlan,
    reload: loadPrediction,
  };
}