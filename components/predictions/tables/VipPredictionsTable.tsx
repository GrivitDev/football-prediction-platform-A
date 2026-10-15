'use client';

import SubscriptionPredictionTable, { type SubscriptionPredictionTableProps } from './SubscriptionPredictionTable';

export type VIPPredictionsTableProps = Omit<SubscriptionPredictionTableProps, 'plan'>;

export function VIPPredictionsTable(props: VIPPredictionsTableProps) {
  return <SubscriptionPredictionTable plan="vip" {...props} />;
}

export default VIPPredictionsTable;
