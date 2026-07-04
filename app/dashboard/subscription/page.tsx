'use client';

import { useSubscription } from '@/hooks/useSubscription';
import CurrentPlanCard from '@/components/dashboard/CurrentPlanCard';
import UpgradePlanCard from '@/components/dashboard/UpgradePlanCard';
import LoadingState from '@/components/dashboard/LoadingState';

export default function SubscriptionPage() {
  const { loading, plan, subscription } = useSubscription();

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">

      {/* CURRENT PLAN */}
      <CurrentPlanCard subscription={subscription} plan={plan} />

      {/* UPGRADE OPTIONS */}
      <UpgradePlanCard plan={plan} />

    </div>
  );
}