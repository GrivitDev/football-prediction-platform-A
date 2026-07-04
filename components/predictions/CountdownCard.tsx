'use client';

interface CountdownCardProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function Box({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 text-center">
      <p className="text-3xl font-bold text-white">
        {String(value).padStart(2, '0')}
      </p>

      <p className="text-xs text-gray-400 uppercase mt-1">
        {label}
      </p>
    </div>
  );
}

export default function CountdownCard({
  days,
  hours,
  minutes,
  seconds,
}: CountdownCardProps) {
  return (
    <div className="rounded-xl border border-yellow-500 bg-yellow-500/10 p-5">

      <div className="text-center mb-5">

        <p className="text-yellow-400 font-semibold text-lg">
          🔒 Prediction Locked
        </p>

        <p className="text-gray-400 text-sm mt-2">
          This prediction hasn't been released yet.
        </p>

      </div>

      <div className="grid grid-cols-4 gap-3">

        <Box value={days} label="Days" />

        <Box value={hours} label="Hours" />

        <Box value={minutes} label="Minutes" />

        <Box value={seconds} label="Seconds" />

      </div>

      <p className="text-center text-gray-500 text-xs mt-5">
        Countdown until prediction release
      </p>

    </div>
  );
}