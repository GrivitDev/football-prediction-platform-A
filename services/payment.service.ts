import api from '@/lib/axios';

export interface CreatePaymentPayload {
  type:
    | 'subscription'
    | 'vip_upgrade';

  target: string;

  transferReference?: string;

  proofImageUrl?: string;

  proofPublicId?: string;

  proofMessage?: string;
}

export const paymentService = {
  async getMyPayments() {
    const res = await api.get('/payments/me');
    const records = Array.isArray(res.data) ? res.data : [];

    // Hide legacy one-off prediction payment records from the subscription-only UI.
    return records.filter((payment: { type?: string } | null) => payment?.type !== 'prediction');
  },

  async createPayment(
    data: CreatePaymentPayload,
  ) {
    const res =
      await api.post(
        '/payments',
        data,
      );

    return res.data;
  },
};
