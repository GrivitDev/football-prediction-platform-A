
'use client';

import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';

import sportsApi from '@/services/sports.service';

import type {
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
  SportsFootballNewsQuery,
  SportsListQuery,
  SportsSystemMonitorQuery,
} from '@/types/sports';


// ============================================================
// QUERY KEYS
// ============================================================

export const sportsQueryKeys = {
  all: ['sports'] as const,

  competitions: () =>
    [...sportsQueryKeys.all, 'competitions'] as const,

  competition: (
    competitionId: string,
  ) =>
    [
      ...sportsQueryKeys.competitions(),
      competitionId,
    ] as const,

  fixtures: () =>
    [...sportsQueryKeys.all, 'fixtures'] as const,

  upcomingFixtures: (
    params: SportsFixtureQuery = {},
  ) =>
    [
      ...sportsQueryKeys.fixtures(),
      'upcoming',
      params,
    ] as const,

  liveFixtures: (
    params: SportsFixtureQuery = {},
  ) =>
    [
      ...sportsQueryKeys.fixtures(),
      'live',
      params,
    ] as const,

  finishedFixtures: (
    params: SportsFixtureQuery = {},
  ) =>
    [
      ...sportsQueryKeys.fixtures(),
      'finished',
      params,
    ] as const,

  footballNews: (
    params: SportsFootballNewsQuery = {},
  ) =>
    [
      ...sportsQueryKeys.all,
      'football-news',
      params,
    ] as const,



  fixtureId: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'id', eventId] as const,

  fixtureUid: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'uid', eventId] as const,

  fixtureDate: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'date', eventId] as const,

  fixtureName: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'name', eventId] as const,

  fixtureShortName: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'short-name', eventId] as const,

  fixtureTimeValid: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'time-valid', eventId] as const,

  fixtureSeason: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'season', eventId] as const,

  fixtureSeasonType: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'season-type', eventId] as const,

  fixtureCompetitions: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'competitions', eventId] as const,

  fixtureLinks: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'links', eventId] as const,

  fixtureLeague: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'league', eventId] as const,

  fixtureStatus: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'status', eventId] as const,

  fixtureVenue: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'venue', eventId] as const,

  fixtureSummaryBoxscore: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'boxscore', eventId] as const,

  fixtureSummaryFormat: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'format', eventId] as const,

  fixtureSummaryGameInfo: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'game-info', eventId] as const,

  fixtureSummaryLastFiveGames: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'last-five-games', eventId] as const,

  fixtureSummaryLeaders: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'leaders', eventId] as const,

  fixtureSummaryBroadcasts: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'broadcasts', eventId] as const,

  fixtureSummaryPickcenter: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'pickcenter', eventId] as const,

  fixtureSummaryOdds: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'odds', eventId] as const,

  fixtureSummaryHasOdds: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'has-odds', eventId] as const,

  fixtureSummaryRosters: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'rosters', eventId] as const,

  fixtureSummaryNews: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'news', eventId] as const,

  fixtureSummarySeasonSeries: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'season-series', eventId] as const,

  fixtureSummaryVideos: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'videos', eventId] as const,

  fixtureSummaryHeader: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'header', eventId] as const,

  fixtureSummaryKeyEvents: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'key-events', eventId] as const,

  fixtureSummaryCommentary: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'commentary', eventId] as const,

  fixtureSummaryWallclockAvailable: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'wallclock-available', eventId] as const,

  fixtureSummaryMeta: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'meta', eventId] as const,

  fixtureSummaryStandings: (eventId: string) =>
    [...sportsQueryKeys.fixtures(), 'summary', 'standings', eventId] as const,

  table: (
    competitionId: string,
    teamId?: string,
  ) =>
    [
      ...sportsQueryKeys.all,
      'table',
      competitionId,
      teamId ?? null,
    ] as const,

  teams: (
    competitionId: string,
    teamId?: string,
  ) =>
    [
      ...sportsQueryKeys.all,
      'teams',
      competitionId,
      teamId ?? null,
    ] as const,

  odds: (
    eventId: string,
  ) =>
    [
      ...sportsQueryKeys.all,
      'odds',
      eventId,
    ] as const,

  youtube: (
    fixtureId: string,
  ) =>
    [
      ...sportsQueryKeys.all,
      'youtube',
      fixtureId,
    ] as const,

  admin: () =>
    [
      ...sportsQueryKeys.all,
      'admin',
    ] as const,

  systemMonitor: (params: SportsSystemMonitorQuery = {}) =>
    [...sportsQueryKeys.admin(), 'system-monitor', params] as const,

  activeCompetitions: (
    params: SportsAdminCompetitionQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'active-competitions',
      params,
    ] as const,

  espnLeagues: (
    params: SportsAdminEspnLeagueQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'espn-leagues',
      params,
    ] as const,

  espnLiveMatches: (
    params: SportsAdminEspnLiveMatchQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'espn-live-matches',
      params,
    ] as const,

  espnNews: (
    params: SportsAdminNewsQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'espn-news',
      params,
    ] as const,

  espnStandings: (
    params: SportsAdminStandingQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'espn-standings',
      params,
    ] as const,

  espnTeams: (
    params: SportsAdminTeamQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'espn-teams',
      params,
    ] as const,

  espnQueueSummary: () =>
    [
      ...sportsQueryKeys.admin(),
      'espn-queue-summary',
    ] as const,

  espnQueues: (
    params: SportsAdminQueueQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'espn-queues',
      params,
    ] as const,

  espnFixtures: (
    params: SportsAdminFixtureQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'espn-fixtures',
      params,
    ] as const,

  footballDataCompetitions: () =>
    [
      ...sportsQueryKeys.admin(),
      'football-data-competitions',
    ] as const,

  footballDataMatches: (
    params: SportsAdminFootballDataMatchQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'football-data-matches',
      params,
    ] as const,

  footballDataStandings: (
    params: SportsAdminFootballDataStandingQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'football-data-standings',
      params,
    ] as const,

  footballDataTeams: (
    params: SportsAdminFootballDataTeamQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'football-data-teams',
      params,
    ] as const,

  oddsApiSports: (
    params: SportsAdminOddsSportsQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'odds-api-sports',
      params,
    ] as const,

  oddsSnapshots: (
    params: SportsAdminOddsSnapshotQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'odds-snapshots',
      params,
    ] as const,

  providerRateLimits: (
    params: SportsAdminProviderRateLimitQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'provider-rate-limits',
      params,
    ] as const,

  youtubeHighlights: (
    params: SportsAdminYoutubeQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'youtube-highlights',
      params,
    ] as const,

  syncStates: (
    params: SportsAdminSyncStateQuery = {},
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'sync-states',
      params,
    ] as const,

  syncStateSummary: () =>
    [
      ...sportsQueryKeys.admin(),
      'sync-state-summary',
    ] as const,

  syncState: (
    stateKey: string,
  ) =>
    [
      ...sportsQueryKeys.admin(),
      'sync-state',
      stateKey,
    ] as const,
};


