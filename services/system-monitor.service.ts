import api from '@/lib/axios';

import type {
  SystemMonitorActivity,
  SystemMonitorActivityQuery,
  SystemMonitorCronQuery,
  SystemMonitorCronView,
  SystemMonitorDashboard,
  SystemMonitorError,
  SystemMonitorErrorQuery,
  SystemMonitorStorageHistoryItem,
  SystemMonitorStorageHistoryQuery,
  SystemMonitorStorageResponse,
} from '@/types/system-monitor';


// ============================================================
// QUERY HELPER
// ============================================================

type QueryValue =
  | string
  | number
  | boolean
  | Date
  | undefined
  | null;


const compactQuery = (
  query?: object,
): Record<string, string | number | boolean> => {
  if (!query) {
    return {};
  }

  const result: Record<
    string,
    string | number | boolean
  > = {};

  for (const [key, value] of Object.entries(
    query as Record<string, QueryValue>,
  )) {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      continue;
    }

    result[key] =
      value instanceof Date
        ? value.toISOString()
        : value;
  }

  return result;
};


// ============================================================
// SYSTEM MONITOR API
// ============================================================

export const systemMonitorApi = {

  // ==========================================================
  // DASHBOARD
  // ==========================================================

  async getDashboard(): Promise<SystemMonitorDashboard> {
    const response =
      await api.get<SystemMonitorDashboard>(
        '/admin/system-monitor',
      );

    return response.data;
  },


  // ==========================================================
  // CRON JOBS
  // ==========================================================

  async getCrons(
    params: SystemMonitorCronQuery = {},
  ): Promise<SystemMonitorCronView[]> {
    const response =
      await api.get<SystemMonitorCronView[]>(
        '/admin/system-monitor/crons',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  async getCron(
    key: string,
  ): Promise<SystemMonitorCronView | null> {
    const response =
      await api.get<SystemMonitorCronView | null>(
        `/admin/system-monitor/crons/${encodeURIComponent(
          key,
        )}`,
      );

    return response.data;
  },


  // ==========================================================
  // ERRORS
  // ==========================================================

  async getErrors(
    params: SystemMonitorErrorQuery = {},
  ): Promise<SystemMonitorError[]> {
    const response =
      await api.get<SystemMonitorError[]>(
        '/admin/system-monitor/errors',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ACTIVITY
  // ==========================================================

  async getActivity(
    params: SystemMonitorActivityQuery = {},
  ): Promise<SystemMonitorActivity[]> {
    const response =
      await api.get<SystemMonitorActivity[]>(
        '/admin/system-monitor/activity',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // STORAGE
  // ==========================================================

  async getStorage(): Promise<SystemMonitorStorageResponse> {
    const response =
      await api.get<SystemMonitorStorageResponse>(
        '/admin/system-monitor/storage',
      );

    return response.data;
  },


  // ==========================================================
  // STORAGE HISTORY
  // ==========================================================

  async getStorageHistory(
    params: SystemMonitorStorageHistoryQuery = {},
  ): Promise<SystemMonitorStorageHistoryItem[]> {
    const response =
      await api.get<SystemMonitorStorageHistoryItem[]>(
        '/admin/system-monitor/storage/history',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default systemMonitorApi;