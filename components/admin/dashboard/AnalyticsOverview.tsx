import AnalyticsCard from './AnalyticsCard';
import { Users, CreditCard, Target, TrendingUp } from 'lucide-react';
import type {
  AnalyticsUsers,
  AnalyticsRevenue,
  AnalyticsSubscriptions,
  AnalyticsPredictions,
} from '@/types/analytics.types';

interface AnalyticsOverviewProps {
  users: AnalyticsUsers;
  revenue: AnalyticsRevenue;
  subscriptions: AnalyticsSubscriptions;
  predictions: AnalyticsPredictions;
}

type ExtendedSubscriptions = AnalyticsSubscriptions & {
  premiumSubscriptions?: number;
  activePremiumSubscriptions?: number;
};

const numberClass = 'text-lg font-semibold leading-5 tracking-tight tabular-nums';
const detailClass = 'text-[9px] leading-3 text-muted-foreground';

export default function AnalyticsOverview({
  users,
  revenue,
  subscriptions,
  predictions,
}: AnalyticsOverviewProps) {
  const extended = subscriptions as ExtendedSubscriptions;
  const premium = extended.activePremiumSubscriptions ?? extended.premiumSubscriptions;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <AnalyticsCard title="Users" icon={Users}>
        <p className={numberClass}>{users.totalUsers.toLocaleString()}</p>
        <div className={`flex flex-wrap justify-between gap-x-2 ${detailClass}`}>
          <span>Active {users.activeUsers.toLocaleString()}</span>
          <span>Verified {users.verifiedUsers.toLocaleString()}</span>
        </div>
      </AnalyticsCard>

      <AnalyticsCard title="Revenue" icon={TrendingUp} highlight>
        <p className={`${numberClass} truncate`}>₦{revenue.totalRevenue.NGN.toLocaleString()}</p>
        <div className={`flex flex-wrap justify-between gap-x-2 ${detailClass}`}>
          <span>${revenue.totalRevenue.USD.toLocaleString()}</span>
          <span>{revenue.totalPayments.toLocaleString()} payments</span>
        </div>
      </AnalyticsCard>

      <AnalyticsCard title="Subscriptions" icon={CreditCard}>
        <p className={numberClass}>{subscriptions.totalSubscriptions.toLocaleString()}</p>
        <div className={`flex flex-wrap gap-x-2 gap-y-0.5 ${detailClass}`}>
          <span>Regular {subscriptions.regularSubscriptions}</span>
          <span>VIP {subscriptions.vipSubscriptions}</span>
          <span>Premium {premium ?? '—'}</span>
        </div>
      </AnalyticsCard>

      <AnalyticsCard title="Predictions" icon={Target}>
        <p className={numberClass}>{predictions.totalPredictions.toLocaleString()}</p>
        <div className={`flex flex-wrap justify-between gap-x-2 ${detailClass}`}>
          <span>Won {predictions.wonPredictions.toLocaleString()}</span>
          <span>Pending {predictions.pendingPredictions.toLocaleString()}</span>
        </div>
      </AnalyticsCard>
    </div>
  );
}
