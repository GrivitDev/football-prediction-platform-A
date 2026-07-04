import api from '@/lib/axios';

export const subscriptionService = {
  async getStatus() {
    const res = await api.get('/subscriptions/status');
    return res.data;
  },
};