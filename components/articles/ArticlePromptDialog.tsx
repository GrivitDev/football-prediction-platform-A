// frontend/components/articles/ArticlePromptDialog.tsx

'use client';

import {
  useEffect,
  useState,
} from 'react';

interface ArticlePromptDialogProps {
  open: boolean;
  title: string;
  description?: string;
  label: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  type?: 'text' | 'url';
  onConfirm: (
    value: string,
  ) => void;
  onClose: () => void;
}

export default function ArticlePromptDialog({
  open,
  title,
  description,
  label,
  placeholder,
  initialValue = '',
  confirmLabel = 'Continue',
  type = 'text',
  onConfirm,
  onClose,
}: ArticlePromptDialogProps) {
  const [value, setValue] =
    useState(initialValue);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [
    open,
    initialValue,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        'Escape'
      ) {
        onClose();
      }

      if (
        event.key ===
          'Enter' &&
        !event.shiftKey
      ) {
        event.preventDefault();

        if (value.trim()) {
          onConfirm(
            value.trim(),
          );
        }
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    open,
    value,
    onClose,
    onConfirm,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-background/80 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-prompt-title"
        className="w-full max-w-sm rounded-lg border border-border bg-card p-4 shadow-2xl"
      >
        <div className="mb-3">
          <h2
            id="article-prompt-title"
            className="text-sm font-semibold text-card-foreground"
          >
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <label
          htmlFor="article-prompt-input"
          className="mb-1 block text-[11px] font-semibold text-foreground"
        >
          {label}
        </label>

        <input
          id="article-prompt-input"
          autoFocus
          type={type}
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value,
            )
          }
          placeholder={placeholder}
          className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />

        <div className="mt-3 flex justify-end gap-1.5">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-md border border-border bg-background px-3 text-[11px] font-medium text-foreground transition hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!value.trim()}
            onClick={() => {
              if (!value.trim()) {
                return;
              }

              onConfirm(
                value.trim(),
              );
            }}
            className="h-8 rounded-md bg-primary px-3 text-[11px] font-medium text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}