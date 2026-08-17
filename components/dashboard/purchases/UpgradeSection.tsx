'use client';

import type { PlanConfig } from '@/types/plan-config';
import type { UpgradePriceResponse } from '@/services/subscription.service';

import UpgradeCard from './UpgradeCard';

import type { PaymentCurrency } from '@/services/payment-gateway.service';
import { useAuth } from '@/providers/auth-provider';

type CurrentPlan =
  | 'free'
  | 'regular'
  | 'vip';

interface UpgradeSectionProps {
  plan: CurrentPlan;
  config: PlanConfig;
  currency?: PaymentCurrency;

  upgradePrice?: UpgradePriceResponse | null;
  upgradeLoading?: boolean;

  onUpgrade: (
    target: 'regular' | 'vip',
  ) => void;
}
export default function UpgradeSection({
  plan,
  config,
  currency,
  upgradePrice,
  upgradeLoading,
  onUpgrade,
}: UpgradeSectionProps) {
  const { user } = useAuth();

  const selectedCurrency: PaymentCurrency =
    user?.currency ?? currency ?? 'USD';

  return (
    <UpgradeCard
      currentPlan={plan}
      config={config}
      currency={selectedCurrency}
      upgradePrice={upgradePrice}
      upgradeLoading={upgradeLoading}
      onUpgrade={onUpgrade}
    />
  );
}