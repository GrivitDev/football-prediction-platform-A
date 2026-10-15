import {
  PredictionMarkets,
} from './prediction-enums';

export interface PredictionSelectionOption {
  label: string;
  value: string;
}

export interface PredictionMarketOption {
  label: string;
  value: string;
  selections: PredictionSelectionOption[];
}

const option = (
  notation: string,
  name: string,
  value = notation,
): PredictionSelectionOption => ({
  label: `${notation} — ${name}`,
  value,
});

const lineKey = (line: number | string) => String(line);

const overUnder = (
  lines: number[],
  suffix: string,
) => [
  ...lines.map((line) =>
    option(
      `O${line}`,
      `Over ${line} ${suffix}`,
      `OVER_${lineKey(line)}`,
    ),
  ),
  ...lines.map((line) =>
    option(
      `U${line}`,
      `Under ${line} ${suffix}`,
      `UNDER_${lineKey(line)}`,
    ),
  ),
];

const teamOverUnder = (
  side: 'HOME' | 'AWAY',
  notationSide: '1' | '2',
  lines: number[],
  suffix: string,
  period: 'FULL_TIME' | 'FIRST_HALF' | 'SECOND_HALF' = 'FULL_TIME',
) => {
  const sideName = side === 'HOME' ? 'Home' : 'Away';
  const periodPrefix = period === 'FIRST_HALF' ? 'FIRST_HALF_' : period === 'SECOND_HALF' ? 'SECOND_HALF_' : '';
  const periodLabel = period === 'FIRST_HALF' ? 'First-Half ' : period === 'SECOND_HALF' ? 'Second-Half ' : '';
  const marketName = `${sideName} Team ${periodLabel}Total ${suffix}`;

  return [
    ...lines.map((line) =>
      option(
        `${notationSide} O${line}`,
        `${marketName} — Over ${line}`,
        `${side}_${periodPrefix}OVER_${lineKey(line)}`,
      ),
    ),
    ...lines.map((line) =>
      option(
        `${notationSide} U${line}`,
        `${marketName} — Under ${line}`,
        `${side}_${periodPrefix}UNDER_${lineKey(line)}`,
      ),
    ),
  ];
};

const handicapSelections = (
  side: 'HOME' | 'AWAY',
  notationSide: '1' | '2',
  lines: number[],
) =>
  lines.flatMap((line) => [
    option(
      `${notationSide} ${line} W`,
      `${side === 'HOME' ? 'Home' : 'Away'} ${line} — Win`,
      `${side}_${lineKey(line)}_WIN`,
    ),
    option(
      `${notationSide} ${line} P`,
      `${side === 'HOME' ? 'Home' : 'Away'} ${line} — Push`,
      `${side}_${lineKey(line)}_PUSH`,
    ),
    option(
      `${notationSide} ${line} L`,
      `${side === 'HOME' ? 'Home' : 'Away'} ${line} — Lose`,
      `${side}_${lineKey(line)}_LOSE`,
    ),
  ]);

const winnerSelections = [
  option(
    '1',
    'Home Team',
    'HOME',
  ),
  option(
    'X',
    'Draw',
    'DRAW',
  ),
  option(
    '2',
    'Away Team',
    'AWAY',
  ),
];

