'use client';

import { PLANS } from '@/lib/plans';
import { paymentService } from '@/services/payment.service';
import { useState } from 'react';

export default function UpgradePlanCard({ plan }: any) {
  const [loading, setLoading] = useState(false);

const createPayment = async (target: string) => {
  try {
    setLoading(true);

    await paymentService.createPayment({
      type: 'subscription',
      target,
    });

    alert('Payment request submitted');

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* REGULAR */}
      <div className="p-6 bg-gray-900 rounded-xl">
        <h3 className="text-white text-xl font-bold">
          Regular Plan
        </h3>

        <p className="text-green-400 font-bold mt-2">
          ₦{PLANS.regular.price}
        </p>

        <ul className="text-gray-400 text-sm mt-3 space-y-1">
          {PLANS.regular.features.map((f) => (
            <li key={f}>• {f}</li>
          ))}
        </ul>

        <button
          disabled={plan !== 'free' || loading}
          onClick={() =>
            createPayment('regular')
          }
          className="mt-4 w-full bg-blue-600 disabled:opacity-50 py-2 rounded"
        >
          {plan === 'free' ? 'Upgrade' : 'Not Available'}
        </button>
      </div>

      {/* VIP */}
      <div className="p-6 bg-gray-900 rounded-xl border border-yellow-500">
        <h3 className="text-white text-xl font-bold">
          VIP Plan
        </h3>

        <p className="text-yellow-400 font-bold mt-2">
          ₦{PLANS.vip.price}
        </p>

        <ul className="text-gray-400 text-sm mt-3 space-y-1">
          {PLANS.vip.features.map((f) => (
            <li key={f}>• {f}</li>
          ))}
        </ul>

        <button
          disabled={loading || plan === 'vip'}
          onClick={() =>
            createPayment('vip')
          }
          className="mt-4 w-full bg-yellow-500 text-black py-2 rounded"
        >
          {plan === 'vip' ? 'Current Plan' : 'Upgrade to VIP'}
        </button>
      </div>

    </div>
  );
}