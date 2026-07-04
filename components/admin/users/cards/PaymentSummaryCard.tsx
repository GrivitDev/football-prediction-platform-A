'use client';

type Props = {
  summary: {
    totalRevenue: number;
    subscriptionRevenue: number;
    predictionRevenue: number;
    totalPayments: number;
    approvedPayments: number;
    pendingPayments: number;
    rejectedPayments: number;
  };
};

const money = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

export default function PaymentSummaryCard({
  summary,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
      <h2 className="text-lg font-semibold mb-5">
        Payment Summary
      </h2>

      <div className="grid grid-cols-2 gap-5">

        <Stat
          label="Total Revenue"
          value={money(summary.totalRevenue)}
        />

        <Stat
          label="Subscription Revenue"
          value={money(summary.subscriptionRevenue)}
        />

        <Stat
          label="Prediction Revenue"
          value={money(summary.predictionRevenue)}
        />

        <Stat
          label="Payments"
          value={summary.totalPayments}
        />

        <Stat
          label="Approved"
          value={summary.approvedPayments}
        />

        <Stat
          label="Pending"
          value={summary.pendingPayments}
        />

        <Stat
          label="Rejected"
          value={summary.rejectedPayments}
        />

      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-sm text-gray-400">
        {label}
      </p>

      <p className="text-xl font-bold">
        {value}
      </p>
    </div>
  );
}