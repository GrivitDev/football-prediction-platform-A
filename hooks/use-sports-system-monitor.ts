'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import sportsSystemMonitorApi from '@/services/sports-system-monitor.service';

import type {
  MonitorExpectedWork,
  MonitorLeagueSummary,
  MonitorNewsSummary,
  MonitorStandingSummary,
  SportsSystemMonitorResponse,
} from '@/types/sports-system-monitor';

type MonitorLeague = MonitorLeagueSummary & {
  standings: MonitorStandingSummary;
  news: MonitorNewsSummary;
  expectedWork: MonitorExpectedWork & { standingsMissingTeams: number };
  loadingStage: string | null;
  error?: string;
};

type ProgressiveMonitorResponse = Omit<SportsSystemMonitorResponse, 'leagues'> & {
  leagues: MonitorLeague[];
};

const REQUEST_TIMEOUT_MS = 8_000;
const CLIENT_CACHE_TTL_MS = 2_000;
const EMPTY_EXPECTED_WORK: MonitorExpectedWork = {
  finishedFixturesMissingSummary: 0,
  upcomingFixturesMissingSummary: 0,
  staleActiveLeagues: 0,
  upcomingFixturesMissingOdds: 0,
  standingsMissingTeams: 0,
};
const EMPTY_STANDINGS: MonitorStandingSummary = {
  rows: 0,
  teams: 0,
  expectedTeams: 0,
  missingTeams: 0,
  coveragePercent: 0,
};
const EMPTY_NEWS: MonitorNewsSummary = {
  total: 0,
  last24Hours: 0,
};
const PRIORITY_ORDER: Record<string, number> = {
  ELITE: 1,
  HIGH: 2,
  REGIONAL: 3,
  SELECTIVE: 4,
};

let cachedSnapshot: SportsSystemMonitorResponse | null = null;
let cachedSnapshotAt = 0;
let inFlightSnapshot: Promise<SportsSystemMonitorResponse> | null = null;

function normalizeConsolidatedResponse(
  response: SportsSystemMonitorResponse,
): ProgressiveMonitorResponse {
  const leagues: MonitorLeague[] = [...(response.leagues ?? [])]
    .sort(
      (a, b) =>
        (PRIORITY_ORDER[String(a.priority).toUpperCase()] ?? 99) -
          (PRIORITY_ORDER[String(b.priority).toUpperCase()] ?? 99) ||
        a.name.localeCompare(b.name),
    )
    .map((league) => {
      const expectedWork = {
        ...EMPTY_EXPECTED_WORK,
        ...(league.expectedWork ?? {}),
        standingsMissingTeams: Number(
          league.expectedWork?.standingsMissingTeams ?? league.standings?.missingTeams ?? 0,
        ),
      };
      const finishedMissingSummary = Number(
        league.fixtures?.finishedMissingSummary ?? expectedWork.finishedFixturesMissingSummary ?? 0,
      );
      const finishedWithSummary = Number(
        league.fixtures?.finishedWithSummary ??
          Math.max(0, Number(league.fixtures?.finished ?? 0) - finishedMissingSummary),
      );

      return {
        ...league,
        fixtures: { ...league.fixtures, finishedWithSummary, finishedMissingSummary },
        standings: league.standings ?? { ...EMPTY_STANDINGS },
        news: league.news ?? { ...EMPTY_NEWS },
        expectedWork,
        loadingStage: 'DONE',
      };
    });

  const standingsMissingTeams = leagues.reduce(
    (total, league) => total + league.expectedWork.standingsMissingTeams,
    0,
  );

  return {
    ...response,
    expectedWork: {
      ...EMPTY_EXPECTED_WORK,
      ...(response.expectedWork ?? {}),
      standingsMissingTeams: Number(
        response.expectedWork?.standingsMissingTeams ?? standingsMissingTeams,
      ),
    },
    leagues,
  };
}

