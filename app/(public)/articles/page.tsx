'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  FileText,
  Heart,
  Loader2,
  Newspaper,
} from 'lucide-react';
import { useState } from 'react';

import { useArticles } from '@/hooks/useArticles';

import type { Article } from '@/types/article';

const PAGE_SIZE = 8;

export default function ArticlesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useArticles({
    page,
    limit: PAGE_SIZE,
  });

  const articles = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handlePrevious = () => {
    setPage((current) => Math.max(1, current - 1));

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNext = () => {
    setPage((current) => Math.min(totalPages, current + 1));

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Honest Predict Football
            </p>

            <h1 className="text-2xl font-bold tracking-tight">
              Articles
            </h1>
          </div>

          {data && data.total > 0 ? (
            <p className="hidden text-xs text-muted-foreground sm:block">
              {data.total} {data.total === 1 ? 'article' : 'articles'}
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState />
        ) : articles.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-card/40">
              {articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="mt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </button>

                <span className="text-xs text-muted-foreground">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}

function ArticleCard({
  article,
}: {
  article: Article;
}) {
  const summary =
    article.description?.trim() ||
    article.excerpt?.trim() ||
    'Read the full article for the latest football analysis and insights.';

  const handleShare = (
    platform: 'facebook' | 'x' | 'linkedin' | 'whatsapp',
  ) => {
    const url = `${window.location.origin}/articles/${article.slug}`;
    const title = article.title || 'Football article';

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    };

    window.open(
      shareUrls[platform],
      '_blank',
      'noopener,noreferrer,width=720,height=620',
    );
  };

  return (
    <article className="group px-2.5 py-2.5 transition-colors hover:bg-muted/30 sm:px-4 sm:py-3">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <Link
          href={`/articles/${article.slug}`}
          className="relative h-[58px] w-[82px] shrink-0 overflow-hidden rounded-md bg-muted sm:h-[70px] sm:w-[108px]"
        >
          {article.featuredImageUrl ? (
            <Image
              src={article.featuredImageUrl}
              alt={article.featuredImageAlt || article.title}
              fill
              sizes="(max-width: 640px) 82px, 108px"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Newspaper className="h-6 w-6 text-muted-foreground/45 sm:h-7 sm:w-7" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/articles/${article.slug}`}
            className="block min-w-0"
          >
            <div className="mb-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[9px] text-muted-foreground sm:mb-1 sm:gap-x-3 sm:text-[11px]">
              {article.publishedAt ? (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {formatDate(article.publishedAt)}
                </span>
              ) : null}

              {article.readingTimeMinutes > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {article.readingTimeMinutes} min
                </span>
              ) : null}
            </div>

            <h2 className="text-[13px] font-bold leading-[1.2] tracking-tight transition-colors group-hover:text-primary sm:line-clamp-2 sm:text-base sm:leading-5">
              {article.title}
            </h2>

            {article.subtitle ? (
              <p className="mt-0.5 text-[10px] font-medium leading-[1.35] text-foreground/70 sm:line-clamp-1 sm:text-xs sm:leading-5">
                {article.subtitle}
              </p>
            ) : null}

            <p className="mt-0.5 text-[10px] leading-[1.4] text-muted-foreground sm:line-clamp-1 sm:text-xs sm:leading-5">
              {summary}
            </p>
          </Link>

          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 sm:mt-2 sm:gap-x-3 sm:gap-y-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-x-3">
              <span className="inline-flex items-center gap-1 text-[9px] text-muted-foreground sm:text-[11px]">
                <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {article.viewsCount.toLocaleString()}
              </span>

              <span className="inline-flex items-center gap-1 text-[9px] text-muted-foreground sm:text-[11px]">
                <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {article.likesCount.toLocaleString()}
              </span>

              {article.tags.length > 0 ? (
                <div className="flex min-w-0 flex-wrap gap-1">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-muted/50 px-1.5 py-0.5 text-[8px] font-medium text-muted-foreground sm:px-2 sm:text-[9px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <SocialButton
                label="Share on Facebook"
                onClick={() => handleShare('facebook')}
              >
                <FacebookIcon />
              </SocialButton>

              <SocialButton
                label="Share on X"
                onClick={() => handleShare('x')}
              >
                <XIcon />
              </SocialButton>

              <SocialButton
                label="Share on LinkedIn"
                onClick={() => handleShare('linkedin')}
              >
                <LinkedInIcon />
              </SocialButton>

              <SocialButton
                label="Share on WhatsApp"
                onClick={() => handleShare('whatsapp')}
              >
                <WhatsAppIcon />
              </SocialButton>

              <Link
                href={`/articles/${article.slug}`}
                className="ml-0.5 inline-flex items-center gap-0.5 text-[9px] font-semibold text-primary transition-colors hover:text-primary/80 sm:ml-1 sm:gap-1 sm:text-[11px]"
              >
                Read
                <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function SocialButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted hover:text-foreground sm:h-7 sm:w-7"
    >
      {children}
    </button>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-border/60 bg-card/30">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading articles...
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-border/60 bg-card/30 px-6 text-center">
      <FileText className="h-9 w-9 text-muted-foreground/50" />

      <h2 className="mt-3 text-base font-semibold">
        No articles available
      </h2>

      <p className="mt-1.5 max-w-md text-xs leading-5 text-muted-foreground">
        Published football articles will appear here when they are available.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-6 text-center">
      <FileText className="h-9 w-9 text-destructive/70" />

      <h2 className="mt-3 text-base font-semibold">
        Articles could not be loaded
      </h2>

      <p className="mt-1.5 max-w-md text-xs leading-5 text-muted-foreground">
        There was a problem loading the article library. Please try again.
      </p>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3 sm:h-3.5 sm:w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.5-4 4.1V10H8v3h2.4v8h3.1Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-2.5 w-2.5 sm:h-3 sm:w-3"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.1l-4.8-6.3L6.6 22H3.5l7.3-8.4L1 2h6.3l4.3 5.7L18.9 2Zm-1.1 17.8h1.7L6.2 4.1H4.4l13.4 15.7Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3 sm:h-3.5 sm:w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.4 8.2H3.2V21h3.2V8.2ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3ZM21 13.7c0-3.9-2.1-5.7-5-5.7-2.3 0-3.3 1.3-3.9 2.1V8.2H9V21h3.1v-6.3c0-1.7.3-3.4 2.5-3.4 2.1 0 2.1 2 2.1 3.5V21H21v-7.3Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3 sm:h-3.5 sm:w-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.5 3.5A11.9 11.9 0 0 0 12.1 0C5.5 0 .1 5.4.1 12c0 2.1.6 4.1 1.6 5.9L0 24l6.2-1.6a12 12 0 0 0 5.9 1.5h.1c6.6 0 11.9-5.4 11.9-12 0-3.2-1.2-6.2-3.6-8.4ZM12.1 21.9c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 0 1 2 12c0-5.5 4.5-9.9 10-9.9 2.7 0 5.1 1 7 2.9 1.9 1.9 2.9 4.3 2.9 7 0 5.5-4.4 9.9-9.8 9.9Zm5.5-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.3-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.1 3.1c.1.2 2 3 4.8 4.2.7.3 1.3.5 1.8.6.8.2 1.5.2 2 .1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z" />
    </svg>
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