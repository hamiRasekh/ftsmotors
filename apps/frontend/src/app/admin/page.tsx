'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    cars: 0,
    categories: 0,
    articles: 0,
    news: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [cars, categories, articles, news, messages] = await Promise.all([
          fetch(`${API_URL}/api/cars?limit=1`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/categories`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/articles?limit=1`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/news?limit=1`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/contact?limit=100`, { headers }).then((r) => r.json()),
        ]);

        const unreadMessages = messages.data?.filter((m: any) => !m.read).length || 0;

        setStats({
          cars: cars.total || 0,
          categories: categories.length || 0,
          articles: articles.total || 0,
          news: news.total || 0,
          messages: messages.total || 0,
          unreadMessages,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  const statCards = [
    {
      title: 'خودروها',
      value: stats.cars,
      icon: '🚗',
      href: '/admin/cars',
      color: 'bg-blue-500',
    },
    {
      title: 'دسته‌بندی‌ها',
      value: stats.categories,
      icon: '📁',
      href: '/admin/categories',
      color: 'bg-green-500',
    },
    {
      title: 'مقالات',
      value: stats.articles,
      icon: '📝',
      href: '/admin/articles',
      color: 'bg-purple-500',
    },
    {
      title: 'اخبار',
      value: stats.news,
      icon: '📰',
      href: '/admin/news',
      color: 'bg-orange-500',
    },
    {
      title: 'پیام‌ها',
      value: stats.messages,
      icon: '✉️',
      href: '/admin/contact',
      color: 'bg-red-500',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">داشبورد</h1>
        <p className="text-muted-foreground">خوش آمدید به پنل مدیریت FTS Motors</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="group relative p-6 border rounded-xl hover:shadow-lg transition-all bg-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`text-4xl p-3 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
              {stat.badge && (
                <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                  {stat.badge} جدید
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
            <div className="mt-4 text-sm text-muted-foreground group-hover:text-primary transition-colors">
              مشاهده همه →
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 border rounded-xl bg-card">
          <h2 className="text-2xl font-semibold mb-4">دسترسی سریع</h2>
          <div className="space-y-2">
            <Link
              href="/admin/cars/new"
              className="block p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              ➕ افزودن خودرو جدید
            </Link>
            <Link
              href="/admin/articles/new"
              className="block p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              ➕ افزودن مقاله جدید
            </Link>
            <Link
              href="/admin/news/new"
              className="block p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              ➕ افزودن خبر جدید
            </Link>
            <Link
              href="/admin/categories/new"
              className="block p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              ➕ افزودن دسته‌بندی جدید
            </Link>
          </div>
        </div>

        <div className="p-6 border rounded-xl bg-card">
          <h2 className="text-2xl font-semibold mb-4">اطلاعات سیستم</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">وضعیت API:</span>
              <span className="text-green-600">✓ آنلاین</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">وضعیت دیتابیس:</span>
              <span className="text-green-600">✓ متصل</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">نسخه:</span>
              <span>1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
