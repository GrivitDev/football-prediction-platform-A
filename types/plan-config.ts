export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
}

export interface PlanLabels {
  free: string;
  regular: string;
  vip: string;
  premium: string;
}

export interface PlanConfig {
  regularPrice: number;
  vipPrice: number;
  premiumPrice: number;

  bankDetails: BankDetails;

  regularPriceUSD: number;
  vipPriceUSD: number;
  premiumPriceUSD: number;

  bankDetailsUSD: BankDetails;

  subscriptionDurationDays: number;
  premiumDurationDays: number;

  planLabels: PlanLabels;
}