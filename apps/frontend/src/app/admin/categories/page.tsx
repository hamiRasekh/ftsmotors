'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCategories();
      } else {
        alert('خطا در حذف دسته‌بندی');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('خطا در حذف دسته‌بندی');
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-muted-foreground">مدیریت دسته‌بندی‌های خودرو</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg"
        >
          ➕ افزودن دسته‌بندی
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-card">
          <p className="text-muted-foreground mb-4">دسته‌بندی‌ای وجود ندارد</p>
          <Link
            href="/admin/categories/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            افزودن اولین دسته‌بندی
          </Link>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-right font-semibold">نام</th>
                <th className="px-6 py-4 text-right font-semibold">Slug</th>
                <th className="px-6 py-4 text-right font-semibold">توضیحات</th>
                <th className="px-6 py-4 text-right font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.id}
                  className={`border-t ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
                >
                  <td className="px-6 py-4 font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-sm">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm"
                      >
                        ✏️ ویرایش
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm"
                      >
                        🗑️ حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
