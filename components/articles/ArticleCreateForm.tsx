// frontend/components/articles/ArticleCreateForm.tsx

'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { Editor } from '@tiptap/react';

import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import ArticleEditor from '@/components/articles/ArticleEditor';
import ArticleToolbar, {
  type AiTarget,
  type ArticlePanel,
} from '@/components/articles/ArticleToolbar';

import {
  useAnalyzeArticleSeo,
  useCheckArticleGrammar,
  useCreateArticle,
  useDeleteArticle,
  useProcessArticleWithAi,
  useUpdateArticle,
} from '@/hooks/useAdminArticles';

import type {
  AiGeneratedArticle,
  AiHeadingsSuggestion,
  AiSeoSuggestion,
  AiWritingAction,
  AiWritingData,
  Article,
  ArticleSeoAnalysis,
  CreateArticleData,
  GrammarMatch,
} from '@/types/article';

interface ArticleCreateFormProps {
  token: string;
  article?: Article | null;
}

export default function ArticleCreateForm({
  token,
  article = null,
}: ArticleCreateFormProps) {
  const router = useRouter();

  const editorRef = useRef<Editor | null>(null);

  const [
    activePanel,
    setActivePanel,
  ] = useState<ArticlePanel>('file');

  const [
    editingArticleId,
    setEditingArticleId,
  ] = useState<string | null>(
    article?._id ?? null,
  );

  const [
    title,
    setTitle,
  ] = useState('');

  const [
    subtitle,
    setSubtitle,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    excerpt,
    setExcerpt,
  ] = useState('');

  const [
    slug,
    setSlug,
  ] = useState('');

  const [
    content,
    setContent,
  ] = useState('');

  const [
    featuredImageUrl,
    setFeaturedImageUrl,
  ] = useState('');

  const [
    featuredImagePublicId,
    setFeaturedImagePublicId,
  ] = useState('');

  const [
    featuredImageAlt,
    setFeaturedImageAlt,
  ] = useState('');

  const [
    seoTitle,
    setSeoTitle,
  ] = useState('');

  const [
    seoDescription,
    setSeoDescription,
  ] = useState('');

  const [
    focusKeyword,
    setFocusKeyword,
  ] = useState('');

  const [
    canonicalUrl,
    setCanonicalUrl,
  ] = useState('');

  const [
    tagsInput,
    setTagsInput,
  ] = useState('');

  const [
    language,
    setLanguage,
  ] = useState('en-GB');

  const [
    seoAnalysis,
    setSeoAnalysis,
  ] = useState<ArticleSeoAnalysis | null>(
    null,
  );

  const [
    grammarMatches,
    setGrammarMatches,
  ] = useState<GrammarMatch[]>([]);

  const [
    isApplyingGrammar,
    setIsApplyingGrammar,
  ] = useState(false);

  const [
    aiResult,
    setAiResult,
  ] = useState<string | null>(null);

  const [
    aiModel,
    setAiModel,
  ] = useState<string | null>(null);

  const [
    lastAiAction,
    setLastAiAction,
  ] = useState<AiWritingAction | null>(
    null,
  );

  const [
    lastAiRequest,
    setLastAiRequest,
  ] = useState<AiWritingData | null>(
    null,
  );

  const [
    aiSeoSuggestion,
    setAiSeoSuggestion,
  ] = useState<AiSeoSuggestion | null>(
    null,
  );

  const [
    aiHeadingsSuggestion,
    setAiHeadingsSuggestion,
  ] =
    useState<AiHeadingsSuggestion | null>(
      null,
    );

  const [
    aiGeneratedArticle,
    setAiGeneratedArticle,
  ] =
    useState<AiGeneratedArticle | null>(
      null,
    );

  const [
    aiTarget,
    setAiTarget,
  ] = useState<AiTarget>(
    'whole-article',
  );

  const [
    editorInstance,
    setEditorInstance,
  ] = useState<Editor | null>(
    null,
  );

  const [
    isPublishing,
    setIsPublishing,
  ] = useState(false);

  const [
    isSavingDraft,
    setIsSavingDraft,
  ] = useState(false);

  const createArticleMutation =
    useCreateArticle(token);

  const updateArticleMutation =
    useUpdateArticle(token);

  const deleteArticleMutation =
    useDeleteArticle(token);

  const seoMutation =
    useAnalyzeArticleSeo(token);

  const grammarMutation =
    useCheckArticleGrammar(token);

  const aiMutation =
    useProcessArticleWithAi(token);

  const tags = useMemo(
    () =>
      [
        ...new Set(
          tagsInput
            .split(',')
            .map((tag) =>
              tag.trim(),
            )
            .filter(Boolean),
        ),
      ],
    [tagsInput],
  );

  const handleEditorReady =
    useCallback(
      (instance: Editor) => {
        editorRef.current =
          instance;

        setEditorInstance(
          instance,
        );
      },
      [],
    );

  const generateSlug = (
    value: string,
  ) => {
    return value
      .normalize('NFKD')
      .replace(
        /[\u0300-\u036f]/g,
        '',
      )
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        '',
      )
      .replace(
        /\s+/g,
        '-',
      )
      .replace(
        /-+/g,
        '-',
      )
      .replace(
        /^-|-$/g,
        '',
      );
  };

  useEffect(() => {
    if (!article) {
      return;
    }

    setEditingArticleId(
      article._id,
    );

    setTitle(
      article.title || '',
    );

    setSubtitle(
      article.subtitle || '',
    );

    setDescription(
      article.description || '',
    );

    setExcerpt(
      article.excerpt || '',
    );

    setSlug(
      article.slug || '',
    );

    setContent(
      article.content || '',
    );

    setFeaturedImageUrl(
      article.featuredImageUrl || '',
    );

    setFeaturedImagePublicId(
      article.featuredImagePublicId || '',
    );

    setFeaturedImageAlt(
      article.featuredImageAlt || '',
    );

    setSeoTitle(
      article.seo?.title || '',
    );

    setSeoDescription(
      article.seo?.description || '',
    );

    setFocusKeyword(
      article.seo?.focusKeyword || '',
    );

    setCanonicalUrl(
      article.seo?.canonicalUrl || '',
    );

    setTagsInput(
      article.tags.join(', '),
    );

    setSeoAnalysis(null);

    setGrammarMatches([]);

    setIsApplyingGrammar(false);

    setAiResult(null);
    setAiModel(null);
    setLastAiAction(null);
    setLastAiRequest(null);
    setAiSeoSuggestion(null);
    setAiHeadingsSuggestion(null);
    setAiGeneratedArticle(null);

    setAiTarget(
      'whole-article',
    );

    if (editorInstance) {
      editorInstance.commands.setContent(
        article.content || '',
        {
          emitUpdate: false,
        },
      );
    }

    setActivePanel('file');
  }, [
    article,
    editorInstance,
  ]);

  const handleTitleChange = (
    value: string,
  ) => {
    const previousAutoSlug =
      generateSlug(title);

    setTitle(value);

    if (
      !slug ||
      slug === previousAutoSlug
    ) {
      setSlug(
        generateSlug(value),
      );
    }

    setSeoAnalysis(null);
  };

  const resetArticle = () => {
    setEditingArticleId(null);

    setTitle('');
    setSubtitle('');
    setDescription('');
    setExcerpt('');
    setSlug('');
    setContent('');
    setFeaturedImageUrl('');
    setFeaturedImagePublicId('');
    setFeaturedImageAlt('');
    setSeoTitle('');
    setSeoDescription('');
    setFocusKeyword('');
    setCanonicalUrl('');
    setTagsInput('');
    setSeoAnalysis(null);
    setGrammarMatches([]);
    setIsApplyingGrammar(false);

    setAiResult(null);
    setAiModel(null);
    setLastAiAction(null);
    setLastAiRequest(null);
    setAiSeoSuggestion(null);
    setAiHeadingsSuggestion(null);
    setAiGeneratedArticle(null);
    setAiTarget('whole-article');

    editorRef.current?.commands.setContent(
      '',
      {
        emitUpdate: false,
      },
    );

    setActivePanel(
      'file',
    );

    toast.success(
      'New article started.',
    );
  };

  const buildArticleData = (
    publish: boolean,
  ): CreateArticleData => {
    return {
      title:
        title.trim(),

      subtitle:
        subtitle.trim() ||
        undefined,

      description:
        description.trim() ||
        undefined,

      excerpt:
        excerpt.trim() ||
        undefined,

      slug:
        slug.trim() ||
        undefined,

      content,

      featuredImageUrl:
        featuredImageUrl.trim() ||
        undefined,

      featuredImageAlt:
        featuredImageAlt.trim() ||
        undefined,

      featuredImagePublicId:
        featuredImagePublicId.trim() ||
        undefined,

      seoTitle:
        seoTitle.trim() ||
        undefined,

      seoDescription:
        seoDescription.trim() ||
        undefined,

      focusKeyword:
        focusKeyword.trim() ||
        undefined,

      canonicalUrl:
        canonicalUrl.trim() ||
        undefined,

      tags:
        tags.length > 0
          ? tags
          : undefined,

      publishedAt:
        publish
          ? new Date().toISOString()
          : undefined,
    };
  };

  const validateArticle = () => {
    if (!title.trim()) {
      setActivePanel('file');

      toast.error(
        'Add an article title before saving.',
      );

      return false;
    }

    if (
      !content
        .replace(
          /<[^>]*>/g,
          '',
        )
        .trim()
    ) {
      toast.error(
        'Write some article content before saving.',
      );

      return false;
    }

    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateArticle()) {
      return;
    }

    try {
      setIsSavingDraft(true);

      const data =
        buildArticleData(
          false,
        );

      if (editingArticleId) {
        await updateArticleMutation.mutateAsync(
          {
            id:
              editingArticleId,

            data,
          },
        );

        toast.success(
          'Article changes saved successfully.',
        );
      } else {
        const created =
          await createArticleMutation.mutateAsync(
            data,
          );

        setEditingArticleId(
          created._id,
        );

        toast.success(
          'Article draft saved successfully.',
        );
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Unable to save the article draft.',
      );
    } finally {
      setIsSavingDraft(
        false,
      );
    }
  };

  const handlePublish = async () => {
    if (!validateArticle()) {
      return;
    }

    try {
      setIsPublishing(true);

      const data =
        buildArticleData(
          true,
        );

      if (editingArticleId) {
        await updateArticleMutation.mutateAsync(
          {
            id:
              editingArticleId,

            data,
          },
        );

        toast.success(
          'Article published successfully.',
        );
      } else {
        const published =
          await createArticleMutation.mutateAsync(
            data,
          );

        setEditingArticleId(
          published._id,
        );

        toast.success(
          'Article published successfully.',
        );
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Unable to publish the article.',
      );
    } finally {
      setIsPublishing(
        false,
      );
    }
  };

  const handleDelete = async () => {
    if (!editingArticleId) {
      return;
    }

    try {
      await deleteArticleMutation.mutateAsync(
        editingArticleId,
      );

      setEditingArticleId(null);

      toast.success(
        'Article deleted successfully.',
      );

      router.replace(
        '/admin/articles',
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Unable to delete the article.',
      );
    }
  };

  const handleSeoAnalysis =
    async () => {
      if (!title.trim()) {
        setActivePanel('file');

        toast.error(
          'Add an article title first.',
        );

        return;
      }

      if (
        !content
          .replace(
            /<[^>]*>/g,
            '',
          )
          .trim()
      ) {
        toast.error(
          'Write some article content first.',
        );

        return;
      }

      try {
        const result =
          await seoMutation.mutateAsync({
            title:
              title.trim(),

            content,

            slug:
              slug.trim() ||
              undefined,

            seoTitle:
              seoTitle.trim() ||
              undefined,

            seoDescription:
              seoDescription.trim() ||
              undefined,

            focusKeyword:
              focusKeyword.trim() ||
              undefined,

            canonicalUrl:
              canonicalUrl.trim() ||
              undefined,
          });

        setSeoAnalysis(
          result,
        );

        toast.success(
          'SEO analysis completed.',
        );
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            'Unable to analyze article SEO.',
        );
      }
    };

  const handleGrammarCheck =
    async () => {
      const editor =
        editorRef.current;

      if (!editor) {
        toast.error(
          'The writing editor is not ready yet.',
        );

        return;
      }

      const plainText =
        editor.getText({
          blockSeparator: ' ',
        });

      if (!plainText.trim()) {
        toast.error(
          'Write some article content first.',
        );

        return;
      }

      try {
        const result =
          await grammarMutation.mutateAsync({
            content:
              plainText,

            language,
          });

        setGrammarMatches(
          result.matches,
        );

        if (
          result.totalIssues ===
          0
        ) {
          toast.success(
            'No grammar or spelling issues were found.',
          );
        } else {
          toast.success(
            `${result.totalIssues} issue(s) found.`,
          );
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            'Unable to check the article grammar.',
        );
      }
    };

  const findDocPositionForTextOffset =
    (
      editor: Editor,
      targetOffset: number,
    ): number => {
      const doc =
        editor.state.doc;

      if (targetOffset <= 0) {
        return 1;
      }

      const plainText =
        editor.getText({
          blockSeparator: ' ',
        });

      if (
        targetOffset >=
        plainText.length
      ) {
        return Math.max(
          1,
          doc.content.size,
        );
      }

      let low = 0;

      let high =
        doc.content.size;

      while (low < high) {
        const middle =
          Math.floor(
            (low + high) / 2,
          );

        const textBefore =
          doc.textBetween(
            0,
            middle,
            ' ',
          );

        if (
          textBefore.length >
          targetOffset
        ) {
          high =
            middle;
        } else {
          low =
            middle + 1;
        }
      }

      return Math.max(
        1,
        low - 1,
      );
    };

  const rangesOverlap = (
    firstStart: number,
    firstLength: number,
    secondStart: number,
    secondLength: number,
  ) => {
    const firstEnd =
      firstStart +
      firstLength;

    const secondEnd =
      secondStart +
      secondLength;

    return (
      firstStart <
        secondEnd &&
      secondStart <
        firstEnd
    );
  };

  const applyGrammarReplacement =
    (
      match: GrammarMatch,
      replacement: string,
    ): boolean => {
      const editor =
        editorRef.current;

      if (!editor) {
        return false;
      }

      const plainText =
        editor.getText({
          blockSeparator: ' ',
        });

      const expectedText =
        plainText.slice(
          match.offset,
          match.offset +
            match.length,
        );

      if (
        !expectedText ||
        expectedText.length !==
          match.length
      ) {
        return false;
      }

      const from =
        findDocPositionForTextOffset(
          editor,
          match.offset,
        );

      const to =
        findDocPositionForTextOffset(
          editor,
          match.offset +
            match.length,
        );

      const currentText =
        editor.state.doc.textBetween(
          from,
          to,
          ' ',
        );

      if (
        currentText !==
        expectedText
      ) {
        return false;
      }

      const applied =
        editor
          .chain()
          .focus()
          .insertContentAt(
            {
              from,
              to,
            },
            replacement,
            {
              updateSelection: true,
            },
          )
          .run();

      if (!applied) {
        return false;
      }

      setContent(
        editor.getHTML(),
      );

      setSeoAnalysis(
        null,
      );

      return true;
    };

  const handleGrammarSuggestion =
    (
      match: GrammarMatch,
      replacement: string,
    ) => {
      const applied =
        applyGrammarReplacement(
          match,
          replacement,
        );

      if (!applied) {
        toast.error(
          'This suggestion is no longer valid. Run the grammar check again.',
        );

        return;
      }

      const delta =
        replacement.length -
        match.length;

      const matchStart =
        match.offset;

      const matchEnd =
        match.offset +
        match.length;

      setGrammarMatches(
        (currentMatches) =>
          currentMatches
            .filter(
              (item) =>
                item !== match,
            )
            .map(
              (item) => {
                const itemStart =
                  item.offset;

                const itemEnd =
                  item.offset +
                  item.length;

                if (
                  itemStart >=
                  matchEnd
                ) {
                  return {
                    ...item,

                    offset:
                      item.offset +
                      delta,
                  };
                }

                if (
                  itemEnd <=
                  matchStart
                ) {
                  return item;
                }

                return null;
              },
            )
            .filter(
              (
                item,
              ): item is GrammarMatch =>
                Boolean(item),
            ),
      );

      toast.success(
        'Correction applied.',
      );
    };

  const handleApplyAllGrammar =
    () => {
      const editor =
        editorRef.current;

      if (!editor) {
        toast.error(
          'The writing editor is not ready yet.',
        );

        return;
      }

      const matchesWithReplacements =
        grammarMatches.filter(
          (match) =>
            match.replacements.length >
            0,
        );

      if (
        matchesWithReplacements.length ===
        0
      ) {
        toast(
          'There are no automatic corrections to apply.',
        );

        return;
      }

      setIsApplyingGrammar(
        true,
      );

      try {
        const sortedMatches =
          [
            ...matchesWithReplacements,
          ].sort(
            (a, b) =>
              b.offset -
              a.offset,
          );

        const acceptedMatches:
          GrammarMatch[] = [];

        for (
          const match of sortedMatches
        ) {
          const replacement =
            match.replacements[0]
              ?.value;

          if (
            replacement ===
            undefined
          ) {
            continue;
          }

          const overlapsAccepted =
            acceptedMatches.some(
              (accepted) =>
                rangesOverlap(
                  match.offset,
                  match.length,
                  accepted.offset,
                  accepted.length,
                ),
            );

          if (
            overlapsAccepted
          ) {
            continue;
          }

          const plainText =
            editor.getText({
              blockSeparator: ' ',
            });

          const expectedText =
            plainText.slice(
              match.offset,
              match.offset +
                match.length,
            );

          if (
            !expectedText ||
            expectedText.length !==
              match.length
          ) {
            continue;
          }

          const from =
            findDocPositionForTextOffset(
              editor,
              match.offset,
            );

          const to =
            findDocPositionForTextOffset(
              editor,
              match.offset +
                match.length,
            );

          const currentText =
            editor.state.doc.textBetween(
              from,
              to,
              ' ',
            );

          if (
            currentText !==
            expectedText
          ) {
            continue;
          }

          const applied =
            editor
              .chain()
              .focus()
              .insertContentAt(
                {
                  from,
                  to,
                },
                replacement,
                {
                  updateSelection:
                    false,
                },
              )
              .run();

          if (applied) {
            acceptedMatches.push(
              match,
            );
          }
        }

        setContent(
          editor.getHTML(),
        );

        setSeoAnalysis(
          null,
        );

        setGrammarMatches(
          (currentMatches) =>
            currentMatches.filter(
              (match) =>
                !acceptedMatches.includes(
                  match,
                ),
            ),
        );

        if (
          acceptedMatches.length > 0
        ) {
          toast.success(
            `${acceptedMatches.length} correction(s) applied.`,
          );
        } else {
          toast.error(
            'The article changed before the corrections could be applied. Run the grammar check again.',
          );
        }
      } finally {
        setIsApplyingGrammar(
          false,
        );
      }
    };

  const getAiInput = (
    target: AiTarget,
  ) => {
    switch (target) {
      case 'title':
        return title.trim();

      case 'subtitle':
        return subtitle.trim();

      case 'description':
        return description.trim();

      case 'whole-article':
      default:
        return content;
    }
  };

  const buildAiRequest = (
    action: AiWritingAction,
    target: AiTarget,
    input: string,
  ): AiWritingData => {
    return {
      content:
        input,

      title:
        title.trim() ||
        undefined,

      subtitle:
        subtitle.trim() ||
        undefined,

      description:
        description.trim() ||
        undefined,

      excerpt:
        excerpt.trim() ||
        undefined,

      focusKeyword:
        focusKeyword.trim() ||
        undefined,

      slug:
        slug.trim() ||
        undefined,

      seoTitle:
        seoTitle.trim() ||
        undefined,

      seoDescription:
        seoDescription.trim() ||
        undefined,

      canonicalUrl:
        canonicalUrl.trim() ||
        undefined,

      tags:
        tags.length > 0
          ? tags
          : undefined,

      action,

      target,
    };
  };

  const clearAiResult = () => {
    setAiResult(null);
    setAiModel(null);
    setLastAiAction(null);
    setLastAiRequest(null);
    setAiSeoSuggestion(null);
    setAiHeadingsSuggestion(null);
    setAiGeneratedArticle(null);
  };

  const runAiRequest = async (
    request: AiWritingData,
    options?: {
      refresh?: boolean;
    },
  ) => {
    const refresh =
      options?.refresh === true;

    if (!refresh) {
      setAiResult(null);
      setAiModel(null);
      setAiSeoSuggestion(null);
      setAiHeadingsSuggestion(null);
      setAiGeneratedArticle(null);
    }

    setLastAiAction(
      request.action,
    );

    setAiTarget(
      request.target,
    );

    setLastAiRequest(
      request,
    );

    try {
      const response =
        await aiMutation.mutateAsync(
          request,
        );

      setAiResult(
        response.result,
      );

      setAiModel(
        response.model,
      );

      setAiSeoSuggestion(
        response.seo ||
          null,
      );

      setAiHeadingsSuggestion(
        response.headings ||
          null,
      );

      setAiGeneratedArticle(
        response.generated ||
          null,
      );

      toast.success(
        refresh
          ? 'AI result refreshed.'
          : request.action ===
                'seo' ||
              request.action ===
                'headings'
          ? 'AI suggestions are ready for review.'
          : 'AI result is ready for review.',
      );
    } catch (error: any) {
      if (!refresh) {
        clearAiResult();
      }

      toast.error(
        error?.response?.data?.message ||
          'Unable to process the selected content with AI.',
      );
    }
  };

  const handleAiAction =
    async (
      action: AiWritingAction,
      target: AiTarget,
    ) => {
      if (
        action ===
        'generate'
      ) {
        if (
          target !==
          'whole-article'
        ) {
          setAiTarget(
            'whole-article',
          );
        }

        toast(
          'Use Write article to provide instructions for a new article.',
        );

        return;
      }

      if (
        (action === 'seo' ||
          action === 'headings') &&
        target !== 'whole-article'
      ) {
        toast.error(
          'This AI action works on the whole article.',
        );

        return;
      }

      const aiInput =
        getAiInput(
          target,
        );

      if (
        target ===
          'whole-article' &&
        !aiInput
          .replace(
            /<[^>]*>/g,
            '',
          )
          .trim()
      ) {
        toast.error(
          'Write some article content first.',
        );

        return;
      }

      if (
        target !==
          'whole-article' &&
        !aiInput.trim()
      ) {
        toast.error(
          `Add some ${target} content first.`,
        );

        return;
      }

      await runAiRequest(
        buildAiRequest(
          action,
          target,
          aiInput,
        ),
      );
    };

  const handleGenerateArticle =
    async (
      prompt: string,
    ) => {
      const cleanPrompt =
        prompt.trim();

      if (!cleanPrompt) {
        return;
      }

      await runAiRequest(
        buildAiRequest(
          'generate',
          'whole-article',
          cleanPrompt,
        ),
      );
    };

  const handleRefreshAi =
    async () => {
      if (!lastAiRequest) {
        toast.error(
          'There is no previous AI request to refresh.',
        );

        return;
      }

      await runAiRequest(
        lastAiRequest,
        {
          refresh: true,
        },
      );
    };

  const handleApplyAiResult =
    async () => {
      if (
        !aiResult?.trim() ||
        !lastAiAction
      ) {
        return;
      }

      if (
        lastAiAction ===
        'generate'
      ) {
        if (!aiGeneratedArticle) {
          toast.error(
            'The AI generation result is incomplete. Refresh and try again.',
          );

          return;
        }

        const generated =
          aiGeneratedArticle;

        const generatedTitle =
          generated.title.trim();

        const generatedSubtitle =
          generated.subtitle.trim();

        const generatedDescription =
          generated.description.trim();

        const generatedExcerpt =
          generated.excerpt.trim();

        const generatedSlug =
          generateSlug(
            generated.slug,
          );

        const generatedSeoTitle =
          generated.seoTitle.trim();

        const generatedSeoDescription =
          generated.seoDescription.trim();

        const generatedFocusKeyword =
          generated.focusKeyword.trim();

        const generatedCanonicalUrl =
          generated.canonicalUrl.trim();

        const generatedTags =
          [
            ...new Set(
              generated.tags
                .map((tag) =>
                  tag.trim(),
                )
                .filter(Boolean),
            ),
          ];

        if (
          !generatedTitle ||
          !generated.contentHtml.trim()
        ) {
          toast.error(
            'The AI generation result is incomplete. Refresh and try again.',
          );

          return;
        }

        const editor =
          editorRef.current;

        if (!editor) {
          toast.error(
            'The writing editor is not ready yet.',
          );

          return;
        }

        const applied =
          editor.commands.setContent(
            generated.contentHtml,
            {
              emitUpdate: true,
            },
          );

        if (
          applied === false
        ) {
          toast.error(
            'Unable to apply the generated article.',
          );

          return;
        }

        setTitle(
          generatedTitle,
        );

        setSubtitle(
          generatedSubtitle,
        );

        setDescription(
          generatedDescription,
        );

        setExcerpt(
          generatedExcerpt,
        );

        setSlug(
          generatedSlug,
        );

        setSeoTitle(
          generatedSeoTitle,
        );

        setSeoDescription(
          generatedSeoDescription,
        );

        setFocusKeyword(
          generatedFocusKeyword,
        );

        setCanonicalUrl(
          generatedCanonicalUrl,
        );

        setTagsInput(
          generatedTags.join(', '),
        );

        setContent(
          editor.getHTML(),
        );

        setGrammarMatches([]);

        setSeoAnalysis(null);

        clearAiResult();

        toast.success(
          'Complete AI-generated article applied to the editor.',
        );

        return;
      }

      if (
        lastAiAction ===
        'seo'
      ) {
        if (!aiSeoSuggestion) {
          toast.error(
            'The AI SEO result is incomplete. Refresh and try again.',
          );

          return;
        }

        const updatedSeoTitle =
          aiSeoSuggestion.seoTitle.trim();

        const updatedSeoDescription =
          aiSeoSuggestion.seoDescription.trim();

        const updatedFocusKeyword =
          aiSeoSuggestion.focusKeyword.trim();

        const updatedSlug =
          generateSlug(
            aiSeoSuggestion.suggestedSlug,
          );

        const editor =
          editorRef.current;

        if (!editor) {
          toast.error(
            'The writing editor is not ready yet.',
          );

          return;
        }

        if (
          !aiSeoSuggestion.revisedContentHtml.trim()
        ) {
          toast.error(
            'The AI SEO result did not contain revised article content.',
          );

          return;
        }

        const applied =
          editor.commands.setContent(
            aiSeoSuggestion.revisedContentHtml,
            {
              emitUpdate: true,
            },
          );

        if (
          applied === false
        ) {
          toast.error(
            'Unable to apply the AI SEO article correction.',
          );

          return;
        }

        setSeoTitle(
          updatedSeoTitle,
        );

        setSeoDescription(
          updatedSeoDescription,
        );

        setFocusKeyword(
          updatedFocusKeyword,
        );

        setSlug(
          updatedSlug,
        );

        const updatedContent =
          editor.getHTML();

        setContent(
          updatedContent,
        );

        setGrammarMatches([]);

        try {
          const rechecked =
            await seoMutation.mutateAsync({
              title:
                title.trim(),

              content:
                updatedContent,

              slug:
                updatedSlug ||
                undefined,

              seoTitle:
                updatedSeoTitle ||
                undefined,

              seoDescription:
                updatedSeoDescription ||
                undefined,

              focusKeyword:
                updatedFocusKeyword ||
                undefined,

              canonicalUrl:
                canonicalUrl.trim() ||
                undefined,
            });

          setSeoAnalysis(
            rechecked,
          );

          clearAiResult();

          if (
            rechecked.score ===
            100
          ) {
            toast.success(
              'AI SEO corrections applied and all SEO checks passed.',
            );
          } else {
            const unresolvedCount =
              rechecked.checks.filter(
                (check) =>
                  !check.passed,
              ).length;

            toast.success(
              `AI SEO corrections applied. ${unresolvedCount} SEO issue(s) still need attention.`,
            );
          }
        } catch {
          setSeoAnalysis(null);

          clearAiResult();

          toast.success(
            'AI SEO corrections applied. Run Check SEO to verify the final result.',
          );
        }

        return;
      }

      if (
        lastAiAction ===
        'headings'
      ) {
        if (
          !aiHeadingsSuggestion?.revisedContentHtml
        ) {
          toast.error(
            'The AI headings result is incomplete. Refresh and try again.',
          );

          return;
        }

        const editor =
          editorRef.current;

        if (!editor) {
          toast.error(
            'The writing editor is not ready yet.',
          );

          return;
        }

        const applied =
          editor.commands.setContent(
            aiHeadingsSuggestion.revisedContentHtml,
            {
              emitUpdate: true,
            },
          );

        if (
          applied === false
        ) {
          toast.error(
            'Unable to apply the heading structure.',
          );

          return;
        }

        setContent(
          editor.getHTML(),
        );

        setGrammarMatches([]);

        setSeoAnalysis(null);

        clearAiResult();

        toast.success(
          'AI heading structure applied.',
        );

        return;
      }

      const result =
        aiResult.trim();

      if (
        aiTarget ===
        'title'
      ) {
        const previousAutoSlug =
          generateSlug(title);

        setTitle(
          result,
        );

        if (
          !slug ||
          slug === previousAutoSlug
        ) {
          setSlug(
            generateSlug(result),
          );
        }

        setSeoAnalysis(null);

        clearAiResult();

        toast.success(
          'AI result applied to the title.',
        );

        return;
      }

      if (
        aiTarget ===
        'subtitle'
      ) {
        setSubtitle(
          result,
        );

        clearAiResult();

        toast.success(
          'AI result applied to the subtitle.',
        );

        return;
      }

      if (
        aiTarget ===
        'description'
      ) {
        setDescription(
          result,
        );

        setSeoAnalysis(null);

        clearAiResult();

        toast.success(
          'AI result applied to the description.',
        );

        return;
      }

      const editor =
        editorRef.current;

      if (!editor) {
        toast.error(
          'The writing editor is not ready yet.',
        );

        return;
      }

      const applied =
        editor.commands.setContent(
          result,
          {
            emitUpdate: true,
          },
        );

      if (
        applied === false
      ) {
        toast.error(
          'Unable to apply the AI result to the article.',
        );

        return;
      }

      setContent(
        editor.getHTML(),
      );

      setGrammarMatches([]);

      setSeoAnalysis(null);

      clearAiResult();

      toast.success(
        'AI result applied to the article.',
      );
    };

  const canApplyAiResult =
    Boolean(
      aiResult?.trim(),
    ) &&
    Boolean(
      lastAiAction,
    ) &&
    (
      lastAiAction ===
        'generate'
        ? Boolean(
            aiGeneratedArticle
              ?.contentHtml
              ?.trim(),
          )
        : lastAiAction ===
            'seo'
          ? Boolean(
              aiSeoSuggestion,
            )
          : lastAiAction ===
              'headings'
            ? Boolean(
                aiHeadingsSuggestion
                  ?.revisedContentHtml,
              )
            : true
    );

  const editorDisabled =
    isSavingDraft ||
    isPublishing ||
    createArticleMutation.isPending ||
    updateArticleMutation.isPending ||
    deleteArticleMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-[1500px] px-3 py-3 sm:px-4">
      <ArticleToolbar
        editor={editorInstance}
        activePanel={activePanel}
        onPanelChange={
          setActivePanel
        }
        file={{
          title,
          subtitle,
          description,
          slug,
          tagsInput,
          onTitleChange:
            handleTitleChange,
          onSubtitleChange:
            setSubtitle,
          onDescriptionChange:
            (
              value,
            ) => {
              setDescription(
                value,
              );

              setSeoAnalysis(
                null,
              );
            },
          onSlugChange:
            (
              value,
            ) => {
              setSlug(
                value,
              );

              setSeoAnalysis(
                null,
              );
            },
          onTagsChange:
            setTagsInput,
          onNew:
            resetArticle,
          onSaveDraft:
            handleSaveDraft,
          onPublish:
            handlePublish,
          onDelete:
            editingArticleId
              ? handleDelete
              : undefined,
          isSavingDraft,
          isPublishing,
          canDelete:
            Boolean(
              editingArticleId,
            ),
        }}
        image={{
          imageUrl:
            featuredImageUrl,

          imageAlt:
            featuredImageAlt,

          disabled:
            editorDisabled,

          onImageUploaded:
            (
              uploaded,
            ) => {
              setFeaturedImageUrl(
                uploaded.url,
              );

              setFeaturedImagePublicId(
                uploaded.publicId,
              );
            },

          onImageAltChange:
            (
              value,
            ) => {
              setFeaturedImageAlt(
                value,
              );
            },

          onRemove:
            () => {
              setFeaturedImageUrl(
                '',
              );

              setFeaturedImagePublicId(
                '',
              );

              setFeaturedImageAlt(
                '',
              );
            },
        }}
        grammar={{
          matches:
            grammarMatches,

          language,

          isChecking:
            grammarMutation.isPending,

          isApplying:
            isApplyingGrammar,

          onLanguageChange:
            setLanguage,

          onCheck:
            handleGrammarCheck,

          onSuggestionSelect:
            handleGrammarSuggestion,

          onApplyAll:
            handleApplyAllGrammar,
        }}
        seo={{
          seoTitle,

          seoDescription,

          focusKeyword,

          slug,

          canonicalUrl,

          analysis:
            seoAnalysis,

          isAnalyzing:
            seoMutation.isPending,

          onSeoTitleChange:
            (
              value,
            ) => {
              setSeoTitle(
                value,
              );

              setSeoAnalysis(
                null,
              );
            },

          onSeoDescriptionChange:
            (
              value,
            ) => {
              setSeoDescription(
                value,
              );

              setSeoAnalysis(
                null,
              );
            },

          onFocusKeywordChange:
            (
              value,
            ) => {
              setFocusKeyword(
                value,
              );

              setSeoAnalysis(
                null,
              );
            },

          onSlugChange:
            (
              value,
            ) => {
              setSlug(
                value,
              );

              setSeoAnalysis(
                null,
              );
            },

          onCanonicalUrlChange:
            (
              value,
            ) => {
              setCanonicalUrl(
                value,
              );

              setSeoAnalysis(
                null,
              );
            },

          onAnalyze:
            handleSeoAnalysis,
        }}
        ai={{
          target:
            aiTarget,

          result:
            aiResult,

          model:
            aiModel,

          resultAction:
            lastAiAction,

          generatedArticle:
            aiGeneratedArticle,

          seoSuggestion:
            aiSeoSuggestion,

          headingsSuggestion:
            aiHeadingsSuggestion,

          isProcessing:
            aiMutation.isPending,

          onTargetChange:
            setAiTarget,

          onAction:
            handleAiAction,

          onGenerate:
            handleGenerateArticle,

          onApply:
            () => {
              void handleApplyAiResult();
            },

          onDiscard:
            clearAiResult,

          onRefresh:
            handleRefreshAi,

          canApply:
            canApplyAiResult,
        }}
      />

      <section className="mt-2 overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex min-h-9 items-center justify-between border-b border-border bg-muted/20 px-3">
          <p className="text-[11px] font-semibold text-foreground">
            Article body
          </p>

          {title.trim() ? (
            <span className="hidden max-w-[300px] truncate text-[10px] text-muted-foreground sm:block">
              {title}
            </span>
          ) : null}
        </div>

        <ArticleEditor
          value={
            content
          }
          onChange={(
            value,
          ) => {
            setContent(
              value,
            );

            setSeoAnalysis(
              null,
            );
          }}
          onEditorReady={
            handleEditorReady
          }
          minHeight="400px"
        />
      </section>
    </div>
  );
}