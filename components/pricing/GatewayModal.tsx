'use client';

import Image from 'next/image';

import { useState } from 'react';

import { motion } from 'framer-motion';

import {
  AlertCircle,
  ArrowRight,
  Loader2,
  X,
} from 'lucide-react';

import paymentGatewayService, {
  type PaymentGateway,
  type PaymentCurrency,
} from '@/services/payment-gateway.service';

import type { PlanConfig } from '@/types/plan-config';

import PaymentModal from './PaymentModal';

interface GatewayModalProps {
  type:
    | 'subscription'
    | 'vip_upgrade';

  target: string;
  amount: number;
  currency: PaymentCurrency;
  config: PlanConfig;
  title?: string;
  description?: string;
  onClose: () => void;
}

export default function GatewayModal({
  type,
  target,
  amount,
  currency,
  config,
  title,
  description,
  onClose,
}: GatewayModalProps) {
  const [loadingGateway, setLoadingGateway] =
    useState<PaymentGateway | null>(null);

  const [error, setError] = useState('');

  const [manualPayment, setManualPayment] =
    useState(false);

  const getDurationLabel = () => {
    if (target === 'premium') {
      return config.premiumDurationDays === 0
        ? 'Lifetime'
        : `${config.premiumDurationDays} days`;
    }

    return `${config.subscriptionDurationDays} days`;
  };

  async function initializePayment(
    gateway: PaymentGateway,
  ) {
    try {
      setError('');
      setLoadingGateway(gateway);

      const data =
        await paymentGatewayService.initializePayment({
          gateway,
          type,
          target,
          currency,
        });

      window.location.href =
        data.authorizationUrl;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        'Unable to initialize payment. Please try again.';

      setError(
        Array.isArray(message)
          ? message[0]
          : message,
      );
    } finally {
      setLoadingGateway(null);
    }
  }

  if (manualPayment) {
    return (
      <PaymentModal
        type={type}
        target={target}
        amount={amount}
        currency={currency}
        config={config}
        title={title}
        description={description}
        onClose={() => setManualPayment(false)}
      />
    );
  }

  const duration = getDurationLabel();

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-start
        justify-center
        overflow-y-auto
        bg-black/60
        p-3
        backdrop-blur-md
        sm:items-center
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.98,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        className="
          relative
          my-2
          flex
          w-full
          max-w-md
          flex-col
          overflow-hidden
          rounded-2xl
          border
          bg-background
          shadow-2xl
          sm:my-0
        "
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loadingGateway !== null}
          aria-label="Close payment modal"
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            bg-background/90
            transition
            hover:bg-muted
            disabled:opacity-50
          "
        >
          <X size={15} />
        </button>

        <div className="border-b bg-primary/5 px-5 py-5">
          <p className="pr-8 text-xs font-semibold text-primary">
            Payment
          </p>

          <h2 className="mt-1 pr-8 text-lg font-bold">
            {title ?? 'Choose Payment Method'}
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            {description ??
              'Select a payment method to continue.'}
          </p>

          <div className="mt-4 flex items-end justify-between gap-4 rounded-xl border bg-background px-4 py-3">
            <div>
              <p className="text-[11px] text-muted-foreground">
                Amount
              </p>

              {duration && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {duration}
                </p>
              )}
            </div>

            <p className="text-2xl font-black">
              {currency === 'NGN' ? '₦' : '$'}
              {amount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-3 p-5">
          <button
            type="button"
            disabled={loadingGateway !== null}
            onClick={() =>
              initializePayment('paystack')
            }
            className="
              group
              flex
              w-full
              items-center
              justify-between
              rounded-xl
              border
              bg-card
              p-3.5
              text-left
              transition
              hover:border-primary
              hover:bg-primary/5
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/gateway/paystack.png"
                  alt="Paystack"
                  width={64}
                  height={64}
                  className="h-16 w-16 max-w-none scale-150 object-contain"
                  priority
                />

                {loadingGateway === 'paystack' && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
                    <Loader2
                      size={17}
                      className="animate-spin text-primary"
                    />
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-bold">
                  Paystack
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Card, bank transfer, USSD and more.
                </p>
              </div>
            </div>

            <ArrowRight
              size={17}
              className="shrink-0 transition-transform group-hover:translate-x-1"
            />
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle
                size={15}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
            <div className="flex items-start gap-2.5">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0 text-amber-500"
              />

              <div>
                <p className="text-xs font-semibold">
                  Manual payment
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Use this fallback only after contacting an
                  admin.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setManualPayment(true)}
              disabled={loadingGateway !== null}
              className="
                mt-3
                w-full
                rounded-lg
                border
                border-amber-500/40
                bg-background
                px-3
                py-2
                text-xs
                font-semibold
                text-amber-600
                transition
                hover:bg-amber-500/10
                disabled:opacity-50
                dark:text-amber-400
              "
            >
              Proceed to Manual Payment
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loadingGateway !== null}
            className="
              w-full
              rounded-lg
              border
              px-4
              py-2.5
              text-sm
              font-medium
              transition
              hover:bg-muted
              disabled:opacity-50
            "
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
