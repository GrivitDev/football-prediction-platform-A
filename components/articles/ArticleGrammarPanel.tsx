'use client';

import { useState } from 'react';

import {
  CheckCheck,
  Loader2,
} from 'lucide-react';

import type { GrammarMatch } from '@/types/article';

interface ArticleGrammarPanelProps {
  matches: GrammarMatch[];
  language: string;
  isChecking?: boolean;
  isApplying?: boolean;
  onLanguageChange: (
    language: string,
  ) => void;
  onCheck: () => void;
  onSuggestionSelect?: (
    match: GrammarMatch,
    replacement: string,
  ) => void;
  onApplyAll?: () => void;
}

export default function ArticleGrammarPanel({
  matches,
  language,
  isChecking = false,
  isApplying = false,
  onLanguageChange,
  onCheck,
  onSuggestionSelect,
  onApplyAll,
}: ArticleGrammarPanelProps) {
  const [applyingKey, setApplyingKey] =
    useState<string | null>(null);

  const actionableMatches =
    matches.filter(
      (match) =>
        match.replacements.length > 0,
    );

  const buildMatchKey = (
    match: GrammarMatch,
    index: number,
  ) =>
    `${match.rule.id}-${match.offset}-${match.length}-${index}`;

  const handleSuggestionClick = (
    match: GrammarMatch,
    replacement: string,
    key: string,
  ) => {
    if (
      isApplying ||
      applyingKey
    ) {
      return;
    }

    setApplyingKey(key);

    try {
      onSuggestionSelect?.(
        match,
        replacement,
      );
    } finally {
      window.setTimeout(() => {
        setApplyingKey(null);
      }, 150);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-foreground">
          Check your writing
        </p>

        <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
          Find spelling, grammar, punctuation, and wording problems.
        </p>
      </div>

      <div className="rounded-md border border-border bg-muted/30 px-2.5 py-2">
        <p className="text-[10px] font-semibold text-foreground">
          Example
        </p>

        <p className="mt-0.5 text-[11px] leading-4.5 text-muted-foreground">
          “He go to school every day.”
          {' → '}
          “He goes to school every day.”
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-end">
        <div>
          <label
            htmlFor="grammar-language"
            className="block text-[11px] font-semibold text-foreground"
          >
            Writing language
          </label>

          <select
            id="grammar-language"
            value={language}
            onChange={(event) =>
              onLanguageChange(
                event.target.value,
              )
            }
            disabled={
              isChecking ||
              isApplying
            }
            className="mt-1 h-8 w-full rounded-md border border-input bg-background px-2.5 text-[11px] text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="en-GB">
              English (UK)
            </option>

            <option value="en-US">
              English (US)
            </option>
          </select>
        </div>

        <button
          type="button"
          onClick={onCheck}
          disabled={
            isChecking ||
            isApplying
          }
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-[11px] font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isChecking ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : null}

          {isChecking
            ? 'Checking...'
            : 'Check writing'}
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-md border border-border bg-background px-3 py-2.5">
          <p className="text-[11px] font-medium text-foreground">
            No corrections are listed.
          </p>

          <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
            Run the check whenever you want to review the article.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex flex-col gap-2 border-b border-border pb-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[11px] font-semibold text-foreground">
                Suggestions
              </span>

              <span className="ml-1.5 text-[10px] text-muted-foreground">
                {matches.length} found
              </span>
            </div>

            {onApplyAll &&
            actionableMatches.length >
              0 ? (
              <button
                type="button"
                onClick={
                  onApplyAll
                }
                disabled={
                  isChecking ||
                  isApplying ||
                  Boolean(
                    applyingKey,
                  )
                }
                className="inline-flex h-7 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[10px] font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isApplying ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCheck className="h-3 w-3" />
                )}

                {isApplying
                  ? 'Applying...'
                  : 'Apply all'}
              </button>
            ) : null}
          </div>

          {matches.map(
            (match, index) => {
              const key =
                buildMatchKey(
                  match,
                  index,
                );

              const hasReplacement =
                match.replacements
                  .length > 0;

              const isThisMatchApplying =
                applyingKey === key;

              return (
                <div
                  key={key}
                  className="rounded-md border border-border bg-background p-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 text-[11px] font-semibold text-foreground">
                      {match.message}
                    </p>

                    {match.rule
                      ?.category
                      ?.name ? (
                      <span className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                        {
                          match
                            .rule
                            .category
                            .name
                        }
                      </span>
                    ) : null}
                  </div>

                  {match.context?.text ? (
                    <p className="mt-1 text-[11px] leading-4.5 text-muted-foreground">
                      {match.context.text}
                    </p>
                  ) : null}

                  {hasReplacement ? (
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <p className="text-[10px] font-medium text-muted-foreground">
                          Try this:
                        </p>

                        <span className="text-[9px] text-muted-foreground">
                          {
                            match
                              .replacements
                              .length
                          }{' '}
                          option
                          {match
                            .replacements
                            .length !==
                          1
                            ? 's'
                            : ''}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {match.replacements
                          .slice(
                            0,
                            5,
                          )
                          .map(
                            (
                              replacement,
                            ) => (
                              <button
                                key={`${key}-${replacement.value}`}
                                type="button"
                                disabled={
                                  isChecking ||
                                  isApplying ||
                                  Boolean(
                                    applyingKey,
                                  )
                                }
                                onClick={() =>
                                  handleSuggestionClick(
                                    match,
                                    replacement.value,
                                    key,
                                  )
                                }
                                className="rounded-md border border-border bg-muted px-2 py-1 text-[10px] font-medium text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isThisMatchApplying ? (
                                  <span className="inline-flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Applying
                                  </span>
                                ) : (
                                  replacement.value
                                )}
                              </button>
                            ),
                          )}
                      </div>

                      <p className="mt-1.5 text-[9px] leading-4 text-muted-foreground">
                        Click a suggestion to apply only that correction.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                      No automatic replacement was provided for this issue.
                    </p>
                  )}
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}