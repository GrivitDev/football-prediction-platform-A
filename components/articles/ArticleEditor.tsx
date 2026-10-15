'use client';

import { useEffect } from 'react';

import type { MouseEvent } from 'react';
import type { Editor } from '@tiptap/react';

import {
  EditorContent,
  useEditor,
} from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import {
  TextStyleKit,
} from '@tiptap/extension-text-style';

interface ArticleEditorProps {
  value?: string;
  onChange: (
    content: string,
  ) => void;
  onEditorReady?: (
    editor: Editor,
  ) => void;
  minHeight?: string;
}

export default function ArticleEditor({
  value = '',
  onChange,
  onEditorReady,
  minHeight = '400px',
}: ArticleEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Image.configure({
        inline: false,
        allowBase64: false,
      }),

      TextAlign.configure({
        types: [
          'heading',
          'paragraph',
        ],
      }),

      CharacterCount,

      TextStyleKit.configure({
        fontFamily: {
          types: ['textStyle'],
        },

        fontSize: {
          types: ['textStyle'],
        },
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        class:
          'article-editor-content min-h-full w-full px-3 py-3 sm:px-4 sm:py-4 outline-none text-foreground',
      },
    },

    onUpdate: ({
      editor: currentEditor,
    }) => {
      onChange(
        currentEditor.getHTML(),
      );
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    onEditorReady?.(editor);
  }, [
    editor,
    onEditorReady,
  ]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentContent =
      editor.getHTML();

    if (
      value !== currentContent &&
      value !== undefined
    ) {
      editor.commands.setContent(
        value,
        {
          emitUpdate: false,
        },
      );
    }
  }, [
    editor,
    value,
  ]);

  if (!editor) {
    return (
      <div
        className="bg-background"
        style={{
          minHeight,
        }}
      >
        <div className="flex min-h-[260px] items-center justify-center px-4 text-xs text-muted-foreground sm:min-h-[350px]">
          Loading editor...
        </div>
      </div>
    );
  }

  const wordCount =
    editor.storage.characterCount
      ?.words?.() ?? 0;

  const characterCount =
    editor.storage.characterCount
      ?.characters?.() ?? 0;

  const focusEditorAtClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    const target =
      event.target as HTMLElement;

    if (
      target.closest(
        'a, button, img, input, textarea, select',
      )
    ) {
      return;
    }

    if (
      !editor.isFocused
    ) {
      editor.commands.focus(
        'end',
      );
    }
  };

  return (
    <div className="overflow-hidden bg-background">
      <div
        className="min-h-full cursor-text bg-background"
        style={{
          minHeight,
        }}
        onMouseDown={
          focusEditorAtClick
        }
      >
        <EditorContent
          editor={editor}
          className="min-h-full w-full"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-border bg-muted/30 px-3 py-1.5 text-[10px] text-muted-foreground sm:px-4">
        <span className="hidden sm:inline">
          Write naturally. Use the tools above when needed.
        </span>

        <span className="sm:hidden">
          Writing area
        </span>

        <div className="flex items-center gap-3">
          <span>
            {wordCount} words
          </span>

          <span>
            {characterCount} characters
          </span>
        </div>
      </div>
    </div>
  );
}