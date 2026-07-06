export default function WhyChooseFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">

      {/* futuristic background glow */}
      <div className="absolute inset-0">

        {/* DARK MODE GLOW */}
        <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="hidden dark:block absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full animate-pulse" />

        {/* LIGHT MODE GLOW */}
        <div className="block dark:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-200/40 blur-[140px] rounded-full" />
        <div className="block dark:hidden absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-200/40 blur-[140px] rounded-full" />

      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-28">

        {/* ===================== */}
        {/* WHY CHOOSE US */}
        {/* ===================== */}

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-green-600 dark:text-green-400 tracking-widest animate-pulse">
            WHY PREDICTPRO
          </p>

          <h2 className="mt-4 text-4xl md:text-6xl font-black">
            Built for Serious Bettors
          </h2>

          <p className="mt-6 text-slate-600 dark:text-slate-400">
            We don’t guess matches — we analyze them using data, probability models, and performance trends.
          </p>
        </div>

        {/* FEATURE GRID */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:scale-[1.03] transition">
            <h3 className="text-lg font-bold">3-Day VIP Advantage</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              VIP users receive predictions up to 3 days before kickoff — giving them early betting edge.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:scale-[1.03] transition">
            <h3 className="text-lg font-bold">Telegram Delivery System</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Predictions are sent directly to Telegram for instant access — no need to log in daily.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:scale-[1.03] transition">
            <h3 className="text-lg font-bold">AI Probability Engine</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              We analyze win/draw probabilities, confidence levels, and market trends.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:scale-[1.03] transition">
            <h3 className="text-lg font-bold">Smart Market Predictions</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Over/Under, Both Teams to Score, and more advanced betting markets included for VIP.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:scale-[1.03] transition md:col-span-2">
            <h3 className="text-lg font-bold">Built for Winning Consistency</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Our system is designed to help bettors make consistent, data-driven decisions — not guesses.
            </p>
          </div>

        </div>

        {/* ===================== */}
        {/* FINAL CTA */}
        {/* ===================== */}

        <div className="mt-24 text-center relative">

          {/* glow behind CTA */}
          <div className="absolute inset-0 flex justify-center">
            <div className="w-[400px] h-[400px] bg-green-200/40 dark:bg-green-500/20 blur-[120px] rounded-full animate-pulse" />
          </div>

          <div className="relative border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl px-10 py-16 transition-colors">

            <h3 className="text-3xl md:text-5xl font-black">
              Ready to Start Winning?
            </h3>

            <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Join PredictPro today and unlock Intelligent football predictions, VIP early access, and Telegram delivery.
            </p>

            <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">

              <a
                href="/register"
                className="bg-green-600 hover:bg-green-700 text-white transition px-8 py-4 rounded-xl font-semibold"
              >
                Get Started Free
              </a>

              <a
                href="/vip"
                className="border border-slate-300 dark:border-white/20 hover:border-slate-400 dark:hover:border-white/40 transition px-8 py-4 rounded-xl font-semibold"
              >
                Go VIP Now
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}