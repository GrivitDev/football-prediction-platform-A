export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">

      {/* background FX */}
      <div className="absolute inset-0">
        {/* Dark mode glow */}
        <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-500/10 blur-[140px] rounded-full animate-pulse" />
        <div className="hidden dark:block absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full animate-pulse" />

        {/* Light mode subtle glow */}
        <div className="block dark:hidden absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-200/40 blur-[120px] rounded-full" />
        <div className="block dark:hidden absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-200/40 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-28">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-green-500 dark:text-green-400 tracking-widest text-sm animate-pulse">
            PREDICTPRO INTELLIGENCE SYSTEM
          </p>

          <h2 className="mt-4 text-4xl md:text-6xl font-black">
            Smarter Football Predictions
          </h2>

          <p className="mt-6 text-slate-600 dark:text-slate-400">
            AI-powered betting insights delivered earlier, faster, and more accurately — built for serious bettors.
          </p>
        </div>

        {/* GRID */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* VIP EARLY ACCESS */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-200/40 to-blue-200/40 dark:from-green-500/20 dark:to-blue-500/20 blur-xl rounded-2xl opacity-60 group-hover:opacity-100 transition" />

            <div className="relative border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:scale-[1.03] transition">
              <h3 className="text-xl font-bold">VIP Early Predictions</h3>

              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Get match predictions up to <span className="text-green-600 dark:text-green-400 font-semibold">3 days before kickoff</span> — gain maximum betting advantage.
              </p>

              <div className="mt-4 text-xs text-green-600 dark:text-green-400">
                EXCLUSIVE VIP ACCESS
              </div>
            </div>
          </div>

          {/* STANDARD */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200/40 to-purple-200/40 dark:from-blue-500/20 dark:to-purple-500/20 blur-xl rounded-2xl opacity-60 group-hover:opacity-100 transition" />

            <div className="relative border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:scale-[1.03] transition">
              <h3 className="text-xl font-bold">Standard Predictions</h3>

              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Regular users receive predictions <span className="text-blue-600 dark:text-blue-400 font-semibold">24 hours before matches</span>.
              </p>

              <div className="mt-4 text-xs text-blue-600 dark:text-blue-400">
                FREE / BASIC ACCESS
              </div>
            </div>
          </div>

          {/* TELEGRAM */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/40 to-green-200/40 dark:from-cyan-500/20 dark:to-green-500/20 blur-xl rounded-2xl opacity-60 group-hover:opacity-100 transition" />

            <div className="relative border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:scale-[1.03] transition">
              <h3 className="text-xl font-bold">Telegram Delivery</h3>

              <p className="mt-3 text-slate-600 dark:text-slate-400">
                VIP users receive predictions instantly on Telegram — no need to log in daily.
              </p>

              <div className="mt-4 text-xs text-cyan-600 dark:text-cyan-400">
                REAL-TIME DELIVERY SYSTEM
              </div>
            </div>
          </div>

          {/* AI ENGINE */}
          <div className="relative group md:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/40 to-pink-200/40 dark:from-purple-500/20 dark:to-pink-500/20 blur-xl rounded-2xl opacity-60 group-hover:opacity-100 transition" />

            <div className="relative border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:scale-[1.02] transition">
              <h3 className="text-xl font-bold">AI Probability Engine (VIP)</h3>

              <p className="mt-3 text-slate-600 dark:text-slate-400">
                VIP members see detailed analytics:
              </p>

              <ul className="mt-4 space-y-2 text-slate-700 dark:text-slate-300">
                <li>⚽ Win / Draw probability for each team</li>
                <li>📊 Confidence level scoring system</li>
                <li>📉 Over / Under market predictions</li>
                <li>🎯 Smart risk indicators for safer betting</li>
              </ul>

              <div className="mt-4 text-xs text-pink-600 dark:text-pink-400">
                ADVANCED BETTING INTELLIGENCE
              </div>
            </div>
          </div>

          {/* AI EDGE */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-200/40 to-cyan-200/40 dark:from-green-500/20 dark:to-cyan-500/20 blur-xl rounded-2xl opacity-60 group-hover:opacity-100 transition" />

            <div className="relative border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 hover:scale-[1.03] transition">
              <h3 className="text-xl font-bold">AI-Powered Analysis</h3>

              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Every prediction is backed by data models, form analysis, and statistical trends.
              </p>

              <div className="mt-4 text-xs text-green-600 dark:text-green-400">
                MACHINE LEARNING INSIGHTS
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}