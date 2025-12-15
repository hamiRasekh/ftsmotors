'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';

const statusColors: Record<string, string> = {
  OPEN: 'bg-gray-200 text-black',
  IN_PROGRESS: 'bg-gray-300 text-black',
  CLOSED: 'bg-gray-100 text-gray-600',
  RESOLVED: 'bg-black text-white',
};

const statusLabels: Record<string, string> = {
  OPEN: 'باز',
  IN_PROGRESS: 'در حال بررسی',
  CLOSED: 'بسته شده',
  RESOLVED: 'حل شده',
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await api.tickets.getAll();
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.tickets.create(formData);
      setSuccess(true);
      setShowForm(false);
      setFormData({ title: '', description: '' });
      fetchTickets();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'خطا در ایجاد تیکت. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <FadeIn>
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">تیکت‌های پشتیبانی</h1>
            <p className="text-gray-600">برای دریافت پشتیبانی، تیکت جدید ایجاد کنید</p>
          </div>
        </FadeIn>
        <AnimatedButton onClick={() => setShowForm(!showForm)} variant="primary" size="md">
          {showForm ? 'انصراف' : 'تیکت جدید'}
        </AnimatedButton>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg text-black"
        >
          ✓ تیکت شما با موفقیت ایجاد شد. ما در اسرع وقت به آن پاسخ خواهیم داد.
        </motion.div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-black mb-6">ایجاد تیکت جدید</h2>
          {error && (
            <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg text-black">
              ✗ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                عنوان تیکت <span className="text-gray-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="عنوان مشکل یا سوال خود را وارد کنید"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                توضیحات <span className="text-gray-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="توضیحات کامل مشکل یا سوال خود را بنویسید..."
              />
            </div>
            <AnimatedButton type="submit" variant="primary" size="lg" className="w-full" onClick={() => {}}>
              {submitting ? 'در حال ایجاد...' : 'ایجاد تیکت'}
            </AnimatedButton>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-600 mb-4">هنوز تیکتی ایجاد نکرده‌اید.</p>
            <AnimatedButton onClick={() => setShowForm(true)} variant="primary" size="md">
              ایجاد اولین تیکت
            </AnimatedButton>
          </div>
        ) : (
          tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/user/tickets/${ticket.id}`}>
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-black">{ticket.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[ticket.status]}`}>
                      {statusLabels[ticket.status]}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 mb-4">{ticket.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>تاریخ: {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</span>
                    {ticket.messages && ticket.messages.length > 0 && (
                      <span>{ticket.messages.length} پیام</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
