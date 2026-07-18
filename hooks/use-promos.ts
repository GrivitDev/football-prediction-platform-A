'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getPromos,
  getActivePromos,
  createPromo,
  updatePromo,
  deactivatePromo,
  getMyPromoProgress,
} from '@/services/promos.service';

export function usePromos() {
  return useQuery({
    queryKey: ['promos'],
    queryFn: getPromos,
  });
}

export function useActivePromos() {
  return useQuery({
    queryKey: ['active-promos'],
    queryFn: getActivePromos,
  });
}

export function useMyPromoProgress() {
  return useQuery({
    queryKey: ['promo-progress'],
    queryFn: getMyPromoProgress,
  });
}

export function useCreatePromo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPromo,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['promos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['active-promos'],
      });
    },
  });
}

export function useUpdatePromo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto: any;
    }) => updatePromo(id, dto),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['promos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['active-promos'],
      });
    },
  });
}

export function useDeactivatePromo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivatePromo,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['promos'],
      });

      queryClient.invalidateQueries({
        queryKey: ['active-promos'],
      });
    },
  });
}