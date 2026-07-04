import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-28">
        <div className="max-w-3xl">
          <p className="text-green-400 font-semibold mb-4">
            Trusted Football Predictions
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Win More With Smart Football Predictions ⚽
          </h1>

          <p className="mt-6 text-slate-400 text-lg">
            Get daily football predictions,
            VIP tips, premium locked
            tickets, live scores, and
            winning analysis from expert
            predictors.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="bg-green-600 hover:bg-green-700 transition px-8 py-4 rounded-xl font-semibold"
            >
              Get Started
            </Link>

            <Link
              href="#premium"
              className="border border-slate-700 hover:border-slate-500 transition px-8 py-4 rounded-xl"
            >
              View Premium Tips
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-10">
            <div>
              <h2 className="text-3xl font-bold">
                98%
              </h2>

              <p className="text-slate-400">
                Winning Accuracy
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                50K+
              </h2>

              <p className="text-slate-400">
                Active Users
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                24/7
              </h2>

              <p className="text-slate-400">
                Live Updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}