import api from '@/lib/axios';

// =========================
// TYPES
// =========================
export interface League {
  code: string;
  name: string;
  country: string;
  type?: string;
  emblem?: string;
}

export interface Match {
  id: string;

  leagueCode: string;

  homeTeam: string;
  awayTeam: string;

  homeTeamBadge?: string;
  awayTeamBadge?: string;

  date: string;
  time?: string;

  status?: string;

  matchday?: number;

  homeScore?: number | null;
  awayScore?: number | null;

  // ✅ NEW (SYNCED WITH BACKEND)
  kickoffTimestamp?: number;
}

// =========================
// LEAGUES
// =========================
export const getLeagues = async (): Promise<League[]> => {
  const res = await api.get('/sports/leagues');
  return res.data;
};

// =========================
// FIXTURES
// =========================
export const getFixtures = async (
  leagueCode: string,
): Promise<Match[]> => {
  const res = await api.get('/sports/fixtures', {
    params: {
      leagueCode,
    },
  });

  return res.data;
};

// =========================
// MATCH DETAILS
// =========================
export const getMatchDetails = async (
  matchId: string,
): Promise<Match> => {
  const res = await api.get(`/sports/match/${matchId}`);
  return res.data;
};

// =========================
// RESULTS
// =========================
export const getPastResults = async (
  leagueCode: string,
): Promise<Match[]> => {
  const res = await api.get('/sports/results', {
    params: {
      leagueCode,
    },
  });

  return res.data;
};

// =========================
// STANDINGS
// =========================
export const getStandings = async (
  leagueCode: string,
) => {
  const res = await api.get('/sports/standings', {
    params: {
      leagueCode,
    },
  });

  return res.data;
};