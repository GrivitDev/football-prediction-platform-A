'use client';

type Props = {
  purchases: any[];
};

const money = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

export default function PurchaseHistoryTable({
  purchases,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold">
          Prediction Purchases
        </h2>
      </div>

      {purchases.length === 0 ? (
        <div className="p-6 text-gray-400">
          No purchases found.
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-slate-950 text-gray-400">
            <tr>
              <th className="text-left px-6 py-3">
                Date
              </th>

              <th className="text-left">
                Prediction
              </th>

              <th className="text-left">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {purchases.map((purchase) => (
              <tr
                key={purchase._id}
                className="border-t border-slate-800"
              >
                <td className="px-6 py-4">
                  {new Date(
                    purchase.createdAt,
                  ).toLocaleDateString()}
                </td>

                <td>
                  {purchase.predictionId?.title ??
                    'Deleted Prediction'}
                </td>

                <td>
                  {money(purchase.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}