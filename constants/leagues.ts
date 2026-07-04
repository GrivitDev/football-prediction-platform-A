export const LEAGUE_NAMES: Record<string, string> = {
  // England
  PL: 'Premier League',
  ELC: 'EFL Championship',
  EL1: 'EFL League One',
  EL2: 'EFL League Two',

  // Spain
  PD: 'La Liga',
  SD: 'La Liga 2',

  // Germany
  BL1: 'Bundesliga',
  BL2: '2. Bundesliga',

  // Italy
  SA: 'Serie A',
  SB: 'Serie B',

  // France
  FL1: 'Ligue 1',
  FL2: 'Ligue 2',

  // Netherlands
  DED: 'Eredivisie',

  // Portugal
  PPL: 'Primeira Liga',

  // Belgium
  BSA: 'Belgian Pro League',

  // Scotland
  SPL: 'Scottish Premiership',

  // Turkey
  TSL: 'Süper Lig',

  // Greece
  GSL: 'Greek Super League',

  // Austria
  BUN: 'Austrian Bundesliga',

  // Switzerland
  SUI: 'Swiss Super League',

  // Denmark
  DSL: 'Danish Superliga',

  // Norway
  ENS: 'Eliteserien',

  // Sweden
  ALL: 'Allsvenskan',

  // Poland
  EKS: 'Ekstraklasa',

  // Czech Republic
  CFL: 'Czech First League',

  // Romania
  LIG1: 'Liga I',

  // Croatia
  HNL: 'Hrvatska Nogometna Liga',

  // Serbia
  SLS: 'Serbian SuperLiga',

  // Ukraine
  UPL: 'Ukrainian Premier League',

  // Saudi Arabia
  SPLSA: 'Saudi Pro League',

  // United Arab Emirates
  UAEPL: 'UAE Pro League',

  // Qatar
  QSL: 'Qatar Stars League',

  // Egypt
  EPLEG: 'Egyptian Premier League',

  // South Africa
  PSL: 'Premier Soccer League',

  // Morocco
  BOTOLA: 'Botola Pro',

  // Algeria
  ALG1: 'Algerian Ligue Professionnelle 1',

  // Tunisia
  TUN1: 'Tunisian Ligue Professionnelle 1',

  // Nigeria
  NPFL: 'Nigeria Premier Football League',

  // USA
  MLS: 'Major League Soccer',

  // Mexico
  LMX: 'Liga MX',

  // Argentina
  LPF: 'Liga Profesional Argentina',

  // Brazil
  BSAA: 'Campeonato Brasileiro Série A',
  BSB: 'Campeonato Brasileiro Série B',

  // Colombia
  COLA: 'Categoría Primera A',

  // Chile
  CHI1: 'Chilean Primera División',

  // Uruguay
  UYPD: 'Uruguayan Primera División',

  // Peru
  PER1: 'Peruvian Primera División',

  // Japan
  J1: 'J1 League',

  // South Korea
  KL1: 'K League 1',

  // China
  CSL: 'Chinese Super League',

  // Australia
  AL: 'A-League',

  // International
  CL: 'UEFA Champions League',
  EL: 'UEFA Europa League',
  ECL: 'UEFA Europa Conference League',
  SC: 'UEFA Super Cup',

  // National Teams
  WC: 'FIFA World Cup',
  EC: 'UEFA European Championship',
  UNL: 'UEFA Nations League',

  // Africa
  AFCON: 'Africa Cup of Nations',
  CAFCL: 'CAF Champions League',
  CAFCC: 'CAF Confederation Cup',

  // South America
  LIB: 'Copa Libertadores',
  SUD: 'Copa Sudamericana',

  // North America
  CCL: 'CONCACAF Champions Cup',

  // Clubs
  CWC: 'FIFA Club World Cup',
};

export const getLeagueName = (
  code?: string,
): string => {
  if (!code) return '-';

  return LEAGUE_NAMES[code] ?? code;
};