'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Wallet,
  XCircle,
} from 'lucide-react';

import toast from 'react-hot-toast';

import {
  getPendingPayments,
  approvePayment,
  rejectPayment,
} from '@/services/admin-payments.service';

import { useAdminRealtime } from '@/hooks/useAdminRealtime';

interface PaymentItem {
  _id: string;
  type: string;
  target?: string;
  amount: number;
  currency?: 'NGN' | 'USD';
  email: string;
  reference?: string;
  transferReference?: string;
  proofImageUrl?: string;
  proofMessage?: string;
}

export default function PaymentsReviewPanel({
  token,
}: {
  token: string;
}) {
  const [payments, setPayments] =
    useState<PaymentItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] =
    useState<string | null>(null);

  async function load() {
    try {
      const data =
        await getPendingPayments(token);

      setPayments(data);
    } catch {
      toast.error(
        'Unable to load pending payments.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [token]);

  useAdminRealtime((event, data) => {
    if (event === 'payment:new') {
      setPayments((prev) => [
        data,
        ...prev,
      ]);

      toast.success('New payment received.');
    }

    if (event === 'payment:update') {
      setPayments((prev) =>
        prev.filter(
          (payment) =>
            payment._id !== data._id,
        ),
      );
    }
  });

  async function approve(id: string) {
    try {
      setProcessing(id);

      await approvePayment(token, id);

      toast.success('Payment approved.');
      await load();
    } catch {
      toast.error(
        'Failed to approve payment.',
      );
    } finally {
      setProcessing(null);
    }
  }

  async function reject(id: string) {
    try {
      setProcessing(id);

      await rejectPayment(token, id);

      toast.success('Payment rejected.');
      await load();
    } catch {
      toast.error(
        'Failed to reject payment.',
      );
    } finally {
      setProcessing(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card/70 p-4">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-28 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card/70 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Wallet className="h-4 w-4 text-primary" />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Pending Payments
            </p>

            <p className="text-[11px] text-muted-foreground">
              Review manual submissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border bg-orange-500/10 px-2.5 py-1 text-[11px] text-orange-600">
          <Clock3 className="h-3 w-3" />
          {payments.length}
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed p-8 text-center">
          <CheckCircle2 className="mx-auto h-7 w-7 text-green-500" />

          <p className="mt-2 text-sm font-semibold">
            No pending payments
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Everything has been reviewed.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {payments.map((payment) => {
            const currency =
              payment.currency ?? 'NGN';

            const symbol =
              currency === 'USD' ? '$' : '₦';

            const target =
              payment.target
                ? payment.target === 'premium'
                  ? 'Premium'
                  : payment.target === 'vip'
                    ? 'VIP'
                    : payment.target === 'regular'
                      ? 'Regular'
                      : payment.target
                : payment.type;

            return (
              <div
                key={payment._id}
                className="rounded-xl border bg-background/40 p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Pending approval
                    </div>

                    <p>
                      <span className="text-muted-foreground">
                        Plan:
                      </span>{' '}
                      {target}
                    </p>

                    <p>
                      <span className="text-muted-foreground">
                        Amount:
                      </span>{' '}
                      {symbol}
                      {Number(
                        payment.amount ?? 0,
                      ).toLocaleString()}
                    </p>

                    <p className="break-all">
                      <span className="text-muted-foreground">
                        User:
                      </span>{' '}
                      {payment.email}
                    </p>

                    {payment.transferReference && (
                      <p className="break-all">
                        <span className="text-muted-foreground">
                          Reference:
                        </span>{' '}
                        {payment.transferReference}
                      </p>
                    )}

                    {payment.proofMessage && (
                      <p className="pt-1 text-muted-foreground">
                        {payment.proofMessage}
                      </p>
                    )}
                  </div>

                  {payment.proofImageUrl && (
                    <a
                      href={payment.proofImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        relative
                        h-28
                        w-full
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        border
                        lg:w-40
                      "
                    >
                      <Image
                        src={payment.proofImageUrl}
                        alt="Payment proof"
                        fill
                        className="object-cover"
                      />

                      <ExternalLink className="absolute right-2 top-2 h-4 w-4 rounded bg-background p-0.5" />
                    </a>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={
                      processing === payment._id
                    }
                    onClick={() =>
                      approve(payment._id)
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      bg-green-600
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-white
                      transition
                      hover:bg-green-500
                      disabled:opacity-50
                    "
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve
                  </button>

                  <button
                    type="button"
                    disabled={
                      processing === payment._id
                    }
                    onClick={() =>
                      reject(payment._id)
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      bg-destructive
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-white
                      transition
                      hover:opacity-90
                      disabled:opacity-50
                    "
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}