'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';
import { MediaLibrary } from '@/components/admin/MediaLibrary';

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    slug: '',
    categoryId: '',
    description: '',
    images: [] as string[],
    features: {} as Record<string, any>,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    published: false,
  });
  const [imageUrl, setImageUrl] = useState('');
  const [featureKey, setFeatureKey] = useState('');
  const [featureValue, setFeatureValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchCar();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Categories fetched:', data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchCar = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFormData({
          brand: data.brand || '',
          model: data.model || '',
          slug: data.slug || '',
          categoryId: data.categoryId || '',
          description: data.description || '',
          images: data.images || [],
          features: data.features || {},
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          seoKeywords: data.seoKeywords || '',
          published: data.published || false,
        });
      }
    } catch (error) {
      console.error('Error fetching car:', error);
      setError('خطا در بارگذاری اطلاعات خودرو');
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = (url: string) => {
    if (url && !formData.images.includes(url)) {
      setFormData({ ...formData, images: [...formData.images, url] });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleAddFeature = () => {
    if (featureKey && featureValue) {
      setFormData({
        ...formData,
        features: { ...formData.features, [featureKey]: featureValue },
      });
      setFeatureKey('');
      setFeatureValue('');
    }
  };

  const handleRemoveFeature = (key: string) => {
    const newFeatures = { ...formData.features };
    delete newFeatures[key];
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cars/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/cars');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'خطا در به‌روزرسانی خودرو');
      }
    } catch (error) {
      console.error('Error updating car:', error);
      setError('خطا در به‌روزرسانی خودرو');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/cars"
          className="text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← بازگشت به لیست خودروها
        </Link>
        <h1 className="text-4xl font-bold mb-2">ویرایش خودرو</h1>
        <p className="text-muted-foreground">ویرایش اطلاعات خودرو</p>
      </div>

      <div className="max-w-4xl">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
          {/* Similar form fields as new page */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="brand" className="block mb-2 font-semibold">
                برند <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="brand"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="model" className="block mb-2 font-semibold">
                مدل <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="model"
                required
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label htmlFor="categoryId" className="block mb-2 font-semibold">
                دسته‌بندی <span className="text-destructive">*</span>
              </label>
              {categories.length === 0 ? (
                <div className="w-full px-4 py-3 border border-yellow-300 rounded-lg bg-yellow-50">
                  <p className="text-sm text-yellow-800">
                    هیچ دسته‌بندی‌ای یافت نشد. لطفاً ابتدا یک دسته‌بندی ایجاد کنید.
                  </p>
                  <Link
                    href="/admin/categories/new"
                    className="text-sm text-yellow-900 underline mt-1 inline-block"
                  >
                    ایجاد دسته‌بندی جدید
                  </Link>
                </div>
              ) : (
                <select
                  id="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-semibold">
              توضیحات <span className="text-destructive">*</span>
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={6}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">تصاویر</label>
            <button
              type="button"
              onClick={() => setShowMediaLibrary(true)}
              className="w-full border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors mb-4"
            >
              <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">برای انتخاب یا آپلود تصویر کلیک کنید</p>
            </button>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={img.startsWith('http') ? img : `${API_URL}${img}`} 
                      alt={`Image ${index + 1}`} 
                      className="w-full h-24 object-cover rounded border" 
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 left-1 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold">ویژگی‌ها</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={featureKey}
                onChange={(e) => setFeatureKey(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="نام ویژگی"
              />
              <input
                type="text"
                value={featureValue}
                onChange={(e) => setFeatureValue(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="مقدار"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/90"
              >
                افزودن
              </button>
            </div>
            <div className="space-y-2">
              {Object.entries(formData.features).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>
                    <strong>{key}:</strong> {String(value)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(key)}
                    className="text-destructive hover:underline"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
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

          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="published" className="font-semibold cursor-pointer">
              منتشر شده
            </label>
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
              <h3 className="text-2xl font-bold">کتابخانه رسانه - انتخاب تصاویر</h3>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <MediaLibrary
              type="image"
              multiple={true}
              onSelect={(url) => {
                handleAddImage(url);
              }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

