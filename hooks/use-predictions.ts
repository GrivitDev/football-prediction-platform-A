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

  list: () =>
    [...predictionQueryKeys.all, 'list'] as const,

  tables: () =>
    [...predictionQueryKeys.all, 'tables'] as const,

  settledWins: () =>
    [...predictionQueryKeys.all, 'settled-wins'] as const,

  detail: (id: string) =>
    [...predictionQueryKeys.all, 'detail', id] as const,

  access: (id: string) =>
    [...predictionQueryKeys.all, 'access', id] as const,
};

export function usePredictionTables() {
  return useQuery({
    queryKey: predictionQueryKeys.tables(),
    queryFn: getPredictionTableRows,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchInterval: 60_000,
    retry: false,
  });
}

export function usePredictions() {
  return useQuery({
    queryKey: predictionQueryKeys.list(),
    queryFn: getPredictions,
    staleTime: 30_000,
  });
}

export function useSettledWins() {
  return useQuery({
    queryKey: predictionQueryKeys.settledWins(),
    queryFn: getSettledWins,
    staleTime: 30_000,
  });
}

export function usePredictionById(id?: string) {
  return useQuery({
    queryKey: predictionQueryKeys.detail(id ?? ''),
    queryFn: () => getPrediction(id as string),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function usePredictionAccess(id?: string) {
  return useQuery<PredictionDetails>({
    queryKey: predictionQueryKeys.access(id ?? ''),
    queryFn: () => getPredictionAccess(id as string),
    enabled: Boolean(id),
    staleTime: 15_000,
  });
}

export function useCalculatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CalculatePredictionPayload) =>
      calculatePrediction(payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.detail(variables.matchId),
      });
    },
  });
}

export function useCreatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePredictionPayload) =>
      createPrediction(payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.tables(),
      });

      if (data.id) {
        void queryClient.invalidateQueries({
          queryKey: predictionQueryKeys.detail(data.id),
        });
      }

      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.settledWins(),
      });
    },
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
    onSuccess: (data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.tables(),
      });

      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.detail(variables.id),
      });

      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.access(variables.id),
      });

      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.settledWins(),
      });

      if (data?.id) {
        void queryClient.invalidateQueries({
          queryKey: predictionQueryKeys.detail(data.id),
        });
      }
    },
  });
}

export function useDeletePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePrediction(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.tables(),
      });

      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.detail(id),
      });

      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.access(id),
      });

      void queryClient.invalidateQueries({
        queryKey: predictionQueryKeys.settledWins(),
      });
    },
  });
}
