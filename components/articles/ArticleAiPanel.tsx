'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Copy,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';

import ArticlePromptDialog from '@/components/articles/ArticlePromptDialog';

import type {
  AiGeneratedArticle,
  AiHeadingsSuggestion,
  AiSeoSuggestion,
  AiWritingAction,
  AiWritingTarget,
} from '@/types/article';

interface ArticleAiPanelProps {
  target: AiWritingTarget;

  result?: string | null;

  model?: string | null;

  resultAction?: AiWritingAction | null;

  generatedArticle?: AiGeneratedArticle | null;

  seoSuggestion?: AiSeoSuggestion | null;

  headingsSuggestion?: AiHeadingsSuggestion | null;

  isProcessing?: boolean;

  onAction: (
    action: AiWritingAction,
  ) => void;

  onGenerate?: (
    prompt: string,
  ) => void;

  onApply?: () => void;

  onDiscard?: () => void;

  onRefresh?: () => void;

  canApply?: boolean;
}

interface AiAction {
  action: AiWritingAction;
  label: string;
  description: string;
  example: string;
  wholeArticleOnly?: boolean;
}

const actions: AiAction[] = [
  {
    action: 'generate',
    label: 'Write article',
    description:
      'Ask AI to write a complete football article from your instructions.',
    example:
      '“Write about bad defence in a football team.”',
  },
  {
    action: 'improve',
    label: 'Improve writing',
    description:
      'Make the writing clearer, smoother, and easier to read.',
    example:
      '“The team played good.” → “The team played well.”',
  },
  {
    action: 'rewrite',
    label: 'Rewrite',
    description:
      'Express the same idea in a fresh and natural way.',
    example:
      'A sentence → a different version with the same meaning.',
  },
  {
    action: 'humanize',
    label: 'Humanize',
    description:
      'Make the writing sound more natural and less robotic.',
    example:
      'AI-style wording → natural editorial football writing.',
  },
  {
    action: 'shorten',
    label: 'Shorten',
    description:
      'Remove repetition and unnecessary wording while keeping the point.',
    example:
      'A long paragraph → a tighter version with the key points.',
  },
  {
    action: 'expand',
    label: 'Expand',
    description:
      'Add useful detail and explanation without inventing facts.',
    example:
      'A brief explanation → a fuller explanation.',
  },
  {
    action: 'seo',
    label: 'SEO suggestions',
    description:
      'Review the complete article and suggest search improvements.',
    example:
      'Title, description, keyword, slug, and search wording.',
    wholeArticleOnly: true,
  },
  {
    action: 'headings',
    label: 'Suggest headings',
    description:
      'Suggest and apply a clearer article heading structure.',
    example:
      'H1 → H2 sections → H3 subsections.',
    wholeArticleOnly: true,
  },
];

const ACTION_LABELS: Record<
  AiWritingAction,
  string
> = {
  generate: 'Write article',
  improve: 'Improve writing',
  rewrite: 'Rewrite',
  humanize: 'Humanize',
  shorten: 'Shorten',
  expand: 'Expand',
  seo: 'SEO suggestions',
  headings: 'Suggest headings',
};

function getTargetLabel(
  target: AiWritingTarget,
) {
  switch (target) {
    case 'whole-article':
      return 'whole article';

    case 'title':
      return 'title';

    case 'subtitle':
      return 'subtitle';

    case 'description':
      return 'description';

    default:
      return target;
  }
}

function getPreviewText(
  value: string,
) {
  if (!value.trim()) {
    return '';
  }

  if (
    typeof window ===
    'undefined'
  ) {
    return value
      .replace(
        /<[^>]*>/g,
        ' ',
      )
      .replace(
        /\s+/g,
        ' ',
      )
      .trim();
  }

  const container =
    document.createElement(
      'div',
    );

  container.innerHTML =
    value;

  return (
    container.textContent ||
    ''
  )
    .replace(
      /\u00a0/g,
      ' ',
    )
    .replace(
      /\s+/g,
      ' ',
    )
    .trim();
}

function getCharacterCount(
  value?: string | null,
) {
  return value?.length ?? 0;
}

