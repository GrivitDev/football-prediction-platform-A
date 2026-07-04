'use client';

import { useState } from 'react';

import { useAuth } from '@/providers/auth-provider';

import { createArticle } from '@/services/article.service';

export default function CreateArticlePage() {
  const { token } = useAuth();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: '',

      excerpt: '',

      content: '',

      featuredImage: '',
    });

  const handleChange = (
    e: any,
  ) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (
      e: React.FormEvent,
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        await createArticle(
          formData,

          token as string,
        );

        alert(
          'Article created successfully',
        );

        setFormData({
          title: '',

          excerpt: '',

          content: '',

          featuredImage: '',
        });
      } catch (error: any) {
        alert(
          error?.response?.data
            ?.message ||
            'Failed to create article',
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-5xl font-black">
          Create Article
        </h1>

        <p className="text-slate-400 mt-2">
          Publish football articles
          and analysis
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <input
          name="title"
          placeholder="Article Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4"
        />

        <input
          name="excerpt"
          placeholder="Short Excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4"
        />

        <input
          name="featuredImage"
          placeholder="Featured Image URL"
          value={
            formData.featuredImage
          }
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4"
        />

        <textarea
          name="content"
          placeholder="Article Content"
          value={
            formData.content
          }
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 h-[400px]"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 transition px-10 py-4 rounded-xl font-bold"
        >
          {loading
            ? 'Publishing...'
            : 'Publish Article'}
        </button>
      </form>
    </div>
  );
}