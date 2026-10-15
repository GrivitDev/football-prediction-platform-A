// Shared prediction contracts used by the admin UI and public prediction views.

export type PredictionPlan = 'free' | 'regular' | 'vip' | 'premium';
export type PredictionStatus = 'pending' | 'won' | 'lost' | 'void';
export type PredictionMarketStatus = 'pending' | 'won' | 'lost' | 'void' | 'push';

export type PredictionProbabilitySource =
  | 'ESPN_PROBABILITY' // retained for historical documents
  | 'IMPLIED_ESPN_ODDS'
  | 'IMPLIED_ODDS_API'
  | 'COMBINATION' // retained for historical documents
  | 'FALLBACK_ESTIMATE';

export type PredictionOddsSource = 'ESPN' | 'ODDS_API';
export type PredictionMarketScope = 'MATCH' | 'HOME' | 'AWAY';
export type PredictionMarketPeriod = 'FULL_TIME' | 'FIRST_HALF' | 'SECOND_HALF';

export type PredictionAccessState =
  | 'subscription'
  | 'locked'
  | 'upgrade_required'
  | 'login_required'
  | 'settled';

export type PredictionMarket = string;

export interface LeagueInfo {
  code: string;
  name: string;
  country: string;
  emblem?: string;
}

export interface PredictionSelection {
  market: PredictionMarket;
  selection: string;
  scope?: PredictionMarketScope;
  period?: PredictionMarketPeriod;
  line?: number;
  outcome?: string;
}

export interface PredictionMarketSelection {
  market: PredictionMarket;
  selection: string;
  scope?: PredictionMarketScope;
  period?: PredictionMarketPeriod;
  line?: number;
  outcome?: string;
}

export interface PredictionMarketResult {
  market: PredictionMarket;
  selection: string;
  scope?: PredictionMarketScope;
  period?: PredictionMarketPeriod;
  line?: number;
  outcome?: string;
  probability: number;
  probabilitySource: PredictionProbabilitySource;
  odds?: number;
  fairOdds: number;
  oddsSource?: PredictionOddsSource;
  status: PredictionMarketStatus;
}

export interface PredictionSportsDataSnapshot {
  fixtureCollectedAt: string;
  summaryCollectedAt: string;
}

export interface PredictionFormGame {
  date: string;
  opponentId: string;
  opponent: string;
  goalsFor: number;
  goalsAgainst: number;
  result: 'W' | 'D' | 'L';
}

export interface PredictionTeamSnapshot {
  tablePosition?: number;
  lastFiveGames: PredictionFormGame[];
}

export interface PredictionOutcomeProbability {
  probability: number;
  fairOdds: number;
  odds?: number;
  oddsSource?: PredictionOddsSource;
}

export interface GeneralPrediction {
  home: PredictionOutcomeProbability;
  draw: PredictionOutcomeProbability;
  away: PredictionOutcomeProbability;
}

export interface PredictionContextOdd {
  market: string;
  selection: string;
  line?: number;
  decimalOdds: number;
  source: 'PICKCENTER' | 'ESPN_ODDS' | 'ODDS_API';
  provider?: string;
}

export interface PredictionHeadToHeadMatch {
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
}

export interface PredictionCalculationContext {
  match: {
    eventId: string;
    leagueCode: string;
    kickoff: string;
    homeTeam: { id: string; name: string; logo?: string };
    awayTeam: { id: string; name: string; logo?: string };
  };
  odds: PredictionContextOdd[];
  headToHead: {
    matchesCount: number;
    homeTeamWins: number;
    draws: number;
    awayTeamWins: number;
    matches: PredictionHeadToHeadMatch[];
  };
  lastFiveGames: {
    home: PredictionFormGame[];
    away: PredictionFormGame[];
  };
  standings: {
    home?: { position?: number; played?: number; wins?: number; draws?: number; losses?: number; goalDifference?: number; points?: number };
    away?: { position?: number; played?: number; wins?: number; draws?: number; losses?: number; goalDifference?: number; points?: number };
  };
  collectedAt: { fixture?: string; summary?: string; odds?: string };
  teamContext: { home: PredictionTeamSnapshot; away: PredictionTeamSnapshot };
}

export interface CalculatedPrediction {
  matchId: string;
  leagueCode: string;
  league?: LeagueInfo;
  homeTeam: string;
  awayTeam: string;
  homeTeamBadge?: string;
  awayTeamBadge?: string;
  matchDate: string;
  kickoffTimestamp: number;
  prediction: PredictionSelection;
  predictionProbability: number;
  probabilitySource: PredictionProbabilitySource;
  /** Support confidence, not a win probability. The backend returns 70–95. */
  confidence: number;
  predictionOdds?: number;
  predictionFairOdds: number;
  predictionOddsSource?: PredictionOddsSource;
  generalPrediction: GeneralPrediction;
  teamContext: { home: PredictionTeamSnapshot; away: PredictionTeamSnapshot };
  /** Available on a calculation preview, not stored in the Prediction document. */
  calculationContext?: PredictionCalculationContext;
  sportsDataSnapshot?: PredictionSportsDataSnapshot;
  modelVersion?: string;
  calculatedAt?: string;
  markets: PredictionMarketResult[];
}

export interface AdminPrediction extends CalculatedPrediction {
  id?: string;
  _id?: string;
  accessType: PredictionPlan;
  status: PredictionStatus;
  settled: boolean;
  deleted: boolean;
  settledAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PredictionAccess {
  allowed: boolean;
  state: PredictionAccessState;
  plan: PredictionPlan;
  message: string | null;
}

export interface PredictionDetailsBase {
  id?: string;
  _id?: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamBadge?: string;
  awayTeamBadge?: string;
  leagueCode: string;
  league?: LeagueInfo;
  matchDate: string;
  kickoffTimestamp: number;
  status: PredictionStatus;
  accessType: PredictionPlan;
  confidence?: number;
}

export interface PredictionData {
  prediction: PredictionSelection;
  predictionProbability: number;
  probabilitySource: PredictionProbabilitySource;
  confidence: number;
  markets: PredictionMarketResult[];
  generalPrediction?: GeneralPrediction;
  teamContext?: { home: PredictionTeamSnapshot; away: PredictionTeamSnapshot };
}

export interface PredictionUserResponse extends PredictionDetailsBase {
  access: PredictionAccess;
  data: PredictionData | null;
  actions?: string[];
}

export type SettledWinPrediction = AdminPrediction & {
  data: PredictionData;
  access: PredictionAccess;
};

export interface SettlementBatchResult {
  processed: number;
  settled: number;
  skipped: number;
}

export interface PredictionQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number | false;
}

