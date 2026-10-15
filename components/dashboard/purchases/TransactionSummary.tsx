'use client';

import {
  CheckCircle2,
  Clock3,
  Wallet,
} from 'lucide-react';

import { StatCard } from '@/components/dashboard/shared/StatCard';

import { useAuth } from '@/providers/auth-provider';

interface Props {
  payments: any[];
}

export default function TransactionSummary({
  payments = [],
}: Props) {
  const { user } = useAuth();

  const currency =
    user?.currency ?? 'NGN';

  const total = payments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0,
  );

  const approved = payments.filter(
    (payment) =>
      payment.status === 'approved',
  ).length;

  const pending = payments.filter(
    (payment) =>
      payment.status === 'pending',
  ).length;

  const formattedTotal =
    new Intl.NumberFormat(
      currency === 'USD'
        ? 'en-US'
        : 'en-NG',
      {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      },
    ).format(total);

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <StatCard
        title="Total Spent"
        value={formattedTotal}
        icon={Wallet}
        description={`Payments in ${currency}`}
      />

      <StatCard
        title="Approved"
        value={approved}
        icon={CheckCircle2}
        description="Successful payments"
      />

      <StatCard
        title="Pending"
        value={pending}
        icon={Clock3}
        description="Awaiting approval"
      />
    </div>
  );
}