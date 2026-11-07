'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  calculatePrediction,
  createPrediction,
  deletePrediction,
  getPrediction,
  getPredictionAccess,
  getPredictionTableRows,
  getPredictions,
  getSettledWins,
  settlePrediction,
  updatePrediction,
  voidPrediction,
  type CalculatePredictionPayload,
  type CreatePredictionPayload,
  type PredictionDetails,
  type UpdatePredictionPayload,
} from '@/services/prediction.service';

export const predictionQueryKeys = {
  all: ['predictions'] as const,
  list: () => [...predictionQueryKeys.all, 'list'] as const,
  tables: () => [...predictionQueryKeys.all, 'tables'] as const,
  settledWins: () => [...predictionQueryKeys.all, 'settled-wins'] as const,
  detail: (id: string) => [...predictionQueryKeys.all, 'detail', id] as const,
  access: (id: string) => [...predictionQueryKeys.all, 'access', id] as const,
};

/**
 * A settlement affects the public tables, recent wins, admin list and any
 * cached detail/access response. Invalidate the common prediction namespace
 * so every view observes the same backend settlement state on its next read.
 */
async function invalidatePredictionViews(
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<void> {
  await queryClient.invalidateQueries({
    queryKey: predictionQueryKeys.all,
  });
}

export function usePredictionTables() {
  return useQuery({
    queryKey: predictionQueryKeys.tables(),
    queryFn: getPredictionTableRows,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    retry: false,
  });
}

export function usePredictions() {
  return useQuery({
    queryKey: predictionQueryKeys.list(),
    queryFn: getPredictions,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  });
}

export function useSettledWins() {
  return useQuery({
    queryKey: predictionQueryKeys.settledWins(),
    queryFn: getSettledWins,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  });
}

export function usePredictionById(id?: string) {
  return useQuery({
    queryKey: predictionQueryKeys.detail(id ?? ''),
    queryFn: () => getPrediction(id as string),
    enabled: Boolean(id),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function usePredictionAccess(id?: string) {
  return useQuery<PredictionDetails>({
    queryKey: predictionQueryKeys.access(id ?? ''),
    queryFn: () => getPredictionAccess(id as string),
    enabled: Boolean(id),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useCalculatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CalculatePredictionPayload) =>
      calculatePrediction(payload),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.detail(variables.matchId),
      }),
  });
}

export function useCreatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePredictionPayload) => createPrediction(payload),
    onSuccess: () => invalidatePredictionViews(queryClient),
  });
}

export function useUpdatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdatePredictionPayload;
    }) => updatePrediction(id, payload),
    onSuccess: () => invalidatePredictionViews(queryClient),
  });
}

export function useDeletePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePrediction(id),
    onSuccess: () => invalidatePredictionViews(queryClient),
  });
}

/** Manual ESPN settlement. Successful and partial outcomes both refresh all views. */
export function useSettlePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => settlePrediction(id),
    onSuccess: () => invalidatePredictionViews(queryClient),
  });
}

/** Manual VOID settlement. The backend remains responsible for integrity checks. */
export function useVoidPrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => voidPrediction(id),
    onSuccess: () => invalidatePredictionViews(queryClient),
  });
}
