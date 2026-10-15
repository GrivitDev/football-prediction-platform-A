'use client';

import { useState } from 'react';

import {
  CheckCircle2,
  Loader2,
  UploadCloud,
  X,
} from 'lucide-react';

import api from '@/lib/axios';

import type { PlanConfig } from '@/types/plan-config';
import type { PaymentCurrency } from '@/services/payment-gateway.service';

import PaymentProofUpload from './PaymentProofUpload';

interface PaymentModalProps {
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

export default function PaymentModal({
  type,
  target,
  amount,
  currency,
  config,
  title,
  description,
  onClose,
}: PaymentModalProps) {
  const [transferReference, setTransferReference] =
    useState('');

  const [proofMessage, setProofMessage] =
    useState('');

  const [proof, setProof] = useState<{
    url: string;
    publicId: string;
  } | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const bankDetails =
    currency === 'USD'
      ? config.bankDetailsUSD
      : config.bankDetails;

  const paymentLabel =
    target === 'premium'
      ? config.planLabels.premium
      : target === 'vip'
        ? config.planLabels.vip
        : config.planLabels.regular;

  const duration =
    target === 'premium'
      ? config.premiumDurationDays === 0
        ? 'Lifetime'
        : `${config.premiumDurationDays} days`
      : `${config.subscriptionDurationDays} days`;

  async function submitPayment() {
    setError('');

    if (!transferReference.trim()) {
      setError(
        'Please enter your payment reference or sender name.',
      );
      return;
    }

    if (!proof) {
      setError(
        'Please upload your payment screenshot before submitting.',
      );
      return;
    }

    try {
      setLoading(true);

      await api.post('/payments', {
        type,
        target,
        currency,
        transferReference:
          transferReference.trim(),
        proofMessage:
          proofMessage.trim(),
        proofImageUrl: proof.url,
        proofPublicId: proof.publicId,
      });

      setSuccess(true);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Unable to submit payment. Please try again.';

      setError(
        Array.isArray(message)
          ? message[0]
          : message,
      );
    } finally {
      setLoading(false);
    }
  }

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
      <div
        className="
          relative
          my-2
          flex
          max-h-[calc(100vh-1.5rem)]
          w-full
          max-w-lg
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
          className="
            absolute
            right-3
            top-3
            z-10
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            bg-background/90
            hover:bg-muted
          "
        >
          <X size={15} />
        </button>

        <div className="min-h-0 overflow-y-auto p-5">
          {success ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2
                  size={34}
                  className="text-green-500"
                />
              </div>

              <h2 className="mt-4 text-xl font-bold">
                Payment Submitted
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Your payment is waiting for admin approval.
                Your account will update after approval.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              <div className="border-b pb-5 pr-8">
                <p className="text-xs font-semibold text-primary">
                  {paymentLabel}
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {title || 'Complete Payment'}
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                  {description ||
                    'Transfer the amount below and upload your payment proof.'}
                </p>

                <div className="mt-3 rounded-xl border bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
                  Payment activation occurs after admin
                  confirmation.
                </div>
              </div>

              <div className="mt-4 rounded-xl border bg-primary/5 p-4">
                <p className="text-xs text-muted-foreground">
                  Amount to pay ({currency})
                </p>

                <p className="mt-1 text-3xl font-black">
                  {currency === 'USD' ? '$' : '₦'}
                  {amount.toLocaleString()}
                </p>

                {duration && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Valid for {duration}
                  </p>
                )}
              </div>

              <div className="mt-4 rounded-xl border p-4">
                <p className="text-sm font-semibold">
                  Bank Transfer
                </p>

                <div className="mt-3 space-y-2 text-xs leading-5">
                  <p>
                    <span className="text-muted-foreground">
                      Bank:
                    </span>{' '}
                    {bankDetails.bankName}
                  </p>

                  <p>
                    <span className="text-muted-foreground">
                      Account:
                    </span>{' '}
                    {bankDetails.accountName}
                  </p>

                  <p>
                    <span className="text-muted-foreground">
                      Number:
                    </span>{' '}
                    {bankDetails.accountNumber}
                  </p>

                  {bankDetails.instructions && (
                    <p className="pt-1 text-muted-foreground">
                      {bankDetails.instructions}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <PaymentProofUpload
                  onUpload={(data) => {
                    setProof(data);
                    setError('');
                  }}
                />

                <input
                  value={transferReference}
                  onChange={(e) => {
                    setTransferReference(
                      e.target.value,
                    );
                    setError('');
                  }}
                  placeholder="Transfer reference / sender name"
                  className="
                    w-full
                    rounded-xl
                    border
                    bg-muted/30
                    px-3
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-primary
                    focus:bg-background
                    focus:ring-4
                    focus:ring-primary/10
                  "
                />

                <textarea
                  value={proofMessage}
                  onChange={(e) =>
                    setProofMessage(e.target.value)
                  }
                  placeholder="Additional information (optional)"
                  className="
                    min-h-24
                    w-full
                    resize-none
                    rounded-xl
                    border
                    bg-muted/30
                    px-3
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-primary
                    focus:bg-background
                    focus:ring-4
                    focus:ring-primary/10
                  "
                />
              </div>

              {error && (
                <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                  {error}
                </div>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={submitPayment}
                className="
                  mt-4
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-primary
                  text-sm
                  font-bold
                  text-primary-foreground
                  transition
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <UploadCloud size={17} />
                    Submit Payment
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
