'use client';

import {
  BadgeCheck,
  CalendarDays,
  CircleDollarSign,
  Crown,
  Sparkles,
  UserRound,
} from 'lucide-react';

import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { fmtDate } from './dashboard.utils';

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background/50 p-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[9px] text-muted-foreground">
            {label}
          </p>

          <p className="mt-0.5 truncate text-xs font-medium">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function useCountdown(
  expiryDate?: string | Date | null,
) {
  const calculate = () => {
    if (!expiryDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const difference =
      new Date(
        expiryDate,
      ).getTime() -
      Date.now();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(
        difference /
          (1000 * 60 * 60 * 24),
      ),

      hours: Math.floor(
        (difference /
          (1000 * 60 * 60)) %
          24,
      ),

      minutes: Math.floor(
        (difference /
          (1000 * 60)) %
          60,
      ),

      seconds: Math.floor(
        (difference / 1000) %
          60,
      ),
    };
  };

  const [time, setTime] =
    useState(calculate);

  useEffect(() => {
    const timer =
      setInterval(() => {
        setTime(calculate());
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [expiryDate]);

  return time;
}

function getPlanTheme(
  plan?: string | null,
) {
  const current =
    plan?.toLowerCase();

  if (current === 'premium') {
    return {
      title: 'Premium Membership',
      icon: Sparkles,
      label: 'Premium',
      iconClass:
        'text-violet-500',
      wrapper:
        'border-violet-500/25 bg-violet-500/5',
      iconWrapper:
        'bg-violet-500/10 border-violet-500/15',
      labelClass:
        'text-violet-500',
    };
  }

  if (current === 'vip') {
    return {
      title: 'VIP Membership',
      icon: Crown,
      label: 'VIP',
      iconClass:
        'text-amber-500',
      wrapper:
        'border-amber-500/25 bg-amber-500/5',
      iconWrapper:
        'bg-amber-500/10 border-amber-500/15',
      labelClass:
        'text-amber-500',
    };
  }

  if (current === 'regular') {
    return {
      title: 'Regular Membership',
      icon: BadgeCheck,
      label: 'Regular',
      iconClass:
        'text-primary',
      wrapper:
        'border-primary/25 bg-primary/5',
      iconWrapper:
        'bg-primary/10 border-primary/15',
      labelClass:
        'text-primary',
    };
  }

  return {
    title: 'Free Membership',
    icon: UserRound,
    label: 'Free',
    iconClass:
      'text-muted-foreground',
    wrapper:
      'border-border bg-muted/20',
    iconWrapper:
      'bg-muted border-border',
    labelClass:
      'text-muted-foreground',
  };
}

export function PlanCard({
  plan,
  startDate,
  expiresAt,
  revenue,
}: {
  plan?: string | null;
  startDate?: string | Date | null;
  expiresAt?: string | Date | null;
  revenue?: number | null;
}) {
  const countdown =
    useCountdown(expiresAt);

  const theme =
    getPlanTheme(plan);

  const PlanIcon =
    theme.icon;

  const isLifetime =
    plan?.toLowerCase() ===
      'premium' &&
    !expiresAt;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3">
      <div
        className={`
          rounded-md
          border
          p-3
          ${theme.wrapper}
        `}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-md
              border
              ${theme.iconWrapper}
            `}
          >
            <PlanIcon
              className={`
                h-4
                w-4
                ${theme.iconClass}
              `}
            />
          </div>

          <div className="min-w-0">
            <p
              className={`
                text-[9px]
                font-semibold
                uppercase
                tracking-wide
                ${theme.labelClass}
              `}
            >
              {theme.label}
            </p>

            <h3 className="truncate text-sm font-semibold">
              {theme.title}
            </h3>

            <p className="text-[9px] text-muted-foreground">
              Started {fmtDate(startDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-background/50 p-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />

          <div>
            <p className="text-[9px] text-muted-foreground">
              {isLifetime
                ? 'Membership'
                : 'Expires'}
            </p>

            <p className="text-xs font-medium">
              {isLifetime
                ? 'Lifetime'
                : fmtDate(expiresAt)}
            </p>
          </div>
        </div>

        {!isLifetime &&
          expiresAt && (
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {[
                {
                  value: countdown.days,
                  label: 'Days',
                },
                {
                  value: countdown.hours,
                  label: 'Hours',
                },
                {
                  value: countdown.minutes,
                  label: 'Minutes',
                },
                {
                  value: countdown.seconds,
                  label: 'Seconds',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-md border border-border bg-card p-1.5 text-center"
                >
                  <p className="text-sm font-semibold tabular-nums">
                    {String(
                      item.value,
                    ).padStart(2, '0')}
                  </p>

                  <p className="text-[8px] text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <MiniStat
          icon={CircleDollarSign}
          label="Subscription Value"
          value={`₦${(
            revenue ?? 0
          ).toLocaleString('en-GB')}`}
        />

        <MiniStat
          icon={BadgeCheck}
          label="Status"
          value="Active"
        />
      </div>
    </div>
  );
}