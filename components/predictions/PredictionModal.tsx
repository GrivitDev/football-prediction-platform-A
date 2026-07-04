'use client';

import { usePrediction } from '@/hooks/usePrediction';

import MatchHeader from './MatchHeader';
import CountdownCard from './CountdownCard';
import LockedCard from './LockedCard';
import PredictionContent from './PredictionContent';

interface Props {
  prediction: {
    _id: string;
  };
  onClose: () => void;
}

export default function PredictionModal({
  prediction,
  onClose,
}: Props) {
  const {
    access,
    loading,
    buying,
    countdown,
    buyPrediction,
    upgradePlan,
  } = usePrediction(prediction._id);

  // =========================
  // LOADING STATE
  // =========================
  if (loading || !access) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
        <div className="text-white text-sm">
          Loading prediction...
        </div>
      </div>
    );
  }

  const released = countdown.released;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-xl bg-gray-900 p-6 space-y-6">

        {/* HEADER */}
        <MatchHeader
          homeTeam={access.homeTeam}
          awayTeam={access.awayTeam}
          confidence={access.preview.confidence}
          matchDate={access.matchDate}
          onClose={onClose}
        />

        {/* =========================
            NOT RELEASED → COUNTDOWN
        ========================= */}
        {!released && (
          <CountdownCard
            days={countdown.days}
            hours={countdown.hours}
            minutes={countdown.minutes}
            seconds={countdown.seconds}
          />
        )}

        {/* =========================
            RELEASED + LOCKED
        ========================= */}
        {released && !access.access.allowed && (
          <LockedCard
            loading={buying}
            price={access.price}
            message={access.access.message}
            onBuy={buyPrediction}
            onUpgrade={upgradePlan}
          />
        )}

        {/* =========================
            RELEASED + UNLOCKED
        ========================= */}
        {released && access.access.allowed && (
          <PredictionContent
            prediction={access.preview.prediction}
            probabilities={access.data?.probabilities}
            markets={access.data?.markets}
          />
        )}

      </div>
    </div>
  );
}