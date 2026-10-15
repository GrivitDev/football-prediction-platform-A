// frontend/app/admin/create-article/page.tsx

'use client';

import {
  useEffect,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import ArticleCreateForm from '@/components/articles/ArticleCreateForm';
import {
  useAuth,
} from '@/providers/auth-provider';

export default function CreateArticlePage() {
  const router =
    useRouter();

  const {
    user,
    token,
    loading,
  } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user || !token) {
      router.replace(
        '/login',
      );

      return;
    }

    if (
      user.role !==
      'admin'
    ) {
      router.replace(
        '/admin',
      );
    }
  }, [
    loading,
    token,
    user,
    router,
  ]);

  if (
    loading ||
    !user ||
    !token ||
    user.role !==
      'admin'
  ) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />

          <p className="mt-3 text-sm text-muted-foreground">
            Checking access...
          </p>
        </div>
      </main>
    );
  }

  return (
    <ArticleCreateForm
      token={token}
    />
  );
}