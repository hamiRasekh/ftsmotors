'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    cars: 0,
    categories: 0,
    articles: 0,
    news: 0,
    messages: 0,
    unreadMessages: 0,
    tickets: 0,
    openTickets: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [cars, categories, articles, news, messages, tickets] = await Promise.all([
          fetch(`${API_URL}/api/cars?limit=1`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/categories`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/articles?limit=1`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/news?limit=1`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/contact?limit=100`, { headers }).then((r) => r.json()),
          fetch(`${API_URL}/api/tickets`, { headers }).then((r) => r.json()).catch(() => ({ data: [] })),
        ]);

        const unreadMessages = messages.data?.filter((m: any) => !m.read).length || 0;
        const openTickets = tickets.data?.filter((t: any) => t.status === 'OPEN').length || 0;

        setStats({
          cars: cars.total || 0,
          categories: categories.length || 0,
          articles: articles.total || 0,
          news: news.total || 0,
          messages: messages.total || 0,
          unreadMessages,
          tickets: tickets.data?.length || 0,
          openTickets,
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Information Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">اطلاعات کلی</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="text-4xl font-bold text-black mb-2">{stats.cars + stats.articles + stats.news}</div>
            <div className="text-gray-600">کل آیتم‌ها</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-black mb-2">{stats.openTickets}</div>
            <div className="text-gray-600">تیکت‌های باز</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-black mb-2">{stats.unreadMessages}</div>
            <div className="text-gray-600">پیام‌های خوانده نشده</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl">🚗</span>
            </div>
            <div>
              <div className="font-semibold text-black">{stats.cars}</div>
              <div className="text-sm text-gray-600">خودرو</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
            <div>
              <div className="font-semibold text-black">{stats.articles}</div>
              <div className="text-sm text-gray-600">در حال بررسی</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <div className="font-semibold text-black">{stats.news}</div>
              <div className="text-sm text-gray-600">تکمیل شده</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'خودروها', value: stats.cars, icon: '🚗', href: '/admin/cars' },
          { title: 'مقالات', value: stats.articles, icon: '📝', href: '/admin/articles' },
          { title: 'اخبار', value: stats.news, icon: '📰', href: '/admin/news' },
          { title: 'تیکت‌ها', value: stats.tickets, icon: '🎫', href: '/admin/tickets' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={stat.href}>
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-black mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.title}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold text-black mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'افزودن خودرو', href: '/admin/cars/new', icon: '➕' },
            { title: 'افزودن مقاله', href: '/admin/articles/new', icon: '📝' },
            { title: 'افزودن خبر', href: '/admin/news/new', icon: '📰' },
            { title: 'افزودن دسته‌بندی', href: '/admin/categories/new', icon: '📁' },
          ].map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium text-black text-center">{action.title}</div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
