'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  Heart,
} from 'lucide-react';

import { useArticles } from '@/hooks/useArticles';

export default function LatestArticlesSection() {
  const { data, isLoading, isError } = useArticles({
    page: 1,
    limit: 5,
  });

  const articles = data?.data ?? [];

  if (isError) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Latest
          </p>

          <h2 className="mt-0.5 text-lg font-bold tracking-tight sm:text-xl">
            Latest Articles
          </h2>
        </div>

        <Link
          href="/articles"
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-2.5 rounded-xl border border-border/50 bg-card/40 p-2.5 sm:gap-3"
            >
              <div className="h-[72px] w-[98px] shrink-0 animate-pulse rounded-lg bg-muted sm:h-24 sm:w-36" />

              <div className="min-w-0 flex-1 space-y-2 py-0.5">
                <div className="h-2.5 w-2/5 animate-pulse rounded bg-muted" />
                <div className="h-3.5 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                <div className="h-2.5 w-full animate-pulse rounded bg-muted" />

                <div className="flex gap-2">
                  <div className="h-2.5 w-10 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-10 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-card/30 px-4 py-6 text-center text-sm text-muted-foreground">
          No articles available yet.
        </div>
      ) : (
        <div className="space-y-2.5">
          {articles.map((article) => (
            <ArticleItem
              key={article._id}
              article={article}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ArticleItem({
  article,
}: {
  article: {
    _id: string;
    slug: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    excerpt?: string | null;
    featuredImageUrl?: string | null;
    featuredImageAlt?: string | null;
    publishedAt?: string | null;
    readingTimeMinutes: number;
    viewsCount: number;
    likesCount: number;
    tags: string[];
  };
}) {
  return (
    <div className="group rounded-xl border border-border/50 bg-card/40 p-2.5 transition-colors hover:border-primary/20 hover:bg-muted/30">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <Link
          href={`/articles/${article.slug}`}
          className="relative h-[72px] w-[98px] shrink-0 overflow-hidden rounded-lg bg-muted sm:h-[88px] sm:w-[132px]"
        >
          {article.featuredImageUrl ? (
            <Image
              src={article.featuredImageUrl}
              alt={article.featuredImageAlt || article.title}
              fill
              sizes="(max-width: 640px) 98px, 132px"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[9px] font-medium text-muted-foreground sm:text-[10px]">
              No image
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/articles/${article.slug}`}
            className="block min-w-0"
          >
            <div className="mb-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[8px] text-muted-foreground sm:mb-1 sm:gap-x-3 sm:text-[10px]">
              {article.publishedAt ? (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                  <span>
                    {formatDate(article.publishedAt)}
                  </span>
                </span>
              ) : null}

              {article.readingTimeMinutes > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" />
                  <span>
                    {article.readingTimeMinutes} min
                  </span>
                </span>
              ) : null}
            </div>

            <h3 className="text-[12px] font-bold leading-[1.3] tracking-tight transition-colors group-hover:text-primary sm:line-clamp-2 sm:text-[15px] sm:leading-5">
              {article.title}
            </h3>

            {article.subtitle ? (
              <p className="mt-0.5 text-[9px] font-medium leading-[1.4] text-foreground/70 sm:line-clamp-1 sm:text-xs sm:leading-4">
                {article.subtitle}
              </p>
            ) : null}

            <p className="mt-0.5 text-[9px] leading-[1.45] text-muted-foreground sm:line-clamp-2 sm:text-[11px] sm:leading-4">
              {article.description ||
                article.excerpt ||
                'Read the full article for more football insight and analysis.'}
            </p>
          </Link>

          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 sm:mt-2 sm:gap-x-3 sm:gap-y-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-x-3">
              <span className="inline-flex items-center gap-1 text-[8px] text-muted-foreground sm:text-[10px]">
                <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {article.viewsCount.toLocaleString()}
              </span>

              <span className="inline-flex items-center gap-1 text-[8px] text-muted-foreground sm:text-[10px]">
                <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {article.likesCount.toLocaleString()}
              </span>

              {article.tags.length > 0 ? (
                <div className="flex min-w-0 flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-muted/50 px-1.5 py-0.5 text-[7px] font-medium text-muted-foreground sm:px-2 sm:text-[9px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <Link
              href={`/articles/${article.slug}`}
              className="inline-flex shrink-0 items-center gap-0.5 text-[8px] font-semibold text-primary transition-colors hover:text-primary/80 sm:gap-1 sm:text-[11px]"
            >
              Read
              <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}