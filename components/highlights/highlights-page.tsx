'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useAdminYoutubeHighlights,
  useSportsCompetitions,
} from '@/hooks/use-sports';

import type {
  YouTubeHighlightRecord,
} from '@/types/sports';

const HIGHLIGHT_LIMIT = 50;

type DateFilter =
  | 'all'
  | 'today'
  | 'yesterday'
  | '7-days'
  | '30-days';

function getValidDate(
  value?: string,
): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function getHighlightDate(
  highlight: YouTubeHighlightRecord,
): string {
  return (
    highlight.publishedAt ??
    highlight.searchedAt ??
    highlight.createdAt ??
    ''
  );
}

function getDateKey(
  value?: string,
): string {
  const date = getValidDate(value);

  if (!date) {
    return '';
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function getTodayDate(): Date {
  const date = new Date();

  date.setHours(
    0,
    0,
    0,
    0,
  );

  return date;
}

function getDayOffset(
  days: number,
): Date {
  const date = getTodayDate();

  date.setDate(
    date.getDate() - days,
  );

  return date;
}

function getDateFilterStart(
  filter: DateFilter,
): Date | null {
  switch (filter) {
    case 'today':
      return getTodayDate();

    case 'yesterday':
      return getDayOffset(1);

    case '7-days':
      return getDayOffset(6);

    case '30-days':
      return getDayOffset(29);

    case 'all':
    default:
      return null;
  }
}

function isWithinDateFilter(
  value: string,
  filter: DateFilter,
): boolean {
  if (filter === 'all') {
    return true;
  }

  const date = getValidDate(value);

  if (!date) {
    return false;
  }

  const start = getDateFilterStart(filter);

  if (!start) {
    return true;
  }

  const dateKey = getDateKey(
    date.toISOString(),
  );

  const startKey = getDateKey(
    start.toISOString(),
  );

  if (
    filter === 'today' ||
    filter === 'yesterday'
  ) {
    return dateKey === startKey;
  }

  return date >= start;
}

function formatDate(
  value: string,
): string {
  const date = getValidDate(value);

  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  ).format(date);
}

function getYoutubeVideoId(
  highlight: YouTubeHighlightRecord,
): string | undefined {
  if (highlight.videoId) {
    return highlight.videoId;
  }

  if (!highlight.videoUrl) {
    return undefined;
  }

  try {
    const url = new URL(
      highlight.videoUrl,
    );

    if (
      url.hostname === 'youtu.be' ||
      url.hostname.endsWith('.youtu.be')
    ) {
      return (
        url.pathname
          .replace(
            /^\/+/,
            '',
          )
          .split('/')[0] ||
        undefined
      );
    }

    if (
      url.hostname.includes(
        'youtube.com',
      )
    ) {
      const queryId =
        url.searchParams.get('v');

      if (queryId) {
        return queryId;
      }

      const match =
        url.pathname.match(
          /\/(?:embed|shorts|live)\/([^/?]+)/i,
        );

      return match?.[1];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function getYoutubeWatchUrl(
  highlight: YouTubeHighlightRecord,
): string | undefined {
  const videoId =
    getYoutubeVideoId(
      highlight,
    );

  if (!videoId) {
    return highlight.videoUrl;
  }

  return `https://www.youtube.com/watch?v=${encodeURIComponent(
    videoId,
  )}`;
}

function getYoutubeEmbedUrl(
  highlight: YouTubeHighlightRecord,
): string | undefined {
  const videoId =
    getYoutubeVideoId(
      highlight,
    );

  if (!videoId) {
    return undefined;
  }

  const query =
    new URLSearchParams({
      autoplay: '1',
      controls: '1',
      enablejsapi: '1',
      fs: '1',
      iv_load_policy: '3',
      playsinline: '1',
      rel: '0',
    });

  return `https://www.youtube.com/embed/${encodeURIComponent(
    videoId,
  )}?${query.toString()}`;
}

function getFallbackThumbnail(
  highlight: YouTubeHighlightRecord,
): string | undefined {
  const videoId =
    getYoutubeVideoId(
      highlight,
    );

  return videoId
    ? `https://i.ytimg.com/vi/${encodeURIComponent(
        videoId,
      )}/hqdefault.jpg`
    : undefined;
}

function getLeagueName(
  highlight: YouTubeHighlightRecord,
  competitionMap: Map<
    string,
    string
  >,
): string {
  if (!highlight.competitionId) {
    return 'Football';
  }

  return (
    competitionMap.get(
      highlight.competitionId.toLowerCase(),
    ) ??
    highlight.competitionId
  );
}

function getSearchText(
  highlight: YouTubeHighlightRecord,
  leagueName: string,
): string {
  return [
    highlight.title,
    highlight.homeTeam,
    highlight.awayTeam,
    highlight.channelTitle,
    leagueName,
    highlight.competitionId,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function getUniqueHighlights(
  highlights: YouTubeHighlightRecord[],
): YouTubeHighlightRecord[] {
  const seenVideoIds =
    new Set<string>();

  const seenFallbackKeys =
    new Set<string>();

  const unique: YouTubeHighlightRecord[] =
    [];

  for (const highlight of highlights) {
    const videoId =
      getYoutubeVideoId(
        highlight,
      );

    if (videoId) {
      const normalizedVideoId =
        videoId
          .trim()
          .toLowerCase();

      if (
        !normalizedVideoId ||
        seenVideoIds.has(
          normalizedVideoId,
        )
      ) {
        continue;
      }

      seenVideoIds.add(
        normalizedVideoId,
      );

      unique.push(
        highlight,
      );

      continue;
    }

    const fallbackKey = [
      highlight.title ?? '',
      highlight.videoUrl ?? '',
      highlight.fixtureId ?? '',
    ]
      .join('|')
      .trim()
      .toLowerCase();

    if (
      !fallbackKey ||
      seenFallbackKeys.has(
        fallbackKey,
      )
    ) {
      continue;
    }

    seenFallbackKeys.add(
      fallbackKey,
    );

    unique.push(
      highlight,
    );
  }

  return unique;
}

function HighlightPlayer({
  highlight,
}: {
  highlight: YouTubeHighlightRecord;
}) {
  const embedUrl =
    getYoutubeEmbedUrl(
      highlight,
    );

  const watchUrl =
    getYoutubeWatchUrl(
      highlight,
    );

  if (!embedUrl) {
    return (
      <div className="flex aspect-video items-center justify-center bg-muted p-3 text-center text-[11px] text-muted-foreground sm:p-4 sm:text-xs">
        <div>
          <p>
            This highlight cannot be
            embedded here.
          </p>

          {watchUrl ? (
            <a
              href={watchUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex font-medium text-foreground underline underline-offset-4"
            >
              Open on YouTube
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full bg-black">
      <iframe
        src={embedUrl}
        title={
          highlight.title ??
          `${highlight.homeTeam} vs ${highlight.awayTeam}`
        }
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function HighlightCard({
  highlight,
  leagueName,
  isOpen,
  onToggle,
}: {
  highlight: YouTubeHighlightRecord;
  leagueName: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const thumbnailUrl =
    highlight.thumbnailUrl ??
    getFallbackThumbnail(
      highlight,
    );

  const watchUrl =
    getYoutubeWatchUrl(
      highlight,
    );

  const title =
    highlight.title ??
    `${highlight.homeTeam} vs ${highlight.awayTeam}`;

  return (
    <article className="min-w-0 overflow-hidden rounded-lg border bg-card">
      {isOpen ? (
        <HighlightPlayer
          highlight={highlight}
        />
      ) : (
        <button
          type="button"
          onClick={onToggle}
          className="group relative block aspect-video w-full overflow-hidden bg-muted text-left"
          aria-label={`Play ${title}`}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.015]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
              {highlight.homeTeam} vs{' '}
              {highlight.awayTeam}
            </div>
          )}

          <span className="absolute inset-0 flex items-center justify-center bg-black/15 transition group-hover:bg-black/25">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white shadow sm:h-10 sm:w-10">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5 h-4 w-4 sm:h-4.5 sm:w-4.5"
                aria-hidden="true"
              >
                <path d="M8 5.14v13.72c0 .73.79 1.19 1.43.84l10.2-5.72a.96.96 0 0 0 0-1.68L9.43 4.3A.96.96 0 0 0 8 5.14Z" />
              </svg>
            </span>
          </span>
        </button>
      )}

      <div className="p-2 sm:p-2.5">
        <div className="mb-1 flex min-w-0 items-center justify-between gap-1.5 text-[9px] text-muted-foreground sm:gap-2 sm:text-[10px]">
          <span className="min-w-0 truncate rounded bg-muted px-1.5 py-0.5">
            {leagueName}
          </span>

          <span className="shrink-0">
            {formatDate(
              getHighlightDate(
                highlight,
              ),
            )}
          </span>
        </div>

        <h2 className="line-clamp-2 text-xs font-semibold leading-4 sm:text-sm sm:leading-5">
          {title}
        </h2>

        <div className="mt-1.5 flex min-w-0 items-center justify-between gap-1.5 sm:gap-2">
          <p className="min-w-0 truncate text-[10px] text-muted-foreground sm:text-[11px]">
            {highlight.homeTeam} vs{' '}
            {highlight.awayTeam}
          </p>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onToggle}
              className="rounded border px-1.5 py-1 text-[9px] font-medium hover:bg-muted sm:px-2 sm:text-[10px]"
            >
              {isOpen
                ? 'Close'
                : 'Play'}
            </button>

            {watchUrl ? (
              <a
                href={watchUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded border px-1.5 py-1 text-[9px] font-medium hover:bg-muted sm:px-2 sm:text-[10px]"
              >
                YouTube
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function HighlightFilters({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  onClear,
}: {
  search: string;
  setSearch: (
    value: string,
  ) => void;
  dateFilter: DateFilter;
  setDateFilter: (
    value: DateFilter,
  ) => void;
  onClear: () => void;
}) {
  return (
    <div className="mb-2.5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-1.5 sm:flex sm:items-center sm:gap-2">
        <input
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value,
            )
          }
          placeholder="Search team, league or video..."
          className="col-span-2 h-8 w-full min-w-0 rounded-md border bg-background px-2.5 text-xs outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring sm:col-span-1 sm:h-8 sm:flex-1"
          aria-label="Search highlights"
        />

        <select
          value={dateFilter}
          onChange={(event) =>
            setDateFilter(
              event.target.value as DateFilter,
            )
          }
          className="h-8 w-full min-w-0 rounded-md border bg-background px-2 text-[11px] outline-none focus:ring-1 focus:ring-ring sm:h-8 sm:w-[125px] sm:shrink-0"
          aria-label="Filter highlights by date"
        >
          <option value="all">
            All dates
          </option>

          <option value="today">
            Today
          </option>

          <option value="yesterday">
            Yesterday
          </option>

          <option value="7-days">
            Last 7 days
          </option>

          <option value="30-days">
            Last 30 days
          </option>
        </select>

        <button
          type="button"
          onClick={onClear}
          className="h-8 w-full rounded-md border px-2.5 text-[11px] font-medium hover:bg-muted sm:h-8 sm:w-auto sm:shrink-0"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

function HighlightSkeleton() {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border bg-card">
      <div className="aspect-video animate-pulse bg-muted" />

      <div className="space-y-2 p-2 sm:p-2.5">
        <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function HighlightsPage() {
  const [
    search,
    setSearch,
  ] = useState('');

  const [
    dateFilter,
    setDateFilter,
  ] = useState<DateFilter>('all');

  const [
    openHighlightKey,
    setOpenHighlightKey,
  ] = useState<string | null>(null);

  const activeHighlightRef =
    useRef<HTMLDivElement | null>(null);

  const competitionsQuery =
    useSportsCompetitions();

  /*
   * The highlights query is the primary content request.
   *
   * The competitions request is deliberately NOT included
   * in the loading state so highlights can appear immediately.
   */
  const highlightsQuery =
    useAdminYoutubeHighlights({
      status: 'found',
      limit: HIGHLIGHT_LIMIT,
      sortBy: 'publishedAt',
      sortOrder: 'desc',
    });

  const competitions =
    useMemo(
      () => competitionsQuery.data ?? [],
      [competitionsQuery.data],
    );

  const competitionMap =
    useMemo(
      () =>
        new Map(
          competitions.map(
            (competition) => [
              competition.competitionId.toLowerCase(),
              competition.name,
            ],
          ),
        ),
      [competitions],
    );

  const normalizedHighlights =
    useMemo(() => {
      const rawHighlights =
        highlightsQuery.data?.data ??
        [];

      const unique =
        getUniqueHighlights(
          rawHighlights,
        );

      return unique.sort(
        (a, b) => {
          const aTime =
            getValidDate(
              getHighlightDate(a),
            )?.getTime() ?? 0;

          const bTime =
            getValidDate(
              getHighlightDate(b),
            )?.getTime() ?? 0;

          return bTime - aTime;
        },
      );
    }, [highlightsQuery.data?.data]);

  const filteredHighlights =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return normalizedHighlights.filter(
        (highlight) => {
          const leagueName =
            getLeagueName(
              highlight,
              competitionMap,
            );

          const highlightDate =
            getHighlightDate(
              highlight,
            );

          if (
            !isWithinDateFilter(
              highlightDate,
              dateFilter,
            )
          ) {
            return false;
          }

          if (
            normalizedSearch &&
            !getSearchText(
              highlight,
              leagueName,
            ).includes(
              normalizedSearch,
            )
          ) {
            return false;
          }

          return true;
        },
      );
    }, [
      normalizedHighlights,
      competitionMap,
      search,
      dateFilter,
    ]);

  /*
   * Progressive reveal:
   *
   * The API may return many records in one response, but
   * the page does not dump all of them into the DOM at once.
   *
   * First highlight appears immediately, then the rest are
   * inserted one-by-one.
   */
  const [revealState, setRevealState] = useState<{
    highlights: typeof filteredHighlights;
    count: number;
  } | null>(null);

  const visibleCount =
    revealState?.highlights === filteredHighlights
      ? revealState.count
      : filteredHighlights.length
        ? 1
        : 0;

  useEffect(() => {
    if (filteredHighlights.length <= 1) {
      return;
    }

    let current = 1;

    const timer = window.setInterval(
      () => {
        current += 1;

        const count = Math.min(
          current,
          filteredHighlights.length,
        );

        setRevealState({
          highlights: filteredHighlights,
          count,
        });

        if (
          current >=
          filteredHighlights.length
        ) {
          window.clearInterval(timer);
        }
      },
      70,
    );

    return () => {
      window.clearInterval(timer);
    };
  }, [filteredHighlights]);

  const visibleHighlights =
    filteredHighlights.slice(
      0,
      visibleCount,
    );

  const activeHighlight =
    openHighlightKey
      ? visibleHighlights.find((highlight) => {
          const key =
            getYoutubeVideoId(highlight) ??
            highlight.fixtureId;

          return key === openHighlightKey;
        }) ?? null
      : null;

  const remainingHighlights =
    activeHighlight
      ? visibleHighlights.filter((highlight) => {
          const key =
            getYoutubeVideoId(highlight) ??
            highlight.fixtureId;

          return key !== openHighlightKey;
        })
      : visibleHighlights;

  useEffect(() => {
    if (!openHighlightKey) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      activeHighlightRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [openHighlightKey]);

  const loading =
    highlightsQuery.isLoading;

  const error =
    highlightsQuery.error;

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="mb-2 flex min-w-0 items-center justify-between gap-2">
          <h1 className="min-w-0 truncate text-base font-semibold tracking-tight sm:text-lg">
            Football Highlights
          </h1>

          {!loading && !error ? (
            <span className="shrink-0 rounded-full border bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {filteredHighlights.length} videos
            </span>
          ) : null}
        </div>

        <HighlightFilters
          search={search}
          setSearch={setSearch}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          onClear={() => {
            setSearch('');
            setDateFilter('all');
            setOpenHighlightKey(null);
          }}
        />

        {loading ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <HighlightSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-[11px] text-destructive sm:py-2.5 sm:text-xs">
            Unable to load highlights right now.
          </div>
        ) : filteredHighlights.length === 0 ? (
          <div className="rounded-lg border bg-card px-3 py-5 text-center sm:py-8">
            <h2 className="text-xs font-semibold sm:text-sm">
              No highlights found
            </h2>

            <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
              Try another search or date.
            </p>
          </div>
        ) : (
          <>
            {activeHighlight ? (
              <section
                ref={activeHighlightRef}
                aria-label="Now playing"
                className="mb-3 scroll-mt-32 sm:mb-4"
              >
                <HighlightCard
                  highlight={activeHighlight}
                  leagueName={getLeagueName(
                    activeHighlight,
                    competitionMap,
                  )}
                  isOpen
                  onToggle={() => setOpenHighlightKey(null)}
                />
              </section>
            ) : null}

            {remainingHighlights.length > 0 ? (
              <section aria-label="More football highlights">
                {activeHighlight ? (
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold sm:text-sm">
                      More highlights
                    </h2>
                    <span className="text-[10px] text-muted-foreground">
                      {remainingHighlights.length} videos
                    </span>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
                  {remainingHighlights.map((highlight) => {
                    const key =
                      getYoutubeVideoId(highlight) ??
                      highlight.fixtureId;

                    return (
                      <HighlightCard
                        key={key}
                        highlight={highlight}
                        leagueName={getLeagueName(
                          highlight,
                          competitionMap,
                        )}
                        isOpen={false}
                        onToggle={() =>
                          setOpenHighlightKey(key ?? null)
                        }
                      />
                    );
                  })}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}