// ============================================================
// PUBLIC / APPLICATION HOOKS
// ============================================================

export function useSportsCompetitions(
  params?: {
    activeOnly?: boolean;
    predictionEnabled?: boolean;
  },
) {
  return useQuery({
    queryKey: [
      ...sportsQueryKeys.competitions(),
      params ?? {},
    ] as const,

    queryFn: () => sportsApi.getCompetitions(params),

    staleTime: 60_000,
  });
}


export function useSportsCompetition(
  competitionId?: string,
) {
  return useQuery({
    queryKey: sportsQueryKeys.competition(
      competitionId ?? '',
    ),

    queryFn: () =>
      sportsApi.getCompetition(
        competitionId as string,
      ),

    enabled: Boolean(competitionId),

    staleTime: 60_000,
  });
}


export function useSportsUpcomingFixtures(
  params: SportsFixtureQuery = {},
) {
  return useQuery({
    queryKey: sportsQueryKeys.upcomingFixtures(params),

    queryFn: () =>
      sportsApi.getUpcomingFixtures(params),

    staleTime: 15_000,

    refetchInterval: 30_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsLiveFixtures(
  params: SportsFixtureQuery = {},
) {
  return useQuery({
    queryKey: sportsQueryKeys.liveFixtures(
      params,
    ),

    queryFn: () =>
      sportsApi.getLiveFixtures(
        params,
      ),

    staleTime: 2_000,

    refetchInterval: 5_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFinishedFixtures(
  params: SportsFixtureQuery = {},
) {
  return useQuery({
    queryKey: sportsQueryKeys.finishedFixtures(params),

    queryFn: () =>
      sportsApi.getFinishedFixtures(params),

    staleTime: 30_000,

    placeholderData: keepPreviousData,
  });
}




export function useSportsFixtureId(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureId(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureId(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureUid(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureUid(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureUid(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureDate(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureDate(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureDate(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureName(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureName(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureName(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureShortName(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureShortName(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureShortName(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureTimeValid(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureTimeValid(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureTimeValid(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSeason(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSeason(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSeason(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSeasonType(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSeasonType(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSeasonType(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureCompetitions(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureCompetitions(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureCompetitions(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureLinks(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureLinks(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureLinks(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureLeague(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureLeague(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureLeague(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureStatus(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureStatus(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureStatus(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureVenue(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureVenue(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureVenue(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryBoxscore(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryBoxscore(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryBoxscore(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryFormat(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryFormat(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryFormat(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryGameInfo(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryGameInfo(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryGameInfo(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryLastFiveGames(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryLastFiveGames(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryLastFiveGames(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryLeaders(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryLeaders(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryLeaders(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryBroadcasts(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryBroadcasts(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryBroadcasts(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryPickcenter(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryPickcenter(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryPickcenter(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryOdds(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryOdds(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryOdds(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryHasOdds(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryHasOdds(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryHasOdds(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryRosters(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryRosters(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryRosters(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryNews(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryNews(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryNews(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummarySeasonSeries(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummarySeasonSeries(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummarySeasonSeries(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryVideos(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryVideos(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryVideos(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryHeader(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryHeader(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryHeader(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryKeyEvents(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryKeyEvents(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryKeyEvents(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryCommentary(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryCommentary(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryCommentary(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryWallclockAvailable(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryWallclockAvailable(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryWallclockAvailable(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryMeta(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryMeta(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryMeta(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsFixtureSummaryStandings(eventId?: string) {
  return useQuery({
    queryKey: sportsQueryKeys.fixtureSummaryStandings(eventId ?? ''),

    queryFn: () =>
      sportsApi.getFixtureSummaryStandings(eventId as string),

    enabled: Boolean(eventId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsLeagueTable(
  competitionId?: string,
  teamId?: string,
) {
  return useQuery({
    queryKey: sportsQueryKeys.table(
      competitionId ?? '',
      teamId,
    ),

    queryFn: () =>
      sportsApi.getLeagueTable(
        competitionId as string,
        teamId,
      ),

    enabled: Boolean(competitionId),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsCompetitionTeams(
  competitionId?: string,
  teamId?: string,
) {
  return useQuery({
    queryKey: sportsQueryKeys.teams(
      competitionId ?? '',
      teamId,
    ),

    queryFn: () =>
      sportsApi.getCompetitionTeams(
        competitionId as string,
        teamId,
      ),

    enabled: Boolean(competitionId),

    staleTime: 5 * 60_000,
  });
}


export function useFootballNews(
  params: SportsFootballNewsQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.footballNews(
        params,
      ),

    queryFn: () =>
      sportsApi.getFootballNews(
        params,
      ),

    staleTime: 60_000,

    placeholderData:
      keepPreviousData,
  });
}


export function useSportsEventOdds(
  eventId?: string,
) {
  return useQuery({
    queryKey: sportsQueryKeys.odds(
      eventId ?? '',
    ),

    queryFn: () =>
      sportsApi.getEventOdds(
        eventId as string,
      ),

    enabled: Boolean(eventId),

    staleTime: 10_000,

    refetchInterval: 30_000,

    placeholderData: keepPreviousData,
  });
}


export function useSportsYoutubeHighlight(
  fixtureId?: string,
) {
  return useQuery({
    queryKey: sportsQueryKeys.youtube(
      fixtureId ?? '',
    ),

    queryFn: () =>
      sportsApi.getYoutubeHighlight(
        fixtureId as string,
      ),

    enabled: Boolean(fixtureId),

    staleTime: 5 * 60_000,
  });
}


// ============================================================
// ADMIN HOOKS
// ============================================================



export function useAdminSportsSystemMonitor(
  params: SportsSystemMonitorQuery = {},
) {
  return useQuery({
    queryKey: sportsQueryKeys.systemMonitor(params),

    queryFn: () =>
      sportsApi.getAdminSystemMonitor(params),

    staleTime: 2_000,

    refetchInterval: 5_000,

    placeholderData: keepPreviousData,
  });
}

export function useAdminSportsActiveCompetitions(
  params: SportsAdminCompetitionQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.activeCompetitions(params),

    queryFn: () =>
      sportsApi.getAdminActiveCompetitions(
        params,
      ),

    staleTime: 30_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminEspnLeagues(
  params: SportsAdminEspnLeagueQuery = {},
) {
  return useQuery({
    queryKey: sportsQueryKeys.espnLeagues(params),

    queryFn: () =>
      sportsApi.getAdminEspnLeagues(params),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminEspnLiveMatches(
  params: SportsAdminEspnLiveMatchQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.espnLiveMatches(params),

    queryFn: () =>
      sportsApi.getAdminEspnLiveMatches(params),

    staleTime: 2_000,

    refetchInterval: 5_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminEspnNews(
  params: SportsAdminNewsQuery = {},
) {
  return useQuery({
    queryKey: sportsQueryKeys.espnNews(params),

    queryFn: () =>
      sportsApi.getAdminEspnNews(params),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminEspnStandings(
  params: SportsAdminStandingQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.espnStandings(params),

    queryFn: () =>
      sportsApi.getAdminEspnStandings(params),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminEspnTeams(
  params: SportsAdminTeamQuery = {},
) {
  return useQuery({
    queryKey: sportsQueryKeys.espnTeams(params),

    queryFn: () =>
      sportsApi.getAdminEspnTeams(params),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminEspnQueueSummary() {
  return useQuery({
    queryKey:
      sportsQueryKeys.espnQueueSummary(),

    queryFn: () =>
      sportsApi.getAdminEspnQueueSummary(),

    staleTime: 2_000,

    refetchInterval: 5_000,
  });
}


export function useAdminEspnQueues(
  params: SportsAdminQueueQuery = {},
) {
  return useQuery({
    queryKey: sportsQueryKeys.espnQueues(params),

    queryFn: () =>
      sportsApi.getAdminEspnQueues(params),

    staleTime: 2_000,

    refetchInterval: 5_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminEspnFixtures(
  params: SportsAdminFixtureQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.espnFixtures(params),

    queryFn: () =>
      sportsApi.getAdminEspnFixtures(params),

    staleTime: 10_000,

    refetchInterval: 15_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminFootballDataCompetitions(
  params: SportsListQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.footballDataCompetitions(),

    queryFn: () =>
      sportsApi.getAdminFootballDataCompetitions(
        params,
      ),

    staleTime: 5 * 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminFootballDataMatches(
  params: SportsAdminFootballDataMatchQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.footballDataMatches(params),

    queryFn: () =>
      sportsApi.getAdminFootballDataMatches(
        params,
      ),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminFootballDataStandings(
  params: SportsAdminFootballDataStandingQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.footballDataStandings(params),

    queryFn: () =>
      sportsApi.getAdminFootballDataStandings(
        params,
      ),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminFootballDataTeams(
  params: SportsAdminFootballDataTeamQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.footballDataTeams(params),

    queryFn: () =>
      sportsApi.getAdminFootballDataTeams(
        params,
      ),

    staleTime: 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminOddsApiSports(
  params: SportsAdminOddsSportsQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.oddsApiSports(params),

    queryFn: () =>
      sportsApi.getAdminOddsApiSports(params),

    staleTime: 5 * 60_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminSportsOddsSnapshots(
  params: SportsAdminOddsSnapshotQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.oddsSnapshots(params),

    queryFn: () =>
      sportsApi.getAdminSportsOddsSnapshots(
        params,
      ),

    staleTime: 15_000,

    refetchInterval: 30_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminProviderRateLimits(
  params: SportsAdminProviderRateLimitQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.providerRateLimits(params),

    queryFn: () =>
      sportsApi.getAdminProviderRateLimits(
        params,
      ),

    staleTime: 5_000,

    refetchInterval: 10_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminYoutubeHighlights(
  params: SportsAdminYoutubeQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.youtubeHighlights(params),

    queryFn: () =>
      sportsApi.getAdminYoutubeHighlights(
        params,
      ),

    staleTime: 30_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminSportsSyncStates(
  params: SportsAdminSyncStateQuery = {},
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.syncStates(params),

    queryFn: () =>
      sportsApi.getAdminSportsSyncStates(params),

    staleTime: 2_000,

    refetchInterval: 5_000,

    placeholderData: keepPreviousData,
  });
}


export function useAdminSportsSyncStateSummary() {
  return useQuery({
    queryKey:
      sportsQueryKeys.syncStateSummary(),

    queryFn: () =>
      sportsApi.getAdminSportsSyncStateSummary(),

    staleTime: 2_000,

    refetchInterval: 5_000,
  });
}


export function useAdminSportsSyncState(
  stateKey?: string,
) {
  return useQuery({
    queryKey:
      sportsQueryKeys.syncState(
        stateKey ?? '',
      ),

    queryFn: () =>
      sportsApi.getAdminSportsSyncState(
        stateKey as string,
      ),

    enabled: Boolean(stateKey),

    staleTime: 2_000,

    refetchInterval: 5_000,

    placeholderData: keepPreviousData,
  });
}

