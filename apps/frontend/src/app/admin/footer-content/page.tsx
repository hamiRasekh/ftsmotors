'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
import { API_URL } from '@/lib/utils';
import Image from 'next/image';

interface FooterLink {
  href: string;
  label: string;
}

export default function AdminFooterContentPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [formData, setFormData] = useState({
    logo: '',
    logoAlt: '',
    companyName: '',
    description: '',
    quickLinks: [] as FooterLink[],
    infoLinks: [] as FooterLink[],
    address: '',
    phone: '',
    phones: [] as string[],
    email: '',
    copyrightText: '',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const data = await api.footerContent.getPublic();
      setContent(data);
      setFormData({
        logo: data.logo || '',
        logoAlt: data.logoAlt || '',
        companyName: data.companyName || '',
        description: data.description || '',
        quickLinks: Array.isArray(data.quickLinks) ? data.quickLinks : [],
        infoLinks: Array.isArray(data.infoLinks) ? data.infoLinks : [],
        address: data.address || '',
        phone: data.phone || '',
        phones: Array.isArray(data.phones) ? data.phones : [],
        email: data.email || '',
        copyrightText: data.copyrightText || '',
      });
    } catch (error) {
      console.error('Error fetching footer content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (content?.id) {
        await api.footerContent.update(content.id, { ...formData, isActive: true });
      } else {
        await api.footerContent.create({ ...formData, isActive: true });
      }
      alert('محتوای فوتر با موفقیت ذخیره شد');
      fetchContent();
    } catch (error) {
      console.error('Error saving footer content:', error);
      alert('خطا در ذخیره محتوا');
    } finally {
      setSaving(false);
    }
  };

  const addLink = (type: 'quickLinks' | 'infoLinks') => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { href: '', label: '' }],
    });
  };

  const updateLink = (type: 'quickLinks' | 'infoLinks', index: number, field: 'href' | 'label', value: string) => {
    const newLinks = [...formData[type]];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, [type]: newLinks });
  };

  const removeLink = (type: 'quickLinks' | 'infoLinks', index: number) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index),
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
          <h1 className="text-4xl font-bold mb-2">مدیریت محتوای فوتر</h1>
          <p className="text-muted-foreground">ویرایش محتوای فوتر سایت</p>
        </FadeIn>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">اطلاعات شرکت</h2>
          
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نام شرکت</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">لینک‌های دسترسی سریع</h2>
            <button
              type="button"
              onClick={() => addLink('quickLinks')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              + افزودن لینک
            </button>
          </div>
          
          {formData.quickLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-end border p-4 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">لینک</label>
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateLink('quickLinks', index, 'href', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">متن</label>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink('quickLinks', index, 'label', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => removeLink('quickLinks', index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                حذف
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">لینک‌های اطلاعات</h2>
            <button
              type="button"
              onClick={() => addLink('infoLinks')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              + افزودن لینک
            </button>
          </div>
          
          {formData.infoLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-end border p-4 rounded-lg">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">لینک</label>
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateLink('infoLinks', index, 'href', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">متن</label>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink('infoLinks', index, 'label', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => removeLink('infoLinks', index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                حذف
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">اطلاعات تماس</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن‌ها (هر شماره در یک خط)</label>
            <textarea
              value={formData.phones.join('\n')}
              onChange={(e) => {
                const phones = e.target.value.split('\n').filter(p => p.trim());
                setFormData({ ...formData, phones });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="02144026696&#10;02144979483"
            />
            <p className="text-xs text-gray-500 mt-1">هر شماره را در یک خط جداگانه وارد کنید</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">متن کپی‌رایت</label>
            <input
              type="text"
              value={formData.copyrightText}
              onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder={`© ${new Date().getFullYear()} فیدار تجارت سوبا. تمامی حقوق محفوظ است.`}
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

