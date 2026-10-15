import api from '@/lib/axios';

import type {
  SportsSystemMonitorQuery,
  SportsSystemMonitorResponse,
} from '@/types/sports-system-monitor';


// ============================================================
// SPORTS SYSTEM MONITOR API
// ============================================================

export const sportsSystemMonitorApi = {
  async getSystemMonitor(
    params: SportsSystemMonitorQuery = {},
  ): Promise<SportsSystemMonitorResponse> {
    const response =
      await api.get<SportsSystemMonitorResponse>(
        '/sports/admin/system-monitor',
        {
          params: {
            ...(params.leagueId ? { leagueId: params.leagueId } : {}),
            ...(params.forceRefresh ? { forceRefresh: true } : {}),
          },
        },
      );

    return response.data;
  },
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default sportsSystemMonitorApi;
