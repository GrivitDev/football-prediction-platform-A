import api from '@/lib/axios';

import type {
  AdminPrediction,
  CalculatedPrediction,
  PredictionCalculationContext,
  PredictionData,
  PredictionDetailsBase,
  PredictionUserResponse,
  PredictionMarketSelection,
  PredictionMarketResult,
  PredictionSelection,
  PredictionStatus,
  PredictionOddsSource,
  PredictionProbabilitySource,
  PredictionMarketStatus,
  PredictionSportsDataSnapshot,
  PredictionPlan,
  PredictionAccess,
  SettledWinPrediction,
} from '@/types/prediction.types';

export type {
  AdminPrediction,
  CalculatedPrediction,
  GeneralPrediction,
  LeagueInfo,
  PredictionAccess,
  PredictionAccessState,
  PredictionCalculationContext,
  PredictionData,
  PredictionDetailsBase,
  PredictionFormGame,
  PredictionMarketResult,
  PredictionMarketSelection,
  PredictionMarketStatus,
  PredictionOddsSource,
  PredictionPlan,
  PredictionProbabilitySource,
  PredictionSelection,
  PredictionSportsDataSnapshot,
  PredictionStatus,
  PredictionTeamSnapshot,
  PredictionUserResponse,
  SettledWinPrediction,
} from '@/types/prediction.types';

export interface CalculatePredictionPayload {
  matchId: string;
  accessType: PredictionPlan;
  markets: PredictionMarketSelection[];
}

export const getPredictionContext = async (
  matchId: string,
): Promise<PredictionCalculationContext> => {
  const res = await api.get<PredictionCalculationContext>(
    `/predictions/context/${encodeURIComponent(matchId)}`,
  );
  return res.data;
};

export const calculatePrediction = async (
  payload: CalculatePredictionPayload,
): Promise<CalculatedPrediction> => {
  const res = await api.post<CalculatedPrediction>('/predictions/calculate', payload);
  return res.data;
};

export interface CreatePredictionPayload {
  matchId: string;
  accessType: PredictionPlan;
  markets: PredictionMarketSelection[];
}

export const createPrediction = async (
  payload: CreatePredictionPayload,
): Promise<AdminPrediction> => {
  const res = await api.post<AdminPrediction>('/predictions', payload);
  return res.data;
};

export const getPredictions = async (): Promise<AdminPrediction[]> => {
  const res = await api.get<AdminPrediction[] | { data?: AdminPrediction[]; predictions?: AdminPrediction[] }>('/predictions');
  if (Array.isArray(res.data)) return res.data;
  const payload = res.data as { data?: AdminPrediction[]; predictions?: AdminPrediction[] };
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.predictions)) return payload.predictions;
  return [];
};

/**
 * Returns each user's tier-gated prediction list. The backend redacts prediction
 * selections/markets for tiers the signed-in user cannot access.
 */
export const getPredictionTableRows = async (): Promise<PredictionUserResponse[]> => {
  const res = await api.get<PredictionUserResponse[] | { data?: PredictionUserResponse[]; predictions?: PredictionUserResponse[] }>(
    '/predictions/tables',
  );
  if (Array.isArray(res.data)) return res.data;
  const payload = res.data as { data?: PredictionUserResponse[]; predictions?: PredictionUserResponse[] };
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.predictions)) return payload.predictions;
  return [];
};

export const getSettledWins = async (): Promise<SettledWinPrediction[]> => {
  const res = await api.get<SettledWinPrediction[] | { data?: SettledWinPrediction[] }>('/predictions/settled-wins');
  if (Array.isArray(res.data)) return res.data;
  const payload = res.data as { data?: SettledWinPrediction[] };
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

export const getPrediction = async (id: string): Promise<AdminPrediction> => {
  const res = await api.get<AdminPrediction>(`/predictions/${id}`);
  return res.data;
};

export const getPredictionById = getPrediction;

export interface PredictionDetails extends PredictionDetailsBase {
  access: PredictionAccess;
  data: PredictionData | null;
  actions?: string[];
}

export const getPredictionAccess = async (id: string): Promise<PredictionDetails> => {
  const res = await api.get<PredictionDetails>(`/predictions/user/${id}`);
  return res.data;
};

export interface UpdatePredictionPayload {
  accessType?: PredictionPlan;
  markets?: PredictionMarketSelection[];
}

export const updatePrediction = async (
  id: string,
  payload: UpdatePredictionPayload,
): Promise<AdminPrediction | null> => {
  const res = await api.patch<AdminPrediction>(`/predictions/${id}`, payload);
  return res.data;
};

export const deletePrediction = async (id: string): Promise<AdminPrediction | null> => {
  const res = await api.delete<AdminPrediction | null>(`/predictions/${id}`);
  return res.data;
};

export const settlePrediction = async (id: string): Promise<AdminPrediction> => {
  const res = await api.post<AdminPrediction>(`/settlement/${id}`);
  return res.data;
};

export const voidPrediction = async (id: string): Promise<AdminPrediction> => {
  const res = await api.post<AdminPrediction>(`/settlement/${id}/void`);
  return res.data;
};

export type PredictionServiceMarket = PredictionMarketResult;
export type PredictionServiceSelection = PredictionSelection;
export type PredictionServiceStatus = PredictionStatus;
export type PredictionServiceOddsSource = PredictionOddsSource;
export type PredictionServiceProbabilitySource = PredictionProbabilitySource;
export type PredictionServiceMarketStatus = PredictionMarketStatus;
export type PredictionServiceSportsSnapshot = PredictionSportsDataSnapshot;
