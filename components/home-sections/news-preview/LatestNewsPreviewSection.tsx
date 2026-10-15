
'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowUpRight, Newspaper } from 'lucide-react';

import sportsApi from '@/services/sports.service';
import type { FootballNewsFeedItem } from '@/types/sports';

type UnknownRecord = Record<string, unknown>;

const PREVIEW_COUNT = 10;
const NEWS_QUERY_LIMIT = 100;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value),
  );
}

function readString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  return undefined;
}

function safeHttpUrl(value: unknown): string | undefined {
  const url = readString(value);

  return url && /^https?:\/\//i.test(url)
    ? url
    : undefined;
}

function getPayload(
  item: FootballNewsFeedItem,
): UnknownRecord {
  return isRecord(item.payload) ? item.payload : {};
}

function getTitle(item: FootballNewsFeedItem): string {
  const payload = getPayload(item);

  return (
    readString(payload.headline) ??
    readString(payload.description) ??
    'Football news'
  );
}

function getDescription(
  item: FootballNewsFeedItem,
): string | undefined {
  const payload = getPayload(item);

  const headline = readString(payload.headline);
  const description = readString(payload.description);
  const story = readString(payload.story);

  const value =
    description && description !== headline
      ? description
      : story;

  if (!value) {
    return undefined;
  }

  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function getArticleUrl(
  item: FootballNewsFeedItem,
): string | undefined {
  const payload = getPayload(item);

  const links = isRecord(payload.links)
    ? payload.links
    : undefined;

  const web =
    links && isRecord(links.web)
      ? links.web
      : undefined;

  return (
    safeHttpUrl(web?.href) ??
    safeHttpUrl(payload.link) ??
    safeHttpUrl(payload.url)
  );
}

function getImageUrl(
  item: FootballNewsFeedItem,
): string | undefined {
  const payload = getPayload(item);

  const direct =
    safeHttpUrl(payload.imageUrl) ??
    safeHttpUrl(payload.thumbnail) ??
    safeHttpUrl(payload.image);

  if (direct) {
    return direct;
  }

  const candidates = Array.isArray(payload.images)
    ? payload.images
    : payload.images !== undefined
      ? [payload.images]
      : [];

  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const url = safeHttpUrl(candidate);

      if (url) {
        return url;
      }

      continue;
    }

    if (!isRecord(candidate)) {
      continue;
    }

    const candidateUrls = Array.isArray(candidate.url)
      ? candidate.url
      : [candidate.url, candidate.href];

    for (const candidateUrl of candidateUrls) {
      const url = safeHttpUrl(candidateUrl);

      if (url) {
        return url;
      }
    }
  }

  return undefined;
}

function getPublishedAt(
  item: FootballNewsFeedItem,
): string | undefined {
  const payload = getPayload(item);

  return (
    readString(item.publishedAt) ??
    readString(payload.published) ??
    readString(payload.lastModified) ??
    readString(item.fixtureDate)
  );
}

function getPublishedTime(
  item: FootballNewsFeedItem,
): number {
  const publishedAt = getPublishedAt(item);

  if (!publishedAt) {
    return 0;
  }

  const value = new Date(publishedAt).getTime();

  return Number.isFinite(value) ? value : 0;
}

function formatDate(value?: string): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

async function fetchLatestNews(): Promise<
  FootballNewsFeedItem[]
> {
  // The backend owns the rolling 14-day publication window.
  // Request the newest persisted records; do not send unsupported date filters.
  const response = await sportsApi.getFootballNews({
    page: 1,
    limit: NEWS_QUERY_LIMIT,
  });

  const latestNews = response.data
    .filter((item) => item.kind === 'NEWS')
    .sort(
      (left, right) =>
        getPublishedTime(right) - getPublishedTime(left),
    );

  const seenTitles = new Set<string>();

  return latestNews
    .filter((item) => {
      const key = getTitle(item).trim().toLowerCase();

      if (!key || seenTitles.has(key)) {
        return false;
      }

      seenTitles.add(key);

      return true;
    })
    .slice(0, PREVIEW_COUNT);
}

