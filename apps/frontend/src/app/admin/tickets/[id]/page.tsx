'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';

const statusLabels: Record<string, string> = {
  OPEN: 'باز',
  IN_PROGRESS: 'در حال بررسی',
  CLOSED: 'بسته شده',
  RESOLVED: 'حل شده',
};

const statusColors: Record<string, string> = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  RESOLVED: 'bg-green-100 text-green-800',
};

export default function AdminTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchTicket();
      // Auto-refresh every 10 seconds
      const interval = setInterval(() => {
        fetchTicket();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const data = await api.tickets.getOne(params.id as string);
      setTicket(data);
      setStatus(data.status);
    } catch (error: any) {
      console.error('Error fetching ticket:', error);
      setError('خطا در بارگذاری تیکت');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.tickets.update(params.id as string, { status: newStatus });
      setStatus(newStatus);
      await fetchTicket();
    } catch (error: any) {
      setError('خطا در تغییر وضعیت تیکت');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      await api.tickets.addMessage(params.id as string, { content: message });
      setMessage('');
      await fetchTicket();
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">تیکت یافت نشد</p>
        <button
          onClick={() => router.push('/admin/tickets')}
          className="text-primary hover:text-accent"
        >
          بازگشت به لیست تیکت‌ها
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/admin/tickets')}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← بازگشت
        </button>
        <FadeIn>
          <h1 className="text-4xl font-bold text-gray-900">جزئیات تیکت</h1>
        </FadeIn>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          {error}
        </motion.div>
      )}

      {/* Ticket Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>
                <strong>کاربر:</strong> {ticket.user?.name || ticket.user?.phone}
              </span>
              <span>•</span>
              <span>
                <strong>تاریخ ایجاد:</strong> {new Date(ticket.createdAt).toLocaleString('fa-IR')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary ${statusColors[status]}`}
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">پیام‌ها</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {ticket.messages && ticket.messages.length > 0 ? (
            ticket.messages.map((msg: any, index: number) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.isAdmin ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg ${
                  msg.isAdmin
                    ? 'bg-primary/10 border-r-4 border-primary ml-8'
                    : 'bg-gray-50 border-l-4 border-gray-300 mr-8'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${msg.isAdmin ? 'text-primary' : 'text-gray-700'}`}>
                      {msg.isAdmin ? '👤 پشتیبانی' : '👤 کاربر'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleString('fa-IR')}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              هنوز پیامی ارسال نشده است.
            </div>
          )}
        </div>
      </div>

      {/* Reply Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">ارسال پاسخ</h3>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="پاسخ خود را بنویسید..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="flex justify-end">
            <AnimatedButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting || !message.trim()}
            >
              {submitting ? 'در حال ارسال...' : 'ارسال پاسخ'}
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  );
}

