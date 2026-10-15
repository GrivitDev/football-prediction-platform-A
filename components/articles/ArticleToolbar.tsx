// frontend/components/articles/ArticleToolbar.tsx

'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  ChangeEvent,
  ReactNode,
} from 'react';

import type { Editor } from '@tiptap/react';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  FilePlus2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Save,
  Send,
  Strikethrough,
  Underline,
  Undo2,
  Trash2,
  X,
} from 'lucide-react';

import { toast } from 'sonner';

import ArticleAiPanel from '@/components/articles/ArticleAiPanel';
import ArticleFeaturedImage from '@/components/articles/ArticleFeaturedImage';
import ArticleGrammarPanel from '@/components/articles/ArticleGrammarPanel';
import ArticleSeoPanel from '@/components/articles/ArticleSeoPanel';

import {
  uploadService,
} from '@/services/uploads.service';

import type {
  AiGeneratedArticle,
  AiHeadingsSuggestion,
  AiSeoSuggestion,
  AiWritingAction,
  ArticleSeoAnalysis,
  GrammarMatch,
} from '@/types/article';

export type ArticlePanel =
  | 'file'
  | 'editor'
  | 'grammar'
  | 'seo'
  | 'ai'
  | 'image';

export type AiTarget =
  | 'whole-article'
  | 'title'
  | 'subtitle'
  | 'description';

interface ArticleToolbarProps {
  editor: Editor | null;

  activePanel: ArticlePanel;

  onPanelChange: (
    panel: ArticlePanel,
  ) => void;

  file: {
    title: string;
    subtitle: string;
    description: string;
    slug: string;
    tagsInput: string;

    onTitleChange: (
      value: string,
    ) => void;

    onSubtitleChange: (
      value: string,
    ) => void;

    onDescriptionChange: (
      value: string,
    ) => void;

    onSlugChange: (
      value: string,
    ) => void;

    onTagsChange: (
      value: string,
    ) => void;

    onNew: () => void;
    onSaveDraft: () => void;
    onPublish: () => void;
    onDelete?: () => void;

    isSavingDraft: boolean;
    isPublishing: boolean;
    canDelete: boolean;
  };

  image: {
    imageUrl: string;
    imageAlt: string;
    disabled: boolean;

    onImageUploaded: (
      uploaded: {
        url: string;
        publicId: string;
      },
    ) => void;

    onImageAltChange: (
      value: string,
    ) => void;

    onRemove: () => void;
  };

  grammar: {
    matches: GrammarMatch[];
    language: string;
    isChecking: boolean;
    isApplying: boolean;

    onLanguageChange: (
      value: string,
    ) => void;

    onCheck: () => void;

    onSuggestionSelect: (
      match: GrammarMatch,
      replacement: string,
    ) => void;

    onApplyAll: () => void;
  };

  seo: {
    seoTitle: string;
    seoDescription: string;
    focusKeyword: string;
    slug: string;
    canonicalUrl: string;
    analysis: ArticleSeoAnalysis | null;
    isAnalyzing: boolean;

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
  };

  ai: {
    target: AiTarget;
    result: string | null;
    model: string | null;
    resultAction: AiWritingAction | null;

    generatedArticle:
      AiGeneratedArticle | null;

    seoSuggestion:
      AiSeoSuggestion | null;

    headingsSuggestion:
      AiHeadingsSuggestion | null;

    isProcessing: boolean;

    onTargetChange: (
      target: AiTarget,
    ) => void;

    onAction: (
      action: AiWritingAction,
      target: AiTarget,
    ) => void;

    onGenerate: (
      prompt: string,
    ) => void;

    onApply: () => void;
    onDiscard: () => void;
    onRefresh: () => void;
    canApply: boolean;
  };
}

type DropdownName =
  | 'textType'
  | 'font'
  | 'size'
  | null;

type TextType =
  | 'normal'
  | 'main'
  | 'section'
  | 'subheading';

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const FONT_FAMILIES = [
  {
    label: 'Default font',
    value: '',
  },
  {
    label: 'Arial',
    value: 'Arial',
  },
  {
    label: 'Georgia',
    value: 'Georgia',
  },
  {
    label: 'Times New Roman',
    value: 'Times New Roman',
  },
  {
    label: 'Verdana',
    value: 'Verdana',
  },
  {
    label: 'Trebuchet MS',
    value: 'Trebuchet MS',
  },
  {
    label: 'Courier New',
    value: 'Courier New',
  },
];

