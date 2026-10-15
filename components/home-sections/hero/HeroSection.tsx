'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaTelegram,
  FaWhatsapp,
} from 'react-icons/fa6';

import type { IconType } from 'react-icons';

import { useAuth } from '@/providers/auth-provider';
import { subscriptionService } from '@/services/subscription.service';

type SubscriptionPlan =
  | 'free'
  | 'regular'
  | 'vip'
  | 'premium';

interface SocialLink {
  name: string;
  href: string | undefined;
  icon: IconType;
}

interface UpgradeOption {
  target: SubscriptionPlan;
  label: string;
  description: string;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Telegram',
    href: process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL,
    icon: FaTelegram,
  },
  {
    name: 'WhatsApp Channel',
    href: process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL,
    icon: FaWhatsapp,
  },
  {
    name: 'Facebook',
    href: process.env.NEXT_PUBLIC_FACEBOOK,
    icon: FaFacebookF,
  },
  {
    name: 'X',
    href: process.env.NEXT_PUBLIC_TWITTER,
    icon: FaXTwitter,
  },
  {
    name: 'Instagram',
    href: process.env.NEXT_PUBLIC_INSTAGRAM,
    icon: FaInstagram,
  },
];

const upgradeOptions: Partial<
  Record<SubscriptionPlan, UpgradeOption>
> = {
  free: {
    target: 'regular',
    label: 'Upgrade to Regular',
    description:
      'Get more football insights with a Regular subscription.',
  },

  regular: {
    target: 'vip',
    label: 'Upgrade to VIP',
    description:
      'Unlock more advanced predictions with VIP access.',
  },

  vip: {
    target: 'premium',
    label: 'Upgrade to Premium',
    description:
      'Take your football analysis experience further with Premium.',
  },
};

function isSubscriptionPlan(
  value: unknown,
): value is SubscriptionPlan {
  return (
    value === 'free' ||
    value === 'regular' ||
    value === 'vip' ||
    value === 'premium'
  );
}

function ArrowIcon({
  className = 'size-4',
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function HeroButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <Link
      href={href}
      className={`
        inline-flex
        min-h-10
        items-center
        justify-center
        gap-2
        rounded-lg
        px-4
        py-2.5
        text-sm
        font-semibold
        transition
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-white
        focus-visible:ring-offset-2
        focus-visible:ring-offset-slate-950
        ${
          variant === 'primary'
            ? `
              bg-emerald-500
              text-white
              hover:bg-emerald-400
            `
            : `
              border
              border-white/25
              bg-white/10
              text-white
              hover:bg-white/20
            `
        }
      `}
    >
      {children}
    </Link>
  );
}

