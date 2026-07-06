export default function ArticlesPreview() {
  return (
    <section className="relative overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">

      {/* background glow */}
      <div className="absolute inset-0">
        {/* DARK MODE GLOW */}
        <div className="hidden dark:block absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="hidden dark:block absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />

        {/* LIGHT MODE GLOW */}
        <div className="block dark:hidden absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-200/40 blur-[120px] rounded-full" />
        <div className="block dark:hidden absolute bottom-0 right-0 w-[350px] h-[350px] bg-blue-200/40 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-28 flex flex-col items-center text-center">

        {/* badge */}
        <div className="px-4 py-2 border border-green-300 dark:border-green-500/30 rounded-full text-green-600 dark:text-green-400 text-sm tracking-widest animate-pulse">
          ARTICLES
        </div>

        {/* main text */}
        <h2 className="mt-6 text-4xl md:text-6xl font-black">
          Professional Football Insights
        </h2>

        <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-2xl">
          Deep analysis, betting strategies, match breakdowns, and winning predictions — built for serious bettors.
        </p>

        {/* holographic card */}
        <div className="mt-12 relative">

          <div className="absolute inset-0 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 dark:from-green-500/20 dark:via-blue-500/20 dark:to-purple-500/20 blur-2xl animate-pulse rounded-2xl" />

          <div className="relative border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl px-10 py-16 rounded-2xl transition-colors">

            <div className="text-2xl md:text-4xl font-extrabold tracking-widest">
              COMING SOON
            </div>

            <div className="mt-4 text-slate-600 dark:text-slate-400">
              PredictPro Insights Hub is under construction
            </div>

            {/* animated dots */}
            <div className="mt-6 flex justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}