const FONT_SIZES = [
  {
    label: 'Default',
    value: '',
  },
  ...[
    12,
    14,
    16,
    18,
    20,
    22,
    24,
    26,
    28,
    30,
    32,
  ].map((size) => ({
    label: `${size} px`,
    value: `${size}px`,
  })),
];

const TEXT_TYPES: {
  label: string;
  value: TextType;
}[] = [
  {
    label: 'Normal text',
    value: 'normal',
  },
  {
    label: 'Main heading',
    value: 'main',
  },
  {
    label: 'Section heading',
    value: 'section',
  },
  {
    label: 'Subheading',
    value: 'subheading',
  },
];

interface ToolbarButtonProps {
  label?: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onClick: () => void;
}

function ToolbarButton({
  label,
  title,
  active = false,
  disabled = false,
  icon,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex h-8 items-center justify-center gap-1.5 rounded-md border px-2 text-[11px] font-medium transition',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground hover:bg-muted',
        disabled
          ? 'cursor-not-allowed opacity-40'
          : '',
      ].join(' ')}
    >
      {icon}

      {label ? (
        <span>{label}</span>
      ) : null}
    </button>
  );
}

interface ToolbarDropdownProps {
  name: Exclude<
    DropdownName,
    null
  >;

  label: string;

  value: string;

  options: {
    label: string;
    value: string;
  }[];

  openMenu: DropdownName;

  onOpenChange: (
    name: DropdownName,
  ) => void;

  onSelect: (
    value: string,
  ) => void;
}

