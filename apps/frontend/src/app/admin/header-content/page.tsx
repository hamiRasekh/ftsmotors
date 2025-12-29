'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
import { API_URL } from '@/lib/utils';
import Image from 'next/image';

interface NavItem {
  href: string;
  label: string;
}

export default function AdminHeaderContentPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [formData, setFormData] = useState({
    logo: '',
    logoAlt: '',
    navItems: [] as NavItem[],
    ctaText: '',
    ctaLink: '',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await api.headerContent.getPublic();
      setContent(data);
      setFormData({
        logo: data.logo || '',
        logoAlt: data.logoAlt || '',
        navItems: Array.isArray(data.navItems) ? data.navItems : [],
        ctaText: data.ctaText || '',
        ctaLink: data.ctaLink || '',
      });
    } catch (error) {
      console.error('Error fetching header content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (content?.id) {
        await api.headerContent.update(content.id, { ...formData, isActive: true });
      } else {
        await api.headerContent.create({ ...formData, isActive: true });
      }
      alert('محتوای هدر با موفقیت ذخیره شد');
      fetchContent();
    } catch (error) {
      console.error('Error saving header content:', error);
      alert('خطا در ذخیره محتوا');
    } finally {
      setSaving(false);
    }
  };

  const addNavItem = () => {
    setFormData({
      ...formData,
      navItems: [...formData.navItems, { href: '', label: '' }],
    });
  };

  const updateNavItem = (index: number, field: 'href' | 'label', value: string) => {
    const newNavItems = [...formData.navItems];
    newNavItems[index] = { ...newNavItems[index], [field]: value };
    setFormData({ ...formData, navItems: newNavItems });
  };

  const removeNavItem = (index: number) => {
    setFormData({
      ...formData,
      navItems: formData.navItems.filter((_, i) => i !== index),
    });
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
        <FadeIn>
          <h1 className="text-4xl font-bold mb-2">مدیریت محتوای هدر</h1>
          <p className="text-muted-foreground">ویرایش منو و لوگوی هدر</p>
        </FadeIn>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">لوگو</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">لوگو</label>
            {formData.logo ? (
              <div className="relative">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                  <Image
                    src={formData.logo.startsWith('http') ? formData.logo : `${API_URL}${formData.logo}`}
                    alt={formData.logoAlt}
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowMediaLibrary(true)}
                  className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  تغییر لوگو
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logo: '' })}
                  className="mt-2 mr-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
                <p className="mt-2 text-sm text-gray-600">برای انتخاب لوگو کلیک کنید</p>
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">متن جایگزین لوگو</label>
            <input
              type="text"
              value={formData.logoAlt}
              onChange={(e) => setFormData({ ...formData, logoAlt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="فیدار تجارت سوبا"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">آیتم‌های منو</h2>
            <button
              type="button"
              onClick={addNavItem}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              + افزودن آیتم
            </button>
          </div>
          
          {formData.navItems.map((item, index) => (
            <div key={index} className="flex gap-2 items-end border p-4 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">لینک</label>
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => updateNavItem(index, 'href', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="/"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">متن</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="خانه"
                />
              </div>
              <button
                type="button"
                onClick={() => removeNavItem(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                حذف
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">دکمه CTA</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">متن دکمه</label>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="دریافت مشاوره"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">لینک دکمه</label>
            <input
              type="text"
              value={formData.ctaLink}
              onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="/contact"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <AnimatedButton type="submit" variant="primary" size="lg" disabled={saving}>
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </AnimatedButton>
        </div>
      </form>

      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">انتخاب لوگو</h3>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <MediaLibrary 
              onSelect={(url) => {
                setFormData({ ...formData, logo: url });
                setShowMediaLibrary(false);
              }} 
              multiple={false} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