function NewsCard({
  item,
}: {
  item: FootballNewsFeedItem;
}) {
  const title = getTitle(item);
  const description = getDescription(item);
  const imageUrl = getImageUrl(item);
  const publishedAt = getPublishedAt(item);
  const articleUrl = getArticleUrl(item);

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
      {/* Article image */}

      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {imageUrl ? (
          // ESPN image URLs are dynamic, so use a native image instead of requiring remotePatterns config.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
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
            <Newspaper
              className="size-6 sm:size-8"
              aria-hidden="true"
            />
          </div>
        )}

        <span
          className="
            absolute
            left-1.5
            top-1.5
            rounded
            border
            border-border/50
            bg-background/95
            px-1.5
            py-0.5
            text-[9px]
            font-bold
            uppercase
            tracking-wide
            sm:left-2
            sm:top-2
            sm:rounded-md
            sm:px-2
            sm:py-1
            sm:text-[10px]
          "
        >
          News
        </span>
      </div>

      {/* Article details */}

      <div className="min-w-0 p-2 sm:p-3">
        <div
          className="
            mb-1.5
            flex
            min-w-0
            flex-wrap
            items-center
            gap-x-1.5
            gap-y-0.5
            text-[9px]
            text-muted-foreground
            sm:mb-2
            sm:gap-2
            sm:text-[11px]
          "
        >
          <span>Football desk</span>

          {publishedAt ? (
            <>
              <span aria-hidden="true">·</span>

              <time
                className="truncate"
                dateTime={publishedAt}
              >
                {formatDate(publishedAt)}
              </time>
            </>
          ) : null}
        </div>

        <h3
          className="
            line-clamp-3
            break-words
            text-xs
            font-semibold
            leading-4
            tracking-tight
            sm:text-[15px]
            sm:leading-5
          "
        >
          {articleUrl ? (
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                decoration-primary/50
                underline-offset-4
                hover:underline
              "
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>

        {description ? (
          <p
            className="
              mt-1.5
              line-clamp-2
              text-[10px]
              leading-4
              text-muted-foreground
              sm:mt-2
              sm:text-xs
              sm:leading-5
            "
          >
            {description}
          </p>
        ) : null}

        {articleUrl ? (
          <div
            className="
              mt-2
              border-t
              border-border/60
              pt-2
              sm:mt-3
              sm:pt-2.5
            "
          >
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                gap-1
                text-[10px]
                font-semibold
                text-primary
                hover:underline
                sm:text-xs
              "
            >
              Read story

              <ArrowUpRight
                className="size-3 sm:size-3.5"
                aria-hidden="true"
              />
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function NewsCardSkeleton() {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border/70 bg-card sm:rounded-xl">
      <div className="aspect-[16/9] animate-pulse bg-muted" />

      <div className="space-y-2 p-2 sm:p-3">
        <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function LatestNewsPreviewSection() {
  const newsQuery = useQuery({
    queryKey: ['home', 'latest-football-news', PREVIEW_COUNT],
    queryFn: fetchLatestNews,
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
    refetchOnWindowFocus: true,
  });

  const news = newsQuery.data ?? [];

  return (
    <section
      aria-labelledby="latest-football-news-title"
      className="px-3 py-4 sm:px-4 sm:py-5 lg:py-6"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}

        <header className="mb-3 flex min-w-0 items-center justify-between gap-2 sm:mb-4 sm:gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs sm:tracking-[0.14em]">
              Stay informed
            </p>

            <h2
              id="latest-football-news-title"
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
              Latest Football News
            </h2>

            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              The latest headlines and stories from football.
            </p>
          </div>

          <Link
            href="/news"
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
            <span className="hidden sm:inline">All news</span>

            <ArrowUpRight
              className="size-3 sm:size-3.5"
              aria-hidden="true"
            />
          </Link>
        </header>

        {/* Loading */}

        {newsQuery.isLoading ? (
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
                <NewsCardSkeleton key={index} />
              ),
            )}
          </div>
        ) : newsQuery.isError ? (
          <div className="rounded-lg border border-border/70 bg-card px-3 py-5 text-center sm:rounded-xl sm:px-4 sm:py-8">
            <p className="text-xs font-medium sm:text-sm">
              Football news is temporarily unavailable.
            </p>

            <button
              type="button"
              onClick={() => void newsQuery.refetch()}
              className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card px-3 py-5 text-center sm:rounded-xl sm:px-4 sm:py-8">
            <Newspaper
              className="mx-auto size-5 text-muted-foreground sm:size-6"
              aria-hidden="true"
            />

            <p className="mt-2 text-xs font-medium sm:text-sm">
              No recent football news available.
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
            {news.map((item) => (
              <NewsCard
                key={`${item.eventId}:${getTitle(item).toLowerCase()}`}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}