export const PredictionMarketOptions: PredictionMarketOption[] = [
  // ==================================================
  // MATCH RESULT
  // ==================================================

  {
    label: 'Match Result (1X2)',
    value: PredictionMarkets.MATCH_RESULT,
    selections: winnerSelections,
  },

  {
    label: 'Double Chance',
    value: PredictionMarkets.DOUBLE_CHANCE,
    selections: [
      option(
        '1X',
        'Home or Draw',
      ),
      option(
        'X2',
        'Draw or Away',
      ),
      option(
        '12',
        'Home or Away',
      ),
    ],
  },

  {
    label: 'Draw No Bet',
    value: PredictionMarkets.DRAW_NO_BET,
    selections: [
      option(
        '1',
        'Home',
        'HOME',
      ),
      option(
        '2',
        'Away',
        'AWAY',
      ),
    ],
  },

  // ==================================================
  // GOALS
  // ==================================================

  {
    label: 'Total Goals',
    value: PredictionMarkets.OVER_UNDER,
    selections: overUnder(
      [0.5, 1.5, 2.5, 3.5, 4.5, 5.5],
      'Goals',
    ),
  },

  {
    label: 'Both Teams to Score (BTTS)',
    value: PredictionMarkets.BOTH_TEAMS_TO_SCORE,
    selections: [
      option(
        'GG',
        'Both Teams To Score — Yes',
        'YES',
      ),
      option(
        'NG',
        'Both Teams To Score — No',
        'NO',
      ),
    ],
  },

  {
    label: 'BTTS + Total Goals',
    value: PredictionMarkets.BTTS_GOALS,
    selections: [
      option('GG + O2.5', 'BTTS Yes + Over 2.5 Goals', 'YES_OVER_2.5'),
      option('GG + U2.5', 'BTTS Yes + Under 2.5 Goals', 'YES_UNDER_2.5'),
      option('NG + O2.5', 'BTTS No + Over 2.5 Goals', 'NO_OVER_2.5'),
      option('NG + U2.5', 'BTTS No + Under 2.5 Goals', 'NO_UNDER_2.5'),
      option('GG + O3.5', 'BTTS Yes + Over 3.5 Goals', 'YES_OVER_3.5'),
      option('GG + U3.5', 'BTTS Yes + Under 3.5 Goals', 'YES_UNDER_3.5'),
      option('NG + O3.5', 'BTTS No + Over 3.5 Goals', 'NO_OVER_3.5'),
      option('NG + U3.5', 'BTTS No + Under 3.5 Goals', 'NO_UNDER_3.5'),
    ],
  },

  {
    label: 'Total Goal Range',
    value: PredictionMarkets.GOAL_RANGE,
    selections: [
      option('0', 'Exactly 0 Goals'),
      option('1–2', '1 to 2 Goals', '1-2'),
      option('3–4', '3 to 4 Goals', '3-4'),
      option('5+', '5 or More Goals', '5+'),
    ],
  },

  {
    label: 'Team Total Goals',
    value: PredictionMarkets.TEAM_TOTAL_GOALS,
    selections: [
      ...teamOverUnder(
        'HOME',
        '1',
        [0.5, 1.5, 2.5, 3.5],
        'Goals',
      ),
      ...teamOverUnder(
        'AWAY',
        '2',
        [0.5, 1.5, 2.5, 3.5],
        'Goals',
      ),
      ...teamOverUnder('HOME', '1', [0.5, 1.5], 'Goals', 'FIRST_HALF'),
      ...teamOverUnder('AWAY', '2', [0.5, 1.5], 'Goals', 'FIRST_HALF'),
      ...teamOverUnder('HOME', '1', [0.5, 1.5], 'Goals', 'SECOND_HALF'),
      ...teamOverUnder('AWAY', '2', [0.5, 1.5], 'Goals', 'SECOND_HALF'),
    ],
  },

  {
    label: 'Team to Score',
    value: PredictionMarkets.TEAM_TO_SCORE,
    selections: [
      option('1 Yes', 'Home Team to Score — Yes', 'HOME_YES'),
      option('1 No', 'Home Team to Score — No', 'HOME_NO'),
      option('2 Yes', 'Away Team to Score — Yes', 'AWAY_YES'),
      option('2 No', 'Away Team to Score — No', 'AWAY_NO'),
    ],
  },

  {
    label: 'Exact Team Goals',
    value: PredictionMarkets.EXACT_GOALS,
    selections: [
      ...[0, 1, 2, 3, 4, 5, 6].map((value) =>
        option(
          `1 = ${value}`,
          `Home exactly ${value} goal${value === 1 ? '' : 's'}`,
          `HOME_${value}`,
        ),
      ),
      ...[0, 1, 2, 3, 4, 5, 6].map((value) =>
        option(
          `2 = ${value}`,
          `Away exactly ${value} goal${value === 1 ? '' : 's'}`,
          `AWAY_${value}`,
        ),
      ),
    ],
  },

  {
    label: 'Clean Sheet',
    value: PredictionMarkets.CLEAN_SHEET,
    selections: [
      option(
        '1',
        'Home Team Clean Sheet',
        'HOME',
      ),
      option(
        '2',
        'Away Team Clean Sheet',
        'AWAY',
      ),
    ],
  },

  // ==================================================
  // HALF MARKETS
  // ==================================================

  {
    label: 'Half Time Result',
    value: PredictionMarkets.HALF_TIME_RESULT,
    selections: [
      option('1', 'Home Win', 'HOME'),
      option('X', 'Draw', 'DRAW'),
      option('2', 'Away Win', 'AWAY'),
    ],
  },

  {
    label: 'Second Half Result',
    value: PredictionMarkets.SECOND_HALF_RESULT,
    selections: [
      option('1', 'Home Win', 'HOME'),
      option('X', 'Draw', 'DRAW'),
      option('2', 'Away Win', 'AWAY'),
    ],
  },

  {
    label: 'Half Time / Full Time',
    value: PredictionMarkets.HALF_TIME_FULL_TIME,
    selections: [
      option('1/1', 'Home / Home', 'HOME_HOME'),
      option('1/X', 'Home / Draw', 'HOME_DRAW'),
      option('1/2', 'Home / Away', 'HOME_AWAY'),
      option('X/1', 'Draw / Home', 'DRAW_HOME'),
      option('X/X', 'Draw / Draw', 'DRAW_DRAW'),
      option('X/2', 'Draw / Away', 'DRAW_AWAY'),
      option('2/1', 'Away / Home', 'AWAY_HOME'),
      option('2/X', 'Away / Draw', 'AWAY_DRAW'),
      option('2/2', 'Away / Away', 'AWAY_AWAY'),
    ],
  },

  // ==================================================
  // HANDICAPS
  // ==================================================

  {
    label: 'Asian Handicap',
    value: PredictionMarkets.ASIAN_HANDICAP,
    selections: [
      ...handicapSelections(
        'HOME',
        '1',
        [-2.5, -1.5, -1, -0.5],
      ),
      ...handicapSelections(
        'AWAY',
        '2',
        [0.5, 1, 1.5, 2.5],
      ),
    ],
  },

  {
    label: 'European Handicap',
    value: PredictionMarkets.EUROPEAN_HANDICAP,
    selections: [
      option(
        '1(-2)',
        'Home -2 — Win',
        'HOME_-2_WIN',
      ),
      option(
        'X(-2)',
        'Draw with -2 handicap',
        'DRAW_-2',
      ),
      option(
        '2(-2)',
        'Away -2 — Win',
        'AWAY_-2_WIN',
      ),

      option(
        '1(-1)',
        'Home -1 — Win',
        'HOME_-1_WIN',
      ),
      option(
        'X(-1)',
        'Draw with -1 handicap',
        'DRAW_-1',
      ),
      option(
        '2(-1)',
        'Away -1 — Win',
        'AWAY_-1_WIN',
      ),
    ],
  },

  // ==================================================
  // CORNERS
  // ==================================================

  {
    label: 'Total Corners',
    value: PredictionMarkets.CORNERS_TOTAL,
    selections: overUnder(
      [7.5, 8.5, 9.5, 10.5, 11.5],
      'Corners',
    ),
  },

  {
    label: 'Team Corners',
    value: PredictionMarkets.TEAM_CORNERS,
    selections: [
      ...teamOverUnder(
        'HOME',
        '1',
        [3.5, 4.5, 5.5],
        'Corners',
      ),
      ...teamOverUnder(
        'AWAY',
        '2',
        [3.5, 4.5, 5.5],
        'Corners',
      ),
    ],
  },

  {
    label: 'Corner Handicap',
    value: PredictionMarkets.CORNER_HANDICAP,
    selections: [
      ...handicapSelections(
        'HOME',
        '1',
        [-4, -3, -2],
      ),
      ...handicapSelections(
        'AWAY',
        '2',
        [2, 3, 4],
      ),
    ],
  },

  // ==================================================
  // CARDS
  // ==================================================

  {
    label: 'Total Cards',
    value: PredictionMarkets.CARDS_TOTAL,
    selections: overUnder(
      [2.5, 3.5, 4.5, 5.5, 6.5],
      'Cards',
    ),
  },

  {
    label: 'Team Cards',
    value: PredictionMarkets.TEAM_CARDS,
    selections: [
      ...teamOverUnder(
        'HOME',
        '1',
        [1.5, 2.5, 3.5],
        'Cards',
      ),
      ...teamOverUnder(
        'AWAY',
        '2',
        [1.5, 2.5, 3.5],
        'Cards',
      ),
    ],
  },

  {
    label: 'Card Handicap',
    value: PredictionMarkets.CARD_HANDICAP,
    selections: [
      ...handicapSelections(
        'HOME',
        '1',
        [-3, -2, -1],
      ),
      ...handicapSelections(
        'AWAY',
        '2',
        [1, 2, 3],
      ),
    ],
  },

  // ==================================================
  // MATCH EVENTS
  // ==================================================

  {
    label: 'First Goal',
    value: PredictionMarkets.FIRST_GOAL,
    selections: [
      option(
        '1',
        'Home Team Scores First',
        'HOME',
      ),
      option(
        '0',
        'No Goal',
        'NO_GOAL',
      ),
      option(
        '2',
        'Away Team Scores First',
        'AWAY',
      ),
    ],
  },

  {
    label: 'Last Goal',
    value: PredictionMarkets.LAST_GOAL,
    selections: [
      option(
        '1',
        'Home Team Scores Last',
        'HOME',
      ),
      option(
        '0',
        'No Goal',
        'NO_GOAL',
      ),
      option(
        '2',
        'Away Team Scores Last',
        'AWAY',
      ),
    ],
  },

  {
    label: 'Win To Nil',
    value: PredictionMarkets.WIN_TO_NIL,
    selections: [
      option(
        '1',
        'Home Win To Nil',
        'HOME',
      ),
      option(
        '2',
        'Away Win To Nil',
        'AWAY',
      ),
    ],
  },

  {
    label: 'Correct Score',
    value: PredictionMarkets.CORRECT_SCORE,
    selections: [
      '0-0',
      '1-0',
      '2-0',
      '3-0',
      '4-0',
      '1-1',
      '2-1',
      '3-1',
      '4-1',
      '2-2',
      '3-2',
      '4-2',
      '0-1',
      '0-2',
      '0-3',
      '0-4',
      '1-2',
      '1-3',
      '1-4',
      '2-3',
      '3-3',
      '3-4',
    ].map((score) =>
      option(
        score.replace('-', ':'),
        score.replace('-', ' - '),
      ),
    ),
  },

  // ==================================================
  // STATISTICS
  // ==================================================

  {
    label: 'Possession Winner',
    value: PredictionMarkets.POSSESSION_WINNER,
    selections: winnerSelections,
  },

  {
    label: 'Most Shots',
    value: PredictionMarkets.MOST_SHOTS,
    selections: winnerSelections,
  },

  {
    label: 'Most Shots On Target',
    value: PredictionMarkets.MOST_SHOTS_ON_TARGET,
    selections: winnerSelections,
  },

  {
    label: 'Goal Timing',
    value: PredictionMarkets.GOAL_TIMING,
    selections: [
      option(
        "1–15'",
        'Goal from 1 to 15 minutes',
        '1_15',
      ),
      option(
        "16–30'",
        'Goal from 16 to 30 minutes',
        '16_30',
      ),
      option(
        "31–45'",
        'Goal from 31 to 45 minutes',
        '31_45',
      ),
      option(
        "46–60'",
        'Goal from 46 to 60 minutes',
        '46_60',
      ),
      option(
        "61–75'",
        'Goal from 61 to 75 minutes',
        '61_75',
      ),
      option(
        "76–90'",
        'Goal from 76 to 90 minutes',
        '76_90',
      ),
    ],
  },

  {
    label: 'Total Offsides',
    value: PredictionMarkets.OFFSIDES_TOTAL,
    selections: overUnder(
      [1.5, 2.5, 3.5, 4.5],
      'Offsides',
    ),
  },

  {
    label: 'Team Offsides',
    value: PredictionMarkets.TEAM_OFFSIDES,
    selections: [
      ...teamOverUnder(
        'HOME',
        '1',
        [0.5, 1.5],
        'Offsides',
      ),
      ...teamOverUnder(
        'AWAY',
        '2',
        [0.5, 1.5],
        'Offsides',
      ),
    ],
  },

  {
    label: 'Total Fouls',
    value: PredictionMarkets.FOULS_TOTAL,
    selections: overUnder(
      [20.5, 25.5, 30.5, 35.5],
      'Fouls',
    ),
  },

  {
    label: 'Team Fouls',
    value: PredictionMarkets.TEAM_FOULS,
    selections: [
      ...teamOverUnder(
        'HOME',
        '1',
        [10.5, 12.5, 15.5],
        'Fouls',
      ),
      ...teamOverUnder(
        'AWAY',
        '2',
        [10.5, 12.5, 15.5],
        'Fouls',
      ),
    ],
  },

  {
    label: 'First-Half Total Goals',
    value: PredictionMarkets.FIRST_HALF_GOALS,
    selections: overUnder(
      [0.5, 1.5, 2.5, 3.5],
      'First Half Goals',
    ),
  },

  {
    label: 'Second-Half Total Goals',
    value: PredictionMarkets.SECOND_HALF_GOALS,
    selections: overUnder(
      [0.5, 1.5, 2.5, 3.5],
      'Second Half Goals',
    ),
  },

  {
    label: 'First-Half Total Corners',
    value: PredictionMarkets.FIRST_HALF_CORNERS,
    selections: overUnder(
      [2.5, 3.5, 4.5],
      'First Half Corners',
    ),
  },

  {
    label: 'First-Half Total Cards',
    value: PredictionMarkets.FIRST_HALF_CARDS,
    selections: overUnder(
      [0.5, 1.5, 2.5],
      'First Half Cards',
    ),
  },
];
