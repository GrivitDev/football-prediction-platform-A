import type { AdminPrediction } from '@/types/prediction.types';

export type MatchDisplayStatus =
  | 'Upcoming'
  | 'In Play'
  | 'Needs Settlement'
  | 'Settled';

export function getMatchStatus(
  prediction: AdminPrediction,
): MatchDisplayStatus {
  const now = new Date();
  const matchTime = new Date(prediction.matchDate);
  const settlementTime = new Date(
    matchTime.getTime() + 2 * 60 * 60 * 1000,
  );

  if (prediction.settled) {
    return 'Settled';
  }

  if (now < matchTime) {
    return 'Upcoming';
  }

  if (now <= settlementTime) {
    return 'In Play';
  }

  return 'Needs Settlement';
}

export function getPredictionLabel(prediction: AdminPrediction): string {
  const market = prediction.prediction?.market
    ?.trim()
    .replace(/_/g, ' ');

  const selection = prediction.prediction?.selection
    ?.trim()
    .replace(/_/g, ' ');

  if (!selection) {
    return '-';
  }

  return market ? `${selection} · ${market}` : selection;
}

export function formatPredictionDate(date: string): string {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
