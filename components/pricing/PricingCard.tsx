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
  onSelect: (id: 'free' | 'regular' | 'vip' | 'premium') => void;
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
    free: 'border-border hover:border-primary/40',
    regular:
      'border-blue-500/35 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background shadow-sm shadow-blue-500/5',
    vip:
      'border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 via-background to-background shadow-sm shadow-yellow-500/5',
    premium:
      'border-amber-500/35 bg-gradient-to-b from-amber-500/10 via-background to-background shadow-sm shadow-amber-500/5',
  };

  const iconStyles = {
    free: 'bg-muted text-primary',
    regular: 'bg-blue-500/15 text-blue-500',
    vip: 'bg-yellow-500/15 text-yellow-500',
    premium: 'bg-amber-500/15 text-amber-500',
  };

  const buttonStyles = {
    free: 'bg-primary text-primary-foreground hover:opacity-90',
    regular: 'bg-primary text-primary-foreground hover:opacity-90',
    vip: 'bg-yellow-500 text-black hover:bg-yellow-400',
    premium: 'bg-amber-500 text-black hover:bg-amber-400',
  };

  const buttonText = {
    free: 'Create Free Account',
    regular: 'Subscribe',
    vip: 'Subscribe',
    premium: 'Get Premium',
  };

  const Icon = icons[plan.id];
  const currencySymbol = currency === 'USD' ? '$' : '₦';

  const duration =
    plan.id === 'premium'
      ? premiumDurationDays === 0
        ? 'Lifetime'
        : `${premiumDurationDays} Days`
      : plan.id === 'free'
        ? null
        : `${subscriptionDurationDays} Days`;

  return (
    <article
      className={`flex h-full min-w-0 flex-col rounded-2xl border p-4 transition-colors duration-200 sm:p-5 ${cardStyles[plan.id]}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconStyles[plan.id]}`}
        >
          <Icon size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="break-words text-base font-bold leading-tight sm:text-lg">
            {plan.name}
          </h2>
          <p className="mt-1 text-xs leading-4 text-muted-foreground">
            {plan.description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex min-w-0 items-baseline gap-2">
        <span className="text-2xl font-black tracking-tight sm:text-3xl">
          {currencySymbol}
          {plan.price.toLocaleString()}
        </span>
        {duration && (
          <span className="text-[11px] text-muted-foreground">
            / {duration}
          </span>
        )}
      </div>

      {plan.id === 'premium' && premiumDurationDays === 0 && (
        <p className="mt-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
          Lifetime access
        </p>
      )}

      <ul className="mt-3 flex-1 space-y-1.5 border-t pt-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500/10">
              <Check size={10} className="text-green-500" />
            </span>
            <span className="min-w-0 text-xs leading-4 text-foreground/90">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={handleSelectPlan}
        className={`mt-4 min-h-10 w-full rounded-lg px-3 py-2.5 text-xs font-bold transition sm:text-sm ${buttonStyles[plan.id]}`}
      >
        {buttonText[plan.id]}
      </button>
    </article>
  );
}
