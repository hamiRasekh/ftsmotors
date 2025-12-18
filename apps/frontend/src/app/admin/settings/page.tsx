'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/utils';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteLogo: string;
  siteFavicon: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  seoDefaultKeywords: string;
  googleAnalytics: string;
  googleTagManager: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'FTS Motors',
    siteDescription: '',
    siteUrl: '',
    siteLogo: '',
    siteFavicon: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    socialFacebook: '',
    socialInstagram: '',
    socialTwitter: '',
    seoDefaultTitle: '',
    seoDefaultDescription: '',
    seoDefaultKeywords: '',
    googleAnalytics: '',
    googleTagManager: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Save to localStorage (in production, save to API)
      localStorage.setItem('siteSettings', JSON.stringify(settings));
      setMessage({ type: 'success', text: 'تنظیمات با موفقیت ذخیره شد' });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'خطا در ذخیره تنظیمات' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">تنظیمات سایت</h1>
        <p className="text-muted-foreground">مدیریت تنظیمات کلی سایت</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">تنظیمات عمومی</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">نام سایت</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">توضیحات سایت</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">آدرس سایت</label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">اطلاعات تماس</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">ایمیل</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">تلفن</label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">آدرس</label>
              <textarea
                value={settings.contactAddress}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">شبکه‌های اجتماعی</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 font-semibold">فیسبوک</label>
              <input
                type="url"
                value={settings.socialFacebook}
                onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">اینستاگرام</label>
              <input
                type="url"
                value={settings.socialInstagram}
                onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">توییتر</label>
              <input
                type="url"
                value={settings.socialTwitter}
                onChange={(e) => setSettings({ ...settings, socialTwitter: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">تنظیمات SEO پیش‌فرض</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold">عنوان پیش‌فرض</label>
              <input
                type="text"
                value={settings.seoDefaultTitle}
                onChange={(e) => setSettings({ ...settings, seoDefaultTitle: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">توضیحات پیش‌فرض</label>
              <textarea
                value={settings.seoDefaultDescription}
                onChange={(e) => setSettings({ ...settings, seoDefaultDescription: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">کلمات کلیدی پیش‌فرض</label>
              <input
                type="text"
                value={settings.seoDefaultKeywords}
                onChange={(e) => setSettings({ ...settings, seoDefaultKeywords: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="کلمه 1, کلمه 2, ..."
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-4">تحلیل و آمار</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">Google Analytics ID</label>
              <input
                type="text"
                value={settings.googleAnalytics}
                onChange={(e) => setSettings({ ...settings, googleAnalytics: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="UA-XXXXXXXXX-X"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Google Tag Manager ID</label>
              <input
                type="text"
                value={settings.googleTagManager}
                onChange={(e) => setSettings({ ...settings, googleTagManager: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="GTM-XXXXXXX"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
          >
            {saving ? '⏳ در حال ذخیره...' : '💾 ذخیره تنظیمات'}
          </button>
        </div>
      </div>
    </div>
  );
}

