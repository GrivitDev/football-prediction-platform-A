'use client';

import SubscriptionPredictionTable, { type SubscriptionPredictionTableProps } from './SubscriptionPredictionTable';

export type FreePredictionsTableProps = Omit<SubscriptionPredictionTableProps, 'plan'>;

export function FreePredictionsTable(props: FreePredictionsTableProps) {
  return <SubscriptionPredictionTable plan="free" {...props} />;
}

export default FreePredictionsTable;
