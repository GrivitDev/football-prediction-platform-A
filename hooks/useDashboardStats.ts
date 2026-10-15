'use client';

import { useEffect, useState } from 'react';

import { userService } from '@/services/user.service';
import { subscriptionService } from '@/services/subscription.service';
import { getPredictionTableRows } from '@/services/prediction.service';
import { getReferralPromos } from '@/services/promos.service';
import type { PredictionUserResponse } from '@/types/prediction.types';
import type { PredictionItem } from '@/components/dashboard/dashboard.types';

function getTopPredictions(
  predictions: PredictionUserResponse[],
): PredictionItem[] {
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
  const tomorrowStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  ).getTime();

  // The user-facing endpoint deliberately omits prediction data when a user
  // does not have access. Only use rows that the backend says are accessible.
  const accessiblePredictions: PredictionItem[] = predictions
    .filter((prediction) => prediction?.access?.allowed && prediction.data)
    .map((prediction) => ({
      ...prediction,
      confidence: Number(
        prediction.data?.confidence ?? prediction.confidence ?? 0,
      ),
    }));

  const validDatedPredictions = accessiblePredictions.filter((prediction) => {
    if (!prediction.matchDate) return false;
    return !Number.isNaN(new Date(prediction.matchDate).getTime());
  });

  const matchesToday = validDatedPredictions.filter((prediction) => {
    const matchTime = new Date(prediction.matchDate!).getTime();
    return matchTime >= todayStart && matchTime < tomorrowStart;
  });

  // If there are no accessible predictions for today, show upcoming matches.
  const candidates = matchesToday.length
    ? matchesToday
    : validDatedPredictions.filter(
        (prediction) => new Date(prediction.matchDate!).getTime() >= todayStart,
      );

  return candidates
    .sort(
      (a, b) => Number(b.confidence ?? 0) - Number(a.confidence ?? 0),
    )
    .slice(0, 3);
}

function normalizeList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];

  const record = value as Record<string, unknown>;
  const possibleKeys = ['data', 'promos', 'items', 'campaigns'];

  for (const key of possibleKeys) {
    const nested = record[key];
    if (Array.isArray(nested)) return nested;
  }

  // Some APIs wrap the collection in more than one object, e.g. { data: { items } }.
  for (const key of possibleKeys) {
    const nested = record[key];
    if (nested && typeof nested === 'object') {
      const nestedRecord = nested as Record<string, unknown>;
      for (const nestedKey of possibleKeys) {
        const nestedValue = nestedRecord[nestedKey];
        if (Array.isArray(nestedValue)) return nestedValue;
      }
    }
  }

  return [];
}

export function useDashboardStats() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [predictions, setPredictions] = useState<PredictionUserResponse[]>([]);
  const [topPredictions, setTopPredictions] = useState<PredictionItem[]>([]);
  const [availablePromos, setAvailablePromos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadPredictions = async () => {
      try {
        const rows = await getPredictionTableRows();
        if (!isActive) return;

        const safeRows = Array.isArray(rows) ? rows : [];
        setPredictions(safeRows);
        setTopPredictions(getTopPredictions(safeRows));
        setPredictionError(null);
      } catch (requestError) {
        console.error('[Dashboard] Failed to load user predictions:', requestError);
        if (!isActive) return;

        setPredictions([]);
        setTopPredictions([]);
        setPredictionError('Predictions are temporarily unavailable.');
      }
    };

    const loadPromos = async () => {
      try {
        const response = await getReferralPromos();
        if (!isActive) return;

        setAvailablePromos(normalizeList(response) as any[]);
        setPromoError(null);
      } catch (requestError) {
        console.error('[Dashboard] Failed to load promotions:', requestError);
        if (!isActive) return;

        setAvailablePromos([]);
        setPromoError('Promotions are temporarily unavailable.');
      }
    };

    const loadCoreDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Profile and subscription status are required to render the dashboard.
        // Optional sections load separately so they cannot take down the page.
        const [userResponse, subscriptionResponse] = await Promise.all([
          userService.getMe(),
          subscriptionService.getStatus(),
        ]);

        if (!isActive) return;

        setUser(userResponse);

        const subscriptionData = subscriptionResponse?.subscription ?? null;
        const currentPlan =
          subscriptionResponse?.plan ?? subscriptionData?.plan ?? 'free';

        // /subscriptions/status returns the resolved plan at the top level as
        // well as the active subscription record. Preserve both pieces of data.
        setSubscription({
          ...(subscriptionData ?? {}),
          plan: currentPlan,
        });

        setLoading(false);

        // Do not block the core dashboard on optional prediction/promo requests.
        void loadPredictions();
        void loadPromos();
      } catch (requestError) {
        console.error('[Dashboard] Failed to load account data:', requestError);
        if (!isActive) return;

        setError('Unable to load your account details. Please refresh and try again.');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void loadCoreDashboardData();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    loading,
    error,
    predictionError,
    promoError,
    user,
    subscription,
    predictions,
    topPredictions,
    availablePromos,
  };
}
