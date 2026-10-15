// ============================================================
// SYSTEM MONITOR TYPES
// ============================================================

export type SystemMonitorCronStatus =
  | 'REGISTERED'
  | 'RUNNING'
  | 'SUCCESS'
  | 'FAILED'
  | 'IDLE';

export type SystemMonitorActivityStatus =
  | 'STARTED'
  | 'SUCCESS'
  | 'FAILED'
  | 'INFO';


// ============================================================
// CRON
// ============================================================

export interface SystemMonitorCronDefinition {
  key: string;
  module: string;
  name: string;
  expression?: string;
  timeZone?: string;
  enabled?: boolean;
}


export interface SystemMonitorError {
  module: string;
  source: string;
  operation: string;
  message: string;
  occurredAt: string;
  stack?: string;
  referenceKey?: string;
}


export interface SystemMonitorActivity {
  module: string;
  source: string;
  operation: string;
  status: SystemMonitorActivityStatus;
  message: string;
  occurredAt: string;
  durationMs?: number;
  referenceKey?: string;
}


export interface SystemMonitorCronScheduler {
  active: boolean;
  callbackRunning: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
}


export interface SystemMonitorCronView {
  key: string;
  module: string;
  name: string;
  expression?: string;
  timeZone?: string;
  enabled: boolean;

  status: SystemMonitorCronStatus;

  lastStartedAt?: string;
  lastSuccessfulAt?: string;
  lastFailedAt?: string;
  lastDurationMs?: number;
  consecutiveFailures: number;
  lastError?: string;

  scheduler: SystemMonitorCronScheduler;
}


// ============================================================
// SYSTEM
// ============================================================

export interface SystemMonitorSystemStatus {
  status: 'ONLINE' | string;
  startedAt: string;
  uptimeSeconds: number;
  currentTime: string;
}


export interface SystemMonitorSummary {
  totalCrons: number;
  runningCrons: number;
  failedCrons: number;
  recentErrors: number;
}


export interface SystemMonitorDashboard {
  system: SystemMonitorSystemStatus;

  summary: SystemMonitorSummary;

  crons: SystemMonitorCronView[];

  recentActivity: SystemMonitorActivity[];

  recentErrors: SystemMonitorError[];
}


// ============================================================
// STORAGE
// ============================================================

export interface SystemMonitorStorageCollection {
  name: string;

  documents: number;

  dataSizeBytes: number;

  storageSizeBytes: number;

  averageDocumentSizeBytes: number;

  indexes: number;

  totalIndexSizeBytes: number;

  totalSizeBytes: number;
}


export interface SystemMonitorStorageTotals {
  collections: number;

  documents: number;

  dataSizeBytes: number;

  storageSizeBytes: number;

  indexSizeBytes: number;

  totalSizeBytes: number;
}


export interface SystemMonitorStorageSnapshot {
  capturedAt: string;

  databaseName: string;

  totals: SystemMonitorStorageTotals;

  collections: SystemMonitorStorageCollection[];
}


export interface SystemMonitorStorageResponse
  extends SystemMonitorStorageSnapshot {
  persistedAt?: string;
}


export interface SystemMonitorStorageHistoryItem {
  capturedAt: string;

  databaseName: string;

  totals: SystemMonitorStorageTotals;
}


export interface SystemMonitorStorageHistoryQuery {
  limit?: number;
}


// ============================================================
// QUERY TYPES
// ============================================================

export interface SystemMonitorCronQuery {
  module?: string;
  status?: SystemMonitorCronStatus | string;
}


export interface SystemMonitorErrorQuery {
  module?: string;
  limit?: number;
}


export interface SystemMonitorActivityQuery {
  module?: string;
  status?: SystemMonitorActivityStatus | string;
  limit?: number;
}