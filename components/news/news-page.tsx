

'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  FaArrowUpRightFromSquare,
  FaMagnifyingGlass,
  FaNewspaper,
  FaPlay,
  FaVideo,
  FaXmark,
} from 'react-icons/fa6';

import {
  useSportsCompetitionTeams,
  useSportsCompetitions,
} from '@/hooks/use-sports';

import sportsApi from '@/services/sports.service';

import type {
  ActiveCompetition,
  EspnTeamRecord,
  FootballNewsFeedItem,
} from '@/types/sports';

type UnknownRecord = Record<string, unknown>;

const NEWS_RENDER_BATCH_SIZE = 24;
const NEWS_RENDER_INTERVAL_MS = 120;
const NEWS_PAGE_SIZE = 24;

interface FeedImage {
  url: string;
  alt?: string;
  caption?: string;
  credit?: string;
}

interface NormalizedFeedItem {
  key: string;
  kind: FootballNewsFeedItem['kind'];
  title: string;
  description?: string;
  story?: string;
  publishedAt?: string;
  link?: string;
  images: FeedImage[];
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: number;
  source?: string;
}

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value),
  );
}

function getObject(
  value: unknown,
): UnknownRecord | undefined {
  return isRecord(value)
    ? value
    : undefined;
}

function getArray(
  value: unknown,
): unknown[] {
  return Array.isArray(value)
    ? value
    : [];
}

