'use client';

type Props = {
  payments: any[];
};

const money = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);

export default function PaymentHistoryTable({
  payments,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold">
          Payment History
        </h2>
      </div>

      {payments.length === 0 ? (
        <div className="p-6 text-gray-400">
          No payment history.
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-slate-950 text-gray-400 text-sm">
            <tr>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left">Type</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Status</th>
              <th className="text-left">Reference</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="border-t border-slate-800"
              >
                <td className="px-6 py-4">
                  {new Date(
                    payment.createdAt,
                  ).toLocaleDateString()}
                </td>

                <td className="capitalize">
                  {payment.type.replace('_', ' ')}
                </td>

                <td>{money(payment.amount)}</td>

                <td>
                  <span
                    className={`capitalize ${
                      payment.status === 'approved'
                        ? 'text-green-400'
                        : payment.status === 'pending'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td className="font-mono text-xs">
                  {payment.reference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}