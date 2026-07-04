'use client';

import { useState } from 'react';
import { purchaseService } from '@/services/purchase.service';

export function usePurchase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePurchase = async (predictionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await purchaseService.initialize(predictionId);
      return res;
    } catch (err: any) {
      setError(err?.message || 'Purchase failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    initializePurchase,
  };
}