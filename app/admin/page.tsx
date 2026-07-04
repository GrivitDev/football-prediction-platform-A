'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardAnalytics } from '@/services/admin.service';

// =========================
// CARD COMPONENT
// =========================
function Card({
  title,
  value,
  sub,
  green,
}: {
  title: string;
  value: string | number;
  sub?: string;
  green?: boolean;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <p className="text-slate-400 text-sm">{title}</p>

      <h2
        className={`mt-3 text-3xl font-black ${
          green ? 'text-green-400' : 'text-white'
        }`}
      >
        {value}
      </h2>

      {sub && (
        <p className="text-xs text-slate-500 mt-2">{sub}</p>
      )}
    </div>
  );
}

// =========================
// MAIN DASHBOARD
// =========================
export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getDashboardAnalytics,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-32 bg-slate-800 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Failed to load dashboard: {(error as any)?.message}
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-black">
          Admin Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Football prediction platform overview
        </p>
      </div>

      {/* =========================
          USERS & SUBSCRIPTIONS
      ========================= */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-300">
          Users & Subscriptions
        </h2>

<div className="grid gap-6 md:grid-cols-4">
  <Card title="Total Users" value={data?.totalUsers || 0} />

  <Card title="Total Predictions" value={data?.totalPredictions || 0} />

  <Card title="Total Subscriptions" value={data?.totalSubscriptions || 0} />
</div>
      </section>

      {/* =========================
          PAYMENTS
          ========================= */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-300">
          Payments & Revenue
        </h2>

        <div className="grid gap-6 md:grid-cols-4">
          <Card
            title="Total Payments"
            value={data?.totalPaymentsCount || 0}
            sub="Number of transactions"
          />
          <Card
            title="Total Revenue"
            value={`₦${Number(data?.totalRevenue || 0).toLocaleString()}`}
            green
          />
        </div>
      </section>

      {/* =========================
          PREDICTION OUTCOMES
          ========================= */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-300">
          Prediction Outcomes
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Won Predictions" value={data?.wonPredictions || 0} green />
          <Card title="Lost Predictions" value={data?.lostPredictions || 0} />
          <Card title="Void Predictions" value={data?.voidPredictions || 0} />
        </div>
      </section>

      {/* =========================
          PREDICTION TYPES
      ========================= */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-300">
          Prediction Access Types
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Free Predictions" value={data?.freePredictions || 0} />
          <Card title="Regular Predictions" value={data?.regularPredictions || 0} />
          <Card title="VIP Predictions" value={data?.vipPredictions || 0} />
        </div>
      </section>

      {/* =========================
          PERFORMANCE
      ========================= */}
      <section className="space-y-6">

        {/* BEST BETS */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-300">
            🔥 Best Bets of the Day
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {data?.topPredictions?.map((p: any) => (
              <div
                key={p._id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl"
              >
                <p className="font-bold">
                  {p.homeTeam} vs {p.awayTeam}
                </p>

                <p className="text-green-400 text-sm mt-2">
                  Confidence: {p.confidence}%
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {p.prediction}
                </p>
              </div>
            ))}
          </div>
        </div>

          <div className="grid gap-6 md:grid-cols-3 mt-6">
            <Card title="Free Subscribers" value={data?.freeUsers || 0} />
            <Card title="Regular Subscribers" value={data?.regularUsers || 0} />
            <Card title="VIP Subscribers" value={data?.vipUsers || 0} />
          </div>
        {/* TOP USERS */}
        <div className="grid gap-6 md:grid-cols-2">

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <h3 className="font-bold mb-3">🏆 Top VIP Subscriber</h3>
            <p className="text-slate-300">
              {data?.topVipUser?.email || '-'}
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <h3 className="font-bold mb-3">🥇 Top Regular Subscriber</h3>
            <p className="text-slate-300">
              {data?.topRegularUser?.email || '-'}
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}