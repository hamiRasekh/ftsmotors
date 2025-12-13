'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/utils';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { StaggerItem } from '@/components/animations/StaggerItem';
import { motion } from 'framer-motion';

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

  const statCards = [
    {
      title: 'خودروها',
      value: stats.cars,
      icon: '🚗',
      color: 'bg-blue-500',
      href: '/admin/cars',
    },
    {
      title: 'دسته‌بندی‌ها',
      value: stats.categories,
      icon: '📁',
      color: 'bg-green-500',
      href: '/admin/categories',
    },
    {
      title: 'مقالات',
      value: stats.articles,
      icon: '📝',
      color: 'bg-purple-500',
      href: '/admin/articles',
    },
    {
      title: 'اخبار',
      value: stats.news,
      icon: '📰',
      color: 'bg-orange-500',
      href: '/admin/news',
    },
    {
      title: 'پیام‌ها',
      value: stats.messages,
      icon: '✉️',
      color: 'bg-red-500',
      href: '/admin/contact',
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
    },
  ];

  const quickActions = [
    { title: 'افزودن خودرو', href: '/admin/cars/new', icon: '➕' },
    { title: 'افزودن مقاله', href: '/admin/articles/new', icon: '📝' },
    { title: 'افزودن خبر', href: '/admin/news/new', icon: '📰' },
    { title: 'افزودن دسته‌بندی', href: '/admin/categories/new', icon: '📁' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <FadeIn>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">داشبورد</h1>
      </FadeIn>

      {/* Stats Cards */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StaggerItem key={index}>
            <Link href={stat.href}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative"
              >
                {stat.badge && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stat.badge}
                  </span>
                )}
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.title}</div>
              </motion.div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Quick Actions */}
      <FadeIn delay={0.3}>
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">دسترسی سریع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href={action.href}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <div className="font-semibold text-gray-900">{action.title}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Recent Activity */}
      <FadeIn delay={0.4}>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">فعالیت‌های اخیر</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">📊</div>
              <div>
                <div className="font-semibold text-gray-900">آمار به‌روزرسانی شد</div>
                <div className="text-sm text-gray-600">هم اکنون</div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
