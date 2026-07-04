'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/services/user.service';
import { subscriptionService } from '@/services/subscription.service';
import { paymentService } from '@/services/payment.service';
import { purchaseService } from '@/services/purchase.service';

export function useDashboardStats() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [userRes, subRes, payRes, purRes] = await Promise.all([
          userService.getMe(),
          subscriptionService.getStatus(),
          paymentService.getMyPayments(),
          purchaseService.getMyPurchases(),
        ]);

        setUser(userRes);
        setSubscription(subRes);
        setPayments(payRes || []);
        setPurchases(purRes || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return {
    loading,
    error,
    user,
    subscription,
    payments,
    purchases,
  };
}