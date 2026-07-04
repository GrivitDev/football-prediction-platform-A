// =========================
// MARKETS
// =========================
export const PredictionMarkets = {
  OVER_UNDER: 'OVER_UNDER',
  HALF_TIME: 'HALF_TIME',
  HALF_TIME_FULL_TIME: 'HALF_TIME_FULL_TIME',
  BOTH_TEAMS_TO_SCORE: 'BOTH_TEAMS_TO_SCORE',
  DOUBLE_CHANCE: 'DOUBLE_CHANCE',
  ASIAN_HANDICAP: 'ASIAN_HANDICAP',
  GOALSCORERS: 'GOALSCORERS',
  CORNERS: 'CORNERS',
  CARDS: 'CARDS',
} as const;

export type PredictionMarket =
  (typeof PredictionMarkets)[keyof typeof PredictionMarkets];

// =========================
// SELECTIONS
// =========================
export const PredictionSelections = {
  // =====================
  // OVER / UNDER
  // =====================
  OVER_1_5: 'OVER_1_5',
  OVER_2_5: 'OVER_2_5',
  OVER_3_5: 'OVER_3_5',
  OVER_4_5: 'OVER_4_5',

  UNDER_1_5: 'UNDER_1_5',
  UNDER_2_5: 'UNDER_2_5',
  UNDER_3_5: 'UNDER_3_5',
  UNDER_4_5: 'UNDER_4_5',

  // =====================
  // BOTH TEAMS TO SCORE
  // =====================
  YES: 'YES',
  NO: 'NO',

  // =====================
  // DOUBLE CHANCE
  // =====================
  ONE_X: '1X',
  X_TWO: 'X2',
  ONE_TWO: '12',

  // =====================
  // 1X2 / HALF TIME
  // =====================
  HOME: 'HOME',
  DRAW: 'DRAW',
  AWAY: 'AWAY',

  // =====================
  // HALF TIME / FULL TIME
  // =====================
  HOME_HOME: 'HOME_HOME',
  HOME_DRAW: 'HOME_DRAW',
  HOME_AWAY: 'HOME_AWAY',

  DRAW_HOME: 'DRAW_HOME',
  DRAW_DRAW: 'DRAW_DRAW',
  DRAW_AWAY: 'DRAW_AWAY',

  AWAY_HOME: 'AWAY_HOME',
  AWAY_DRAW: 'AWAY_DRAW',
  AWAY_AWAY: 'AWAY_AWAY',
} as const;

export type PredictionSelection =
  (typeof PredictionSelections)[keyof typeof PredictionSelections];