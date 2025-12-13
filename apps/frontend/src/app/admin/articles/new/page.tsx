'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';

export default function NewArticlePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    published: false,
    publishedAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        publishedAt: formData.published && formData.publishedAt ? formData.publishedAt : null,
      };
      const response = await fetch(`${API_URL}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/admin/articles');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'خطا در ایجاد مقاله');
      }
    } catch (error) {
      console.error('Error creating article:', error);
      setError('خطا در ایجاد مقاله');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← بازگشت به لیست مقالات
        </Link>
        <h1 className="text-4xl font-bold mb-2">افزودن مقاله جدید</h1>
        <p className="text-muted-foreground">ایجاد مقاله جدید</p>
      </div>

      <div className="max-w-4xl">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
          <div>
            <label htmlFor="title" className="block mb-2 font-semibold">
              عنوان <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({
                  ...formData,
                  title,
                  slug: formData.slug || generateSlug(title),
                });
              }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="عنوان مقاله"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block mb-2 font-semibold">
              Slug <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block mb-2 font-semibold">
              خلاصه
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder="خلاصه مقاله..."
            />
          </div>

          <div>
            <label htmlFor="content" className="block mb-2 font-semibold">
              محتوا <span className="text-destructive">*</span>
            </label>
            <textarea
              id="content"
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              rows={15}
              placeholder="محتوای مقاله (Markdown یا HTML)..."
            />
          </div>

          <div>
            <label htmlFor="image" className="block mb-2 font-semibold">
              تصویر (URL)
            </label>
            <input
              type="url"
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="seoTitle" className="block mb-2 font-semibold">
                عنوان SEO
              </label>
              <input
                type="text"
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="seoDescription" className="block mb-2 font-semibold">
                توضیحات SEO
              </label>
              <textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="seoKeywords" className="block mb-2 font-semibold">
                کلمات کلیدی SEO
              </label>
              <input
                type="text"
                id="seoKeywords"
                value={formData.seoKeywords}
                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5"
            />
            <label htmlFor="published" className="font-semibold">
              منتشر شده
            </label>
          </div>

          {formData.published && (
            <div>
              <label htmlFor="publishedAt" className="block mb-2 font-semibold">
                تاریخ انتشار
              </label>
              <input
                type="datetime-local"
                id="publishedAt"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
            >
              {loading ? '⏳ در حال ذخیره...' : '💾 ذخیره'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