function stringValue(
  value: unknown,
): string | undefined {
  if (
    typeof value === 'string' &&
    value.trim()
  ) {
    return value.trim();
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  return undefined;
}

function stripHtml(
  value?: string,
): string {
  if (!value) {
    return '';
  }

  return value
    .replace(
      /<br\s*\/?>/gi,
      '\n',
    )
    .replace(
      /<\/p>/gi,
      '\n\n',
    )
    .replace(
      /<[^>]+>/g,
      '',
    )
    .replace(
      /&nbsp;/gi,
      ' ',
    )
    .replace(
      /&amp;/gi,
      '&',
    )
    .replace(
      /&quot;/gi,
      '"',
    )
    .replace(
      /&#39;/gi,
      "'",
    )
    .replace(
      /&lt;/gi,
      '<',
    )
    .replace(
      /&gt;/gi,
      '>',
    )
    .replace(
      /\n{3,}/g,
      '\n\n',
    )
    .trim();
}

function formatDateTime(
  value?: string,
): string {
  if (!value) {
    return '';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  return new Intl.DateTimeFormat(
    'en-NG',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
  ).format(date);
}

function formatDuration(value?: number): string {
  if (
    value === undefined ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return '';
  }

  const totalSeconds = Math.round(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function firstUrl(
  value: unknown,
  depth = 0,
): string | undefined {
  if (depth > 8) {
    return undefined;
  }

  if (
    typeof value === 'string' &&
    /^https?:\/\//i.test(
      value,
    )
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found =
        firstUrl(
          item,
          depth + 1,
        );

      if (found) {
        return found;
      }
    }

    return undefined;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  for (
    const key of [
      'href',
      'url',
      'src',
      'contentUrl',
      'playbackUrl',
      'file',
    ]
  ) {
    const found =
      firstUrl(
        value[key],
        depth + 1,
      );

    if (found) {
      return found;
    }
  }

  return firstUrl(
    value.links,
    depth + 1,
  );
}

function getImages(
  payload: UnknownRecord,
  fallback?: string,
): FeedImage[] {
  const result: FeedImage[] = [];
  const seen =
    new Set<string>();

  const rawImages =
    getArray(
      payload.images,
    );

  for (
    const value of rawImages
  ) {
    if (
      !isRecord(value)
    ) {
      continue;
    }

    const urls =
      Array.isArray(
        value.url,
      )
        ? value.url
        : [value.url];

    for (
      const rawUrl of urls
    ) {
      const url =
        stringValue(
          rawUrl,
        );

      if (
        !url ||
        seen.has(url)
      ) {
        continue;
      }

      seen.add(url);

      result.push({
        url,
        alt:
          stringValue(
            value.alt,
          ),
        caption:
          stringValue(
            value.caption,
          ),
        credit:
          stringValue(
            value.credit,
          ),
      });
    }
  }

  if (
    result.length === 0 &&
    fallback
  ) {
    result.push({
      url: fallback,
    });
  }

  return result.slice(
    0,
    6,
  );
}

function getVideoUrl(
  payload: UnknownRecord,
): string | undefined {
  const links = getObject(payload.links);
  const source = getObject(links?.source);
  const mobile = getObject(links?.mobile);
  const mobileSource = getObject(mobile?.source);
  const progressive = getObject(links?.progressiveDownload);
  const streaming = getObject(links?.streaming);

  // Prefer the direct MP4 assets exposed by the summary payload.
  // They can be played directly inside our own <video> element.
  const directCandidates = [
    source?.href,
    getObject(source?.HD)?.href,
    getObject(source?.full)?.href,
    getObject(source?.hds)?.href,
    getObject(source?.mezzanine)?.href,
    mobileSource?.href,
    getObject(mobileSource?.HD)?.href,
  ];

  for (const candidate of directCandidates) {
    const url = stringValue(candidate);

    if (
      url &&
      /\.(?:mp4|m4v)(?:$|[?#])/i.test(url)
    ) {
      return url;
    }
  }

  return (
    firstUrl(progressive) ??
    firstUrl(source) ??
    firstUrl(streaming)
  );
}

function getVideoThumbnail(
  payload: UnknownRecord,
): string | undefined {
  return (
    stringValue(
      payload.thumbnail,
    ) ??
    firstUrl(
      payload.image,
    ) ??
    firstUrl(
      payload.images,
    )
  );
}

function normalizeItem(
  item: FootballNewsFeedItem,
): NormalizedFeedItem {
  const payload =
    getObject(
      item.payload,
    ) ?? {};

  const isVideo =
    item.kind ===
    'VIDEO';

  const title =
    isVideo
      ? (
          stringValue(
            payload.headline,
          ) ??
          stringValue(
            payload.title,
          ) ??
          'Football video'
        )
      : (
          stringValue(
            payload.headline,
          ) ??
          stringValue(
            payload.description,
          ) ??
          'Football news'
        );

  const description =
    stringValue(
      payload.description,
    );

  const story =
    stringValue(
      payload.story,
    );

  const publishedAt =
    item.publishedAt ??
    (
      isVideo
        ? stringValue(
            payload.originalPublishDate,
          )
        : stringValue(
            payload.published,
          )
    );

  const link =
    stringValue(
      getObject(
        linksForArticle(
          payload,
        ),
      )?.href,
    ) ??
    firstUrl(
      payload.links,
    );

  const fallbackImage =
    isVideo
      ? getVideoThumbnail(
          payload,
        )
      : stringValue(
          payload.imageUrl,
        );

  const images =
    getImages(
      payload,
      fallbackImage,
    );

  const videoUrl =
    isVideo
      ? getVideoUrl(
          payload,
        )
      : undefined;

  const videoDuration =
    isVideo &&
    typeof payload.duration === 'number' &&
    Number.isFinite(payload.duration)
      ? payload.duration
      : undefined;

  return {
    key: `${item.kind}:${title.trim().toLowerCase()}`,
    kind:
      item.kind,
    title,
    description,
    story,
    publishedAt,
    link,
    images,
    videoUrl,
    videoThumbnail:
      fallbackImage,
    videoDuration,
    source:
      stringValue(
        payload.source,
      ) ??
      stringValue(
        payload.byline,
      ),
  };
}

function linksForArticle(
  payload: UnknownRecord,
): UnknownRecord | undefined {
  const links =
    getObject(
      payload.links,
    );

  return getObject(
    links?.web,
  );
}

function openInNewTab(
  url: string,
) {
  return (
    /^https?:\/\//i.test(
      url,
    )
  );
}

function FeedCard({
  item,
  featured = false,
  isPlaying,
  onPlay,
}: {
  item: NormalizedFeedItem;
  featured?: boolean;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const primaryImage = item.images[0];
  const articleText = stripHtml(item.story) || stripHtml(item.description);
  const dateLabel = formatDateTime(item.publishedAt);

  const mediaClass = featured
    ? 'aspect-[16/9] sm:aspect-[16/7]'
    : 'aspect-[16/9]';

  return (
    <article className="group min-w-0 overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md sm:rounded-xl">
      <div className={`relative ${mediaClass} overflow-hidden bg-muted`}>
        {isPlaying && item.videoUrl ? (
          <video
            className="h-full w-full bg-black object-contain"
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={item.videoThumbnail}
            src={item.videoUrl}
          />
        ) : primaryImage?.url ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt ?? item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading={featured ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-muted text-muted-foreground">
            {item.kind === 'VIDEO' ? (
              <FaVideo className="h-6 w-6 sm:h-8 sm:w-8" />
            ) : (
              <FaNewspaper className="h-6 w-6 sm:h-8 sm:w-8" />
            )}
          </div>
        )}

        <span className="absolute left-1.5 top-1.5 rounded bg-background/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-foreground shadow-sm sm:left-3 sm:top-3 sm:rounded-md sm:px-2 sm:py-1 sm:text-[10px]">
          {item.kind === 'VIDEO' ? 'Video' : 'News'}
        </span>

        {item.kind === 'VIDEO' && !isPlaying ? (
          item.videoUrl ? (
            <button
              type="button"
              onClick={onPlay}
              aria-label={`Play ${item.title}`}
              className="absolute inset-0 grid place-items-center bg-black/10 transition-colors hover:bg-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-black/75 text-white shadow-lg transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
                <FaPlay className="ml-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
              {item.videoDuration ? (
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold text-white sm:bottom-3 sm:right-3 sm:px-2 sm:py-1 sm:text-[11px]">
                  {formatDuration(item.videoDuration)}
                </span>
              ) : null}
            </button>
          ) : item.link && openInNewTab(item.link) ? (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              aria-label={`Watch ${item.title}`}
              className="absolute inset-0 grid place-items-center bg-black/10 transition-colors hover:bg-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-black/75 text-white shadow-lg sm:h-11 sm:w-11">
                <FaPlay className="ml-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
            </a>
          ) : null
        ) : null}
      </div>

      <div className={featured ? 'p-3 sm:p-4' : 'p-2 sm:p-3'}>
        <div className="mb-1.5 flex min-w-0 items-center gap-1.5 text-[10px] text-muted-foreground sm:mb-2 sm:gap-2 sm:text-[11px]">
          <span className="truncate">{item.source || 'Football desk'}</span>
          {dateLabel ? <span aria-hidden="true">·</span> : null}
          {dateLabel ? <time className="shrink-0" dateTime={item.publishedAt}>{dateLabel}</time> : null}
        </div>

        <h2 className={`${featured ? 'text-base leading-5 sm:text-lg sm:leading-6' : 'text-xs leading-4 sm:text-sm sm:leading-5'} line-clamp-3 font-bold tracking-tight text-foreground`}>
          {item.link && openInNewTab(item.link) && item.kind !== 'VIDEO' ? (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="decoration-primary/50 underline-offset-4 hover:underline"
            >
              {item.title}
            </a>
          ) : item.title}
        </h2>

        {item.description ? (
          <p className={`mt-1.5 text-[11px] leading-4 text-muted-foreground sm:mt-2 sm:text-xs sm:leading-5 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {stripHtml(item.description)}
          </p>
        ) : articleText && item.kind !== 'VIDEO' ? (
          <p className={`mt-1.5 text-[11px] leading-4 text-muted-foreground sm:mt-2 sm:text-xs sm:leading-5 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {articleText}
          </p>
        ) : null}

        <div className="mt-2 flex items-center justify-between gap-2 border-t border-border/70 pt-2 sm:mt-3 sm:gap-3 sm:pt-2.5">
          <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground sm:text-[10px]">
            {item.kind === 'VIDEO' ? 'Video report' : 'Latest report'}
          </span>
          {item.link && openInNewTab(item.link) ? (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-primary hover:underline sm:text-xs"
            >
              {item.kind === 'VIDEO' ? 'Watch' : 'Read story'}
              <FaArrowUpRightFromSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function FeedSkeleton({
  count = 9,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
      {Array.from({
        length: count,
      }).map(
        (_, index) => (
          <div
            key={index}
            className="min-w-0 overflow-hidden rounded-lg border bg-card sm:rounded-xl"
          >
            <div className="aspect-[16/9] animate-pulse bg-muted/70" />
            <div className="space-y-2 p-2 sm:p-3">
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed bg-card px-3 py-6 text-center sm:rounded-xl sm:px-4 sm:py-8">
      <div className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground sm:h-9 sm:w-9">
        <FaNewspaper className="h-4 w-4" />
      </div>

      <p className="mt-2 text-xs font-semibold sm:text-sm">
        No football news
      </p>
    </div>
  );
}

function FilterBar({
  search,
  setSearch,
  leagueId,
  setLeagueId,
  teamId,
  setTeamId,
  competitions,
  teams,
  onReset,
}: {
  search: string;
  setSearch: (value: string) => void;
  leagueId: string;
  setLeagueId: (value: string) => void;
  teamId: string;
  setTeamId: (value: string) => void;
  competitions: ActiveCompetition[];
  teams: EspnTeamRecord[];
  onReset: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card shadow-sm sm:rounded-xl">
      <div className="grid grid-cols-2 gap-2 p-2 sm:flex sm:flex-row sm:flex-wrap sm:p-3 lg:flex-nowrap">
        <div className="relative col-span-2 min-w-0 flex-1 sm:col-span-1">
          <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            className="h-9 w-full rounded-md border bg-background pl-9 pr-8 text-xs outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10 sm:h-10 sm:rounded-lg sm:text-sm"
          />

          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-1.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <FaXmark className="h-3 w-3" />
            </button>
          ) : null}
        </div>

        <select
          value={leagueId}
          onChange={(event) => {
            setLeagueId(event.target.value);
            setTeamId('');
          }}
          className="h-9 w-full min-w-0 rounded-md border bg-background px-2 text-xs outline-none focus:border-primary/50 sm:h-10 sm:min-w-[140px] sm:w-auto sm:rounded-lg sm:px-3 sm:text-sm"
        >
          <option value="">All leagues</option>
          {competitions.map((competition) => (
            <option key={competition.competitionId} value={competition.competitionId}>
              {competition.name}
            </option>
          ))}
        </select>

        <select
          value={teamId}
          onChange={(event) => setTeamId(event.target.value)}
          disabled={!leagueId}
          className="h-9 w-full min-w-0 rounded-md border bg-background px-2 text-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-primary/50 sm:h-10 sm:min-w-[140px] sm:w-auto sm:rounded-lg sm:px-3 sm:text-sm"
        >
          <option value="">{leagueId ? 'All teams' : 'Select league'}</option>
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.displayName ?? team.name ?? team.shortName ?? team.teamId}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReset}
          className="col-span-2 h-9 rounded-md border bg-background px-3 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground sm:col-span-1 sm:h-10 sm:rounded-lg sm:px-4 sm:text-sm"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

interface NewsFeedFilters {
  leagueId: string;
  teamId: string;
}

function getItemPublishedTime(item: FootballNewsFeedItem): number {
  const payload = getObject(item.payload) ?? {};
  const candidate = item.publishedAt ?? stringValue(
    item.kind === 'VIDEO' ? payload.originalPublishDate : payload.published,
  );
  const publishedTime = candidate ? new Date(candidate).getTime() : Number.NaN;

  if (Number.isFinite(publishedTime)) {
    return publishedTime;
  }

  const fixtureTime = new Date(item.fixtureDate).getTime();
  return Number.isFinite(fixtureTime) ? fixtureTime : 0;
}

function interleaveNewsAndVideos(
  items: FootballNewsFeedItem[],
): FootballNewsFeedItem[] {
  const byNewest = (left: FootballNewsFeedItem, right: FootballNewsFeedItem) =>
    getItemPublishedTime(right) - getItemPublishedTime(left);

  const news = items.filter((item) => item.kind !== 'VIDEO').sort(byNewest);
  const videos = items.filter((item) => item.kind === 'VIDEO').sort(byNewest);

  if (!news.length || !videos.length) {
    return [...news, ...videos].sort(byNewest);
  }

  // Use a repeatable random sequence for a given feed so streamed updates do
  // not reshuffle the cards on every render. Each category stays newest-first.
  const seedText = [...news, ...videos]
    .map((item) => `${item.kind}:${getTitleKey(item)}`)
    .sort()
    .join('|');
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }

  const random = () => {
    seed += 0x6D2B79F5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };

  const mixed: FootballNewsFeedItem[] = [];
  let newsIndex = 0;
  let videoIndex = 0;

  while (newsIndex < news.length || videoIndex < videos.length) {
    const newsRemaining = news.length - newsIndex;
    const videosRemaining = videos.length - videoIndex;

    if (!newsRemaining) {
      mixed.push(videos[videoIndex++]);
    } else if (!videosRemaining) {
      mixed.push(news[newsIndex++]);
    } else if (random() < videosRemaining / (newsRemaining + videosRemaining)) {
      mixed.push(videos[videoIndex++]);
    } else {
      mixed.push(news[newsIndex++]);
    }
  }

  return mixed;
}

function getTitleKey(item: FootballNewsFeedItem): string {
  return normalizeItem(item).title.trim().toLowerCase();
}

function passesNewsFeedFilters(
  item: FootballNewsFeedItem,
  filters: NewsFeedFilters,
): boolean {
  if (filters.leagueId && item.leagueId !== filters.leagueId) {
    return false;
  }

  if (
    filters.teamId &&
    item.homeTeamId !== filters.teamId &&
    item.awayTeamId !== filters.teamId
  ) {
    return false;
  }

  return true;
}

function buildFilteredFeedItems(
  items: FootballNewsFeedItem[],
  filters: NewsFeedFilters,
): FootballNewsFeedItem[] {
  const latestByTitle = new Map<string, FootballNewsFeedItem>();

  for (const item of items) {
    if (!passesNewsFeedFilters(item, filters)) {
      continue;
    }

    const title = getTitleKey(item);
    if (!title) {
      continue;
    }

    // Keep a news article and a video with the same headline as separate feed items.
    const dedupeKey = `${item.kind}:${title}`;
    const existing = latestByTitle.get(dedupeKey);
    if (
      !existing ||
      getItemPublishedTime(item) > getItemPublishedTime(existing)
    ) {
      latestByTitle.set(dedupeKey, item);
    }
  }

  return interleaveNewsAndVideos([...latestByTitle.values()]);
}

export default function NewsPage({
  className,
}: {
  className?: string;
}) {
  const [search, setSearch] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [streamItems, setStreamItems] = useState<FootballNewsFeedItem[]>([]);
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [playingVideoKey, setPlayingVideoKey] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(NEWS_PAGE_SIZE);

  const currentFilters: NewsFeedFilters = {
    leagueId,
    teamId,
  };

  const streamControllerRef = useRef<AbortController | null>(null);
  const streamRequestIdRef = useRef(0);
  const rawStreamItemsRef = useRef<FootballNewsFeedItem[]>([]);
  const filtersRef = useRef<NewsFeedFilters>(currentFilters);
  const activeVideoRef = useRef<HTMLElement | null>(null);

  filtersRef.current = currentFilters;

  const competitionsQuery = useSportsCompetitions({
    activeOnly: true,
  });

  const teamsQuery = useSportsCompetitionTeams(
    leagueId || undefined,
  );

  const competitions = competitionsQuery.data ?? [];
  const teams = teamsQuery.data ?? [];

  useEffect(() => {
    const requestId = ++streamRequestIdRef.current;

    streamControllerRef.current?.abort();

    const controller = new AbortController();
    streamControllerRef.current = controller;

    rawStreamItemsRef.current = [];

    setStreamItems([]);
    setStreamError(false);
    setStreamLoading(true);

    // The backend reads the persisted news collection and applies its rolling
    // 14-day publication window plus any selected competition/team filters.
    const streamUrl = sportsApi.getFootballNewsStreamUrl({
      competitionId: leagueId || undefined,
      teamId: teamId || undefined,
    });

    const run = async () => {
      let lastRenderedCount = 0;

      const flushStreamItems = () => {
        const items = rawStreamItemsRef.current;
        if (items.length === lastRenderedCount) return;

        lastRenderedCount = items.length;
        setStreamItems(
          buildFilteredFeedItems(items, filtersRef.current),
        );
      };

      // Render the first item immediately, then batch subsequent updates so a
      // large stream does not trigger a React render for every single item.
      const renderTimer = window.setInterval(
        flushStreamItems,
        NEWS_RENDER_INTERVAL_MS,
      );

      try {
        const response = await fetch(streamUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/x-ndjson',
          },
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `News stream request failed with ${response.status}`,
          );
        }

        if (!response.body) {
          throw new Error('News stream response has no body.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            buffer += decoder.decode();
          } else if (value) {
            buffer += decoder.decode(value, {
              stream: true,
            });
          }

          const lines = buffer.split('\n');
          buffer = done ? '' : (lines.pop() ?? '');

          for (const rawLine of lines) {
            const line = rawLine.trim();

            if (!line) {
              continue;
            }

            let event: {
              type?: string;
              item?: FootballNewsFeedItem;
              message?: string;
            };

            try {
              event = JSON.parse(line);
            } catch {
              continue;
            }

            if (event.type === 'item' && event.item) {
              /*
               * Store the raw item exactly as received. No title, league, team,
               * search or video-age filtering happens during transport.
               */
              const item = event.item as FootballNewsFeedItem;

              rawStreamItemsRef.current.push(item);

              const receivedCount = rawStreamItemsRef.current.length;
              if (
                receivedCount === 1 ||
                receivedCount - lastRenderedCount >= NEWS_RENDER_BATCH_SIZE
              ) {
                flushStreamItems();
              }
            }

            if (event.type === 'error') {
              throw new Error(
                event.message ?? 'Football news stream failed.',
              );
            }
          }

          if (done) {
            break;
          }
        }
      } catch (error) {
        if (
          controller.signal.aborted ||
          requestId !== streamRequestIdRef.current
        ) {
          return;
        }

        setStreamError(true);
      } finally {
        window.clearInterval(renderTimer);

        if (
          !controller.signal.aborted &&
          requestId === streamRequestIdRef.current
        ) {
          flushStreamItems();
          setStreamLoading(false);
        }
      }
    };

    void run();

    return () => {
      controller.abort();
    };
  }, [leagueId, teamId]);

  /*
   * Keep the visible feed in sync with the selected filters. The stream is
   * also filtered by the backend, while this client-side pass keeps title
   * deduplication and filtering consistent during streaming.
   */
  useEffect(() => {
    setVisibleCount(NEWS_PAGE_SIZE);
    setStreamItems(
      buildFilteredFeedItems(rawStreamItemsRef.current, currentFilters),
    );
  }, [leagueId, teamId]);

  useEffect(() => {
    if (!playingVideoKey || !activeVideoRef.current) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      activeVideoRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [playingVideoKey]);

  const feedItems = streamItems;

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return feedItems;
    }

    return feedItems.filter((item) =>
      [
        normalizeItem(item).title,
        normalizeItem(item).description,
        normalizeItem(item).story,
        normalizeItem(item).source,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [feedItems, search]);

  const reset = () => {
    setSearch('');
    setLeagueId('');
    setTeamId('');
    setVisibleCount(NEWS_PAGE_SIZE);
    setPlayingVideoKey(null);
  };

  const hasItems = filteredItems.length > 0;
  const visibleItems = filteredItems.slice(0, visibleCount);
  const getStableCardKey = (item: FootballNewsFeedItem) => {
    const normalized = normalizeItem(item);
    return normalized.key || `${item.kind}:${getTitleKey(item)}`;
  };
  const activeVideoItem = visibleItems.find(
    (item) =>
      item.kind === 'VIDEO' &&
      getStableCardKey(item) === playingVideoKey,
  );
  const orderedVisibleItems = activeVideoItem
    ? [
        activeVideoItem,
        ...visibleItems.filter(
          (item) => getStableCardKey(item) !== getStableCardKey(activeVideoItem),
        ),
      ]
    : visibleItems;
  const featuredItem = orderedVisibleItems[0];
  const remainingItems = orderedVisibleItems.slice(1);

  return (
    <main className={['min-h-screen', className ?? ''].join(' ')}>
      <div className="mx-auto w-full max-w-[1440px] px-2 py-2 sm:px-3 sm:py-3 lg:px-5">
        <header className="mb-2 flex flex-col justify-between gap-1.5 sm:flex-row sm:items-end sm:gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              Football News
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground sm:gap-2 sm:text-xs">
            <span className="rounded-full border bg-card px-2 py-1 font-medium sm:px-3 sm:py-1.5">
              Last 14 days
            </span>
            <span className="rounded-full border bg-card px-2 py-1 font-semibold sm:px-3 sm:py-1.5">
              {filteredItems.length} {filteredItems.length === 1 ? 'story' : 'stories'}
            </span>
          </div>
        </header>

        <FilterBar
          search={search}
          setSearch={(value) => {
            setSearch(value);
            setVisibleCount(NEWS_PAGE_SIZE);
            setPlayingVideoKey(null);
          }}
          leagueId={leagueId}
          setLeagueId={(value) => {
            setLeagueId(value);
            setTeamId('');
            setVisibleCount(NEWS_PAGE_SIZE);
            setPlayingVideoKey(null);
          }}
          teamId={teamId}
          setTeamId={(value) => {
            setTeamId(value);
            setVisibleCount(NEWS_PAGE_SIZE);
            setPlayingVideoKey(null);
          }}
          competitions={competitions}
          teams={teams}
          onReset={reset}
        />

        {streamError ? (
          <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/[0.04] px-3 py-2.5 text-xs text-destructive sm:mt-4 sm:rounded-xl sm:px-4 sm:text-sm">
            Football news could not be loaded. Please try again later.
          </div>
        ) : null}

        <div className="mt-3 sm:mt-5">
          {!hasItems && streamLoading ? (
            <FeedSkeleton count={6} />
          ) : !hasItems ? (
            <EmptyState />
          ) : (
            <>
              {featuredItem ? (
                <section
                  ref={activeVideoItem ? activeVideoRef : undefined}
                  aria-label={activeVideoItem ? 'Now playing' : 'Top story'}
                  className="mb-4 scroll-mt-20 sm:mb-5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3 sm:gap-3">
                    <div className="min-w-0">
                      <h2 className="text-xs font-bold tracking-tight sm:text-sm">
                        {activeVideoItem ? 'Now playing' : featuredItem.kind === 'VIDEO' ? 'Featured video' : 'Top story'}
                      </h2>
                      {activeVideoItem ? (
                        <p className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground sm:text-[11px]">
                          {normalizeItem(featuredItem).title}
                        </p>
                      ) : null}
                    </div>
                    {activeVideoItem ? (
                      <button
                        type="button"
                        onClick={() => setPlayingVideoKey(null)}
                        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border bg-card px-2.5 text-[11px] font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground sm:h-9 sm:rounded-lg sm:px-3 sm:text-xs"
                        aria-label="Close video player"
                      >
                        <FaXmark className="h-3 w-3" />
                        Close
                      </button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground sm:text-[11px]">Latest within each type</span>
                    )}
                  </div>
                  <FeedCard
                    key={getStableCardKey(featuredItem)}
                    item={normalizeItem(featuredItem)}
                    featured
                    isPlaying={playingVideoKey === getStableCardKey(featuredItem)}
                    onPlay={() => setPlayingVideoKey(getStableCardKey(featuredItem))}
                  />
                </section>
              ) : null}

              {remainingItems.length > 0 ? (
                <section aria-label="More football news">
                  <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3 sm:gap-3">
                    <h2 className="text-xs font-bold tracking-tight sm:text-sm">More stories</h2>
                    <span className="text-[10px] text-muted-foreground sm:text-[11px]">{remainingItems.length} articles and videos</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
                    {remainingItems.map((item) => {
                      const normalized = normalizeItem(item);
                      const itemKey = getStableCardKey(item);

                      return (
                        <FeedCard
                          key={itemKey}
                          item={{ ...normalized, key: itemKey }}
                          isPlaying={playingVideoKey === itemKey}
                          onPlay={() => setPlayingVideoKey(itemKey)}
                        />
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {visibleCount < filteredItems.length ? (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => Math.min(count + NEWS_PAGE_SIZE, filteredItems.length))}
                    className="rounded-lg border bg-card px-3 py-2 text-xs font-semibold transition hover:bg-muted sm:px-4 sm:text-sm"
                  >
                    Show more stories ({filteredItems.length - visibleCount} remaining)
                  </button>
                </div>
              ) : null}

              {streamLoading ? (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-current" />
                  Loading football news…
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

