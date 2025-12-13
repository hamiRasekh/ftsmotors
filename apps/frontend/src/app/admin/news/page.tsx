'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/news?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNews(data.data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
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
          <h1 className="text-4xl font-bold mb-2">مدیریت اخبار</h1>
          <p className="text-muted-foreground">مدیریت اخبار سایت</p>
        </div>
        <Link
          href="/admin/news/new"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg"
        >
          ➕ افزودن خبر
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-card">
          <p className="text-muted-foreground mb-4">خبری وجود ندارد</p>
          <Link
            href="/admin/news/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            افزودن اولین خبر
          </Link>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-right">عنوان</th>
              <th className="px-4 py-3 text-right">وضعیت</th>
              <th className="px-4 py-3 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3">
                  {item.published ? (
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
                      href={`/admin/news/${item.id}`}
                      className="px-3 py-1 bg-secondary rounded hover:bg-secondary/90"
                    >
                      ویرایش
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
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
      )}
    </div>
  );
}

