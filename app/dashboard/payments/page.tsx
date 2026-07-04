'use client';

import { usePayments } from '@/hooks/usePayments';
import PaymentHistoryTable from '@/components/dashboard/PaymentHistoryTable';
import LoadingState from '@/components/dashboard/LoadingState';

export default function PaymentsPage() {
  const { loading, payments, error } = usePayments();

  if (loading) return <LoadingState />;

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-white text-2xl font-bold">
        Payment History
      </h1>

      <PaymentHistoryTable payments={payments} />

    </div>
  );
}