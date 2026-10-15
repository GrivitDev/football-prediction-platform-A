'use client';

import SubscriptionPredictionTable, { type SubscriptionPredictionTableProps } from './SubscriptionPredictionTable';

export type PremiumPredictionsTableProps = Omit<SubscriptionPredictionTableProps, 'plan'>;

export function PremiumPredictionsTable(props: PremiumPredictionsTableProps) {
  return <SubscriptionPredictionTable plan="premium" {...props} />;
}

export default PremiumPredictionsTable;
