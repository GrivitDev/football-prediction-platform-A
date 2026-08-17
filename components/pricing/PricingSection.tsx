'use client';

import { useEffect, useMemo, useState } from 'react';

import PricingCard from './PricingCard';
import GatewayModal from './GatewayModal';

import { getPlanConfig } from '@/lib/plan-config';

import type { PlanConfig } from '@/types/plan-config';
import type { PaymentCurrency } from '@/services/payment-gateway.service';

import { useAuth } from '@/providers/auth-provider';

import {
  Crown,
  Gift,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

type SelectedPlan =
  | 'regular'
  | 'vip'
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
    // Guests always see USD
    setCurrency('USD');
    return;
  }

  // Logged-in users use their saved currency
  setCurrency(user.currency);
}, [user]);


  const prices = useMemo(() => {
    if (!config) {
      return {
        regular: 0,
        vip: 0,
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
    };
  }, [config, currency]);

  if (loading) {
    return (
      <section className="px-6 py-20">
        Loading plans...
      </section>
    );
  }

  if (!config) {
    return (
      <section className="px-6 py-20">
        Failed loading plans.
      </section>
    );
  }

  const plans = [
    {
      id: 'free' as const,

      name: config.planLabels.free,

      price: 0,

      description:
        'Perfect for getting started with Honest Predict.',

      features: [
        'Daily free football predictions',
        'Basic match analysis',
        'Limited prediction access',
        'Community support',
        'Standard advertisements',
        'Create your prediction history',
      ],
    },

    {
      id: 'regular' as const,

      name: config.planLabels.regular,

      price: prices.regular,

      description:
        'For users who want more winning opportunities every day.',

      popular: true,

      features: [
        'Everything in Free',
        'Access to Regular Predictions',
        'More prediction markets',
        'Reduced advertisements',
        'Priority prediction releases',
        'Purchase exclusive predictions',
        'Faster customer support',
      ],
    },

    {
      id: 'vip' as const,

      name: config.planLabels.vip,

      price: prices.vip,

      description:
        'The complete Honest Predict experience with every premium benefit.',

      features: [
        'Everything in Regular',
        'Unlimited VIP Predictions',
        'Highest confidence selections',
        'VIP Telegram Channel Access',
        'Zero advertisements',
        'Priority customer support',
        'Early access to premium tips',
        'Exclusive VIP promotions & rewards',
      ],
    },
  ];

  return (
    <section className="px-6 py-20">

      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-16 text-center">

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-primary/20
              bg-primary/10
              px-5
              py-2
              text-sm
              font-semibold
              text-primary
            "
          >
            <Crown size={16} />

            Premium Membership
          </div>

          <h1
            className="
              mx-auto
              mt-5
              max-w-4xl
              text-3xl
              font-black
              leading-tight
              sm:text-4xl
              lg:text-6xl
            "
          >
            Unlock the Full
            <span className="text-primary">
              {' '}
              Honest Predict
            </span>
            {' '}
            Experience
          </h1>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-base
              leading-7
              text-muted-foreground
              md:text-lg
            "
          >
            Choose the membership that fits your football
            journey. Enjoy premium predictions, fewer
            advertisements, exclusive VIP privileges,
            and a smoother experience built for passionate
            football fans.
          </p>

          {/* Benefits */}

          <div
            className="
              mt-8
              flex
              gap-3
              overflow-x-auto
              pb-2
              scrollbar-hide
              md:flex-wrap
              md:justify-center
            "
          >
            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                border
                bg-card
                px-3
                py-2
                text-xs
                shadow-sm
                sm:px-4
                sm:text-sm
              "
            >
              <TrendingUp
                size={16}
                className="text-primary"
              />

              Premium Predictions
            </div>

            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                border
                bg-card
                px-3
                py-2
                text-xs
                shadow-sm
                sm:px-4
                sm:text-sm
              "
            >
              <MessageCircle
                size={16}
                className="text-blue-500"
              />

              VIP Telegram
            </div>

            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                border
                bg-card
                px-3
                py-2
                text-xs
                shadow-sm
                sm:px-4
                sm:text-sm
              "
            >
              <ShieldCheck
                size={16}
                className="text-green-500"
              />

              Less Ads
            </div>

            <div
              className="
                flex
                shrink-0
                items-center
                gap-2
                rounded-full
                border
                bg-card
                px-3
                py-2
                text-xs
                shadow-sm
                sm:px-4
                sm:text-sm
              "
            >
              <Gift
                size={16}
                className="text-amber-500"
              />

              Rewards
            </div>
          </div>

        </div>

  <div className="mb-12 flex justify-center">
  <div
    className="
      rounded-full
      border
      bg-card
      px-4
      py-2
      text-sm
      text-muted-foreground
    "
  >
    Prices shown in{' '}
    <span className="font-semibold">
      {currency === 'NGN'
        ? 'Nigerian Naira (₦)'
        : 'US Dollars ($)'}
    </span>
  </div>
</div>

        {/* Pricing */}

        <div
          className="
            grid
            gap-6
            md:grid-cols-3
          "
        >
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currency={currency}
              subscriptionDurationDays={
                config.subscriptionDurationDays
              }
              onSelect={(id) => {
                if (
                  id === 'regular' ||
                  id === 'vip'
                ) {
                  if (!user) {
                    window.location.href =
                      `/login?redirect=/pricing`;

                    return;
                  }

                  setSelectedPlan(id);
                }
              }}
            />
          ))}
        </div>

      </div>

      {/* Payment Gateway */}

      {selectedPlan && (
        <GatewayModal
          type="subscription"
          target={selectedPlan}
          amount={
            selectedPlan === 'regular'
              ? prices.regular
              : prices.vip
          }
          currency={currency}
          config={config}
          title={
            `Complete ${selectedPlan.toUpperCase()} Subscription`
          }
          description={
            'Choose your preferred payment gateway to securely complete your subscription.'
          }
          onClose={() => setSelectedPlan(null)}
        />
      )}

    </section>
  );
}