function validateResponse(response: SportsSystemMonitorResponse): void {
  if (
    !response ||
    typeof response !== 'object' ||
    typeof response.generatedAt !== 'string' ||
    !response.scope ||
    !response.inventory ||
    !response.queue ||
    !response.sync ||
    !Array.isArray(response.leagues)
  ) {
    throw new Error('The sports monitor endpoint returned an incomplete response.');
  }
}

async function requestSnapshot(forceRefresh: boolean): Promise<SportsSystemMonitorResponse> {
  const cacheIsFresh =
    cachedSnapshot !== null && Date.now() - cachedSnapshotAt < CLIENT_CACHE_TTL_MS;

  if (!forceRefresh && cacheIsFresh && cachedSnapshot) return cachedSnapshot;
  if (inFlightSnapshot) return inFlightSnapshot;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const request = Promise.race([
    sportsSystemMonitorApi.getSystemMonitor({ forceRefresh }).then((response) => {
      validateResponse(response);
      // The warm-up response is intentionally not cached.
      if (response.snapshotReady !== false) {
        cachedSnapshot = response;
        cachedSnapshotAt = Date.now();
      }
      return response;
    }),
    new Promise<SportsSystemMonitorResponse>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error('The sports monitor request timed out. Check the backend endpoint and database connection.')),
        REQUEST_TIMEOUT_MS,
      );
    }),
  ]).finally(() => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    if (inFlightSnapshot === request) inFlightSnapshot = null;
  });

  inFlightSnapshot = request;
  return request;
}

export function useSportsSystemMonitor() {
  const [data, setData] = useState<ProgressiveMonitorResponse | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mountedRef = useRef(false);
  const requestIdRef = useRef(0);
  const dataRef = useRef<ProgressiveMonitorResponse | null>(null);
  const loadRef = useRef<(forceRefresh: boolean) => Promise<void>>(async () => {});
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedulePoll = useCallback((delayMs: number) => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    pollTimerRef.current = setTimeout(() => {
      pollTimerRef.current = null;
      if (mountedRef.current) void loadRef.current(false);
    }, delayMs);
  }, []);

  const load = useCallback(async (forceRefresh: boolean) => {
    const requestId = ++requestIdRef.current;
    setIsFetching(true);
    setIsError(false);
    setError(null);
    if (!dataRef.current) setIsLoading(true);

    try {
      const response = await requestSnapshot(forceRefresh);
      if (!mountedRef.current || requestId !== requestIdRef.current) return;

      if (response.snapshotReady === false) {
        if (response.snapshotError) {
          setIsError(true);
          setError(new Error(response.snapshotError));
          setIsLoading(false);
          return;
        }

        // The backend is building a single snapshot. Poll its quick status
        // response rather than starting dozens of sequential sports API calls.
        setIsLoading(!dataRef.current);
        schedulePoll(1_500);
        return;
      }

      const normalized = normalizeConsolidatedResponse(response);
      dataRef.current = normalized;
      setData(normalized);
      setIsLoading(false);
      if (response.snapshotError) {
        setIsError(true);
        setError(new Error(response.snapshotError));
        // Keep the last usable snapshot on screen; a manual refresh can retry.
      } else {
        setIsError(false);
        setError(null);
        // Keep data visible while stale data is refreshed in the background.
        schedulePoll(response.refreshing ? 2_000 : 10_000);
      }
    } catch (caughtError) {
      if (!mountedRef.current || requestId !== requestIdRef.current) return;
      const requestError = caughtError instanceof Error
        ? caughtError
        : new Error('Unable to load the sports system monitor.');
      setIsError(true);
      setError(requestError);
      if (!dataRef.current) setIsLoading(false);
      schedulePoll(dataRef.current ? 15_000 : 5_000);
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) setIsFetching(false);
    }
  }, [schedulePoll]);

  loadRef.current = load;
  const refetch = useCallback(() => load(true), [load]);

  useEffect(() => {
    mountedRef.current = true;
    void load(false);
    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [load]);

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess: Boolean(data) && !isError,
    refetch,
    usedFallbackCollector: false,
  };
}
