'use client';

interface Props {
  prediction: string;

  probabilities?: {
    home: number;
    draw: number;
    away: number;
  } | null;

  markets?:
    | {
        market: string;
        selection?: string;
      }[]
    | null;
}

export default function PredictionContent({
  prediction,
  probabilities,
  markets,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="rounded-lg bg-green-600/10 border border-green-600 p-5">

        <p className="text-sm text-gray-400">
          Prediction
        </p>

        <h2 className="text-3xl font-bold text-green-400 mt-2">
          {prediction}
        </h2>

      </div>

      {probabilities && (
        <div className="rounded-lg bg-gray-800 p-5">

          <h3 className="text-white font-semibold mb-4">
            Probabilities
          </h3>

          <div className="space-y-2">

            <div className="flex justify-between">

              <span>Home</span>

              <span>{probabilities.home}%</span>

            </div>

            <div className="flex justify-between">

              <span>Draw</span>

              <span>{probabilities.draw}%</span>

            </div>

            <div className="flex justify-between">

              <span>Away</span>

              <span>{probabilities.away}%</span>

            </div>

          </div>

        </div>
      )}

      {!!markets?.length && (
        <div className="rounded-lg bg-gray-800 p-5">

          <h3 className="text-white font-semibold mb-4">
            Markets
          </h3>

          <div className="space-y-3">

            {markets.map((market, index) => (
              <div
                key={index}
                className="rounded bg-gray-700 p-3 flex justify-between"
              >
                <span>{market.market}</span>

                <span className="text-green-400">
                  {market.selection}
                </span>
              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}