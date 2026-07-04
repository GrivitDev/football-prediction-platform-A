import api from '@/lib/axios';

export const paymentService = {
  async getMyPayments() {
    const res = await api.get('/payments/me');
    return res.data;
  },

  async createPayment(data: any) {
    const res = await api.post('/payments', data);
    return res.data;
  },
};