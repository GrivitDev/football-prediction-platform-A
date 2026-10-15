import AnalyticsCard from './AnalyticsCard';
import { UserPlus, Gift, Clock } from 'lucide-react';
import type { AnalyticsReferrals } from '@/types/analytics.types';

interface Props {
  referrals: AnalyticsReferrals;
}

const numberClass = 'text-base font-semibold leading-5 tracking-tight tabular-nums';

export default function ReferralSection({ referrals }: Props) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold tracking-tight">Referral Program</h2>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <AnalyticsCard title="Total Referrals" icon={UserPlus} highlight>
          <p className={numberClass}>{referrals.totalReferrals.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Rewarded" icon={Gift}>
          <p className={numberClass}>{referrals.rewardedReferrals.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Pending Rewards" icon={Clock}>
          <p className={numberClass}>{referrals.pendingRewards.toLocaleString()}</p>
        </AnalyticsCard>
      </div>
    </section>
  );
}
