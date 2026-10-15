

// frontend/services/sports.service.ts

import api from '@/lib/axios';

import type {
  ActiveCompetition,
  EspnFixtureRecord,
  EspnLeagueRecord,
  EspnNewsRecord,
  EspnQueueRecord,
  EspnQueueSummary,
  EspnStandingRecord,
  EspnTeamRecord,
  FootballDataCompetitionRecord,
  FootballDataMatchRecord,
  FootballDataStandingRecord,
  FootballDataTeamRecord,
  OddsApiSportRecord,
  PaginatedResponse,
  SportsAdminCompetitionQuery,
  SportsAdminEspnLeagueQuery,
  SportsAdminEspnLiveMatchQuery,
  SportsAdminFixtureQuery,
  SportsAdminFootballDataMatchQuery,
  SportsAdminFootballDataStandingQuery,
  SportsAdminFootballDataTeamQuery,
  SportsAdminNewsQuery,
  SportsAdminOddsSnapshotQuery,
  SportsAdminOddsSportsQuery,
  SportsAdminProviderRateLimitQuery,
  SportsAdminQueueQuery,
  SportsAdminStandingQuery,
  SportsAdminSyncStateQuery,
  SportsAdminTeamQuery,
  SportsAdminYoutubeQuery,
  SportsFixtureQuery,
  SportsListQuery,
  SportsOddsSnapshotRecord,
  SportsProviderRateLimitRecord,
  SportsSyncState,
  SportsSyncStateSummary,
  SportsSystemMonitorQuery,
  SportsSystemMonitorResponse,
  SportsEndpointValue,
  SportsFootballNewsQuery,
  FootballNewsFeedItem,
  YouTubeHighlightRecord,
} from '@/types/sports';


// ============================================================
// QUERY SERIALIZATION
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

  const result: Record<string, string | number | boolean> = {};

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
// SPORTS API
// ============================================================

