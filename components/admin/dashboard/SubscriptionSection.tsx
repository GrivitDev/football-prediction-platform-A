import { CreditCard, Crown, Users, CheckCircle, Sparkles } from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import type { AnalyticsSubscriptions } from '@/types/analytics.types';

interface Props {
  subscriptions: AnalyticsSubscriptions;
}

type ExtendedSubscriptions = AnalyticsSubscriptions & {
  activePremiumSubscriptions?: number;
  premiumSubscriptions?: number;
};

const numberClass = 'text-base font-semibold leading-5 tracking-tight tabular-nums';

export default function SubscriptionSection({ subscriptions }: Props) {
  const extended = subscriptions as ExtendedSubscriptions;
  const premium = extended.activePremiumSubscriptions ?? extended.premiumSubscriptions;

  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold tracking-tight">Subscription Analytics</h2>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        <AnalyticsCard title="Active" description="Currently active" icon={CheckCircle} highlight>
          <p className={numberClass}>{subscriptions.activeSubscriptions.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Regular" description="Active regular" icon={Users}>
          <p className={numberClass}>{subscriptions.activeRegularSubscriptions.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="VIP" description="Active VIP" icon={Crown} highlight>
          <p className={numberClass}>{subscriptions.activeVipSubscriptions.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Premium" description={typeof premium === 'number' ? 'Active premium' : 'Not returned'} icon={Sparkles}>
          <p className={numberClass}>{typeof premium === 'number' ? premium.toLocaleString() : '—'}</p>
        </AnalyticsCard>
        <AnalyticsCard title="All Records" description="Lifetime subscriptions" icon={CreditCard}>
          <p className={numberClass}>{subscriptions.totalSubscriptions.toLocaleString()}</p>
        </AnalyticsCard>
      </div>
    </section>
  );
}
