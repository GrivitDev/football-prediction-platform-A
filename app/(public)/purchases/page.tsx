'use client';

import { useState } from 'react';

import { PageHero } from '@/components/dashboard/shared/PageHero';
import { DashboardSection } from '@/components/dashboard/shared/DashboardSection';

import TransactionSummary from '@/components/dashboard/purchases/TransactionSummary';
import TransactionTable from '@/components/dashboard/purchases/TransactionTable';

import PaymentModal from '@/components/pricing/PaymentModal';

import { usePurchases } from '@/hooks/usePurchases';
import { usePlanConfig } from '@/hooks/usePlanConfig';

import type { PaymentCurrency } from '@/services/payment-gateway.service';

import { useAuth } from '@/providers/auth-provider';

type UpgradeTarget =
  | 'regular'
  | 'vip'
  | 'premium';

export default function PurchasesPage() {
  const {
    loading,
    payments,
  } = usePurchases();

  const { config } =
    usePlanConfig();

  const { user } = useAuth();

  const [upgrade, setUpgrade] =
    useState<UpgradeTarget | null>(null);

  const currency: PaymentCurrency =
    user?.currency ?? 'USD';

  const getAmount = (
    target: UpgradeTarget,
  ) => {
    if (!config) {
      return 0;
    }

    if (currency === 'USD') {
      if (target === 'regular') {
        return config.regularPriceUSD;
      }

      if (target === 'vip') {
        return config.vipPriceUSD;
      }

      return config.premiumPriceUSD;
    }

    if (target === 'regular') {
      return config.regularPrice;
    }

    if (target === 'vip') {
      return config.vipPrice;
    }

    return config.premiumPrice;
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageHero
        title="Payment History"
        description="Review payments for your subscription and plan upgrades."
      />

      <DashboardSection>
        <TransactionSummary
          payments={payments}
        />
      </DashboardSection>

      <DashboardSection>
        <TransactionTable
          loading={loading}
          payments={payments}
        />
      </DashboardSection>

      {upgrade && config && (
        <PaymentModal
          type="subscription"
          target={upgrade}
          amount={getAmount(upgrade)}
          config={config}
          currency={currency}
          title={`Subscribe to ${config.planLabels[upgrade]}`}
          description="Complete payment to activate your subscription."
          onClose={() => setUpgrade(null)}
        />
      )}
    </div>
  );
}
