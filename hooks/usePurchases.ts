'use client';

import { useEffect, useState } from 'react';

import { paymentService } from '@/services/payment.service';
import { subscriptionService } from '@/services/subscription.service';

export type SubscriptionPlan = 'free' | 'regular' | 'vip' | 'premium';

/**
 * Backwards-compatible type alias for any existing imports. Plan access is
 * subscription-based; this type does not represent individual prediction buys.
 * New code should use SubscriptionPlan.
 */
export type PurchasePlan = SubscriptionPlan;

type SubscriptionPayment = {
  type?: string;
  [key: string]: any;
};

function isSubscriptionPayment(payment: SubscriptionPayment) {
  return payment?.type === 'subscription' || payment?.type === 'vip_upgrade';
}

/**
 * Keeps the existing hook name so current pages do not break, while loading
 * only subscription and VIP-upgrade payments from the current payments API.
 * Historical single-prediction payment records are intentionally excluded.
 */
export function usePurchases() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [plan, setPlan] = useState<SubscriptionPlan>('free');

  async function fetchData() {
    try {
      setLoading(true);

      const [paymentsRes, subscriptionRes] = await Promise.all([
        paymentService.getMyPayments(),
        subscriptionService.getStatus(),
      ]);

      const paymentList = Array.isArray(paymentsRes) ? paymentsRes : [];
      setPayments(paymentList.filter(isSubscriptionPayment));
      setSubscription(subscriptionRes?.subscription ?? null);
      setPlan(subscriptionRes?.plan ?? 'free');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchData();
    // Keep the current mount-only fetch behavior.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    payments,
    subscription,
    plan,
    refetch: fetchData,
  };
}

// Clearer name for new consumers; usePurchases remains available for legacy
// imports until page/component names can be migrated separately.
export const useSubscriptionPayments = usePurchases;
