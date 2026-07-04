'use client';

import { useEffect, useState } from 'react';
import PlanConfigPanel from '@/components/admin/subscriptions/PlanConfigPanel';
import PaymentsReviewPanel from '@/components/admin/subscriptions/PaymentsReviewPanel';
import BankDetailsPanel from '@/components/admin/subscriptions/BankDetailsPanel';

export default function AdminSubscriptionsPage() {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const t = localStorage.getItem('token') || '';
    setToken(t);
  }, []);

  if (!token) {
    return <p>Loading admin session...</p>;
  }

  return (
    <div className="p-6 space-y-10">
      <PlanConfigPanel token={token} />
      <BankDetailsPanel token={token} />
      <PaymentsReviewPanel token={token} />
    </div>
  );
}