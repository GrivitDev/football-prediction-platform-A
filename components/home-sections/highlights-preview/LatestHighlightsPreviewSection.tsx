'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Play, Video } from 'lucide-react';

import { useAdminYoutubeHighlights } from '@/hooks/use-sports';
import type { YouTubeHighlightRecord } from '@/types/sports';

const PREVIEW_COUNT = 10;
const HIGHLIGHT_QUERY_LIMIT = 30;

function getValidDate(value?: string): Date | null {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
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

function getYoutubeVideoId(
  highlight: YouTubeHighlightRecord,
): string | undefined {
  if (highlight.videoId?.trim()) {
    return highlight.videoId.trim();
  }

  if (!highlight.videoUrl) {
    return undefined;
  }

  try {
    const url = new URL(highlight.videoUrl);

    if (
      url.hostname === 'youtu.be' ||
      url.hostname.endsWith('.youtu.be')
    ) {
      return (
        url.pathname.replace(/^\/+/, '').split('/')[0] ||
        undefined
      );
    }

    if (url.hostname.includes('youtube.com')) {
      const queryId = url.searchParams.get('v');

      if (queryId) {
        return queryId;
      }

      return url.pathname.match(
        /\/(?:embed|shorts|live)\/([^/?]+)/i,
      )?.[1];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function getHighlightKey(
  highlight: YouTubeHighlightRecord,
): string {
  return getYoutubeVideoId(highlight) ?? highlight.fixtureId;
}

function getHighlightTitle(
  highlight: YouTubeHighlightRecord,
): string {
  return (
    highlight.title?.trim() ||
    `${highlight.homeTeam} vs ${highlight.awayTeam}`
  );
}

function getThumbnailUrl(
  highlight: YouTubeHighlightRecord,
): string | undefined {
  if (highlight.thumbnailUrl?.trim()) {
    return highlight.thumbnailUrl;
  }

  const videoId = getYoutubeVideoId(highlight);

  return videoId
    ? `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`
    : undefined;
}

function getWatchUrl(
  highlight: YouTubeHighlightRecord,
): string | undefined {
  const videoId = getYoutubeVideoId(highlight);

  if (videoId) {
    return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  }

  return highlight.videoUrl;
}

function formatDate(value: string): string {
  const date = getValidDate(value);

  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getUniqueLatestHighlights(
  highlights: YouTubeHighlightRecord[],
): YouTubeHighlightRecord[] {
  const seenVideos = new Set<string>();
  const seenFallbacks = new Set<string>();
  const unique: YouTubeHighlightRecord[] = [];

  const sorted = [...highlights].sort((left, right) => {
    const leftTime =
      getValidDate(getHighlightDate(left))?.getTime() ?? 0;

    const rightTime =
      getValidDate(getHighlightDate(right))?.getTime() ?? 0;

    return rightTime - leftTime;
  });

  for (const highlight of sorted) {
    const videoId = getYoutubeVideoId(highlight);

    if (videoId) {
      const normalizedVideoId = videoId.toLowerCase();

      if (seenVideos.has(normalizedVideoId)) {
        continue;
      }

      seenVideos.add(normalizedVideoId);
      unique.push(highlight);

      continue;
    }

    const fallbackKey = [
      highlight.title ?? '',
      highlight.videoUrl ?? '',
      highlight.fixtureId,
    ]
      .join('|')
      .trim()
      .toLowerCase();

    if (!fallbackKey || seenFallbacks.has(fallbackKey)) {
      continue;
    }

    seenFallbacks.add(fallbackKey);
    unique.push(highlight);
  }

  return unique.slice(0, PREVIEW_COUNT);
}

function HighlightCard({
  highlight,
  isPlaying,
  onPlay,
}: {
  highlight: YouTubeHighlightRecord;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const videoId = getYoutubeVideoId(highlight);
  const thumbnailUrl = getThumbnailUrl(highlight);
  const title = getHighlightTitle(highlight);
  const watchUrl = getWatchUrl(highlight);
  const publishedAt = getHighlightDate(highlight);

  return (
    <article
      className="
        group
        min-w-0
        overflow-hidden
        rounded-lg
        border
        border-border/70
        bg-card
        transition-shadow
        hover:shadow-md
        sm:rounded-xl
      "
    >
      {/* Video thumbnail */}

      <div className="relative aspect-video overflow-hidden bg-muted">
        {isPlaying && videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&controls=1&playsinline=1&rel=0`}
            title={title}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-300
              group-hover:scale-[1.03]
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Video
              className="size-6 sm:size-8"
              aria-hidden="true"
            />
          </div>
        )}

        {!isPlaying &&
          (videoId ? (
            <button
              type="button"
              onClick={onPlay}
              aria-label={`Play ${title}`}
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-black/15
                transition
                hover:bg-black/30
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-inset
                focus-visible:ring-primary
              "
            >
              <span
                className="
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  bg-black/80
                  text-white
                  shadow-lg
                  sm:size-11
                "
              >
                <Play
                  className="ml-0.5 size-4 fill-current sm:size-[18px]"
                  aria-hidden="true"
                />
              </span>
            </button>
          ) : watchUrl ? (
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${title}`}
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-black/15
                transition
                hover:bg-black/30
              "
            >
              <span
                className="
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  bg-black/80
                  text-white
                  shadow-lg
                  sm:size-11
                "
              >
                <Play
                  className="ml-0.5 size-4 fill-current sm:size-[18px]"
                  aria-hidden="true"
                />
              </span>
            </a>
          ) : null)}
      </div>

      {/* Card details */}

      <div className="min-w-0 p-2 sm:p-3">
        <div
          className="
            mb-1.5
            flex
            min-w-0
            flex-wrap
            items-center
            justify-between
            gap-x-1.5
            gap-y-1
            text-[9px]
            text-muted-foreground
            sm:mb-2
            sm:gap-2
            sm:text-[11px]
          "
        >
          <span
            className="
              min-w-0
              max-w-full
              truncate
              rounded
              bg-muted
              px-1.5
              py-0.5
              sm:rounded-md
              sm:px-2
              sm:py-1
            "
          >
            {highlight.competitionId || 'Football'}
          </span>

          {publishedAt ? (
            <time
              className="shrink-0"
              dateTime={publishedAt}
            >
              {formatDate(publishedAt)}
            </time>
          ) : null}
        </div>

        <h3
          className="
            line-clamp-2
            break-words
            text-xs
            font-semibold
            leading-4
            tracking-tight
            sm:text-sm
            sm:leading-5
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1
            truncate
            text-[10px]
            text-muted-foreground
            sm:mt-1.5
            sm:text-xs
          "
        >
          {highlight.homeTeam} vs {highlight.awayTeam}
        </p>

        <div
          className="
            mt-2
            flex
            min-w-0
            items-center
            justify-between
            gap-1.5
            border-t
            border-border/60
            pt-2
            sm:mt-3
            sm:gap-2
            sm:pt-2.5
          "
        >
          <span
            className="
              min-w-0
              truncate
              text-[9px]
              text-muted-foreground
              sm:text-[10px]
            "
          >
            {highlight.channelTitle || 'YouTube highlight'}
          </span>

<Link
  href="/highlights"
  className="
    inline-flex
    shrink-0
    items-center
    gap-0.5
    text-[10px]
    font-semibold
    text-primary
    hover:underline
    sm:gap-1
    sm:text-xs
  "
>
  Watch
  <ArrowUpRight
    className="size-3 sm:size-3.5"
    aria-hidden="true"
  />
</Link>
        </div>
      </div>
    </article>
  );
}

function HighlightCardSkeleton() {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border/70 bg-card sm:rounded-xl">
      <div className="aspect-video animate-pulse bg-muted" />

      <div className="space-y-2 p-2 sm:p-3">
        <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function LatestHighlightsPreviewSection() {
  const [playingKey, setPlayingKey] =
    useState<string | null>(null);

  const highlightsQuery = useAdminYoutubeHighlights({
    status: 'found',
    limit: HIGHLIGHT_QUERY_LIMIT,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });

  const highlights = useMemo(
    () =>
      getUniqueLatestHighlights(
        highlightsQuery.data?.data ?? [],
      ),
    [highlightsQuery.data?.data],
  );

  return (
    <section
      aria-labelledby="latest-football-highlights-title"
      className="px-3 py-4 sm:px-4 sm:py-5 lg:py-6"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}

        <header className="mb-3 flex min-w-0 items-center justify-between gap-2 sm:mb-4 sm:gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs sm:tracking-[0.14em]">
              Watch the action
            </p>

            <h2
              id="latest-football-highlights-title"
              className="
                mt-0.5
                text-lg
                font-bold
                leading-tight
                tracking-tight
                sm:mt-1
                sm:text-xl
                lg:text-2xl
              "
            >
              Latest Football Highlights
            </h2>

            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Recent match highlights, ready to watch.
            </p>
          </div>

          <Link
            href="/highlights"
            className="
              inline-flex
              min-h-8
              shrink-0
              items-center
              justify-center
              gap-1
              rounded-md
              border
              border-border/70
              px-2
              py-1.5
              text-[10px]
              font-semibold
              transition
              hover:bg-muted
              sm:min-h-9
              sm:rounded-lg
              sm:px-3
              sm:text-xs
              lg:text-sm
            "
          >
            <span className="sm:hidden">All</span>
            <span className="hidden sm:inline">All highlights</span>

            <ArrowUpRight
              className="size-3 sm:size-3.5"
              aria-hidden="true"
            />
          </Link>
        </header>

        {/* Loading */}

        {highlightsQuery.isLoading ? (
          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:gap-3
              lg:grid-cols-3
              xl:grid-cols-5
            "
          >
            {Array.from(
              { length: PREVIEW_COUNT },
              (_, index) => (
                <HighlightCardSkeleton key={index} />
              ),
            )}
          </div>
        ) : highlightsQuery.isError ? (
          <div className="rounded-lg border border-border/70 bg-card px-3 py-5 text-center sm:rounded-xl sm:px-4 sm:py-8">
            <p className="text-xs font-medium sm:text-sm">
              Highlights are temporarily unavailable.
            </p>

            <button
              type="button"
              onClick={() => void highlightsQuery.refetch()}
              className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : highlights.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card px-3 py-5 text-center sm:rounded-xl sm:px-4 sm:py-8">
            <Video
              className="mx-auto size-5 text-muted-foreground sm:size-6"
              aria-hidden="true"
            />

            <p className="mt-2 text-xs font-medium sm:text-sm">
              No recent highlights available.
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:gap-3
              lg:grid-cols-3
              xl:grid-cols-5
            "
          >
            {highlights.map((highlight) => {
              const key = getHighlightKey(highlight);

              return (
                <HighlightCard
                  key={key}
                  highlight={highlight}
                  isPlaying={playingKey === key}
                  onPlay={() =>
                    setPlayingKey((current) =>
                      current === key ? null : key,
                    )
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}