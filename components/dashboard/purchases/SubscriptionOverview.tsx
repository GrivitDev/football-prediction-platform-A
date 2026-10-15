'use client';

import {
  CalendarDays,
  CheckCircle2,
  Crown,
} from 'lucide-react';

import { StatCard } from '@/components/dashboard/shared/StatCard';
import { StatusBadge } from '@/components/dashboard/shared/StatusBadge';

interface Props {
  loading: boolean;
  subscription: any;
  plan:
    | 'free'
    | 'regular'
    | 'vip'
    | 'premium';
}

export default function SubscriptionOverview({
  loading,
  subscription,
  plan,
}: Props) {
  if (loading) {
    return null;
  }

  const isLifetimePremium =
    plan === 'premium' &&
    !subscription?.expiryDate;

  const expiresAt = isLifetimePremium
    ? 'Lifetime'
    : subscription?.expiryDate
      ? new Date(
          subscription.expiryDate,
        ).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'No expiry';

  const status = subscription?.isActive
    ? 'active'
    : 'inactive';

  const planDescription =
    plan === 'premium'
      ? 'Highest membership level'
      : plan === 'vip'
        ? 'VIP membership'
        : plan === 'regular'
          ? 'Regular membership'
          : 'Free membership';

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <StatCard
        title="Current Plan"
        value={plan.toUpperCase()}
        icon={Crown}
        description={planDescription}
      />

      <StatCard
        title="Current Status"
        value={<StatusBadge status={status} />}
        icon={CheckCircle2}
        description="Account access status"
      />

      <StatCard
        title="Expires"
        value={expiresAt}
        icon={CalendarDays}
        description={
          isLifetimePremium
            ? 'Lifetime membership'
            : 'Subscription end date'
        }
      />
    </div>
  );
}