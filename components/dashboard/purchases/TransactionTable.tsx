'use client';

import {
  CreditCard,
  Crown,
  Sparkles,
  Wallet,
} from 'lucide-react';

import { StatusBadge } from '@/components/dashboard/shared/StatusBadge';
import { EmptyState } from '@/components/dashboard/shared/EmptyState';

interface Props {
  loading: boolean;
  payments: any[];
}

function isSubscriptionPayment(payment: any) {
  return payment?.type === 'subscription' || payment?.type === 'vip_upgrade';
}

export default function TransactionTable({ loading, payments }: Props) {
  if (loading) return null;

  // Protect the payment history UI from old records created under the removed
  // single-prediction purchase model, even if a caller passes them in.
  const visiblePayments = (Array.isArray(payments) ? payments : []).filter(
    isSubscriptionPayment,
  );

  if (!visiblePayments.length) {
    return (
      <EmptyState
        icon={Wallet}
        title="No transactions yet"
        description="Your subscription payments will appear here after submission."
      />
    );
  }

  function getType(payment: any) {
    return payment.type === 'subscription' ? 'Subscription' : 'VIP Upgrade';
  }

  function getItem(payment: any) {
    return payment.type === 'subscription'
      ? `${payment.target?.toUpperCase() || 'SUBSCRIPTION'} Plan`
      : 'VIP Plan';
  }

  function getPlanIcon(payment: any) {
    if (payment.target === 'premium') return Sparkles;
    if (payment.target === 'vip' || payment.type === 'vip_upgrade') return Crown;
    return CreditCard;
  }

  function formatAmount(amount: number, currency: 'NGN' | 'USD') {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(date: string) {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
      ? '—'
      : parsed.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
  }

  return (
    <div className="space-y-3">
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-muted/30 text-muted-foreground">
              {['Type', 'Item', 'Amount', 'Status', 'Date'].map((header) => (
                <th key={header} className="px-3 py-2.5 text-left text-[11px] font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiblePayments.map((payment) => {
              const currency = payment.currency === 'USD' ? 'USD' : 'NGN';
              return (
                <tr key={payment._id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-3 py-2.5 font-medium">{getType(payment)}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{getItem(payment)}</td>
                  <td className="px-3 py-2.5 font-semibold">
                    {formatAmount(Number(payment.amount || 0), currency)}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {formatDate(payment.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 md:hidden">
        {visiblePayments.map((payment) => {
          const Icon = getPlanIcon(payment);
          const currency = payment.currency === 'USD' ? 'USD' : 'NGN';

          return (
            <div key={payment._id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{getType(payment)}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{getItem(payment)}</p>
                  </div>
                </div>
                <StatusBadge status={payment.status} />
              </div>
              <div className="mt-3 flex items-end justify-between gap-3 border-t pt-2.5">
                <div>
                  <p className="text-[10px] text-muted-foreground">Amount</p>
                  <p className="mt-0.5 text-base font-semibold">
                    {formatAmount(Number(payment.amount || 0), currency)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Date</p>
                  <p className="mt-0.5 text-xs font-medium">{formatDate(payment.createdAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
