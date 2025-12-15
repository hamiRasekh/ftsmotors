'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';

export default function UserDashboard() {
  const [stats, setStats] = useState({
    tickets: 0,
    openTickets: 0,
    feedbacks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tickets, feedbacks] = await Promise.all([
          api.tickets.getAll(),
          api.feedbacks.getAll(),
        ]);

        setStats({
          tickets: tickets.length || 0,
          openTickets: tickets.filter((t: any) => t.status === 'OPEN').length || 0,
          feedbacks: feedbacks.length || 0,
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
    return <div className="text-center py-20 text-gray-600">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <FadeIn>
        <h1 className="text-4xl font-bold text-black mb-8">داشبورد</h1>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="text-3xl mb-2">🎫</div>
          <div className="text-2xl font-bold text-black">{stats.tickets}</div>
          <div className="text-gray-600">کل تیکت‌ها</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="text-3xl mb-2">🔓</div>
          <div className="text-2xl font-bold text-black">{stats.openTickets}</div>
          <div className="text-gray-600">تیکت‌های باز</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="text-3xl mb-2">💡</div>
          <div className="text-2xl font-bold text-black">{stats.feedbacks}</div>
          <div className="text-gray-600">انتقادات و پیشنهادات</div>
        </motion.div>
      </div>
    </div>
  );
}
