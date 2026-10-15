'use client';

import {
  useEffect,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import {
  Loader2,
} from 'lucide-react';

import ArticleCreateForm from '@/components/articles/ArticleCreateForm';

import {
  useAdminArticle,
} from '@/hooks/useAdminArticles';

import {
  useAuth,
} from '@/providers/auth-provider';

export default function EditArticlePage() {
  const router = useRouter();

  const params =
    useParams<{
      articleId: string;
    }>();

  const articleId =
    params.articleId;

  const {
    user,
    token,
    loading: authLoading,
  } = useAuth();

  const articleQuery =
    useAdminArticle(
      articleId,
      token || '',
    );

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user || !token) {
      router.replace('/login');

      return;
    }

    if (user.role !== 'admin') {
      router.replace('/admin');
    }
  }, [
    authLoading,
    token,
    user,
    router,
  ]);

  if (
    authLoading ||
    !user ||
    !token ||
    user.role !== 'admin'
  ) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />

          <p className="mt-2 text-xs text-muted-foreground">
            Checking access...
          </p>
        </div>
      </main>
    );
  }

  if (
    articleQuery.isLoading
  ) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />

          <p className="mt-2 text-xs text-muted-foreground">
            Loading article...
          </p>
        </div>
      </main>
    );
  }

  if (
    articleQuery.isError ||
    !articleQuery.data
  ) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-[700px] items-center justify-center px-4">
        <div className="w-full rounded-lg border border-border bg-card p-5 text-center">
          <p className="text-sm font-semibold text-foreground">
            Article could not be loaded
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            The article may have been deleted or is no longer available.
          </p>

          <button
            type="button"
            onClick={() =>
              router.replace(
                '/admin/articles',
              )
            }
            className="mt-4 inline-flex h-8 items-center rounded-md bg-primary px-3 text-[11px] font-medium text-primary-foreground transition hover:opacity-90"
          >
            Back to articles
          </button>
        </div>
      </main>
    );
  }

  return (
    <ArticleCreateForm
      token={token}
      article={
        articleQuery.data
      }
    />
  );
}