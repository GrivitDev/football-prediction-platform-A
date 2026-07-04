'use client';

export default function PurchasedPredictionsTable({
  purchases,
}: any) {
  return (
    <div className="bg-slate-900 rounded-xl p-4">

      <h2 className="text-white font-bold mb-4">
        Purchased Predictions
      </h2>

      {(!purchases || purchases.length === 0) && (
        <p className="text-slate-400 text-sm">
          No purchased predictions yet
        </p>
      )}

      <div className="space-y-3">

        {purchases?.map((p: any) => {
          const pred = p.predictionId;

          return (
            <div
              key={p._id}
              className="flex justify-between items-center bg-slate-800 p-3 rounded-lg"
            >

              {/* MATCH INFO */}
              <div>
                <p className="text-white font-medium">
                  {pred?.homeTeam} vs {pred?.awayTeam}
                </p>

                <p className="text-xs text-slate-400">
                  {pred?.leagueCode || 'Unknown League'}
                </p>
              </div>

              {/* RIGHT SIDE */}
              <div className="text-right">

                <p className="text-green-400 font-bold">
                  ₦{p.amount}
                </p>

                <p className="text-xs text-slate-400">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}