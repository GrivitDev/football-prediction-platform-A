'use client';

import Image from 'next/image';

import type { AdminPrediction } from '@/types/prediction.types';

import { getLeagueName } from '@/constants/leagues';
import { getMatchStatus } from '@/utils/prediction.utils';

interface Props {
  predictions: AdminPrediction[];
  onSelect: (prediction: AdminPrediction) => void;
}

const statusOrder: Record<string, number> = {
  'In Play': 0,
  Upcoming: 1,
  'Needs Settlement': 2,
  Settled: 3,
};

const statusTone = (status: string) =>
  status === 'Settled'
    ? 'bg-emerald-500/10 text-emerald-600'
    : status === 'In Play'
      ? 'bg-blue-500/10 text-blue-600'
      : status === 'Needs Settlement'
        ? 'bg-amber-500/10 text-amber-600'
        : 'bg-muted text-muted-foreground';

const accessTone = (access: string) =>
  access === 'premium'
    ? 'bg-violet-500/10 text-violet-700'
    : access === 'vip'
      ? 'bg-yellow-500/10 text-yellow-700'
      : access === 'regular'
        ? 'bg-blue-500/10 text-blue-700'
        : 'bg-emerald-500/10 text-emerald-700';

const formatDate = (value: string) => {
  const date = new Date(value);

  return {
    date: date.toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
    }),
    time: date.toLocaleTimeString('en-NG', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  };
};

function predictionLabel(prediction: AdminPrediction) {
  const market = prediction.prediction.market.replace(/_/g, ' ');
  const selection = prediction.prediction.selection.replace(/_/g, ' ');

  return `${selection} · ${market}`;
}

function PredictionIcon({
  prediction,
  size = 20,
}: {
  prediction: AdminPrediction;
  size?: number;
}) {
  const selection = prediction.prediction.selection.toUpperCase();

  const src =
    selection === 'HOME'
      ? prediction.homeTeamBadge
      : selection === 'AWAY'
        ? prediction.awayTeamBadge
        : undefined;

  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="shrink-0 object-contain"
        unoptimized
      />
    );
  }

  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-primary/10 text-[8px] font-bold text-primary"
      style={{ width: size, height: size }}
    >
      P
    </span>
  );
}

export default function PredictionsTable({
  predictions,
  onSelect,
}: Props) {
  const sorted = [...predictions].sort(
    (a, b) =>
      (statusOrder[getMatchStatus(a)] ?? 99) -
      (statusOrder[getMatchStatus(b)] ?? 99),
  );

  if (!sorted.length) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
        No predictions found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="divide-y lg:hidden">
        {sorted.map((prediction) => {
          const date = formatDate(prediction.matchDate);
          const status = getMatchStatus(prediction);
          const league =
            prediction.league?.name ?? getLeagueName(prediction.leagueCode);

          return (
            <button
              key={prediction._id}
              type="button"
              onClick={() => onSelect(prediction)}
              className="w-full p-2.5 text-left hover:bg-muted/30"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  {prediction.league?.emblem && (
                    <Image
                      src={prediction.league.emblem}
                      alt=""
                      width={18}
                      height={18}
                      className="shrink-0 object-contain"
                      unoptimized
                    />
                  )}

                  <span className="truncate text-xs font-semibold">
                    {league}
                  </span>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${statusTone(
                    status,
                  )}`}
                >
                  {status}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-center gap-2.5">
                <Team
                  name={prediction.homeTeam}
                  badge={prediction.homeTeamBadge}
                />
                <span className="text-[9px] font-bold text-muted-foreground">
                  VS
                </span>
                <Team
                  name={prediction.awayTeam}
                  badge={prediction.awayTeamBadge}
                  reverse
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 border-t pt-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  <PredictionIcon prediction={prediction} />
                  <span className="truncate text-[11px] font-semibold text-primary">
                    {predictionLabel(prediction)}
                  </span>
                </div>

                <div className="text-right text-[9px] text-muted-foreground">
                  {prediction.confidence}% · {date.date} · {date.time}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-left">
          <thead className="border-b bg-muted/40">
            <tr>
              {[
                'Match',
                'League',
                'Selection',
                'Support',
                'Access',
                'Status',
              ].map((label) => (
                <th
                  key={label}
                  className="px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-muted-foreground"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sorted.map((prediction) => {
              const status = getMatchStatus(prediction);
              const league =
                prediction.league?.name ??
                getLeagueName(prediction.leagueCode);
              const date = formatDate(prediction.matchDate);

              return (
                <tr
                  key={prediction._id}
                  onClick={() => onSelect(prediction)}
                  className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Team
                        name={prediction.homeTeam}
                        badge={prediction.homeTeamBadge}
                        compact
                      />
                      <span className="text-[8px] font-bold text-muted-foreground">
                        VS
                      </span>
                      <Team
                        name={prediction.awayTeam}
                        badge={prediction.awayTeamBadge}
                        compact
                        reverse
                      />
                    </div>
                    <p className="mt-1 text-[9px] text-muted-foreground">
                      {date.date} · {date.time}
                    </p>
                  </td>

                  <td className="max-w-[180px] px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {prediction.league?.emblem ? (
                        <Image
                          src={prediction.league.emblem}
                          alt=""
                          width={18}
                          height={18}
                          className="shrink-0 object-contain"
                          unoptimized
                        />
                      ) : (
                        <span className="grid h-[18px] w-[18px] place-items-center rounded bg-muted text-[8px] font-bold">
                          L
                        </span>
                      )}

                      <span className="truncate text-[11px] font-medium">
                        {league}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <PredictionIcon prediction={prediction} />
                      <span className="max-w-[180px] truncate text-[11px] font-semibold text-primary">
                        {predictionLabel(prediction)}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-2.5 text-[11px] font-semibold">
                    {prediction.confidence}%
                  </td>

                  <td className="px-3 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize ${accessTone(
                        prediction.accessType,
                      )}`}
                    >
                      {prediction.accessType}
                    </span>
                  </td>

                  <td className="px-3 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${statusTone(
                        status,
                      )}`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Team({
  name,
  badge,
  reverse = false,
  compact = false,
}: {
  name: string;
  badge?: string;
  reverse?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-1.5 ${
        reverse ? 'flex-row-reverse text-right' : ''
      }`}
    >
      {badge ? (
        <Image
          src={badge}
          alt=""
          width={compact ? 18 : 22}
          height={compact ? 18 : 22}
          className="shrink-0 object-contain"
          unoptimized
        />
      ) : (
        <span className="h-4 w-4 shrink-0 rounded-full bg-muted" />
      )}

      <span className="truncate text-[11px] font-medium">{name}</span>
    </div>
  );
}
