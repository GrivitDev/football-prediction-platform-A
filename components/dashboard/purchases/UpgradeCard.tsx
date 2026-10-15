'use client';

import {
  BadgeCheck,
  Check,
  Crown,
  Loader2,
  Sparkles,
  Trophy,
} from 'lucide-react';

import type { PlanConfig } from '@/types/plan-config';
import type { UpgradePriceResponse } from '@/services/subscription.service';
import type { PaymentCurrency } from '@/services/payment-gateway.service';

type CurrentPlan =
  | 'free'
  | 'regular'
  | 'vip'
  | 'premium';

type UpgradeTarget =
  | 'regular'
  | 'vip'
  | 'premium';

interface UpgradeCardProps {
  currentPlan: CurrentPlan;
  config: PlanConfig;
  currency: PaymentCurrency;

  upgradePrice?: UpgradePriceResponse | null;
  upgradeLoading?: boolean;

  onUpgrade: (
    target: UpgradeTarget,
  ) => void;
}

interface PlanCard {
  id: UpgradeTarget;
  name: string;
  price: number;
  durationLabel: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export default function UpgradeCard({
  currentPlan,
  config,
  currency,
  upgradePrice,
  upgradeLoading = false,
  onUpgrade,
}: UpgradeCardProps) {
  const currencySymbol =
    currency === 'USD'
      ? '$'
      : '₦';

  const formatMoney = (
    value: number,
    fractionDigits =
      currency === 'USD' ? 2 : 0,
  ) =>
    `${currencySymbol}${value.toLocaleString(
      'en-GB',
      {
        minimumFractionDigits:
          fractionDigits,
        maximumFractionDigits:
          fractionDigits,
      },
    )}`;

  const getDurationLabel = (
    plan: UpgradeTarget,
  ) => {
    if (plan === 'premium') {
      return config.premiumDurationDays ===
        0
        ? 'Lifetime'
        : `${config.premiumDurationDays} days`;
    }

    return `${config.subscriptionDurationDays} days`;
  };

  const regularPlan: PlanCard = {
    id: 'regular',
    name: config.planLabels.regular,
    price:
      currency === 'USD'
        ? config.regularPriceUSD
        : config.regularPrice,
    durationLabel:
      getDurationLabel('regular'),
    description:
      'More prediction access with fewer advertisements.',
    popular: true,
    features: [
      'Regular Predictions',
      'Reduced advertisements',
      'Priority prediction releases',
    ],
  };

  const vipPlan: PlanCard = {
    id: 'vip',
    name: config.planLabels.vip,
    price:
      currentPlan === 'regular' &&
      upgradePrice
        ? upgradePrice.amount
        : currency === 'USD'
          ? config.vipPriceUSD
          : config.vipPrice,
    durationLabel:
      getDurationLabel('vip'),
    description:
      'Full VIP prediction access with zero advertisements.',
    features: [
      'Unlimited VIP Predictions',
      'Zero advertisements',
      'Early prediction access',
    ],
  };

  const premiumPlan: PlanCard = {
    id: 'premium',
    name: config.planLabels.premium,
    price:
      currency === 'USD'
        ? config.premiumPriceUSD
        : config.premiumPrice,
    durationLabel:
      getDurationLabel('premium'),
    description:
      'Complete platform access at the highest membership level.',
    features: [
      'All premium prediction access',
      'Zero advertisements',
      'Highest membership level',
    ],
  };

  let plans: PlanCard[] = [];

  if (currentPlan === 'free') {
    plans = [
      regularPlan,
      vipPlan,
      premiumPlan,
    ];
  } else if (currentPlan === 'regular') {
    plans = [
      vipPlan,
      premiumPlan,
    ];
  } else if (currentPlan === 'vip') {
    plans = [premiumPlan];
  }

  const icons = {
    regular: Trophy,
    vip: Crown,
    premium: Sparkles,
  };

  const iconStyles = {
    regular:
      'bg-primary/10 text-primary',
    vip:
      'bg-amber-500/10 text-amber-500',
    premium:
      'bg-violet-500/10 text-violet-500',
  };

  const borderStyles = {
    regular:
      'border-primary/30',
    vip:
      'border-amber-500/30',
    premium:
      'border-violet-500/30',
  };

  const buttonStyles = {
    regular:
      'bg-primary text-primary-foreground hover:bg-primary/90',
    vip:
      'bg-amber-500 text-black hover:bg-amber-400',
    premium:
      'bg-violet-600 text-white hover:bg-violet-500',
  };

  const buttonText = {
    regular: 'Subscribe',
    vip: 'Upgrade to VIP',
    premium: 'Upgrade to Premium',
  };

  if (currentPlan === 'premium') {
    return (
      <div className="rounded-lg border border-violet-500/30 bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-violet-500">
            <Sparkles className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold">
              {config.planLabels.premium}
            </p>

            <p className="text-[11px] text-muted-foreground">
              You already have the highest membership level.
            </p>
          </div>

          <span className="ml-auto shrink-0 rounded-md bg-violet-500/10 px-2 py-1 text-[10px] font-medium text-violet-500">
            Current
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`
          grid
          gap-3
          ${
            plans.length === 1
              ? 'mx-auto max-w-md'
              : plans.length === 2
                ? 'md:grid-cols-2'
                : 'lg:grid-cols-3'
          }
        `}
      >
        {plans.map((plan) => {
          const Icon = icons[plan.id];

          const isCalculatedUpgrade =
            currentPlan === 'regular' &&
            plan.id === 'vip' &&
            !!upgradePrice;

          return (
            <div
              key={plan.id}
              className={`
                relative
                rounded-lg
                border
                bg-card
                p-3.5
                ${borderStyles[plan.id]}
              `}
            >
              {plan.popular && (
                <span className="absolute right-3 top-3 rounded-md bg-primary/10 px-2 py-1 text-[9px] font-semibold text-primary">
                  POPULAR
                </span>
              )}

              <div className="flex items-start gap-2.5">
                <div
                  className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    ${iconStyles[plan.id]}
                  `}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 pr-12">
                  <h2 className="text-sm font-semibold">
                    {plan.name}
                  </h2>

                  <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-xl font-bold">
                  {formatMoney(plan.price)}
                </span>

                <span className="text-[10px] text-muted-foreground">
                  {isCalculatedUpgrade
                    ? 'upgrade'
                    : `/ ${plan.durationLabel}`}
                </span>
              </div>

              {isCalculatedUpgrade &&
                upgradePrice && (
                  <div className="mt-3 rounded-md border bg-muted/30 p-2.5">
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">
                          Days remaining
                        </span>

                        <span className="font-medium">
                          {upgradePrice.daysRemaining}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground">
                          Upgrade rate
                        </span>

                        <span className="font-medium">
                          {formatMoney(
                            upgradePrice.upgradeDailyPrice,
                            2,
                          )}
                          /day
                        </span>
                      </div>

                      <div className="border-t pt-1.5">
                        <div className="flex justify-between gap-3">
                          <span className="font-medium">
                            Amount to pay
                          </span>

                          <span className="font-semibold text-primary">
                            {formatMoney(
                              upgradePrice.amount,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              <ul className="mt-3 space-y-1.5">
                {plan.features.map(
                  (feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-1.5 text-[11px] leading-4"
                    >
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ),
                )}
              </ul>

              <button
                type="button"
                disabled={upgradeLoading}
                onClick={() =>
                  onUpgrade(plan.id)
                }
                className={`
                  mt-3
                  flex
                  h-8
                  w-full
                  items-center
                  justify-center
                  rounded-md
                  px-3
                  text-[11px]
                  font-medium
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  ${buttonStyles[plan.id]}
                `}
              >
                {upgradeLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  buttonText[plan.id]
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}