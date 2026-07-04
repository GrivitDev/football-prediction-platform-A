'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';

import DashboardStats from '@/components/dashboard/DashboardStats';
import CurrentPlanCard from '@/components/dashboard/CurrentPlanCard';
import PaymentHistoryTable from '@/components/dashboard/PaymentHistoryTable';
import PurchasedPredictionsTable from '@/components/dashboard/PurchasedPredictionsTable';
import LoadingState from '@/components/dashboard/LoadingState';

export default function DashboardPage() {
  const {
    loading,
    user,
    subscription,
    payments,
    purchases,
    error,
  } = useDashboardStats();

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER / STATS */}
      <DashboardStats
        user={user}
        subscription={subscription}
        payments={payments}
        purchases={purchases}
      />

      {/* CURRENT PLAN */}
      <CurrentPlanCard subscription={subscription} />

      {/* RECENT PAYMENTS */}
      <PaymentHistoryTable
        payments={payments.slice(0, 5)}
      />

      {/* RECENT PURCHASES */}
      <PurchasedPredictionsTable
        purchases={purchases.slice(0, 5)}
      />
    </div>
  );
}