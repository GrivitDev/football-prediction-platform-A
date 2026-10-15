'use client';

import type { ArticleSeoAnalysis } from '@/types/article';

interface ArticleSeoPanelProps {
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  slug: string;
  canonicalUrl: string;
  analysis?: ArticleSeoAnalysis | null;
  isAnalyzing?: boolean;
  onSeoTitleChange: (
    value: string,
  ) => void;
  onSeoDescriptionChange: (
    value: string,
  ) => void;
  onFocusKeywordChange: (
    value: string,
  ) => void;
  onSlugChange: (
    value: string,
  ) => void;
  onCanonicalUrlChange: (
    value: string,
  ) => void;
  onAnalyze: () => void;
}

function StatusIcon({
  passed,
}: {
  passed: boolean;
}) {
  return (
    <span
      className={
        passed
          ? 'font-semibold text-primary'
          : 'font-semibold text-destructive'
      }
      aria-hidden="true"
    >
      {passed ? '✓' : '!'}
    </span>
  );
}

function Example({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
      Example: {children}
    </p>
  );
}

export default function ArticleSeoPanel({
  seoTitle,
  seoDescription,
  focusKeyword,
  slug,
  canonicalUrl,
  analysis,
  isAnalyzing = false,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onFocusKeywordChange,
  onSlugChange,
  onCanonicalUrlChange,
  onAnalyze,
}: ArticleSeoPanelProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-foreground">
          Make the article easier to find
        </p>

        <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
          Search details help search engines understand the article.
        </p>
      </div>

      <div>
        <label
          htmlFor="article-slug"
          className="block text-[11px] font-semibold text-foreground"
        >
          Page address
        </label>

        <input
          id="article-slug"
          type="text"
          value={slug}
          onChange={(event) =>
            onSlugChange(
              event.target.value,
            )
          }
          maxLength={300}
          placeholder="latest-football-news"
          className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2.5 text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />

        <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <Example>
            latest-football-news
          </Example>

          <span>
            {slug.length}/300
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="seo-title"
          className="block text-[11px] font-semibold text-foreground"
        >
          Search title
        </label>

        <input
          id="seo-title"
          type="text"
          value={seoTitle}
          onChange={(event) =>
            onSeoTitleChange(
              event.target.value,
            )
          }
          maxLength={300}
          placeholder="Latest Football News and Results"
          className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2.5 text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />

        <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>
            Recommended by SEO: 30–60 characters
          </span>

          <span>
            {seoTitle.length}/300
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="seo-description"
          className="block text-[11px] font-semibold text-foreground"
        >
          Search description
        </label>

        <textarea
          id="seo-description"
          value={seoDescription}
          onChange={(event) =>
            onSeoDescriptionChange(
              event.target.value,
            )
          }
          maxLength={1000}
          rows={3}
          placeholder="Read the latest football news, results and analysis."
          className="mt-1 w-full resize-none rounded-md border border-input bg-background px-2.5 py-2 text-[11px] leading-4.5 text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />

        <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>
            Recommended by SEO: 120–170 characters
          </span>

          <span>
            {seoDescription.length}/1000
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="focus-keyword"
          className="block text-[11px] font-semibold text-foreground"
        >
          Main search phrase
        </label>

        <input
          id="focus-keyword"
          type="text"
          value={focusKeyword}
          onChange={(event) =>
            onFocusKeywordChange(
              event.target.value,
            )
          }
          maxLength={200}
          placeholder="football news"
          className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2.5 text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />

        <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <Example>
            football news
          </Example>

          <span>
            {focusKeyword.length}/200
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="canonical-url"
          className="block text-[11px] font-semibold text-foreground"
        >
          Preferred page address
        </label>

        <input
          id="canonical-url"
          type="url"
          value={canonicalUrl}
          onChange={(event) =>
            onCanonicalUrlChange(
              event.target.value,
            )
          }
          maxLength={2048}
          placeholder="https://example.com/articles/football-news"
          className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2.5 text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />

        <div className="mt-0.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <Example>
            https://example.com/articles/football-news
          </Example>

          <span>
            {canonicalUrl.length}/2048
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={isAnalyzing}
        className="inline-flex h-8 w-full items-center justify-center rounded-md bg-primary px-3 text-[11px] font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAnalyzing
          ? 'Checking...'
          : 'Check SEO'}
      </button>

      {analysis ? (
        <div className="space-y-3 border-t border-border pt-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                SEO check
              </span>

              <span className="text-xs font-semibold text-foreground">
                {analysis.score}%
              </span>
            </div>

            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      analysis.score,
                    ),
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            {analysis.checks.map(
              (check) => (
                <div
                  key={check.key}
                  className="border-b border-border pb-2 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-1.5">
                    <StatusIcon
                      passed={
                        check.passed
                      }
                    />

                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-foreground">
                        {check.label}
                      </p>

                      <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                        {check.message}
                      </p>

                      {check.recommendation ? (
                        <p className="mt-0.5 text-[10px] leading-4 text-foreground">
                          {check.recommendation}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div className="rounded-md bg-muted px-2.5 py-2">
              <span className="block text-[9px] text-muted-foreground">
                Words
              </span>

              <span className="mt-0.5 block text-xs font-semibold text-foreground">
                {analysis.metrics.wordCount}
              </span>
            </div>

            <div className="rounded-md bg-muted px-2.5 py-2">
              <span className="block text-[9px] text-muted-foreground">
                Headings
              </span>

              <span className="mt-0.5 block text-xs font-semibold text-foreground">
                {analysis.metrics.headingCount}
              </span>
            </div>

            <div className="rounded-md bg-muted px-2.5 py-2">
              <span className="block text-[9px] text-muted-foreground">
                Internal links
              </span>

              <span className="mt-0.5 block text-xs font-semibold text-foreground">
                {analysis.metrics.internalLinkCount}
              </span>
            </div>

            <div className="rounded-md bg-muted px-2.5 py-2">
              <span className="block text-[9px] text-muted-foreground">
                Images
              </span>

              <span className="mt-0.5 block text-xs font-semibold text-foreground">
                {analysis.metrics.imageCount}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}