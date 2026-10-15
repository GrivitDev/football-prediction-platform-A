'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Edit3,
  Eye,
  FileText,
  Heart,
  CheckCircle2,
  Clock3,
  Loader2,
  Newspaper,
  Plus,
  Send,
  Trash2,
  RotateCcw,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import {
  useAdminArticles,
  useDeleteArticle,
  usePublishArticle,
  useUnpublishArticle,
} from '@/hooks/useAdminArticles';

import { useAuth } from '@/providers/auth-provider';

import type {
  ArticleStatus,
} from '@/types/article';

export default function ArticlesPage() {
  const router = useRouter();

  const {
    user,
    token,
    loading: authLoading,
  } = useAuth();

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<ArticleStatus | undefined>(
    undefined,
  );

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null,
  );

  const [
    publishingId,
    setPublishingId,
  ] = useState<string | null>(
    null,
  );

  const [
    unpublishingId,
    setUnpublishingId,
  ] = useState<string | null>(
    null,
  );

  const adminArticlesQuery =
    useAdminArticles(
      token || '',
      {
        status:
          statusFilter,

        search:
          search.trim() ||
          undefined,

        page: 1,

        limit: 100,
      },
    );

  const publishMutation =
    usePublishArticle(
      token || '',
    );

  const unpublishMutation =
    useUnpublishArticle(
      token || '',
    );

  const deleteMutation =
    useDeleteArticle(
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

  const articles =
    adminArticlesQuery.data?.data ??
    [];

  const total =
    adminArticlesQuery.data?.total ??
    articles.length;

  const isLoading =
    adminArticlesQuery.isLoading;

  const isFetching =
    adminArticlesQuery.isFetching;

  const handleEdit = (
    articleId: string,
  ) => {
    router.push(
      `/admin/articles/${articleId}/edit`,
    );
  };

  const handleCreate = () => {
    router.push(
      '/admin/create-article',
    );
  };

  const handlePublish = async (
    articleId: string,
  ) => {
    try {
      setPublishingId(
        articleId,
      );

      await publishMutation.mutateAsync(
        articleId,
      );

      toast.success(
        'Article published successfully.',
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Unable to publish the article.',
      );
    } finally {
      setPublishingId(
        null,
      );
    }
  };

  const handleUnpublish = async (
    articleId: string,
  ) => {
    try {
      setUnpublishingId(
        articleId,
      );

      await unpublishMutation.mutateAsync(
        articleId,
      );

      toast.success(
        'Article unpublished successfully.',
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Unable to unpublish the article.',
      );
    } finally {
      setUnpublishingId(
        null,
      );
    }
  };

  const handleDelete = async (
    articleId: string,
    title: string,
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${title}" permanently?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        articleId,
      );

      await deleteMutation.mutateAsync(
        articleId,
      );

      toast.success(
        'Article deleted successfully.',
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Unable to delete the article.',
      );
    } finally {
      setDeletingId(
        null,
      );
    }
  };

  const formatDate = (
    value: string,
  ) => {
    try {
      return new Intl.DateTimeFormat(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        },
      ).format(
        new Date(value),
      );
    } catch {
      return '—';
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1500px] px-3 py-3 sm:px-4">
      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <header className="flex flex-col gap-3 border-b border-border bg-muted/20 p-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-primary" />

              <h1 className="text-base font-semibold text-foreground">
                Manage Articles
              </h1>
            </div>

            <p className="mt-1 text-[11px] text-muted-foreground">
              {total}{' '}
              {total === 1
                ? 'article'
                : 'articles'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                adminArticlesQuery.refetch()
              }
              disabled={isFetching}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isFetching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}

              Refresh
            </button>

            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />

              New article
            </button>
          </div>
        </header>

        <div className="border-b border-border bg-background p-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search articles..."
              className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setStatusFilter(
                    undefined,
                  )
                }
                className={[
                  'h-8 rounded-md border px-2.5 text-[11px] font-medium transition',
                  statusFilter ===
                    undefined
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted',
                ].join(' ')}
              >
                All
              </button>

              <button
                type="button"
                onClick={() =>
                  setStatusFilter(
                    'published',
                  )
                }
                className={[
                  'h-8 rounded-md border px-2.5 text-[11px] font-medium transition',
                  statusFilter ===
                    'published'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted',
                ].join(' ')}
              >
                Published
              </button>

              <button
                type="button"
                onClick={() =>
                  setStatusFilter(
                    'draft',
                  )
                }
                className={[
                  'h-8 rounded-md border px-2.5 text-[11px] font-medium transition',
                  statusFilter ===
                    'draft'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted',
                ].join(' ')}
              >
                Drafts
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="divide-y divide-border">
            {[
              1,
              2,
              3,
              4,
            ].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-3"
                >
                  <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />

                  <div className="min-w-0 flex-1">
                    <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />

                    <div className="mt-2 h-2.5 w-1/3 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : adminArticlesQuery.isError ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-2 text-sm font-semibold text-foreground">
              Unable to load articles
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Please refresh the article list and try again.
            </p>

            <button
              type="button"
              onClick={() =>
                adminArticlesQuery.refetch()
              }
              className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[11px] font-medium text-primary-foreground"
            >
              Try again
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-2 text-sm font-semibold text-foreground">
              No articles found
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Create your first article to get started.
            </p>

            <button
              type="button"
              onClick={handleCreate}
              className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[11px] font-medium text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" />

              New article
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Article
                  </th>

                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>

                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Views
                  </th>

                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Likes
                  </th>

                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Updated
                  </th>

                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {articles.map(
                  (article) => {
                    const isPublishing =
                      publishingId ===
                      article._id;

                    const isUnpublishing =
                      unpublishingId ===
                      article._id;

                    const isDeleting =
                      deletingId ===
                      article._id;

                    const rowBusy =
                      isPublishing ||
                      isUnpublishing ||
                      isDeleting;

                    return (
                      <tr
                        key={
                          article._id
                        }
                        className="border-b border-border last:border-b-0 hover:bg-muted/10"
                      >
                        <td className="px-3 py-3">
                          <div className="flex min-w-0 items-start gap-2.5">
                            <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
                              <FileText className="h-3.5 w-3.5 text-primary" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-foreground">
                                {article.title}
                              </p>

                              {article.subtitle ? (
                                <p className="mt-0.5 max-w-[440px] truncate text-[10px] text-muted-foreground">
                                  {
                                    article.subtitle
                                  }
                                </p>
                              ) : null}

                              <p className="mt-1 text-[10px] text-muted-foreground">
                                /articles/
                                {
                                  article.slug
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3">
                          {article.status ===
                          'published' ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-1 text-[10px] font-medium text-green-600">
                              <CheckCircle2 className="h-3 w-3" />

                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/10 px-2 py-1 text-[10px] font-medium text-orange-600">
                              <Clock3 className="h-3 w-3" />

                              Draft
                            </span>
                          )}
                        </td>

                        <td className="px-3 py-3 text-right">
                          <span className="inline-flex items-center justify-end gap-1 text-xs font-medium text-foreground">
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />

                            {article.viewsCount.toLocaleString()}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-right">
                          <span className="inline-flex items-center justify-end gap-1 text-xs font-medium text-foreground">
                            <Heart className="h-3.5 w-3.5 text-muted-foreground" />

                            {article.likesCount.toLocaleString()}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-[10px] text-muted-foreground">
                          {formatDate(
                            article.updatedAt,
                          )}
                        </td>

                        <td className="px-3 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  article._id,
                                )
                              }
                              disabled={
                                rowBusy
                              }
                              className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-[10px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Edit3 className="h-3 w-3" />

                              Edit
                            </button>

                            {article.status ===
                            'published' ? (
                              <button
                                type="button"
                                onClick={() =>
                                  void handleUnpublish(
                                    article._id,
                                  )
                                }
                                disabled={
                                  rowBusy
                                }
                                className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-[10px] font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isUnpublishing ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Clock3 className="h-3 w-3" />
                                )}

                                Unpublish
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  void handlePublish(
                                    article._id,
                                  )
                                }
                                disabled={
                                  rowBusy
                                }
                                className="inline-flex h-7 items-center gap-1 rounded-md bg-primary px-2 text-[10px] font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isPublishing ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Send className="h-3 w-3" />
                                )}

                                Publish
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                void handleDelete(
                                  article._id,
                                  article.title,
                                )
                              }
                              disabled={
                                rowBusy
                              }
                              className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-[10px] font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}

                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}