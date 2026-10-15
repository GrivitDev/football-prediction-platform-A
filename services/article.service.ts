// frontend/services/article.service.ts

import api from '@/lib/axios';

import type {
  AiWritingData,
  AiWritingResponse,
  Article,
  ArticleListResponse,
  ArticleQueryParams,
  ArticleSeoAnalysis,
  CheckGrammarResponse,
  CreateArticleData,
  UpdateArticleData,
} from '@/types/article';

const getAuthHeaders = (
  token: string,
) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getArticles = async (
  params?: ArticleQueryParams,
): Promise<ArticleListResponse> => {
  const response = await api.get(
    '/articles',
    {
      params,
    },
  );

  return response.data;
};

export const getAdminArticles = async (
  token: string,
  params?: ArticleQueryParams,
): Promise<ArticleListResponse> => {
  const response = await api.get(
    '/articles/admin',
    {
      params,
      ...getAuthHeaders(token),
    },
  );

  return response.data;
};

export const getAdminArticleById = async (
  id: string,
  token: string,
): Promise<Article> => {
  const response = await api.get(
    `/articles/admin/${id}`,
    getAuthHeaders(token),
  );

  return response.data;
};

export const getArticle = async (
  slug: string,
): Promise<Article> => {
  const response = await api.get(
    `/articles/slug/${slug}`,
  );

  return response.data;
};

export const getArticleById = async (
  id: string,
): Promise<Article> => {
  const response = await api.get(
    `/articles/${id}`,
  );

  return response.data;
};

export const createArticle = async (
  data: CreateArticleData,
  token: string,
): Promise<Article> => {
  const response = await api.post(
    '/articles',
    data,
    getAuthHeaders(token),
  );

  return response.data;
};

export const updateArticle = async (
  id: string,
  data: UpdateArticleData,
  token: string,
): Promise<Article> => {
  const response = await api.patch(
    `/articles/${id}`,
    data,
    getAuthHeaders(token),
  );

  return response.data;
};

export const publishArticle = async (
  id: string,
  token: string,
): Promise<Article> => {
  const response = await api.post(
    `/articles/${id}/publish`,
    undefined,
    getAuthHeaders(token),
  );

  return response.data;
};

export const unpublishArticle = async (
  id: string,
  token: string,
): Promise<Article> => {
  const response = await api.post(
    `/articles/${id}/unpublish`,
    undefined,
    getAuthHeaders(token),
  );

  return response.data;
};

export const deleteArticle = async (
  id: string,
  token: string,
): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await api.delete(
    `/articles/${id}`,
    getAuthHeaders(token),
  );

  return response.data;
};

export const incrementArticleView = async (
  id: string,
): Promise<{
  viewsCount: number;
}> => {
  const response = await api.post(
    `/articles/${id}/view`,
  );

  return response.data;
};

export const likeArticle = async (
  id: string,
): Promise<{
  likesCount: number;
}> => {
  const response = await api.post(
    `/articles/${id}/like`,
  );

  return response.data;
};

export const analyzeArticleSeo = async (
  data: {
    title: string;
    content: string;
    slug?: string;
    seoTitle?: string;
    seoDescription?: string;
    focusKeyword?: string;
    canonicalUrl?: string;
  },
  token: string,
): Promise<ArticleSeoAnalysis> => {
  const response = await api.post(
    '/articles/seo/analyze',
    data,
    getAuthHeaders(token),
  );

  return response.data;
};

export const checkArticleGrammar = async (
  content: string,
  language: string,
  token: string,
): Promise<CheckGrammarResponse> => {
  const response = await api.post(
    '/articles/grammar/check',
    {
      content,
      language,
    },
    getAuthHeaders(token),
  );

  return response.data;
};

export const processArticleWithAi = async (
  data: AiWritingData,
  token: string,
): Promise<AiWritingResponse> => {
  const response = await api.post(
    '/articles/ai/process',
    {
      content: data.content,

      title:
        data.title,

      subtitle:
        data.subtitle,

      description:
        data.description,

      focusKeyword:
        data.focusKeyword,

      slug:
        data.slug,

      seoTitle:
        data.seoTitle,

      seoDescription:
        data.seoDescription,

      canonicalUrl:
        data.canonicalUrl,

      action:
        data.action,

      target:
        data.target,
    },
    getAuthHeaders(token),
  );

  return response.data;
};