export default function HeroSection() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [plan, setPlan] =
    useState<SubscriptionPlan | null>(null);

  const [subscriptionLoading, setSubscriptionLoading] =
    useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setPlan(null);
      setSubscriptionLoading(false);
      return;
    }

    let cancelled = false;

    async function loadSubscription() {
      setSubscriptionLoading(true);

      try {
        const response =
          await subscriptionService.getStatus();

        if (cancelled) {
          return;
        }

        const currentPlan = response?.plan;

        setPlan(
          isSubscriptionPlan(currentPlan)
            ? currentPlan
            : 'free',
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            'Failed to load subscription plan:',
            error,
          );

          setPlan(null);
        }
      } finally {
        if (!cancelled) {
          setSubscriptionLoading(false);
        }
      }
    }

    loadSubscription();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const isLoggedIn = Boolean(user);

  const upgrade =
    plan ? upgradeOptions[plan] : undefined;

  const configuredSocialLinks = socialLinks.filter(
    ({ href }) =>
      typeof href === 'string' &&
      href.trim().length > 0,
  );

  return (
    <section
      className="
        relative
        isolate
        h-auto
        min-h-[300px]
        w-full
        overflow-hidden
        bg-slate-950
        text-white
        sm:rounded-xl
        lg:h-[60vh]
        lg:min-h-0
        lg:max-h-[420px]
      "
    >
      {/* Stadium background */}

      <Image
        src="/hero/stadium-1.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="
          z-0
          object-cover
          object-center
        "
      />

      {/* Background overlay */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          bg-gradient-to-r
          from-black/90
          via-black/75
          to-black/45
        "
      />

      {/* Social media links */}

      {configuredSocialLinks.length > 0 && (
        <nav
          aria-label="Honest Predict social media"
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            max-w-[calc(100%-1.5rem)]
            flex-wrap
            justify-end
            gap-1.5
            sm:right-5
            sm:top-4
            sm:gap-2
            lg:right-6
            lg:top-5
          "
        >
          {configuredSocialLinks.map(
            ({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className="
                  flex
                  size-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/20
                  bg-black/30
                  text-white/90
                  transition
                  hover:border-white/50
                  hover:bg-white/15
                  hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  sm:size-9
                "
              >
                <Icon
                  className="size-4"
                  aria-hidden="true"
                />
              </a>
            ),
          )}
        </nav>
      )}

      {/* Main hero content */}

      <div
        className="
          relative
          z-10
          flex
          min-h-[300px]
          flex-col
          items-start
          justify-center
          px-5
          pb-7
          pt-20
          sm:px-8
          sm:pb-8
          lg:h-full
          lg:min-h-0
          lg:px-10
          lg:py-10
          xl:px-12
        "
      >
        <div
          className="
            w-full
            max-w-xl
            space-y-3
            sm:space-y-3.5
          "
        >
          {/* Welcome badge */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-emerald-400/30
              bg-emerald-400/10
              px-3
              py-1.5
              text-[10px]
              font-semibold
              tracking-wider
              text-emerald-300
              sm:text-xs
            "
          >
            <span
              className="
                size-1.5
                rounded-full
                bg-emerald-400
              "
            />

            WELCOME TO HONEST PREDICT
          </div>

          {/* Heading */}

          <h1
            className="
              max-w-lg
              text-2xl
              font-bold
              leading-tight
              tracking-tight
              sm:text-3xl
            "
          >
            Professional Football Predictions.
          </h1>

          {/* Description */}

          <p
            className="
              max-w-md
              text-sm
              leading-relaxed
              text-white/75
              sm:text-base
            "
          >
            Accurate match analysis, confidence
            ratings and premium football insights
            every day.
          </p>

          {/* Guest actions */}

          {!authLoading && !isLoggedIn && (
            <div className="space-y-3 pt-1">
              <p
                className="
                  max-w-md
                  text-xs
                  leading-relaxed
                  text-white/65
                  sm:text-sm
                "
              >
                Join Honest Predict and discover
                football predictions backed by
                match analysis.
              </p>

              <div className="flex flex-wrap gap-2.5">
                <HeroButton
                  href="/login"
                  variant="secondary"
                >
                  Log In
                </HeroButton>

                <HeroButton href="/register">
                  Register

                  <ArrowIcon className="size-4" />
                </HeroButton>
              </div>
            </div>
          )}

          {/* Subscription loading */}

          {!authLoading &&
            isLoggedIn &&
            subscriptionLoading && (
              <div
                className="space-y-3 pt-1"
                aria-label="Loading subscription"
              >
                <div
                  className="
                    h-3
                    w-64
                    max-w-full
                    animate-pulse
                    rounded
                    bg-white/15
                  "
                />

                <div
                  className="
                    h-10
                    w-40
                    animate-pulse
                    rounded-lg
                    bg-white/10
                  "
                />
              </div>
            )}

          {/* Subscription upgrade */}

          {!authLoading &&
            isLoggedIn &&
            !subscriptionLoading &&
            upgrade && (
              <div className="space-y-3 pt-1">
                <p
                  className="
                    max-w-md
                    text-xs
                    leading-relaxed
                    text-white/65
                    sm:text-sm
                  "
                >
                  {upgrade.description}
                </p>

                <HeroButton href="/dashboard/subscriptions">
                  {upgrade.label}

                  <ArrowIcon className="size-4" />
                </HeroButton>
              </div>
            )}

          {/* Premium subscribers */}

          {!authLoading &&
            isLoggedIn &&
            !subscriptionLoading &&
            plan === 'premium' && (
              <div className="space-y-3 pt-1">
                <p
                  className="
                    max-w-md
                    text-xs
                    leading-relaxed
                    text-white/65
                    sm:text-sm
                  "
                >
                  Explore the latest football
                  predictions and match insights.
                </p>

                <HeroButton href="/predictions">
                  Explore Predictions

                  <ArrowIcon className="size-4" />
                </HeroButton>
              </div>
            )}

          {/* Subscription request failed */}

          {!authLoading &&
            isLoggedIn &&
            !subscriptionLoading &&
            plan === null && (
              <div className="space-y-3 pt-1">
                <p
                  className="
                    max-w-md
                    text-xs
                    leading-relaxed
                    text-white/65
                    sm:text-sm
                  "
                >
                  View your membership details and
                  available subscription options.
                </p>

                <HeroButton href="/dashboard/subscriptions">
                  View Subscription

                  <ArrowIcon className="size-4" />
                </HeroButton>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}