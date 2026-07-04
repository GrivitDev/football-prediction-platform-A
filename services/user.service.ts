import api from '@/lib/axios';

export const userService = {
  async getMe() {
    const res = await api.get('/users/me');
    return res.data;
  },
};