export const sportsApi = {
  // ==========================================================
  // PUBLIC / APPLICATION
  // ==========================================================

  async getCompetitions(params?: {
    activeOnly?: boolean;
    predictionEnabled?: boolean;
  }): Promise<ActiveCompetition[]> {
    const response = await api.get<ActiveCompetition[]>(
      '/sports/competitions',
      {
        params: compactQuery(params),
      },
    );

    return response.data;
  },

  async getCompetition(
    competitionId: string,
  ): Promise<ActiveCompetition | null> {
    const response =
      await api.get<ActiveCompetition | null>(
        `/sports/competitions/${encodeURIComponent(
          competitionId,
        )}`,
      );

    return response.data;
  },

  async getUpcomingFixtures(
    params: SportsFixtureQuery = {},
  ): Promise<EspnFixtureRecord[]> {
    const response =
      await api.get<EspnFixtureRecord[]>(
        '/sports/fixtures/upcoming',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },

  async getLiveFixtures(
    params: SportsFixtureQuery = {},
  ): Promise<EspnFixtureRecord[]> {
    const response =
      await api.get<EspnFixtureRecord[]>(
        '/sports/fixtures/live',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },

  getFootballNewsStreamUrl(
    params: SportsFootballNewsQuery = {},
  ): string {
    return api.getUri({
      url: '/sports/news-feed/stream',
      params: compactQuery(params),
    });
  },

  async getFootballNews(
    params: SportsFootballNewsQuery = {},
  ): Promise<PaginatedResponse<FootballNewsFeedItem>> {
    const response =
      await api.get<
        PaginatedResponse<FootballNewsFeedItem>
      >(
        '/sports/news-feed',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },

  async getFinishedFixtures(
    params: SportsFixtureQuery = {},
  ): Promise<EspnFixtureRecord[]> {
    const response =
      await api.get<EspnFixtureRecord[]>(
        '/sports/fixtures/finished',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },




  // ==========================================================
  // PUBLIC / ESPN FIXTURE PAYLOAD FIELDS
  // ==========================================================

  async getFixtureId(eventId: string): Promise<string | null> {
    const response = await api.get<string | null>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/id`,
    );

    return response.data;
  },

  async getFixtureUid(eventId: string): Promise<string | null> {
    const response = await api.get<string | null>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/uid`,
    );

    return response.data;
  },

  async getFixtureDate(eventId: string): Promise<string | null> {
    const response = await api.get<string | null>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/date`,
    );

    return response.data;
  },

  async getFixtureName(eventId: string): Promise<string | null> {
    const response = await api.get<string | null>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/name`,
    );

    return response.data;
  },

  async getFixtureShortName(eventId: string): Promise<string | null> {
    const response = await api.get<string | null>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/short-name`,
    );

    return response.data;
  },

  async getFixtureTimeValid(eventId: string): Promise<boolean | null> {
    const response = await api.get<boolean | null>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/time-valid`,
    );

    return response.data;
  },

  async getFixtureSeason(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/season`,
    );

    return response.data;
  },

  async getFixtureSeasonType(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/season-type`,
    );

    return response.data;
  },

  async getFixtureCompetitions(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/competitions`,
    );

    return response.data;
  },

  async getFixtureLinks(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/links`,
    );

    return response.data;
  },

  async getFixtureLeague(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/league`,
    );

    return response.data;
  },

  async getFixtureStatus(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/status`,
    );

    return response.data;
  },

  async getFixtureVenue(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/venue`,
    );

    return response.data;
  },


  // ==========================================================
  // PUBLIC / ESPN MATCH SUMMARY SECTIONS
  // ==========================================================

  async getFixtureSummaryBoxscore(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/boxscore`,
    );

    return response.data;
  },

  async getFixtureSummaryFormat(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/format`,
    );

    return response.data;
  },

  async getFixtureSummaryGameInfo(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/game-info`,
    );

    return response.data;
  },

  async getFixtureSummaryLastFiveGames(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/last-five-games`,
    );

    return response.data;
  },

  async getFixtureSummaryLeaders(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/leaders`,
    );

    return response.data;
  },

  async getFixtureSummaryBroadcasts(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/broadcasts`,
    );

    return response.data;
  },

  async getFixtureSummaryPickcenter(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/pickcenter`,
    );

    return response.data;
  },

  async getFixtureSummaryOdds(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/odds`,
    );

    return response.data;
  },

  async getFixtureSummaryHasOdds(eventId: string): Promise<boolean | null> {
    const response = await api.get<boolean | null>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/has-odds`,
    );

    return response.data;
  },

  async getFixtureSummaryRosters(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/rosters`,
    );

    return response.data;
  },

  async getFixtureSummaryNews(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/news`,
    );

    return response.data;
  },

  async getFixtureSummarySeasonSeries(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/season-series`,
    );

    return response.data;
  },

  async getFixtureSummaryVideos(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/videos`,
    );

    return response.data;
  },

  async getFixtureSummaryHeader(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/header`,
    );

    return response.data;
  },

  async getFixtureSummaryKeyEvents(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/key-events`,
    );

    return response.data;
  },

  async getFixtureSummaryCommentary(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/commentary`,
    );

    return response.data;
  },

  async getFixtureSummaryWallclockAvailable(eventId: string): Promise<boolean | null> {
    const response = await api.get<boolean | null>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/wallclock-available`,
    );

    return response.data;
  },

  async getFixtureSummaryMeta(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/meta`,
    );

    return response.data;
  },

  async getFixtureSummaryStandings(eventId: string): Promise<SportsEndpointValue> {
    const response = await api.get<SportsEndpointValue>(
      `/sports/fixtures/${encodeURIComponent(eventId)}/summary/standings`,
    );

    return response.data;
  },

  async getLeagueTable(
    competitionId: string,
    teamId?: string,
    groupId?: string,
  ): Promise<EspnStandingRecord[]> {
    const response =
      await api.get<EspnStandingRecord[]>(
        `/sports/competitions/${encodeURIComponent(
          competitionId,
        )}/standings`,
        {
          params: compactQuery({ teamId, groupId }),
        },
      );

    return response.data;
  },

  async getCompetitionTeams(
    competitionId: string,
    teamId?: string,
  ): Promise<EspnTeamRecord[]> {
    const response =
      await api.get<EspnTeamRecord[]>(
        `/sports/competitions/${encodeURIComponent(
          competitionId,
        )}/teams`,
        {
          params: compactQuery({ teamId }),
        },
      );

    return response.data;
  },

  async getEventOdds(
    eventId: string,
  ): Promise<SportsOddsSnapshotRecord[]> {
    const response =
      await api.get<SportsOddsSnapshotRecord[]>(
        `/sports/odds/event/${encodeURIComponent(
          eventId,
        )}`,
      );

    return response.data;
  },

  async getYoutubeHighlight(
    fixtureId: string,
  ): Promise<YouTubeHighlightRecord | null> {
    const response =
      await api.get<YouTubeHighlightRecord | null>(
        `/sports/youtube/${encodeURIComponent(
          fixtureId,
        )}`,
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: SYSTEM MONITOR
  // ==========================================================

  async getAdminSystemMonitor(
    params: SportsSystemMonitorQuery = {},
  ): Promise<SportsSystemMonitorResponse> {
    const response =
      await api.get<SportsSystemMonitorResponse>(
        '/sports/admin/system-monitor',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ACTIVE COMPETITIONS
  // ==========================================================

  async getAdminActiveCompetitions(
    params: SportsAdminCompetitionQuery = {},
  ): Promise<PaginatedResponse<ActiveCompetition>> {
    const response =
      await api.get<
        PaginatedResponse<ActiveCompetition>
      >(
        '/sports/admin/active-competitions',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ESPN LEAGUES
  // ==========================================================

  async getAdminEspnLeagues(
    params: SportsAdminEspnLeagueQuery = {},
  ): Promise<PaginatedResponse<EspnLeagueRecord>> {
    const response =
      await api.get<
        PaginatedResponse<EspnLeagueRecord>
      >(
        '/sports/admin/espn/leagues',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ESPN LIVE MATCHES
  // ==========================================================

  async getAdminEspnLiveMatches(
    params: SportsAdminEspnLiveMatchQuery = {},
  ): Promise<PaginatedResponse<EspnFixtureRecord>> {
    const response =
      await api.get<
        PaginatedResponse<EspnFixtureRecord>
      >(
        '/sports/admin/espn/live-matches',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ESPN NEWS
  // ==========================================================

  async getAdminEspnNews(
    params: SportsAdminNewsQuery = {},
  ): Promise<PaginatedResponse<EspnNewsRecord>> {
    const response =
      await api.get<
        PaginatedResponse<EspnNewsRecord>
      >(
        '/sports/admin/espn/news',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ESPN STANDINGS
  // ==========================================================

  async getAdminEspnStandings(
    params: SportsAdminStandingQuery = {},
  ): Promise<PaginatedResponse<EspnStandingRecord>> {
    const response =
      await api.get<
        PaginatedResponse<EspnStandingRecord>
      >(
        '/sports/admin/espn/standings',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ESPN TEAMS
  // ==========================================================

  async getAdminEspnTeams(
    params: SportsAdminTeamQuery = {},
  ): Promise<PaginatedResponse<EspnTeamRecord>> {
    const response =
      await api.get<
        PaginatedResponse<EspnTeamRecord>
      >(
        '/sports/admin/espn/teams',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ESPN FIXTURES
  // ==========================================================

  async getAdminEspnFixtures(
    params: SportsAdminFixtureQuery = {},
  ): Promise<PaginatedResponse<EspnFixtureRecord>> {
    const response =
      await api.get<
        PaginatedResponse<EspnFixtureRecord>
      >(
        '/sports/admin/espn/fixtures',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ESPN QUEUE SUMMARY
  // ==========================================================

  async getAdminEspnQueueSummary(): Promise<EspnQueueSummary> {
    const response =
      await api.get<EspnQueueSummary>(
        '/sports/admin/espn/queues/summary',
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ESPN QUEUES
  // ==========================================================

  async getAdminEspnQueues(
    params: SportsAdminQueueQuery = {},
  ): Promise<PaginatedResponse<EspnQueueRecord>> {
    const response =
      await api.get<
        PaginatedResponse<EspnQueueRecord>
      >(
        '/sports/admin/espn/queues',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: FOOTBALL-DATA COMPETITIONS
  // ==========================================================

  async getAdminFootballDataCompetitions(
    params: SportsListQuery = {},
  ): Promise<
    PaginatedResponse<FootballDataCompetitionRecord>
  > {
    const response =
      await api.get<
        PaginatedResponse<FootballDataCompetitionRecord>
      >(
        '/sports/admin/football-data/competitions',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: FOOTBALL-DATA MATCHES
  // ==========================================================

  async getAdminFootballDataMatches(
    params: SportsAdminFootballDataMatchQuery = {},
  ): Promise<
    PaginatedResponse<FootballDataMatchRecord>
  > {
    const response =
      await api.get<
        PaginatedResponse<FootballDataMatchRecord>
      >(
        '/sports/admin/football-data/matches',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: FOOTBALL-DATA STANDINGS
  // ==========================================================

  async getAdminFootballDataStandings(
    params: SportsAdminFootballDataStandingQuery = {},
  ): Promise<
    PaginatedResponse<FootballDataStandingRecord>
  > {
    const response =
      await api.get<
        PaginatedResponse<FootballDataStandingRecord>
      >(
        '/sports/admin/football-data/standings',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: FOOTBALL-DATA TEAMS
  // ==========================================================

  async getAdminFootballDataTeams(
    params: SportsAdminFootballDataTeamQuery = {},
  ): Promise<
    PaginatedResponse<FootballDataTeamRecord>
  > {
    const response =
      await api.get<
        PaginatedResponse<FootballDataTeamRecord>
      >(
        '/sports/admin/football-data/teams',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ODDS API SPORTS
  // ==========================================================

  async getAdminOddsApiSports(
    params: SportsAdminOddsSportsQuery = {},
  ): Promise<PaginatedResponse<OddsApiSportRecord>> {
    const response =
      await api.get<
        PaginatedResponse<OddsApiSportRecord>
      >(
        '/sports/admin/odds-api/sports',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: ODDS SNAPSHOTS
  // ==========================================================

  async getAdminSportsOddsSnapshots(
    params: SportsAdminOddsSnapshotQuery = {},
  ): Promise<
    PaginatedResponse<SportsOddsSnapshotRecord>
  > {
    const response =
      await api.get<
        PaginatedResponse<SportsOddsSnapshotRecord>
      >(
        '/sports/admin/odds-api/snapshots',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: PROVIDER RATE LIMITS
  // ==========================================================

  async getAdminProviderRateLimits(
    params: SportsAdminProviderRateLimitQuery = {},
  ): Promise<
    PaginatedResponse<SportsProviderRateLimitRecord>
  > {
    const response =
      await api.get<
        PaginatedResponse<SportsProviderRateLimitRecord>
      >(
        '/sports/admin/provider-rate-limits',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: YOUTUBE HIGHLIGHTS
  // ==========================================================

  async getAdminYoutubeHighlights(
    params: SportsAdminYoutubeQuery = {},
  ): Promise<
    PaginatedResponse<YouTubeHighlightRecord>
  > {
    const response =
      await api.get<
        PaginatedResponse<YouTubeHighlightRecord>
      >(
        '/sports/admin/youtube-highlights',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },


  // ==========================================================
  // ADMIN: SPORTS SYNC STATES
  // ==========================================================

  async getAdminSportsSyncStates(
    params: SportsAdminSyncStateQuery = {},
  ): Promise<PaginatedResponse<SportsSyncState>> {
    const response =
      await api.get<
        PaginatedResponse<SportsSyncState>
      >(
        '/sports/admin/sync-states',
        {
          params: compactQuery(params),
        },
      );

    return response.data;
  },

  async getAdminSportsSyncStateSummary(): Promise<SportsSyncStateSummary> {
    const response =
      await api.get<SportsSyncStateSummary>(
        '/sports/admin/sync-states/summary',
      );

    return response.data;
  },

  async getAdminSportsSyncState(
    stateKey: string,
  ): Promise<SportsSyncState | null> {
    const response =
      await api.get<SportsSyncState | null>(
        `/sports/admin/sync-states/${encodeURIComponent(
          stateKey,
        )}`,
      );

    return response.data;
  },
};

export default sportsApi;
