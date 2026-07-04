'use client';

import { formatMatchTime } from '@/lib/formatMatchTime';

interface MatchHeaderProps {
  homeTeam: string;
  awayTeam: string;
  confidence: number;
  matchDate: string;
  onClose: () => void;
}

export default function MatchHeader({
  homeTeam,
  awayTeam,
  confidence,
  matchDate,
  onClose,
}: MatchHeaderProps) {
  return (
    <div className="space-y-3 border-b border-gray-800 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            {homeTeam}
          </h2>

          <p className="text-sm text-gray-400 text-center my-1">
            VS
          </p>

          <h2 className="text-xl font-bold text-white">
            {awayTeam}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">
          {formatMatchTime(matchDate)}
        </span>

        <span className="text-green-400 font-semibold">
          {confidence}% Confidence
        </span>
      </div>
    </div>
  );
}