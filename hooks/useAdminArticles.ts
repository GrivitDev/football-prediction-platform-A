// frontend/hooks/useAdminArticles.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  analyzeArticleSeo,
  checkArticleGrammar,
  createArticle,
  deleteArticle,
  getAdminArticleById,
  getAdminArticles,
  processArticleWithAi,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from '@/services/article.service';

import type {
  AiWritingData,
  ArticleQueryParams,
  CreateArticleData,
  UpdateArticleData,
} from '@/types/article';

export const useAdminArticles = (
  token: string,
  params?: ArticleQueryParams,
) => {
  return useQuery({
    queryKey: ['admin-articles', params],

    queryFn: () =>
      getAdminArticles(
        token,
        params,
      ),

    enabled: Boolean(token),
  });
};

export const useAdminArticle = (
  id: string,
  token: string,
) => {
  return useQuery({
    queryKey: ['admin-article', id],

    queryFn: () =>
      getAdminArticleById(
        id,
        token,
      ),

    enabled: Boolean(id && token),
  });
};

export const useCreateArticle = (
  token: string,
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateArticleData,
    ) =>
      createArticle(
        data,
        token,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-articles'],
      });

      queryClient.invalidateQueries({
        queryKey: ['articles'],
      });
    },
  });
};

export const useUpdateArticle = (
  token: string,
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateArticleData;
    }) =>
      updateArticle(
        id,
        data,
        token,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin-articles'],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'admin-article',
          variables.id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ['articles'],
      });
    },
  });
};

export const usePublishArticle = (
  token: string,
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      publishArticle(
        id,
        token,
      ),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ['admin-articles'],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'admin-article',
          id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ['articles'],
      });
    },
  });
};

export const useUnpublishArticle = (
  token: string,
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      unpublishArticle(
        id,
        token,
      ),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ['admin-articles'],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'admin-article',
          id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ['articles'],
      });
    },
  });
};

export const useDeleteArticle = (
  token: string,
) => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteArticle(
        id,
        token,
      ),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ['admin-articles'],
      });

      queryClient.removeQueries({
        queryKey: [
          'admin-article',
          id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ['articles'],
      });
    },
  });
};

export const useAnalyzeArticleSeo = (
  token: string,
) => {
  return useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      slug?: string;
      seoTitle?: string;
      seoDescription?: string;
      focusKeyword?: string;
      canonicalUrl?: string;
    }) =>
      analyzeArticleSeo(
        data,
        token,
      ),
  });
};

export const useCheckArticleGrammar = (
  token: string,
) => {
  return useMutation({
    mutationFn: ({
      content,
      language,
    }: {
      content: string;
      language: string;
    }) =>
      checkArticleGrammar(
        content,
        language,
        token,
      ),
  });
};

export const useProcessArticleWithAi = (
  token: string,
) => {
  return useMutation({
    mutationFn: (
      data: AiWritingData,
    ) =>
      processArticleWithAi(
        data,
        token,
      ),
  });
};