function ToolbarDropdown({
  name,
  label,
  value,
  options,
  openMenu,
  onOpenChange,
  onSelect,
}: ToolbarDropdownProps) {
  const isOpen =
    openMenu === name;

  const selected =
    options.find(
      (option) =>
        option.value === value,
    );

  return (
    <div
      data-toolbar-dropdown
      className="relative"
    >
      <button
        type="button"
        title={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() =>
          onOpenChange(
            isOpen ? null : name,
          )
        }
        className="inline-flex h-8 min-w-[105px] items-center justify-between gap-2 rounded-md border border-border bg-background px-2.5 text-[11px] font-medium text-foreground transition hover:bg-muted"
      >
        <span className="truncate">
          {selected?.label ||
            label}
        </span>

        <ChevronDown
          className={[
            'h-3 w-3 shrink-0 text-muted-foreground transition-transform',
            isOpen
              ? 'rotate-180'
              : '',
          ].join(' ')}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 min-w-[175px] overflow-hidden rounded-md border border-border bg-card p-1 shadow-xl"
        >
          {options.map(
            (option) => {
              const selectedOption =
                option.value ===
                value;

              return (
                <button
                  key={
                    option.value ||
                    `${name}-default`
                  }
                  type="button"
                  role="option"
                  aria-selected={
                    selectedOption
                  }
                  onClick={() => {
                    onSelect(
                      option.value,
                    );

                    onOpenChange(
                      null,
                    );
                  }}
                  className={[
                    'block w-full rounded-md px-2.5 py-1.5 text-left text-[11px] transition',
                    selectedOption
                      ? 'bg-primary/10 font-semibold text-foreground'
                      : 'text-foreground hover:bg-muted',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              );
            },
          )}
        </div>
      ) : null}
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  destructive = false,
  busy = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-background/80 p-3 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-lg border border-border bg-card p-4 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="h-8 rounded-md border border-border bg-background px-3 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={[
              'inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
              destructive
                ? 'bg-destructive text-destructive-foreground hover:opacity-90'
                : 'bg-primary text-primary-foreground hover:opacity-90',
            ].join(' ')}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}

            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArticleToolbar({
  editor,
  activePanel,
  onPanelChange,
  file,
  image,
  grammar,
  seo,
  ai,
}: ArticleToolbarProps) {
  const imageInputRef =
    useRef<HTMLInputElement>(null);

  const [
    openMenu,
    setOpenMenu,
  ] = useState<DropdownName>(null);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [
    pendingImageFile,
    setPendingImageFile,
  ] = useState<File | null>(null);

  const [
    inlineImageAlt,
    setInlineImageAlt,
  ] = useState('');

  const [
    showImageDialog,
    setShowImageDialog,
  ] = useState(false);

  const [
    showLinkDialog,
    setShowLinkDialog,
  ] = useState(false);

  const [
    linkUrl,
    setLinkUrl,
  ] = useState('');

  const [
    showNewDialog,
    setShowNewDialog,
  ] = useState(false);

  const [
    showDeleteDialog,
    setShowDeleteDialog,
  ] = useState(false);

  const [
    selectionVersion,
    setSelectionVersion,
  ] = useState(0);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const refresh = () => {
      setSelectionVersion(
        (value) =>
          value + 1,
      );
    };

    editor.on(
      'selectionUpdate',
      refresh,
    );

    editor.on(
      'transaction',
      refresh,
    );

    return () => {
      editor.off(
        'selectionUpdate',
        refresh,
      );

      editor.off(
        'transaction',
        refresh,
      );
    };
  }, [editor]);

  useEffect(() => {
    setOpenMenu(null);
  }, [activePanel]);

  useEffect(() => {
    if (!openMenu) {
      return;
    }

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      const target =
        event.target as HTMLElement;

      if (
        target.closest(
          '[data-toolbar-dropdown]',
        )
      ) {
        return;
      }

      setOpenMenu(null);
    };

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === 'Escape'
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      'pointerdown',
      handlePointerDown,
    );

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDown,
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [openMenu]);

  const currentTextStyle =
    editor?.getAttributes(
      'textStyle',
    ) ?? {};

  const currentFontFamily =
    currentTextStyle.fontFamily ||
    '';

  const currentFontSize =
    currentTextStyle.fontSize ||
    '';

  const currentTextType =
    editor?.isActive(
      'heading',
      {
        level: 1,
      },
    )
      ? 'main'
      : editor?.isActive(
          'heading',
          {
            level: 2,
          },
        )
        ? 'section'
        : editor?.isActive(
            'heading',
            {
              level: 3,
            },
          )
          ? 'subheading'
          : 'normal';

  void selectionVersion;

  const handleFontFamilyChange =
    (value: string) => {
      if (!editor) {
        return;
      }

      const chain =
        editor
          .chain()
          .focus();

      if (!value) {
        chain
          .unsetFontFamily()
          .run();

        return;
      }

      chain
        .setFontFamily(value)
        .run();
    };

  const handleFontSizeChange =
    (value: string) => {
      if (!editor) {
        return;
      }

      const chain =
        editor
          .chain()
          .focus();

      if (!value) {
        chain
          .unsetFontSize()
          .run();

        return;
      }

      chain
        .setFontSize(value)
        .run();
    };

  const handleTextTypeChange =
    (value: string) => {
      if (!editor) {
        return;
      }

      if (value === 'main') {
        editor
          .chain()
          .focus()
          .setHeading({
            level: 1,
          })
          .run();

        return;
      }

      if (value === 'section') {
        editor
          .chain()
          .focus()
          .setHeading({
            level: 2,
          })
          .run();

        return;
      }

      if (
        value ===
        'subheading'
      ) {
        editor
          .chain()
          .focus()
          .setHeading({
            level: 3,
          })
          .run();

        return;
      }

      editor
        .chain()
        .focus()
        .setParagraph()
        .run();
    };

  const openLinkDialog = () => {
    if (!editor) {
      return;
    }

    const {
      from,
      to,
    } = editor.state.selection;

    const existingHref =
      editor.getAttributes(
        'link',
      ).href || '';

    if (
      from === to &&
      !existingHref
    ) {
      toast.error(
        'Select the text you want to turn into a link first.',
      );

      return;
    }

    setLinkUrl(
      existingHref,
    );

    setShowLinkDialog(
      true,
    );
  };

  const closeLinkDialog =
    () => {
      setShowLinkDialog(false);

      setLinkUrl('');
    };

  const applyLink = () => {
    if (!editor) {
      return;
    }

    const url =
      linkUrl.trim();

    if (!url) {
      editor
        .chain()
        .focus()
        .unsetLink()
        .run();

      closeLinkDialog();

      toast.success(
        'Link removed.',
      );

      return;
    }

    editor
      .chain()
      .focus()
      .setLink({
        href: url,
      })
      .run();

    closeLinkDialog();

    toast.success(
      'Link added.',
    );
  };

  const selectInlineImage =
    () => {
      if (
        uploadingImage ||
        !editor
      ) {
        return;
      }

      imageInputRef.current?.click();
    };

  const handleInlineImageSelected =
    (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const selectedFile =
        event.target.files?.[0];

      if (!selectedFile) {
        return;
      }

      if (
        ![
          'image/jpeg',
          'image/png',
          'image/webp',
        ].includes(
          selectedFile.type,
        )
      ) {
        toast.error(
          'Only JPG, PNG, and WebP images are allowed.',
        );

        event.target.value =
          '';

        return;
      }

      if (
        selectedFile.size >
        MAX_IMAGE_SIZE
      ) {
        toast.error(
          'Article images cannot exceed 5MB.',
        );

        event.target.value =
          '';

        return;
      }

      setPendingImageFile(
        selectedFile,
      );

      setInlineImageAlt(
        '',
      );

      setShowImageDialog(
        true,
      );

      event.target.value =
        '';
    };

  const closeImageDialog =
    () => {
      if (uploadingImage) {
        return;
      }

      setShowImageDialog(
        false,
      );

      setPendingImageFile(
        null,
      );

      setInlineImageAlt(
        '',
      );

      if (
        imageInputRef.current
      ) {
        imageInputRef.current.value =
          '';
      }
    };

  const uploadInlineImage =
    async () => {
      if (
        !pendingImageFile ||
        !editor
      ) {
        return;
      }

      setUploadingImage(
        true,
      );

      try {
        const uploaded =
          await uploadService.uploadArticleImage(
            pendingImageFile,
          );

        const inserted =
          editor
            .chain()
            .focus()
            .setImage({
              src: uploaded.url,
              alt:
                inlineImageAlt.trim(),
            })
            .run();

        if (!inserted) {
          toast.error(
            'The image could not be inserted into the article.',
          );

          return;
        }

        closeImageDialog();

        toast.success(
          'Image added to the article.',
        );
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            'Unable to upload article image.',
        );
      } finally {
        setUploadingImage(
          false,
        );
      }
    };

  const panelItems: {
    id: ArticlePanel;
    label: string;
  }[] = [
    {
      id: 'file',
      label: 'File',
    },
    {
      id: 'editor',
      label: 'Editor',
    },
    {
      id: 'grammar',
      label: 'Grammar and spelling',
    },
    {
      id: 'seo',
      label: 'SEO',
    },
    {
      id: 'ai',
      label: 'AI assistant',
    },
    {
      id: 'image',
      label: 'Image',
    },
  ];

  const aiTargetOptions: {
    label: string;
    value: AiTarget;
  }[] = [
    {
      label: 'Whole article',
      value: 'whole-article',
    },
    {
      label: 'Title',
      value: 'title',
    },
    {
      label: 'Subtitle',
      value: 'subtitle',
    },
    {
      label: 'Description',
      value: 'description',
    },
  ];

  const fileActionsDisabled =
    file.isSavingDraft ||
    file.isPublishing;

  const grammarBusy =
    grammar.isChecking ||
    grammar.isApplying;

  const aiBusy =
    ai.isProcessing;

  return (
    <>
      <section className="overflow-visible rounded-lg border border-border bg-card">
        <div className="overflow-x-auto border-b border-border bg-muted/30 no-scrollbar">
          <div className="flex min-w-max px-1.5 pt-1.5">
            {panelItems.map(
              (item) => {
                const active =
                  activePanel ===
                  item.id;

                return (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    role="tab"
                    aria-selected={
                      active
                    }
                    onClick={() =>
                      onPanelChange(
                        item.id,
                      )
                    }
                    className={[
                      'rounded-t-md border px-3 py-2 text-[11px] font-semibold transition',
                      active
                        ? 'border-border border-b-card bg-card text-foreground'
                        : 'border-transparent text-muted-foreground hover:bg-background hover:text-foreground',
                    ].join(
                      ' ',
                    )}
                  >
                    {item.label}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {activePanel ===
        'file' ? (
          <div className="p-3">
            <div className="mb-3 flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
              <button
                type="button"
                onClick={() =>
                  setShowNewDialog(
                    true,
                  )
                }
                disabled={
                  fileActionsDisabled
                }
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                New
              </button>

              <button
                type="button"
                onClick={
                  file.onSaveDraft
                }
                disabled={
                  fileActionsDisabled
                }
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                {file.isSavingDraft ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}

                {file.isSavingDraft
                  ? 'Saving...'
                  : 'Save draft'}
              </button>

              <button
                type="button"
                onClick={
                  file.onPublish
                }
                disabled={
                  fileActionsDisabled
                }
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {file.isPublishing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}

                {file.isPublishing
                  ? 'Publishing...'
                  : 'Publish'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (
                    file.canDelete
                  ) {
                    setShowDeleteDialog(
                      true,
                    );
                  }
                }}
                disabled={
                  !file.canDelete ||
                  fileActionsDisabled
                }
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[11px] font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>

            <div className="grid gap-2.5">
              <div>
                <label
                  htmlFor="article-title"
                  className="mb-1 block text-[11px] font-semibold text-foreground"
                >
                  Title
                </label>

                <input
                  id="article-title"
                  type="text"
                  value={
                    file.title
                  }
                  onChange={(
                    event,
                  ) =>
                    file.onTitleChange(
                      event
                        .target
                        .value,
                    )
                  }
                  maxLength={
                    200
                  }
                  disabled={
                    fileActionsDisabled
                  }
                  placeholder="Enter the article title"
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs font-semibold text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
                />
              </div>

              <div className="grid gap-2.5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="article-subtitle"
                    className="mb-1 block text-[11px] font-semibold text-foreground"
                  >
                    Subtitle
                  </label>

                  <textarea
                    id="article-subtitle"
                    value={
                      file.subtitle
                    }
                    onChange={(
                      event,
                    ) =>
                      file.onSubtitleChange(
                        event
                          .target
                          .value,
                      )
                    }
                    maxLength={
                      300
                    }
                    rows={
                      2
                    }
                    disabled={
                      fileActionsDisabled
                    }
                    placeholder="A short line supporting the title"
                    className="w-full resize-none rounded-md border border-input bg-background px-2.5 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="article-description"
                    className="mb-1 block text-[11px] font-semibold text-foreground"
                  >
                    Description
                  </label>

                  <textarea
                    id="article-description"
                    value={
                      file.description
                    }
                    onChange={(
                      event,
                    ) =>
                      file.onDescriptionChange(
                        event
                          .target
                          .value,
                      )
                    }
                    maxLength={
                      1000
                    }
                    rows={
                      2
                    }
                    disabled={
                      fileActionsDisabled
                    }
                    placeholder="Briefly explain what the article is about"
                    className="w-full resize-none rounded-md border border-input bg-background px-2.5 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="article-page-slug"
                    className="mb-1 block text-[11px] font-semibold text-foreground"
                  >
                    Article URL
                  </label>

                  <div className="flex h-8 w-full overflow-hidden rounded-md border border-input bg-background">
                    <span className="inline-flex shrink-0 items-center border-r border-border bg-muted px-2.5 text-[11px] text-muted-foreground">
                      /articles/
                    </span>

                    <input
                      id="article-page-slug"
                      type="text"
                      value={
                        file.slug
                      }
                      onChange={(
                        event,
                      ) =>
                        file.onSlugChange(
                          event
                            .target
                            .value
                            .replace(
                              /\s+/g,
                              '-',
                            )
                            .replace(
                              /[^a-zA-Z0-9-]/g,
                              '',
                            )
                            .replace(
                              /-+/g,
                              '-',
                            )
                            .replace(
                              /^-|-$/g,
                              '',
                            ),
                        )
                      }
                      maxLength={
                        300
                      }
                      disabled={
                        fileActionsDisabled
                      }
                      placeholder="my-article"
                      className="min-w-0 flex-1 bg-background px-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
                    />
                  </div>

                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                    Your article will appear at{' '}
                    <span className="font-medium">
                      /articles/
                      {file.slug ||
                        'my-article'}
                    </span>
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="article-tags"
                    className="mb-1 block text-[11px] font-semibold text-foreground"
                  >
                    Tags
                  </label>

                  <input
                    id="article-tags"
                    type="text"
                    value={
                      file.tagsInput
                    }
                    onChange={(
                      event,
                    ) =>
                      file.onTagsChange(
                        event
                          .target
                          .value,
                      )
                    }
                    disabled={
                      fileActionsDisabled
                    }
                    placeholder="news, football, analysis"
                    className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activePanel ===
        'editor' ? (
          <div className="p-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <ToolbarDropdown
                name="textType"
                label="Text type"
                value={
                  currentTextType
                }
                options={
                  TEXT_TYPES
                }
                openMenu={
                  openMenu
                }
                onOpenChange={
                  setOpenMenu
                }
                onSelect={
                  handleTextTypeChange
                }
              />

              <ToolbarDropdown
                name="font"
                label="Font"
                value={
                  currentFontFamily
                }
                options={
                  FONT_FAMILIES
                }
                openMenu={
                  openMenu
                }
                onOpenChange={
                  setOpenMenu
                }
                onSelect={
                  handleFontFamilyChange
                }
              />

              <ToolbarDropdown
                name="size"
                label="Size"
                value={
                  currentFontSize
                }
                options={
                  FONT_SIZES
                }
                openMenu={
                  openMenu
                }
                onOpenChange={
                  setOpenMenu
                }
                onSelect={
                  handleFontSizeChange
                }
              />

              <div className="mx-0.5 h-5 w-px bg-border" />

              <ToolbarButton
                title="Bold"
                icon={
                  <Bold className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive(
                    'bold',
                  ),
                )}
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .toggleBold()
                    .run()
                }
              />

              <ToolbarButton
                title="Italic"
                icon={
                  <Italic className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive(
                    'italic',
                  ),
                )}
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .toggleItalic()
                    .run()
                }
              />

              <ToolbarButton
                title="Underline"
                icon={
                  <Underline className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive(
                    'underline',
                  ),
                )}
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .toggleUnderline()
                    .run()
                }
              />

              <ToolbarButton
                title="Strikethrough"
                icon={
                  <Strikethrough className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive(
                    'strike',
                  ),
                )}
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .toggleStrike()
                    .run()
                }
              />

              <ToolbarButton
                title="Bulleted list"
                icon={
                  <List className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive(
                    'bulletList',
                  ),
                )}
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .toggleBulletList()
                    .run()
                }
              />

              <ToolbarButton
                title="Numbered list"
                icon={
                  <ListOrdered className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive(
                    'orderedList',
                  ),
                )}
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .toggleOrderedList()
                    .run()
                }
              />

              <ToolbarButton
                title="Quote"
                icon={
                  <Quote className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive(
                    'blockquote',
                  ),
                )}
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .toggleBlockquote()
                    .run()
                }
              />

              <ToolbarButton
                title="Horizontal line"
                icon={
                  <Minus className="h-3.5 w-3.5" />
                }
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .setHorizontalRule()
                    .run()
                }
              />

              <ToolbarButton
                title="Align left"
                icon={
                  <AlignLeft className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive({
                    textAlign:
                      'left',
                  }),
                )}
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .setTextAlign(
                      'left',
                    )
                    .run()
                }
              />

              <ToolbarButton
                title="Align center"
                icon={
                  <AlignCenter className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive({
                    textAlign:
                      'center',
                  }),
                )}
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .setTextAlign(
                      'center',
                    )
                    .run()
                }
              />

              <ToolbarButton
                title="Align right"
                icon={
                  <AlignRight className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive({
                    textAlign:
                      'right',
                  }),
                )}
                disabled={
                  !editor
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .setTextAlign(
                      'right',
                    )
                    .run()
                }
              />

              <ToolbarButton
                label="Link"
                title="Add or edit a link"
                icon={
                  <Link2 className="h-3.5 w-3.5" />
                }
                active={Boolean(
                  editor?.isActive(
                    'link',
                  ),
                )}
                disabled={
                  !editor
                }
                onClick={
                  openLinkDialog
                }
              />

              <ToolbarButton
                label="Image"
                title="Insert an image into the article"
                icon={
                  uploadingImage ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ImagePlus className="h-3.5 w-3.5" />
                  )
                }
                disabled={
                  !editor ||
                  uploadingImage
                }
                onClick={
                  selectInlineImage
                }
              />

              <ToolbarButton
                title="Undo"
                icon={
                  <Undo2 className="h-3.5 w-3.5" />
                }
                disabled={
                  !editor ||
                  !editor
                    .can()
                    .chain()
                    .focus()
                    .undo()
                    .run()
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .undo()
                    .run()
                }
              />

              <ToolbarButton
                title="Redo"
                icon={
                  <Redo2 className="h-3.5 w-3.5" />
                }
                disabled={
                  !editor ||
                  !editor
                    .can()
                    .chain()
                    .focus()
                    .redo()
                    .run()
                }
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .redo()
                    .run()
                }
              />
            </div>
          </div>
        ) : null}

        {activePanel ===
        'grammar' ? (
          <div className="p-3">
            <ArticleGrammarPanel
              matches={
                grammar.matches
              }
              language={
                grammar.language
              }
              isChecking={
                grammar.isChecking
              }
              isApplying={
                grammarBusy
              }
              onLanguageChange={
                grammar.onLanguageChange
              }
              onCheck={
                grammar.onCheck
              }
              onSuggestionSelect={
                grammar.onSuggestionSelect
              }
              onApplyAll={
                grammar.onApplyAll
              }
            />
          </div>
        ) : null}

        {activePanel ===
        'seo' ? (
          <div className="p-3">
            <ArticleSeoPanel
              seoTitle={
                seo.seoTitle
              }
              seoDescription={
                seo.seoDescription
              }
              focusKeyword={
                seo.focusKeyword
              }
              slug={
                seo.slug
              }
              canonicalUrl={
                seo.canonicalUrl
              }
              analysis={
                seo.analysis
              }
              isAnalyzing={
                seo.isAnalyzing
              }
              onSeoTitleChange={
                seo.onSeoTitleChange
              }
              onSeoDescriptionChange={
                seo.onSeoDescriptionChange
              }
              onFocusKeywordChange={
                seo.onFocusKeywordChange
              }
              onSlugChange={
                seo.onSlugChange
              }
              onCanonicalUrlChange={
                seo.onCanonicalUrlChange
              }
              onAnalyze={
                seo.onAnalyze
              }
            />
          </div>
        ) : null}

        {activePanel ===
        'ai' ? (
          <div className="p-3">
            <div className="mb-3 rounded-md border border-border bg-muted/30 p-2.5">
              <label className="mb-1.5 block text-[11px] font-semibold text-foreground">
                Work on
              </label>

              <div className="flex flex-wrap gap-1.5">
                {aiTargetOptions.map(
                  (
                    option,
                  ) => (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        ai.onTargetChange(
                          option.value,
                        )
                      }
                      disabled={
                        aiBusy
                      }
                      className={[
                        'rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition',
                        ai.target ===
                        option.value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:bg-muted',
                        aiBusy
                          ? 'cursor-not-allowed opacity-50'
                          : '',
                      ].join(
                        ' ',
                      )}
                    >
                      {
                        option.label
                      }
                    </button>
                  ),
                )}
              </div>
            </div>

            <ArticleAiPanel
              target={
                ai.target
              }
              result={
                ai.result
              }
              model={
                ai.model
              }
              resultAction={
                ai.resultAction
              }
              generatedArticle={
                ai.generatedArticle
              }
              seoSuggestion={
                ai.seoSuggestion
              }
              headingsSuggestion={
                ai.headingsSuggestion
              }
              isProcessing={
                ai.isProcessing
              }
              onAction={(
                action,
              ) =>
                ai.onAction(
                  action,
                  ai.target,
                )
              }
              onGenerate={
                ai.onGenerate
              }
              onApply={
                ai.onApply
              }
              onDiscard={
                ai.onDiscard
              }
              onRefresh={
                ai.onRefresh
              }
              canApply={
                ai.canApply
              }
            />
          </div>
        ) : null}

        {activePanel ===
        'image' ? (
          <div className="p-3">
            <ArticleFeaturedImage
              imageUrl={
                image.imageUrl
              }
              imageAlt={
                image.imageAlt
              }
              disabled={
                image.disabled
              }
              onImageUploaded={
                image.onImageUploaded
              }
              onRemove={
                image.onRemove
              }
            />

            <div className="mt-3">
              <label
                htmlFor="article-featured-alt"
                className="mb-1 block text-[11px] font-semibold text-foreground"
              >
                Image description
              </label>

              <input
                id="article-featured-alt"
                type="text"
                value={
                  image.imageAlt
                }
                onChange={(
                  event,
                ) =>
                  image.onImageAltChange(
                    event
                      .target
                      .value,
                  )
                }
                maxLength={
                  255
                }
                disabled={
                  image.disabled
                }
                placeholder="Example: Football players celebrating after scoring"
                className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
              />
            </div>
          </div>
        ) : null}
      </section>

      <input
        ref={
          imageInputRef
        }
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp"
        onChange={
          handleInlineImageSelected
        }
      />

      {showLinkDialog ? (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-background/80 p-3 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-lg border border-border bg-card p-4 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Add a link
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Enter the web address for the selected text.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeLinkDialog
                }
                aria-label="Close"
                className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3">
              <input
                id="article-link-url"
                type="url"
                value={
                  linkUrl
                }
                onChange={(
                  event,
                ) =>
                  setLinkUrl(
                    event
                      .target
                      .value,
                  )
                }
                autoFocus
                placeholder="https://example.com"
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    'Enter'
                  ) {
                    event.preventDefault();

                    applyLink();
                  }

                  if (
                    event.key ===
                    'Escape'
                  ) {
                    event.preventDefault();

                    closeLinkDialog();
                  }
                }}
                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={
                  closeLinkDialog
                }
                className="h-8 rounded-md border border-border bg-background px-3 text-[11px] font-medium text-foreground transition hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  applyLink
                }
                className="h-8 rounded-md bg-primary px-3 text-[11px] font-medium text-primary-foreground transition hover:opacity-90"
              >
                Add link
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showImageDialog ? (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-background/80 p-3 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-lg border border-border bg-card p-4 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Describe the image
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Add a short description of what the image shows.
                </p>
              </div>

              {!uploadingImage ? (
                <button
                  type="button"
                  onClick={
                    closeImageDialog
                  }
                  aria-label="Close"
                  className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="mt-3">
              <input
                id="article-inline-image-alt"
                type="text"
                value={
                  inlineImageAlt
                }
                onChange={(
                  event,
                ) =>
                  setInlineImageAlt(
                    event
                      .target
                      .value,
                  )
                }
                autoFocus
                maxLength={
                  255
                }
                disabled={
                  uploadingImage
                }
                placeholder="Describe what the image shows"
                onKeyDown={(
                  event,
                ) => {
                  if (
                    event.key ===
                    'Enter'
                  ) {
                    event.preventDefault();

                    if (
                      !uploadingImage
                    ) {
                      void uploadInlineImage();
                    }
                  }

                  if (
                    event.key ===
                    'Escape'
                  ) {
                    event.preventDefault();

                    if (
                      !uploadingImage
                    ) {
                      closeImageDialog();
                    }
                  }
                }}
                className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:opacity-60"
              />
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={
                  closeImageDialog
                }
                disabled={
                  uploadingImage
                }
                className="h-8 rounded-md border border-border bg-background px-3 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void uploadInlineImage()
                }
                disabled={
                  uploadingImage
                }
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-[11px] font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Add image'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={
          showNewDialog
        }
        title="Start a new article?"
        message="The information currently entered on this page will be cleared."
        confirmLabel="Start new article"
        onCancel={() =>
          setShowNewDialog(
            false,
          )
        }
        onConfirm={() => {
          setShowNewDialog(
            false,
          );

          file.onNew();
        }}
      />

      <ConfirmDialog
        open={
          showDeleteDialog
        }
        title="Delete this article?"
        message="This action permanently removes the article."
        confirmLabel="Delete article"
        destructive
        onCancel={() =>
          setShowDeleteDialog(
            false,
          )
        }
        onConfirm={() => {
          setShowDeleteDialog(
            false,
          );

          file.onDelete?.();
        }}
      />
    </>
  );
}