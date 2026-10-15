import {
  Target,
  Crown,
  Users,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import type { AnalyticsPredictions } from '@/types/analytics.types';

interface Props {
  predictions: AnalyticsPredictions;
}

type ExtendedPredictions = AnalyticsPredictions & {
  premiumPredictions?: number;
};

const numberClass = 'text-base font-semibold leading-5 tracking-tight tabular-nums';

export default function PredictionSection({ predictions }: Props) {
  const extended = predictions as ExtendedPredictions;

  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold tracking-tight">Prediction Performance</h2>

      <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-3 sm:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-9">
        <AnalyticsCard title="Total" icon={Target} highlight>
          <p className={numberClass}>{predictions.totalPredictions.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Free" icon={Target}>
          <p className={numberClass}>{predictions.freePredictions.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Regular" icon={Users}>
          <p className={numberClass}>{predictions.regularPredictions.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="VIP" icon={Crown}>
          <p className={numberClass}>{predictions.vipPredictions.toLocaleString()}</p>
        </AnalyticsCard>
        {typeof extended.premiumPredictions === 'number' && (
          <AnalyticsCard title="Premium" icon={Sparkles}>
            <p className={numberClass}>{extended.premiumPredictions.toLocaleString()}</p>
          </AnalyticsCard>
        )}
        <AnalyticsCard title="Won" icon={CheckCircle} highlight>
          <p className={numberClass}>{predictions.wonPredictions.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Lost" icon={XCircle}>
          <p className={numberClass}>{predictions.lostPredictions.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Void" icon={ShieldAlert}>
          <p className={numberClass}>{predictions.voidPredictions.toLocaleString()}</p>
        </AnalyticsCard>
        <AnalyticsCard title="Pending" icon={Clock}>
          <p className={numberClass}>{predictions.pendingPredictions.toLocaleString()}</p>
        </AnalyticsCard>
      </div>
    </section>
  );
}
