'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
import { ArticleFormSkeleton } from '@/components/admin/LoadingSkeleton';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [seoPreview, setSeoPreview] = useState({ title: '', description: '', url: '' });

  useEffect(() => {
    fetchArticle();
  }, [id]);

  useEffect(() => {
    updateSeoPreview();
  }, [formData]);

  const updateSeoPreview = () => {
    const title = formData.seoTitle || formData.title || 'عنوان صفحه';
    const description = formData.seoDescription || formData.excerpt || 'توضیحات صفحه';
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${formData.slug || 'slug'}`;
    setSeoPreview({ title, description, url });
  };

  const fetchArticle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          image: data.image || '',
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          seoKeywords: data.seoKeywords || '',
          published: data.published || false,
          publishedAt: data.publishedAt
            ? new Date(data.publishedAt).toISOString().slice(0, 16)
            : '',
        });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('خطا در بارگذاری اطلاعات مقاله');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        publishedAt: formData.published && formData.publishedAt ? formData.publishedAt : null,
      };
      const response = await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'PATCH',
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
        setError(errorData.message || 'خطا در به‌روزرسانی مقاله');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      setError('خطا در به‌روزرسانی مقاله');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <ArticleFormSkeleton />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← بازگشت به لیست مقالات
        </Link>
        <h1 className="text-4xl font-bold mb-2">ویرایش مقاله</h1>
        <p className="text-muted-foreground">ویرایش اطلاعات مقاله</p>
      </div>

      <div className="max-w-6xl">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
            <h2 className="text-2xl font-bold">اطلاعات پایه</h2>
            
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
                  setFormData({ ...formData, title: e.target.value });
                  updateSeoPreview();
                }}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value });
                  updateSeoPreview();
                }}
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
                onChange={(e) => {
                  setFormData({ ...formData, excerpt: e.target.value });
                  updateSeoPreview();
                }}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="خلاصه مقاله..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.excerpt.length} / 160 کاراکتر (توصیه می‌شود برای SEO)
              </p>
            </div>

            <div>
              <label className="block mb-2 font-semibold">تصویر شاخص</label>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image.startsWith('http') ? formData.image : `${API_URL}${formData.image}`}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    حذف
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowMediaLibrary(true)}
                  className="w-full border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                >
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">برای انتخاب تصویر کلیک کنید</p>
                </button>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">محتوای مقاله</h2>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="محتوای مقاله را اینجا بنویسید..."
            />
          </div>

          {/* SEO Section */}
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-6">
            <h2 className="text-2xl font-bold">بهینه‌سازی SEO</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="seoTitle" className="block mb-2 font-semibold">
                    عنوان SEO
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => {
                      setFormData({ ...formData, seoTitle: e.target.value });
                      updateSeoPreview();
                    }}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={formData.title || 'عنوان SEO'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoTitle.length || formData.title.length} / 60 کاراکتر
                  </p>
                </div>

                <div>
                  <label htmlFor="seoDescription" className="block mb-2 font-semibold">
                    توضیحات SEO
                  </label>
                  <textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => {
                      setFormData({ ...formData, seoDescription: e.target.value });
                      updateSeoPreview();
                    }}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder={formData.excerpt || 'توضیحات SEO'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoDescription.length || formData.excerpt.length} / 160 کاراکتر
                  </p>
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
                    placeholder="کلمه کلیدی 1, کلمه کلیدی 2, ..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    کلمات کلیدی را با کاما جدا کنید
                  </p>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold">پیش‌نمایش نتایج جستجو</label>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="text-sm text-blue-600 mb-1">{seoPreview.url}</div>
                  <div className="text-xl text-blue-800 mb-2 font-medium">{seoPreview.title}</div>
                  <div className="text-sm text-gray-600">{seoPreview.description}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Publish Settings */}
          <div className="bg-card p-6 rounded-xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">تنظیمات انتشار</h2>
            
            <div className="flex items-center gap-4 mb-4">
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
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
            >
              {saving ? '⏳ در حال ذخیره...' : '💾 ذخیره تغییرات'}
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

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">کتابخانه رسانه</h3>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <MediaLibrary
              onSelect={(url) => {
                setFormData({ ...formData, image: url });
                setShowMediaLibrary(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
