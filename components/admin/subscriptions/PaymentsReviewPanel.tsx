'use client';

import { useEffect, useState } from 'react';
import {
  getPendingPayments,
  approvePayment,
  rejectPayment,
} from '@/services/admin-payments.service';
import { useAdminRealtime } from '@/hooks/useAdminRealtime';
import { toast } from 'react-hot-toast';

export default function PaymentsReviewPanel({ token }: { token: string }) {
  const [payments, setPayments] = useState<any[]>([]);

  const load = async () => {
    const data = await getPendingPayments(token);
    setPayments(data);
  };

  useEffect(() => {
    load();
  }, []);
useAdminRealtime((event, data) => {
  if (event === 'payment:new') {
    setPayments((prev) => [data, ...prev]);
    toast.success('New payment received 💰');
  }

  if (event === 'payment:update') {
    setPayments((prev) =>
      prev.map((p) => (p._id === data._id ? data : p)),
    );
  }
});
  const approve = async (id: string) => {
    await approvePayment(token, id);
    await load();
  };

  const reject = async (id: string) => {
    await rejectPayment(token, id);
    await load();
  };

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold">Pending Payments</h2>

      {payments.map((p) => (
        <div key={p._id} className="border p-3 rounded">
          <p>Type: {p.type}</p>
          <p>Amount: {p.amount}</p>
          <p>User: {p.email}</p>
          <p>Status: {p.status}</p>

          {p.proofImageUrl && (
            <img src={p.proofImageUrl} className="w-40 mt-2" />
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => approve(p._id)}
              className="bg-green-600 text-white px-3 py-1"
            >
              Approve
            </button>

            <button
              onClick={() => reject(p._id)}
              className="bg-red-600 text-white px-3 py-1"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}