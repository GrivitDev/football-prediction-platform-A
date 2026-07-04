'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import api from '@/lib/axios';

export default function ArticlesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const res = await api.get('/articles');
      return res.data;
    },
  });

  const [editArticle, setEditArticle] = useState<any>(null);

  const updateField = (field: string, value: any) => {
    setEditArticle((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveArticle = async () => {
    await api.patch(`/articles/${editArticle._id}`, editArticle);

    setEditArticle(null);

    queryClient.invalidateQueries({ queryKey: ['articles'] });
  };

  if (isLoading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Articles</h1>

      {/* LIST */}
      <div className="grid gap-3">
        {data?.map((article: any) => (
          <div
            key={article._id}
            className="p-4 bg-slate-900 border border-slate-800 rounded flex justify-between"
          >
            <div>
              <p className="font-semibold">{article.title}</p>
              <p className="text-xs text-slate-400">
                {article.status || 'draft'}
              </p>
            </div>

            <button
              onClick={() => setEditArticle(article)}
              className="px-4 py-2 bg-blue-600 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editArticle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-2xl p-5 rounded border border-slate-800">

            <h2 className="text-xl font-bold mb-4">
              Edit Article
            </h2>

            <input
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded mb-3"
              value={editArticle.title}
              onChange={(e) =>
                updateField('title', e.target.value)
              }
            />

            <textarea
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded h-64"
              value={editArticle.content}
              onChange={(e) =>
                updateField('content', e.target.value)
              }
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={saveArticle}
                className="flex-1 bg-green-600 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditArticle(null)}
                className="flex-1 bg-slate-700 py-2 rounded"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}