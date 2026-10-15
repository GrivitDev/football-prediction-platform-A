'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';

import {
  useArticle,
  useArticleLike,
  useArticleView,
} from '@/hooks/useArticles';

export default function ArticleDetailsPage() {
  const params = useParams<{ slug: string }>();

  const slug = params?.slug || '';

  const { data: article, isLoading, isError } = useArticle(slug);

  const viewMutation = useArticleView();
  const likeMutation = useArticleLike();

  const viewTrackedRef = useRef(false);

  useEffect(() => {
    if (!article?._id || viewTrackedRef.current) {
      return;
    }

    viewTrackedRef.current = true;

    const storageKey = `article-viewed-${article._id}`;

    try {
      if (sessionStorage.getItem(storageKey)) {
        return;
      }

      sessionStorage.setItem(storageKey, '1');

      viewMutation.mutate(article._id);
    } catch {
      viewMutation.mutate(article._id);
    }
  }, [article?._id, viewMutation]);

  const bodyContent = useMemo(() => {
    const content = article?.content;

    if (!content) {
      return '';
    }

    return content.replace(
      /<h1\b[^>]*>[\s\S]*?<\/h1>/i,
      '',
    );
  }, [article?.content]);

  const handleShare = (
    platform: 'facebook' | 'x' | 'linkedin' | 'whatsapp',
  ) => {
    const url = window.location.href;
    const title = article?.title || 'Football article';

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

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 sm:px-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading article...
          </div>
        </div>
      </main>
    );
  }

  if (isError || !article) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6">
          <h1 className="text-2xl font-bold">
            Article not found
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            The article may have been unpublished, removed, or the link may be
            incorrect.
          </p>

          <Link
            href="/articles"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <article className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
        <Link
          href="/articles"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>

        <header className="border-b border-border/60 pb-7">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.7rem]">
              {article.title}
            </h1>

            {article.subtitle ? (
              <p className="mt-3 text-base font-medium leading-7 text-foreground/75 sm:text-lg">
                {article.subtitle}
              </p>
            ) : null}

            {article.description ? (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                {article.description}
              </p>
            ) : null}
          </div>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {article.publishedAt ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(article.publishedAt)}
                </span>
              ) : null}

              {article.readingTimeMinutes > 0 ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {article.readingTimeMinutes} min read
                </span>
              ) : null}

              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {article.viewsCount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
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

              <button
                type="button"
                onClick={() => likeMutation.mutate(article._id)}
                disabled={likeMutation.isPending}
                className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                aria-label="Like article"
              >
                {likeMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Heart className="h-3.5 w-3.5" />
                )}

                {article.likesCount.toLocaleString()}
              </button>
            </div>
          </div>
        </header>

        {article.featuredImageUrl ? (
        <figure className="relative mt-7 aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <Image
            src={article.featuredImageUrl}
            alt={article.featuredImageAlt || article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 960px"
            className="object-cover"
            priority
            />
        </figure>
        ) : null}

        {article.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div
            className="
            article-content
            mt-8
            max-w-4xl
            text-[15px]
            leading-7
            text-foreground/90
            text-left
            sm:text-justify
            hyphens-auto

            [&_p]:mb-5
            [&_p:last-child]:mb-0

            [&_h1]:mb-5
            [&_h1]:mt-8
            [&_h1]:text-2xl
            [&_h1]:font-bold
            [&_h1]:leading-tight

            [&_h2]:mb-4
            [&_h2]:mt-9
            [&_h2]:text-xl
            [&_h2]:font-bold
            [&_h2]:leading-tight

            [&_h3]:mb-3
            [&_h3]:mt-7
            [&_h3]:text-lg
            [&_h3]:font-bold

            [&_h4]:mb-2
            [&_h4]:mt-6
            [&_h4]:font-semibold

            [&_ul]:mb-5
            [&_ul]:ml-5
            [&_ul]:list-disc

            [&_ol]:mb-5
            [&_ol]:ml-5
            [&_ol]:list-decimal

            [&_li]:mb-2

            [&_a]:font-medium
            [&_a]:text-primary
            [&_a]:underline
            [&_a]:underline-offset-4

            [&_blockquote]:my-6
            [&_blockquote]:border-l-2
            [&_blockquote]:border-primary
            [&_blockquote]:pl-5
            [&_blockquote]:italic
            [&_blockquote]:text-muted-foreground

            [&_img]:my-7
            [&_img]:w-full
            [&_img]:rounded-xl
            [&_img]:border
            [&_img]:border-border/60

            [&_figure]:my-7
            [&_figcaption]:mt-2
            [&_figcaption]:text-center
            [&_figcaption]:text-xs
            [&_figcaption]:text-muted-foreground

            [&_table]:my-7
            [&_table]:w-full
            [&_table]:overflow-hidden
            [&_table]:rounded-xl
            [&_table]:border
            [&_table]:border-border
            [&_th]:border-b
            [&_th]:border-border
            [&_th]:bg-muted/60
            [&_th]:px-3
            [&_th]:py-2
            [&_th]:text-left
            [&_td]:border-b
            [&_td]:border-border
            [&_td]:px-3
            [&_td]:py-2
          "
          dangerouslySetInnerHTML={{
            __html: bodyContent,
          }}
        />

        <footer className="mt-10 border-t border-border/60 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>
                {article.likesCount.toLocaleString()}{' '}
                {article.likesCount === 1 ? 'like' : 'likes'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => likeMutation.mutate(article._id)}
              disabled={likeMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-50"
            >
              {likeMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              Like article
            </button>
          </div>
        </footer>
      </article>
    </main>
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
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
      className="h-3.5 w-3.5"
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
      className="h-4 w-4"
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
      className="h-4 w-4"
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
    month: 'long',
    year: 'numeric',
  }).format(date);
}