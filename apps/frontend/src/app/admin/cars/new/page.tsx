'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';

export default function NewCarPage() {
  const router = useRouter();
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
  });
  const [imageUrl, setImageUrl] = useState('');
  const [featureKey, setFeatureKey] = useState('');
  const [featureValue, setFeatureValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (brand: string, model: string) => {
    return `${brand}-${model}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleAddImage = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] });
      setImageUrl('');
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
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/cars`, {
        method: 'POST',
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
        setError(errorData.message || 'خطا در ایجاد خودرو');
      }
    } catch (error) {
      console.error('Error creating car:', error);
      setError('خطا در ایجاد خودرو');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/cars"
          className="text-muted-foreground hover:text-foreground mb-4 inline-block"
        >
          ← بازگشت به لیست خودروها
        </Link>
        <h1 className="text-4xl font-bold mb-2">افزودن خودرو جدید</h1>
        <p className="text-muted-foreground">ایجاد خودرو جدید در سیستم</p>
      </div>

      <div className="max-w-4xl">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
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
                onChange={(e) => {
                  const brand = e.target.value;
                  setFormData({
                    ...formData,
                    brand,
                    slug: formData.slug || generateSlug(brand, formData.model),
                  });
                }}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="مثال: تویوتا"
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
                onChange={(e) => {
                  const model = e.target.value;
                  setFormData({
                    ...formData,
                    model,
                    slug: formData.slug || generateSlug(formData.brand, model),
                  });
                }}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="مثال: کمری"
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
                placeholder="toyota-camry"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block mb-2 font-semibold">
                دسته‌بندی <span className="text-destructive">*</span>
              </label>
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
              placeholder="توضیحات کامل درباره خودرو..."
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">تصاویر</label>
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="URL تصویر"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/90"
              >
                افزودن
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {formData.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img src={img} alt={`Image ${index + 1}`} className="w-full h-24 object-cover rounded border" />
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
          </div>

          <div>
            <label className="block mb-2 font-semibold">ویژگی‌ها</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={featureKey}
                onChange={(e) => setFeatureKey(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="نام ویژگی (مثال: موتور)"
              />
              <input
                type="text"
                value={featureValue}
                onChange={(e) => setFeatureValue(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="مقدار (مثال: 2.5 لیتری)"
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
                placeholder="کلمه1, کلمه2, کلمه3"
              />
            </div>
          </div>

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

