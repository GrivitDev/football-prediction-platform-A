'use client';

type Props = {
  summary: {
    hasSubscription: boolean;
    currentPlan: string;
    status: string;
    daysRemaining: number;
    expired: boolean;
  };
};

export default function SubscriptionSummaryCard({
  summary,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">

      <h2 className="text-lg font-semibold mb-5">
        Subscription
      </h2>

      <div className="space-y-4">

        <Row
          label="Current Plan"
          value={summary.currentPlan.toUpperCase()}
        />

        <Row
          label="Status"
          value={summary.status}
        />

        <Row
          label="Days Remaining"
          value={summary.daysRemaining}
        />

        <Row
          label="Expired"
          value={summary.expired ? 'Yes' : 'No'}
        />

      </div>

    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}