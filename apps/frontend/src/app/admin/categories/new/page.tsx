'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';

export default function NewCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'خطا در ایجاد دسته‌بندی');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setError('خطا در ایجاد دسته‌بندی');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← بازگشت به لیست دسته‌بندی‌ها
        </Link>
        <h1 className="text-4xl font-bold mb-2">افزودن دسته‌بندی جدید</h1>
        <p className="text-muted-foreground">ایجاد دسته‌بندی جدید برای خودروها</p>
      </div>

      <div className="max-w-2xl">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold">
              نام دسته‌بندی <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="مثال: خودروهای سواری"
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
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono text-sm"
              placeholder="مثال: sedans"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              آدرس URL برای این دسته‌بندی (به انگلیسی و با خط تیره)
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-semibold">
              توضیحات
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              rows={4}
              placeholder="توضیحات درباره این دسته‌بندی..."
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
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-4">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="max-w-xs rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  در حال ذخیره...
                </span>
              ) : (
                '💾 ذخیره'
              )}
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
