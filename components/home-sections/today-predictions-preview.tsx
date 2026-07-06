'use client';

import Link from 'next/link';

type PredictionPreview = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  leagueCode: string;
  confidence: number;
};

const mockPredictions: PredictionPreview[] = [
  { id: '1', homeTeam: 'Arsenal', awayTeam: 'Chelsea', leagueCode: 'EPL', confidence: 82 },
  { id: '2', homeTeam: 'Barcelona', awayTeam: 'Sevilla', leagueCode: 'La Liga', confidence: 76 },
  { id: '3', homeTeam: 'Inter Milan', awayTeam: 'AC Milan', leagueCode: 'Serie A', confidence: 88 },
  { id: '4', homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', leagueCode: 'Bundesliga', confidence: 79 },
];

const getCtaLink = (isLoggedIn: boolean) =>
  isLoggedIn ? '/vip' : '/register';

export default function TodayPredictionsPreview({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">

      {/* background glow */}
      <div className="absolute inset-0">

        {/* DARK GLOW */}
        <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full animate-pulse" />

        {/* LIGHT GLOW */}
        <div className="block dark:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-200/40 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-28">

        {/* HEADER */}
        <div className="text-center">
          <p className="text-green-600 dark:text-green-400 tracking-widest animate-pulse">
            TODAY'S PICKS
          </p>

          <h2 className="mt-4 text-4xl md:text-6xl font-black">
            Live Football Predictions
          </h2>

          <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            AI-analyzed matches for today. VIP users unlock deeper insights, probabilities, and betting markets.
          </p>
        </div>

        {/* CARDS */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {mockPredictions.map((match) => (
            <div
              key={match.id}
              className="relative group"
            >

              {/* hover glow */}
              <div className="absolute inset-0 bg-green-200/40 dark:bg-green-500/10 opacity-0 group-hover:opacity-100 blur-xl transition rounded-2xl" />

              <div className="relative border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-5 hover:scale-[1.03] transition">

                {/* LEAGUE */}
                <p className="text-xs text-slate-500 dark:text-slate-400 tracking-widest">
                  {match.leagueCode}
                </p>

                {/* TEAMS */}
                <h3 className="mt-3 text-lg font-bold">
                  {match.homeTeam}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm">vs</p>

                <h3 className="text-lg font-bold">
                  {match.awayTeam}
                </h3>

                {/* CONFIDENCE */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Confidence</span>
                    <span>{isLoggedIn ? `${match.confidence}%` : 'Locked'}</span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{
                        width: isLoggedIn ? `${match.confidence}%` : '40%',
                        filter: isLoggedIn ? 'none' : 'blur(2px)',
                      }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={getCtaLink(isLoggedIn)}
                  className="mt-6 inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white transition py-2 rounded-xl font-semibold"
                >
                  {isLoggedIn ? 'View VIP Insights' : 'Unlock Predictions'}
                </Link>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}