'use client';

import { useEffect, useMemo, useState } from 'react';

import GatewayModal from './GatewayModal';
import PricingCard from './PricingCard';

import { getPlanConfig } from '@/lib/plan-config';

import type { PlanConfig } from '@/types/plan-config';
import type { PaymentCurrency } from '@/services/payment-gateway.service';

import { useAuth } from '@/providers/auth-provider';

type SelectedPlan =
  | 'regular'
  | 'vip'
  | 'premium'
  | null;

export default function PricingSection() {
  const { user } = useAuth();

  const [config, setConfig] =
    useState<PlanConfig | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedPlan, setSelectedPlan] =
    useState<SelectedPlan>(null);

  const [currency, setCurrency] =
    useState<PaymentCurrency>('USD');

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await getPlanConfig();

        setConfig(data);
      } catch (error) {
        console.error(
          'Failed loading plans',
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  useEffect(() => {
    if (!user) {
      setCurrency('USD');
      return;
    }

    setCurrency(user.currency);
  }, [user]);

  const prices = useMemo(() => {
    if (!config) {
      return {
        regular: 0,
        vip: 0,
        premium: 0,
      };
    }

    return {
      regular:
        currency === 'USD'
          ? config.regularPriceUSD
          : config.regularPrice,

      vip:
        currency === 'USD'
          ? config.vipPriceUSD
          : config.vipPrice,

      premium:
        currency === 'USD'
          ? config.premiumPriceUSD
          : config.premiumPrice,
    };
  }, [config, currency]);

  if (loading) {
    return (
      <section className="overflow-hidden px-4 py-10 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-7 w-48 rounded-lg bg-muted" />

          <div className="mt-2 h-4 w-72 rounded bg-muted" />

          <div
            className="
              mt-8
              flex
              gap-4
              overflow-hidden

              sm:grid
              sm:grid-cols-2

              xl:grid-cols-4
            "
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  h-80
                  w-[82%]
                  shrink-0
                  rounded-2xl
                  bg-muted

                  sm:w-auto
                "
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!config) {
    return (
      <section className="overflow-hidden px-4 py-10 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-7xl rounded-xl border p-4 text-sm text-muted-foreground">
          Failed loading plans.
        </div>
      </section>
    );
  }

  const plans = [

    {
      id: 'regular' as const,
      name: config.planLabels.regular,
      price: prices.regular,
      description: 'More prediction access every day.',
      features: [
        'Everything in Free',
        'Regular predictions',
        'More prediction markets',
        'Reduced advertisements',
        'Priority prediction releases',
      ],
    },

    {
      id: 'premium' as const,
      name: config.planLabels.premium,
      price: prices.premium,
      description: 'Maximum platform access.',
      features: [
        'Everything in VIP',
        'Premium prediction access',
        'All available premium benefits',
        'Priority access',
        'Premium support',
        config.premiumDurationDays === 0
          ? 'Lifetime membership'
          : `${config.premiumDurationDays}-day membership`,
      ],
    },

    {
      id: 'vip' as const,
      name: config.planLabels.vip,
      price: prices.vip,
      description: 'Expanded access and VIP benefits.',
      features: [
        'Everything in Regular',
        'VIP predictions',
        'Highest confidence selections',
        'VIP Telegram access',
        'Zero advertisements',
        'Priority support',
      ],
    },

  ];

  return (
    <section className="overflow-hidden px-4 py-10 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Subscription Plans
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Choose the level of access you need.
            </p>
          </div>

          <div className="w-fit rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">
            Prices in{' '}
            <span className="font-semibold text-foreground">
              {currency === 'NGN'
                ? 'Nigerian Naira (₦)'
                : 'US Dollars ($)'}
            </span>
          </div>
        </div>

        <div
          className="
            -mx-4
            flex
            snap-x
            snap-mandatory
            gap-4
            overflow-x-auto
            overscroll-x-contain
            px-4
            pb-3
            items-center
            justify-center
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden

            sm:mx-0
            sm:grid
            sm:grid-cols-2
            sm:gap-4
            sm:overflow-visible
            sm:px-0
            sm:pb-0

            xl:grid-cols-3
          "
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="
                w-[65%]
                shrink-0
                snap-start

                sm:w-auto
                sm:min-w-0
              "
            >
              <PricingCard
                plan={plan}
                currency={currency}
                subscriptionDurationDays={
                  config.subscriptionDurationDays
                }
                premiumDurationDays={
                  config.premiumDurationDays
                }
                onSelect={(id) => {
                  if (id === 'free') {
                    window.location.href = '/register';
                    return;
                  }

                  if (!user) {
                    window.location.href =
                      '/login?redirect=/pricing';

                    return;
                  }

                  setSelectedPlan(id);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <GatewayModal
          type="subscription"
          target={selectedPlan}
          amount={prices[selectedPlan]}
          currency={currency}
          config={config}
          title={`Complete ${config.planLabels[selectedPlan]} Subscription`}
          description="Choose your preferred payment method."
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </section>
  );
}