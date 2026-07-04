'use client';

interface LockedCardProps {
  loading: boolean;
  price: number;
  message?: string;
  onUpgrade: () => void;
  onBuy: () => void;
}

export default function LockedCard({
  loading,
  price,
  message,
  onUpgrade,
  onBuy,
}: LockedCardProps) {
  return (
    <div className="rounded-xl border border-yellow-500 bg-yellow-500/10 p-5">

      <h3 className="text-yellow-400 font-semibold">
        🔒 Prediction Locked
      </h3>

      <p className="text-gray-400 mt-2">
        {message}
      </p>

      <div className="mt-5 rounded-lg bg-gray-800 p-4">

        <p className="text-white font-semibold">
          Unlock to access:
        </p>

        <ul className="mt-3 space-y-2 text-gray-400 text-sm">

          <li>✓ Full prediction</li>

          <li>✓ AI probabilities</li>

          <li>✓ Betting markets</li>

        </ul>

      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">

        <button
          onClick={onUpgrade}
          className="rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 transition"
        >
          Upgrade
        </button>

        <button
          disabled={loading}
          onClick={onBuy}
          className="rounded-lg bg-yellow-500 py-3 font-semibold text-black hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Buy ₦${price}`}
        </button>

      </div>

    </div>
  );
}