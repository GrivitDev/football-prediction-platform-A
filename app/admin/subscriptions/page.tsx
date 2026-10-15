'use client';

import { useEffect, useState } from 'react';

import {
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

import PlanConfigPanel from '@/components/admin/subscriptions/PlanConfigPanel';
import PaymentsReviewPanel from '@/components/admin/subscriptions/PaymentsReviewPanel';
import BankDetailsPanel from '@/components/admin/subscriptions/BankDetailsPanel';

export default function AdminSubscriptionsPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(
      localStorage.getItem('token') || '',
    );

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-4">
        <div className="rounded-xl border bg-card p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />

          <h2 className="mt-3 text-base font-semibold">
            Admin Session Required
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Please login again to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 overflow-hidden p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            Subscription Management
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">
            Plans, bank details and payment approvals.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-[11px] text-green-600">
          <CheckCircle2 className="h-3 w-3" />
          Operational
        </div>
      </div>

      <section>
        <SectionTitle title="Plan Configuration" />
        <PlanConfigPanel token={token} />
      </section>

      <section>
        <SectionTitle title="Bank Configuration" />
        <BankDetailsPanel token={token} />
      </section>

      <section>
        <SectionTitle title="Payment Verification" />
        <PaymentsReviewPanel token={token} />
      </section>
    </div>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <div className="mb-2">
      <h2 className="text-sm font-semibold">
        {title}
      </h2>
    </div>
  );
}