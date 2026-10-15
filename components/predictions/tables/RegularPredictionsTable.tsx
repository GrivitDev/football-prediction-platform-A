'use client';

import SubscriptionPredictionTable, { type SubscriptionPredictionTableProps } from './SubscriptionPredictionTable';

export type RegularPredictionsTableProps = Omit<SubscriptionPredictionTableProps, 'plan'>;

export function RegularPredictionsTable(props: RegularPredictionsTableProps) {
  return <SubscriptionPredictionTable plan="regular" {...props} />;
}

export default RegularPredictionsTable;
