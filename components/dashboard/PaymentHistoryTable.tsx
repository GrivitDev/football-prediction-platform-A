'use client';

import { useState } from 'react';
import { getPaymentStatusColor } from '@/lib/payment-status';

export default function PaymentHistoryTable({ payments }: any) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2">

      {payments?.map((p: any) => (
        <div
          key={p._id}
          className="bg-gray-900 rounded p-4"
        >

          {/* ROW HEADER */}
          <div
            className="flex justify-between cursor-pointer"
            onClick={() =>
              setOpenId(openId === p._id ? null : p._id)
            }
          >

            <div>
              <p className="text-white capitalize">
                {p.type}
              </p>
              <p className="text-xs text-gray-400">
                ₦{p.amount} • {p.reference}
              </p>
            </div>

            <span
              className={`px-2 py-1 rounded text-xs ${getPaymentStatusColor(
                p.status,
              )}`}
            >
              {p.status}
            </span>

          </div>

          {/* EXPANDED */}
          {openId === p._id && (
            <div className="mt-3 text-sm text-gray-400 space-y-2">

              {p.proofMessage && (
                <p>
                  <strong>Message:</strong> {p.proofMessage}
                </p>
              )}

              {p.transferReference && (
                <p>
                  <strong>Transfer Ref:</strong>{' '}
                  {p.transferReference}
                </p>
              )}

              {p.adminNote && (
                <p className="text-red-400">
                  <strong>Admin Note:</strong> {p.adminNote}
                </p>
              )}

              {p.proofImageUrl && (
                <img
                  src={p.proofImageUrl}
                  className="w-40 rounded mt-2"
                />
              )}

            </div>
          )}

        </div>
      ))}

    </div>
  );
}