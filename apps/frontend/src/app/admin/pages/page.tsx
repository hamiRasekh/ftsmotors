'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false }) as any;
import 'react-quill/dist/quill.snow.css';

export default function AdminPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    isPublished: false,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const data = await api.pages.getAll();
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPage) {
        await api.pages.update(editingPage.id, formData);
      } else {
        await api.pages.create(formData);
      }
      setShowForm(false);
      setEditingPage(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        isPublished: false,
      });
      fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      seoTitle: page.seoTitle || '',
      seoDescription: page.seoDescription || '',
      seoKeywords: page.seoKeywords || '',
      isPublished: page.isPublished,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('آیا مطمئن هستید؟')) {
      try {
        await api.pages.delete(id);
        fetchPages();
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <FadeIn>
          <h1 className="text-4xl font-bold text-gray-900">مدیریت صفحات</h1>
        </FadeIn>
        <AnimatedButton onClick={() => setShowForm(!showForm)} variant="primary" size="md">
          {showForm ? 'انصراف' : 'صفحه جدید'}
        </AnimatedButton>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">محتوا</label>
              <ReactQuill
                value={formData.content}
                onChange={(value: string) => setFormData({ ...formData, content: value })}
                theme="snow"
                className="bg-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                <input
                  type="text"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords</label>
                <input
                  type="text"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <span>منتشر شده</span>
              </label>
            </div>
            <AnimatedButton type="submit" variant="primary" size="md" onClick={() => {}}>
              {editingPage ? 'ذخیره تغییرات' : 'ایجاد صفحه'}
            </AnimatedButton>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{page.title}</h3>
                <p className="text-gray-600 text-sm">/{page.slug}</p>
                <span className={`px-3 py-1 rounded-full text-sm mt-2 inline-block ${
                  page.isPublished ? 'bg-black text-white' : 'bg-gray-200 text-black'
                }`}>
                  {page.isPublished ? 'منتشر شده' : 'پیش‌نویس'}
                </span>
              </div>
              <div className="flex gap-2">
                <AnimatedButton onClick={() => handleEdit(page)} variant="outline" size="sm">
                  ویرایش
                </AnimatedButton>
                <AnimatedButton onClick={() => handleDelete(page.id)} variant="secondary" size="sm">
                  حذف
                </AnimatedButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

