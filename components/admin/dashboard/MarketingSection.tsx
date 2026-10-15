import AnalyticsCard from './AnalyticsCard';
import { Megaphone, MousePointerClick, Eye, Gift, CheckCircle, Clock } from 'lucide-react';
import type { AnalyticsAds, AnalyticsPromos } from '@/types/analytics.types';

interface Props {
  ads: AnalyticsAds;
  promos: AnalyticsPromos;
}

const numberClass = 'text-base font-semibold leading-5 tracking-tight tabular-nums';

export default function MarketingSection({ ads, promos }: Props) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold tracking-tight">Marketing</h2>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
        <AnalyticsCard title="Total Ads" icon={Megaphone}>
          <p className={numberClass}>{ads.totalAds.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Active Ads" icon={Megaphone} highlight>
          <p className={numberClass}>{ads.activeAds.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Impressions" icon={Eye}>
          <p className={numberClass}>{ads.impressions.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Clicks" icon={MousePointerClick}>
          <p className={numberClass}>{ads.clicks.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="CTR" icon={MousePointerClick} highlight>
          <p className={numberClass}>{ads.ctr.toFixed(2)}%</p>
        </AnalyticsCard>
        <AnalyticsCard title="Total Promos" icon={Gift}>
          <p className={numberClass}>{promos.totalPromos.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Active Promos" icon={CheckCircle} highlight>
          <p className={numberClass}>{promos.activePromos.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Expired Promos" icon={Clock}>
          <p className={numberClass}>{promos.expiredPromos.toLocaleString()}</p>
        </AnalyticsCard>
      </div>
    </section>
  );
}
