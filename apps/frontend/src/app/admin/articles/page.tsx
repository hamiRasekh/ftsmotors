'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/articles?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setArticles(data.data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">مدیریت مقالات</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          افزودن مقاله
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-right">عنوان</th>
              <th className="px-4 py-3 text-right">وضعیت</th>
              <th className="px-4 py-3 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t">
                <td className="px-4 py-3">{article.title}</td>
                <td className="px-4 py-3">
                  {article.published ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      منتشر شده
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                      پیش‌نویس
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="px-3 py-1 bg-secondary rounded hover:bg-secondary/90"
                    >
                      ویرایش
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

