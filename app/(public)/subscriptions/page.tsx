'use client';

import { useEffect, useState } from 'react';

import { PageHero } from '@/components/dashboard/shared/PageHero';
import { DashboardSection } from '@/components/dashboard/shared/DashboardSection';

import SubscriptionOverview from '@/components/dashboard/purchases/SubscriptionOverview';
import UpgradeSection from '@/components/dashboard/purchases/UpgradeSection';

import { usePurchases } from '@/hooks/usePurchases';
import { usePlanConfig } from '@/hooks/usePlanConfig';

import GatewayModal from '@/components/pricing/GatewayModal';

import {
  getUpgradePrice,
  type UpgradePriceResponse,
} from '@/services/subscription.service';

import { InternalAds } from '@/components/ads/IntAds/InternalAds';
import { AdPage } from '@/constants/ads/ad-page';
import { AdPosition } from '@/constants/ads/ad-position';

import type { PaymentCurrency } from '@/services/payment-gateway.service';

import { useAuth } from '@/providers/auth-provider';

type SubscriptionTarget =
  | 'regular'
  | 'vip'
  | 'premium';

export default function PurchasesPage() {
  const {
    loading,
    subscription,
    plan,
  } = usePurchases();

  const { config } =
    usePlanConfig();

  const { user } = useAuth();

  const currency: PaymentCurrency =
    user?.currency ?? 'USD';

  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionTarget | null>(null);

  const [upgrade, setUpgrade] =
    useState<'vip' | null>(null);

  const [upgradePrice, setUpgradePrice] =
    useState<UpgradePriceResponse | null>(null);

  const [upgradeLoading, setUpgradeLoading] =
    useState(false);

  useEffect(() => {
    if (plan !== 'regular') {
      setUpgradePrice(null);
      setUpgradeLoading(false);
      return;
    }

    let cancelled = false;

    async function loadUpgradePrice() {
      try {
        setUpgradeLoading(true);

        const data =
          await getUpgradePrice();

        if (cancelled) {
          return;
        }

        setUpgradePrice(
          data.canUpgrade
            ? data
            : null,
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Failed to load VIP upgrade price:',
            error,
          );

          setUpgradePrice(null);
        }
      } finally {
        if (!cancelled) {
          setUpgradeLoading(false);
        }
      }
    }

    loadUpgradePrice();

    return () => {
      cancelled = true;
    };
  }, [plan]);

  const getPlanPrice = (
    target: SubscriptionTarget,
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
        title="Subscription"
        description="Manage your membership."
      />

      <DashboardSection>
        <SubscriptionOverview
          loading={loading}
          subscription={subscription}
          plan={plan}
        />
      </DashboardSection>

      {config && (
        <DashboardSection>
          <UpgradeSection
            plan={plan}
            config={config}
            currency={currency}
            upgradePrice={upgradePrice}
            upgradeLoading={upgradeLoading}
            onUpgrade={async (
              target,
            ) => {
              setUpgradePrice(
                target === 'vip' &&
                  plan === 'regular'
                  ? upgradePrice
                  : null,
              );

              if (
                target === 'regular'
              ) {
                if (plan === 'free') {
                  setSelectedPlan(
                    'regular',
                  );
                }

                return;
              }

              if (target === 'vip') {
                if (plan === 'free') {
                  setSelectedPlan('vip');
                  return;
                }

                if (plan === 'regular') {
                  if (
                    !upgradePrice?.canUpgrade
                  ) {
                    return;
                  }

                  setUpgrade('vip');
                }

                return;
              }

              if (
                target === 'premium'
              ) {
                if (
                  plan === 'free' ||
                  plan === 'regular' ||
                  plan === 'vip'
                ) {
                  setSelectedPlan(
                    'premium',
                  );
                }
              }
            }}
          />
        </DashboardSection>
      )}

      {selectedPlan && config && (
        <GatewayModal
          type="subscription"
          target={selectedPlan}
          amount={getPlanPrice(
            selectedPlan,
          )}
          currency={currency}
          config={config}
          title={`Complete ${config.planLabels[selectedPlan]} Subscription`}
          description="Choose your preferred payment method."
          onClose={() =>
            setSelectedPlan(null)
          }
        />
      )}

      {upgrade &&
        config &&
        upgradePrice && (
          <GatewayModal
            type="vip_upgrade"
            target="vip"
            amount={upgradePrice.amount}
            currency={currency}
            config={config}
            title={`Upgrade to ${config.planLabels.vip}`}
            description="Complete payment to upgrade your membership."
            onClose={() =>
              setUpgrade(null)
            }
          />
        )}

      <InternalAds
        page={AdPage.HOME}
        position={AdPosition.BOTTOM}
      />

      <InternalAds
        page={AdPage.HOME}
        position={AdPosition.POPUP}
      />
    </div>
  );
}