import {
  BadgeCheck,
  Crown,
  Mail,
  Phone,
  Sparkles,
  UserRound,
} from 'lucide-react';

import type {
  ElementType,
  ReactNode,
} from 'react';

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background/50 p-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] text-muted-foreground">
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

export function IdentityCard({
  name,
  username,
  email,
  phoneNumber,
  plan,
}: {
  name?: string | null;
  username?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  plan?: string | null;
}) {
  const currentPlan =
    plan?.toLowerCase() || 'free';

  const membership =
    {
      premium: {
        label: 'PREMIUM',
        icon: Sparkles,
        iconClass:
          'bg-violet-500/10 text-violet-500',
        badgeClass:
          'bg-violet-500/10 text-violet-500',
      },

      vip: {
        label: 'VIP',
        icon: Crown,
        iconClass:
          'bg-amber-500/10 text-amber-500',
        badgeClass:
          'bg-amber-500/10 text-amber-500',
      },

      regular: {
        label: 'REGULAR',
        icon: BadgeCheck,
        iconClass:
          'bg-primary/10 text-primary',
        badgeClass:
          'bg-primary/10 text-primary',
      },

      free: {
        label: 'FREE',
        icon: UserRound,
        iconClass:
          'bg-muted text-muted-foreground',
        badgeClass:
          'bg-muted text-muted-foreground',
      },
    }[currentPlan] || {
      label: 'FREE',
      icon: UserRound,
      iconClass:
        'bg-muted text-muted-foreground',
      badgeClass:
        'bg-muted text-muted-foreground',
    };

  const MembershipIcon =
    membership.icon;

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40">
          <UserRound className="h-4.5 w-4.5 text-muted-foreground" />

          <div
            className={`
              absolute
              -right-1.5
              -top-1.5
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-md
              ${membership.iconClass}
            `}
          >
            <MembershipIcon className="h-3 w-3" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold">
              {name || 'User'}
            </h3>

            <span
              className={`
                rounded-md
                px-1.5
                py-0.5
                text-[8px]
                font-semibold
                tracking-wide
                ${membership.badgeClass}
              `}
            >
              {membership.label}
            </span>
          </div>

          <p className="truncate text-[10px] text-muted-foreground">
            {username
              ? `@${username}`
              : 'No username'}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <MiniStat
          icon={Mail}
          label="Email"
          value={email || '—'}
        />

        <MiniStat
          icon={Phone}
          label="Phone"
          value={phoneNumber || '—'}
        />
      </div>
    </div>
  );
}