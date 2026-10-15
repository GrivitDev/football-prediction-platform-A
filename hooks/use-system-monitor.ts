'use client';

import {
  useQuery,
} from '@tanstack/react-query';

import systemMonitorApi from '@/services/system-monitor.service';

import type {
  SystemMonitorActivityQuery,
  SystemMonitorCronQuery,
  SystemMonitorErrorQuery,
  SystemMonitorStorageHistoryQuery,
} from '@/types/system-monitor';


// ============================================================
// QUERY KEYS
// ============================================================

export const systemMonitorQueryKeys = {
  all: ['system-monitor'] as const,


  // ==========================================================
  // DASHBOARD
  // ==========================================================

  dashboard: () =>
    [
      ...systemMonitorQueryKeys.all,
      'dashboard',
    ] as const,


  // ==========================================================
  // CRONS
  // ==========================================================

  crons: (
    params: SystemMonitorCronQuery = {},
  ) =>
    [
      ...systemMonitorQueryKeys.all,
      'crons',
      params,
    ] as const,


  cron: (
    key: string,
  ) =>
    [
      ...systemMonitorQueryKeys.all,
      'cron',
      key,
    ] as const,


  // ==========================================================
  // ERRORS
  // ==========================================================

  errors: (
    params: SystemMonitorErrorQuery = {},
  ) =>
    [
      ...systemMonitorQueryKeys.all,
      'errors',
      params,
    ] as const,


  // ==========================================================
  // ACTIVITY
  // ==========================================================

  activity: (
    params: SystemMonitorActivityQuery = {},
  ) =>
    [
      ...systemMonitorQueryKeys.all,
      'activity',
      params,
    ] as const,


  // ==========================================================
  // STORAGE
  // ==========================================================

  storage: () =>
    [
      ...systemMonitorQueryKeys.all,
      'storage',
    ] as const,


  storageHistory: (
    params: SystemMonitorStorageHistoryQuery = {},
  ) =>
    [
      ...systemMonitorQueryKeys.all,
      'storage-history',
      params,
    ] as const,
};


// ============================================================
// DASHBOARD
// ============================================================

export function useSystemMonitorDashboard() {
  return useQuery({
    queryKey:
      systemMonitorQueryKeys.dashboard(),

    queryFn: () =>
      systemMonitorApi.getDashboard(),

    staleTime: 10_000,

    refetchInterval: 15_000,
  });
}


// ============================================================
// CRONS
// ============================================================

export function useSystemMonitorCrons(
  params: SystemMonitorCronQuery = {},
) {
  return useQuery({
    queryKey:
      systemMonitorQueryKeys.crons(params),

    queryFn: () =>
      systemMonitorApi.getCrons(params),

    staleTime: 10_000,

    refetchInterval: 15_000,
  });
}


export function useSystemMonitorCron(
  key?: string,
) {
  return useQuery({
    queryKey:
      systemMonitorQueryKeys.cron(
        key ?? '',
      ),

    queryFn: () =>
      systemMonitorApi.getCron(
        key as string,
      ),

    enabled: Boolean(key),

    staleTime: 10_000,

    refetchInterval: 15_000,
  });
}


// ============================================================
// ERRORS
// ============================================================

export function useSystemMonitorErrors(
  params: SystemMonitorErrorQuery = {},
) {
  return useQuery({
    queryKey:
      systemMonitorQueryKeys.errors(params),

    queryFn: () =>
      systemMonitorApi.getErrors(params),

    staleTime: 10_000,

    refetchInterval: 15_000,
  });
}


// ============================================================
// ACTIVITY
// ============================================================

export function useSystemMonitorActivity(
  params: SystemMonitorActivityQuery = {},
) {
  return useQuery({
    queryKey:
      systemMonitorQueryKeys.activity(params),

    queryFn: () =>
      systemMonitorApi.getActivity(params),

    staleTime: 10_000,

    refetchInterval: 15_000,
  });
}


// ============================================================
// STORAGE
// ============================================================

export function useSystemMonitorStorage() {
  return useQuery({
    queryKey:
      systemMonitorQueryKeys.storage(),

    queryFn: () =>
      systemMonitorApi.getStorage(),

    staleTime: 60_000,

    refetchInterval: 60_000,
  });
}


// ============================================================
// STORAGE HISTORY
// ============================================================

export function useSystemMonitorStorageHistory(
  params: SystemMonitorStorageHistoryQuery = {},
) {
  return useQuery({
    queryKey:
      systemMonitorQueryKeys.storageHistory(
        params,
      ),

    queryFn: () =>
      systemMonitorApi.getStorageHistory(
        params,
      ),

    staleTime: 300_000,

    refetchInterval: 300_000,
  });
}