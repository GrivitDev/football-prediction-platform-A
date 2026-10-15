import { DollarSign, Crown, CreditCard, Target, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import type { AnalyticsRevenue, RevenueBreakdown } from '@/types/analytics.types';
import { useExchangeRate } from '@/hooks/useExchangeRate';

interface Props {
  revenue: AnalyticsRevenue;
}

type ExtendedRevenue = AnalyticsRevenue & {
  premiumRevenue?: RevenueBreakdown;
};

type RevenueCard = {
  title: string;
  revenue?: RevenueBreakdown;
  icon: LucideIcon;
  highlight?: boolean;
};

const formatNaira = (amount: number) => `₦${amount.toLocaleString()}`;
const formatDollar = (amount: number) => `$${amount.toLocaleString()}`;

export default function RevenueSection({ revenue }: Props) {
  const { rate, loading, error } = useExchangeRate();
  const extended = revenue as ExtendedRevenue;

  const cards: RevenueCard[] = [
    { title: 'Total', revenue: revenue.totalRevenue, icon: DollarSign, highlight: true },
    { title: 'Regular', revenue: revenue.regularRevenue, icon: CreditCard },
    { title: 'VIP', revenue: revenue.vipRevenue, icon: Crown, highlight: true },
    { title: 'Premium', revenue: extended.premiumRevenue, icon: Sparkles },
    { title: 'Predictions', revenue: revenue.predictionRevenue, icon: Target },
  ];

  const availableCards = cards.filter(
    (card): card is RevenueCard & { revenue: RevenueBreakdown } => Boolean(card.revenue),
  );

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold tracking-tight">Revenue Analytics</h2>
        {!loading && !error && (
          <span className="text-[9px] leading-3 text-muted-foreground">
            $1 ≈ ₦{rate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {availableCards.map((card) => (
          <AnalyticsCard key={card.title} title={card.title} icon={card.icon} highlight={card.highlight}>
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[9px] leading-3">
              <span className="whitespace-nowrap">
                <span className="text-muted-foreground">NGN </span>
                <span className="font-medium tabular-nums">{formatNaira(card.revenue.NGN)}</span>
              </span>
              <span className="whitespace-nowrap">
                <span className="text-muted-foreground">USD </span>
                <span className="font-medium tabular-nums">{formatDollar(card.revenue.USD)}</span>
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between gap-2 border-t border-border/60 pt-1.5">
              <span className="text-[9px] leading-3 text-muted-foreground">₦ equivalent</span>
              <span className="truncate text-xs font-semibold leading-4 tabular-nums">
                {loading || error ? '--' : formatNaira(card.revenue.NGN + card.revenue.USD * rate)}
              </span>
            </div>
          </AnalyticsCard>
        ))}
      </div>
    </section>
  );
}
