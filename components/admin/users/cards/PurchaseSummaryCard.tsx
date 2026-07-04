'use client';

type Props = {
  summary: {
    totalPurchases: number;
    totalSpent: number;
  };
};

const money = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

export default function PurchaseSummaryCard({
  summary,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">

      <h2 className="text-lg font-semibold mb-5">
        Prediction Purchases
      </h2>

      <div className="space-y-5">

        <div>
          <p className="text-gray-400">
            Purchased Predictions
          </p>

          <p className="text-3xl font-bold">
            {summary.totalPurchases}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Total Spent
          </p>

          <p className="text-2xl font-bold">
            {money(summary.totalSpent)}
          </p>
        </div>

      </div>

    </div>
  );
}