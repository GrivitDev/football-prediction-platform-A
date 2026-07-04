// services/admin-users.service.ts

import api from '@/lib/axios';

// =========================
// GET USERS (ADMIN TABLE)
// =========================
export const getUsers = async (params: {
  search?: string;
  page?: number;
  status?: string;
  role?: string;
}) => {
  const res = await api.get('/admin/users', {
    params,
  });

  return res.data;
};

// =========================
// GET USER DETAILS
// =========================
export const getUser = async (id: string) => {
  const res = await api.get(
    `/admin/users/${id}/details`,
  );

  return res.data;
};

// =========================
// USER ACTIONS
// =========================
export const suspendUser = (
  id: string,
  data: {
    reason?: string;
    bannedUntil?: Date;
  },
) =>
  api.patch(
    `/admin/users/${id}/suspend`,
    data,
  );

export const activateUser = (id: string) =>
  api.patch(`/admin/users/${id}/activate`);

export const deleteUser = (id: string) =>
  api.patch(`/admin/users/${id}/delete`);

export const forceLogout = (id: string) =>
  api.patch(
    `/admin/users/${id}/logout-all`,
  );