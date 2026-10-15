'use client';

import {
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';

import type { PaymentCurrency } from '@/services/payment-gateway.service';

interface PricingPlan {
  id: 'free' | 'regular' | 'vip' | 'premium';
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface PricingCardProps {
  plan: PricingPlan;
  currency: PaymentCurrency;
  subscriptionDurationDays: number;
  premiumDurationDays: number;
  onSelect: (
    id: 'free' | 'regular' | 'vip' | 'premium',
  ) => void;
}

export default function PricingCard({
  plan,
  currency,
  subscriptionDurationDays,
  premiumDurationDays,
  onSelect,
}: PricingCardProps) {
  const handleSelectPlan = () => {
    if (plan.id === 'free') {
      window.location.href = '/register';
      return;
    }

    onSelect(plan.id);
  };

  const icons = {
    free: ShieldCheck,
    regular: Trophy,
    vip: Crown,
    premium: Sparkles,
  };

  const cardStyles = {
    free: `
      border-border
      hover:border-primary/40
    `,

    regular: `
      border-blue-500/40
      bg-gradient-to-br
      from-blue-500/10
      via-blue-500/5
      to-background
      shadow-lg
      shadow-blue-500/10
    `,

    vip: `
      border-yellow-500/30
      bg-gradient-to-b
      from-yellow-500/10
      via-background
      to-background
      shadow-lg
      shadow-yellow-500/10
    `,

    premium: `
      border-amber-500/40
      bg-gradient-to-b
      from-amber-500/12
      via-background
      to-background
      shadow-lg
      shadow-amber-500/10
    `,
  };

  const iconStyles = {
    free: `
      bg-muted
      text-primary
    `,

    regular: `
      bg-blue-500/15
      text-blue-500
      ring-2
      ring-blue-500/20
    `,

    vip: `
      bg-yellow-500/15
      text-yellow-500
    `,

    premium: `
      bg-amber-500/15
      text-amber-500
      ring-2
      ring-amber-500/20
    `,
  };

  const buttonStyles = {
    free: `
      bg-primary
      text-primary-foreground
      hover:opacity-90
    `,

    regular: `
      bg-primary
      text-primary-foreground
      hover:opacity-90
    `,

    vip: `
      bg-yellow-500
      text-black
      hover:bg-yellow-400
    `,

    premium: `
      bg-amber-500
      text-black
      hover:bg-amber-400
    `,
  };

  const buttonText = {
    free: 'Create Free Account',
    regular: 'Subscribe',
    vip: 'Subscribe',
    premium: 'Get Premium',
  };

  const Icon = icons[plan.id];

  const currencySymbol =
    currency === 'USD' ? '$' : '₦';

  const duration =
    plan.id === 'premium'
      ? premiumDurationDays === 0
        ? 'Lifetime'
        : `${premiumDurationDays} Days`
      : plan.id === 'free'
        ? null
        : `${subscriptionDurationDays} Days`;

  return (
    <div
      className={`
        relative
        rounded-2xl
        border
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        ${cardStyles[plan.id]}
      `}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${iconStyles[plan.id]}
            `}
          >
            <Icon size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">
              {plan.name}
            </h2>

            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {plan.description}
            </p>
          </div>
        </div>

        <div>
          {plan.price === 0 ? (
            <span className="text-4xl font-black">
              {currencySymbol}0
            </span>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight">
                {currencySymbol}
                {plan.price.toLocaleString()}
              </span>

              {duration && (
                <span className="text-xs text-muted-foreground">
                  / {duration}
                </span>
              )}
            </div>
          )}

          {plan.id === 'premium' &&
            premiumDurationDays === 0 && (
              <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                Lifetime access
              </p>
            )}
        </div>

        <ul className="space-y-2.5">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5"
            >
              <span
                className="
                  mt-0.5
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-green-500/10
                "
              >
                <Check
                  size={12}
                  className="text-green-500"
                />
              </span>

              <span className="text-xs leading-5 sm:text-sm">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleSelectPlan}
          className={`
            w-full
            rounded-xl
            px-4
            py-3
            text-sm
            font-bold
            transition
            ${buttonStyles[plan.id]}
          `}
        >
          {buttonText[plan.id]}
        </button>
      </div>
    </div>
  );
}