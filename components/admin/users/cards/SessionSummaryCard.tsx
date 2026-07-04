'use client';

type Props = {
  summary: {
    totalSessions: number;
    activeSessions: number;
    lastLogin: string | null;
  };
};

export default function SessionSummaryCard({
  summary,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">

      <h2 className="text-lg font-semibold mb-5">
        Sessions
      </h2>

      <div className="space-y-4">

        <Row
          label="Total Sessions"
          value={summary.totalSessions}
        />

        <Row
          label="Active Sessions"
          value={summary.activeSessions}
        />

        <Row
          label="Last Login"
          value={
            summary.lastLogin
              ? new Date(summary.lastLogin).toLocaleString()
              : 'Never'
          }
        />

      </div>

    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">
        {label}
      </span>

      <span className="font-semibold text-right">
        {value}
      </span>
    </div>
  );
}