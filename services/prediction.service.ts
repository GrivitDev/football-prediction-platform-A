import api from '@/lib/axios';

// =========================
// TYPES (UI SAFE MODEL)
// =========================
export interface PredictionDetails {

  id: string;


  homeTeam: string;

  awayTeam: string;


  homeTeamBadge?: string;

  awayTeamBadge?: string;


  leagueCode: string;


  league?: {
    code: string;
    name: string;
    country: string;
    emblem?: string;
  };


  matchDate: string;

  status: string;


  preview: {
    prediction: string;
    confidence: number;
  };


  access: {
    allowed: boolean;
    state: 'full' | 'locked';
    price?: number;
    message?: string;
    purchased?: boolean;
  };


  data?: {

    probabilities?: {
      home: number;
      draw: number;
      away: number;
    };


    markets?: {
      market: string;
      selection?: string;
    }[];

  };

}

export interface CreatePredictionPayload {

  matchId: string;

  leagueCode: string;


  league?: {
    code: string;
    name: string;
    country: string;
    emblem?: string;
  };


  homeTeam: string;

  awayTeam: string;


  homeTeamBadge?: string;

  awayTeamBadge?: string;


  confidence: number;


  probabilities: {
    home: number;
    draw: number;
    away: number;
  };


  markets: {
    market: string;
    selection?: string;
  }[];


  accessType:
    | 'free'
    | 'regular'
    | 'vip';


  price: number;


  matchDate: string;

}

export const createPrediction = async (payload: CreatePredictionPayload) => {
  const res = await api.post('/predictions', payload);
  return res.data;
};

// =========================
// GET ALL (TABLE VIEW)
// =========================
export const getPredictions = async () => {
  const res = await api.get('/predictions');
  return res.data;
};

// =========================
// GET ONE (ADMIN RAW)
// =========================
export const getPrediction = async (id: string) => {
  const res = await api.get(`/predictions/${id}`);
  return res.data;
};

// =========================
// GET USER ACCESS VIEW (IMPORTANT)
// =========================
export const getPredictionAccess = async (
  id: string,
): Promise<PredictionDetails> => {
  const res = await api.get(`/predictions/user/${id}`);
  return res.data;
};

export const updatePrediction = async (id: string, payload: any) => {
  const res = await api.patch(`/predictions/${id}`, payload);
  return res.data;
};

export const deletePrediction = async (id: string) => {
  const res = await api.delete(`/predictions/${id}`);
  return res.data;
};

export const settlePrediction = async (
  id: string,
  actualResult: 'HOME' | 'AWAY' | 'DRAW' | 'VOID',
) => {

  const res = await api.post(`/settlement/${id}`, {
    result: actualResult,
  });

  return res.data;
};