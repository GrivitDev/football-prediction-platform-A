// frontend/hooks/useArticles.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getArticle,
  getArticles,
  incrementArticleView,
  likeArticle,
} from '@/services/article.service';

import type {
  ArticleQueryParams,
} from '@/types/article';

export const useArticles = (
  params?: ArticleQueryParams,
) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => getArticles(params),
  });
};

export const useArticle = (
  slug: string,
) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticle(slug),
    enabled: Boolean(slug),
  });
};

export const useArticleView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      incrementArticleView(id),

    onSuccess: (data, id) => {
      queryClient.setQueriesData(
        {
          queryKey: ['article'],
        },
        (article: any) => {
          if (!article || article._id !== id) {
            return article;
          }

          return {
            ...article,
            viewsCount: data.viewsCount,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: ['articles'],
      });
    },
  });
};

export const useArticleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      likeArticle(id),

    onSuccess: (data, id) => {
      queryClient.setQueriesData(
        {
          queryKey: ['article'],
        },
        (article: any) => {
          if (!article || article._id !== id) {
            return article;
          }

          return {
            ...article,
            likesCount: data.likesCount,
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: ['articles'],
      });
    },
  });
};