function MetadataField({
  label,
  value,
  count,
  limit,
  className = '',
}: {
  label: string;
  value?: string | null;
  count?: boolean;
  limit?: number;
  className?: string;
}) {
  return (
    <div
      className={[
        'rounded-md border border-border bg-background px-2.5 py-2',
        className,
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        {count && limit ? (
          <span className="text-[9px] text-muted-foreground">
            {getCharacterCount(
              value,
            )}
            /{limit}
          </span>
        ) : null}
      </div>

      <p className="mt-1 break-words text-[11px] leading-4.5 text-foreground">
        {value?.trim() || '—'}
      </p>
    </div>
  );
}

export default function ArticleAiPanel({
  target,
  result,
  model,
  resultAction = null,
  generatedArticle = null,
  seoSuggestion = null,
  headingsSuggestion = null,
  isProcessing = false,
  onAction,
  onGenerate,
  onApply,
  onDiscard,
  onRefresh,
  canApply,
}: ArticleAiPanelProps) {
  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    showPromptDialog,
    setShowPromptDialog,
  ] = useState(false);

  const hasResult =
    Boolean(
      result?.trim(),
    );

  const effectiveCanApply =
    canApply ??
    Boolean(
      hasResult,
    );

  const targetLabel =
    getTargetLabel(
      target,
    );

  const resultLabel =
    resultAction
      ? ACTION_LABELS[
          resultAction
        ]
      : 'AI result';

  const previewText =
    result
      ? getPreviewText(
          result,
        )
      : '';

  useEffect(() => {
    if (!hasResult) {
      setCopied(false);
    }
  }, [hasResult]);

  const handleCopy =
    async () => {
      if (!result?.trim()) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          result,
        );

        setCopied(true);

        window.setTimeout(
          () =>
            setCopied(false),
          1200,
        );
      } catch {
        setCopied(false);
      }
    };

  const handleActionClick =
    (
      action: AiWritingAction,
    ) => {
      if (
        action ===
        'generate'
      ) {
        setShowPromptDialog(
          true,
        );

        return;
      }

      onAction(action);
    };

  const handleGenerateConfirm =
    (
      prompt: string,
    ) => {
      setShowPromptDialog(
        false,
      );

      onGenerate?.(
        prompt,
      );
    };

  return (
    <>
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />

            <p className="text-sm font-semibold text-foreground">
              AI writing assistant
            </p>
          </div>

          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            Working on:{' '}
            {targetLabel}. Choose a writing tool and review the result before applying it.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map(
            (item) => {
              const unavailable =
                item.wholeArticleOnly &&
                target !==
                  'whole-article';

              return (
                <button
                  key={
                    item.action
                  }
                  type="button"
                  disabled={
                    isProcessing ||
                    unavailable
                  }
                  onClick={() =>
                    handleActionClick(
                      item.action,
                    )
                  }
                  className={[
                    'rounded-md border border-border bg-background p-3 text-left transition',
                    unavailable
                      ? 'cursor-not-allowed opacity-40'
                      : 'hover:border-primary/40 hover:bg-muted',
                    isProcessing
                      ? 'cursor-not-allowed opacity-50'
                      : '',
                  ].join(
                    ' ',
                  )}
                >
                  <span className="block text-xs font-semibold text-foreground">
                    {item.label}
                  </span>

                  <span className="mt-1 block text-[11px] leading-4.5 text-muted-foreground">
                    {
                      item.description
                    }
                  </span>

                  <span className="mt-2 block border-t border-border pt-2 text-[10px] leading-4 text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Example:
                    </span>{' '}
                    {
                      item.example
                    }
                  </span>

                  {unavailable ? (
                    <span className="mt-1.5 block text-[10px] font-medium text-muted-foreground">
                      Available for the whole article only.
                    </span>
                  ) : null}
                </button>
              );
            },
          )}
        </div>

        {isProcessing &&
        !hasResult ? (
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />

            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">
                AI is working...
              </p>

              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Nothing has been changed yet.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {hasResult ? (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-background/80 p-3 backdrop-blur-sm"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
                event.currentTarget &&
              !isProcessing
            ) {
              onDiscard?.();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-ai-result-title"
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />

                  <h2
                    id="article-ai-result-title"
                    className="text-sm font-semibold text-foreground"
                  >
                    {resultLabel}
                  </h2>
                </div>

                {model ? (
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                    Generated with{' '}
                    {model}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() =>
                  !isProcessing &&
                  onDiscard?.()
                }
                disabled={
                  isProcessing
                }
                aria-label="Close result"
                className="shrink-0 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-3 rounded-md border border-border bg-muted/30 px-2.5 py-2">
                <p className="text-[10px] font-semibold text-foreground">
                  Review before applying
                </p>

                <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                  The article has not been changed. Apply only after checking the generated content and metadata.
                </p>
              </div>

              {resultAction ===
                'generate' &&
              generatedArticle ? (
                <div className="mb-3 space-y-2">
                  <div className="rounded-md border border-primary/20 bg-primary/5 px-2.5 py-2">
                    <p className="text-[10px] font-semibold text-foreground">
                      Complete generated article
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                      Applying this result will replace the current editable article fields with the generated values below.
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <MetadataField
                      label="Title"
                      value={
                        generatedArticle.title
                      }
                      count
                      limit={200}
                      className="sm:col-span-2"
                    />

                    <MetadataField
                      label="Subtitle"
                      value={
                        generatedArticle.subtitle
                      }
                      count
                      limit={300}
                    />

                    <MetadataField
                      label="Description"
                      value={
                        generatedArticle.description
                      }
                      count
                      limit={1000}
                    />

                    <MetadataField
                      label="Excerpt"
                      value={
                        generatedArticle.excerpt
                      }
                      count
                      limit={2000}
                    />

                    <MetadataField
                      label="Slug"
                      value={
                        generatedArticle.slug
                      }
                      count
                      limit={300}
                    />

                    <MetadataField
                      label="SEO title"
                      value={
                        generatedArticle.seoTitle
                      }
                      count
                      limit={300}
                    />

                    <MetadataField
                      label="SEO description"
                      value={
                        generatedArticle.seoDescription
                      }
                      count
                      limit={1000}
                      className="sm:col-span-2"
                    />

                    <MetadataField
                      label="Focus keyword"
                      value={
                        generatedArticle.focusKeyword
                      }
                      count
                      limit={200}
                    />

                    <MetadataField
                      label="Canonical URL"
                      value={
                        generatedArticle.canonicalUrl
                      }
                      count
                      limit={2048}
                    />

                    <div className="rounded-md border border-border bg-background px-2.5 py-2 sm:col-span-2">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Tags
                      </p>

                      <div className="mt-1 flex flex-wrap gap-1">
                        {generatedArticle.tags?.length ? (
                          generatedArticle.tags.map(
                            (
                              tag,
                              index,
                            ) => (
                              <span
                                key={`${tag}-${index}`}
                                className="rounded-md bg-muted px-2 py-1 text-[9px] font-medium text-foreground"
                              >
                                {tag}
                              </span>
                            ),
                          )
                        ) : (
                          <span className="text-[10px] text-muted-foreground">
                            No tags generated.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-border bg-background px-2.5 py-2">
                    <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Generated article body
                    </p>

                    <div className="max-h-[280px] overflow-y-auto rounded border border-border bg-muted/20 p-2.5">
                      <div className="whitespace-pre-wrap break-words text-[11px] leading-5 text-foreground">
                        {getPreviewText(
                          generatedArticle.contentHtml,
                        ) ||
                          'No article body was generated.'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {resultAction ===
                'seo' &&
              seoSuggestion ? (
                <div className="mb-3 space-y-2">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <MetadataField
                      label="SEO title"
                      value={
                        seoSuggestion.seoTitle
                      }
                      count
                      limit={300}
                    />

                    <MetadataField
                      label="Focus keyword"
                      value={
                        seoSuggestion.focusKeyword
                      }
                      count
                      limit={200}
                    />

                    <MetadataField
                      label="Meta description"
                      value={
                        seoSuggestion.seoDescription
                      }
                      count
                      limit={1000}
                      className="sm:col-span-2"
                    />

                    <MetadataField
                      label="Suggested slug"
                      value={
                        seoSuggestion.suggestedSlug
                      }
                      count
                      limit={300}
                      className="sm:col-span-2"
                    />
                  </div>

                  {seoSuggestion.changes?.length ? (
                    <div className="rounded-md border border-border bg-background px-2.5 py-2">
                      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Changes made
                      </p>

                      <div className="space-y-1">
                        {seoSuggestion.changes.map(
                          (
                            change,
                            index,
                          ) => (
                            <div
                              key={`${change}-${index}`}
                              className="rounded border border-border bg-muted/30 px-2 py-1.5 text-[10px] leading-4 text-foreground"
                            >
                              {change}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ) : null}

                  {seoSuggestion.unresolvedIssues?.length ? (
                    <div className="rounded-md border border-border bg-background px-2.5 py-2">
                      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Unresolved issues
                      </p>

                      <div className="space-y-1">
                        {seoSuggestion.unresolvedIssues.map(
                          (
                            issue,
                            index,
                          ) => (
                            <div
                              key={`${issue}-${index}`}
                              className="rounded border border-border bg-muted/30 px-2 py-1.5 text-[10px] leading-4 text-foreground"
                            >
                              {issue}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ) : null}

                  {seoSuggestion.revisedContentHtml?.trim() ? (
                    <div className="rounded-md border border-border bg-background px-2.5 py-2">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Revised article
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                        AI has also prepared an analyzer-guided revision of the article body. It will replace the current body when you apply this SEO result.
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {resultAction ===
                'headings' &&
              headingsSuggestion ? (
                <div className="mb-3 rounded-md border border-border bg-background p-2.5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold text-foreground">
                      Suggested structure
                    </p>

                    <span className="text-[9px] text-muted-foreground">
                      {
                        headingsSuggestion
                          .headings
                          .length
                      }{' '}
                      heading
                      {headingsSuggestion
                        .headings
                        .length !==
                      1
                        ? 's'
                        : ''}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {headingsSuggestion.headings.map(
                      (
                        heading,
                        index,
                      ) => (
                        <div
                          key={`${heading.level}-${heading.text}-${index}`}
                          className="flex items-start gap-2 rounded border border-border bg-muted/30 px-2 py-1.5"
                        >
                          <span className="shrink-0 text-[9px] font-semibold text-muted-foreground">
                            H
                            {
                              heading.level
                            }
                          </span>

                          <span className="text-[11px] leading-4.5 text-foreground">
                            {
                              heading.text
                            }
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : null}

              <div className="min-h-[180px] rounded-md border border-border bg-background p-3 sm:min-h-[240px]">
                {isProcessing ? (
                  <div className="flex min-h-[180px] items-center justify-center sm:min-h-[240px]">
                    <div className="text-center">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary" />

                      <p className="mt-2 text-xs font-medium text-foreground">
                        Generating a new result...
                      </p>

                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        The current article remains unchanged.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words text-xs leading-5 text-foreground">
                    {previewText ||
                      result}
                  </div>
                )}
              </div>

              <div className="mt-2 text-[10px] leading-4 text-muted-foreground">
                {resultAction ===
                'generate'
                  ? 'Apply will populate the complete article editor with the generated title, subtitle, description, excerpt, slug, SEO metadata, tags, and article body.'
                  : resultAction ===
                      'seo'
                    ? 'Apply will update the SEO title, meta description, focus keyword, and slug, replace the article body with the analyzer-guided revision, and run the SEO check again.'
                    : resultAction ===
                        'headings'
                      ? 'Apply will replace the article body with the revised heading structure while preserving the article content.'
                      : 'Important facts and claims should still be reviewed before publishing.'}
              </div>
            </div>

            <div className="shrink-0 border-t border-border bg-muted/20 px-3 py-2.5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() =>
                    void handleCopy()
                  }
                  disabled={
                    isProcessing
                  }
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Copy className="h-3.5 w-3.5" />

                  {copied
                    ? 'Copied'
                    : 'Copy'}
                </button>

                <div className="grid grid-cols-3 gap-1.5 sm:flex">
                  <button
                    type="button"
                    onClick={() =>
                      !isProcessing &&
                      onDiscard?.()
                    }
                    disabled={
                      isProcessing
                    }
                    className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Discard
                  </button>

                  <button
                    type="button"
                    onClick={
                      onRefresh
                    }
                    disabled={
                      isProcessing ||
                      !onRefresh
                    }
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />

                    Refresh
                  </button>

                  <button
                    type="button"
                    onClick={
                      onApply
                    }
                    disabled={
                      isProcessing ||
                      !effectiveCanApply ||
                      !onApply
                    }
                    className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-[11px] font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <ArticlePromptDialog
        open={
          showPromptDialog
        }
        title="Write a new article"
        description="Describe what you want the AI to write. Be as specific as needed."
        label="Writing instruction"
        placeholder="Write an article about bad defence in a football team."
        confirmLabel="Generate article"
        onConfirm={
          handleGenerateConfirm
        }
        onClose={() =>
          setShowPromptDialog(
            false,
          )
        }
      />
    </>
  );
}