'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
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

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await api.tickets.getAll(filter || undefined);
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ticket.title.toLowerCase().includes(query) ||
      ticket.description.toLowerCase().includes(query) ||
      ticket.user?.phone?.includes(query) ||
      ticket.user?.name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div>
      <FadeIn>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">مدیریت تیکت‌ها</h1>
            <p className="text-gray-600">تعداد کل تیکت‌ها: {tickets.length}</p>
          </div>
        </div>
      </FadeIn>

      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در تیکت‌ها..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="OPEN">باز</option>
          <option value="IN_PROGRESS">در حال بررسی</option>
          <option value="CLOSED">بسته شده</option>
          <option value="RESOLVED">حل شده</option>
        </select>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-600">
            {searchQuery ? 'تیکتی با این جستجو یافت نشد.' : 'هنوز تیکتی وجود ندارد.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Link href={`/admin/tickets/${ticket.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors mb-2">
                      {ticket.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{ticket.user?.name || ticket.user?.phone}</span>
                    <span>•</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</span>
                    {ticket.messages && ticket.messages.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-primary font-medium">
                          {ticket.messages.length} پیام
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${statusColors[ticket.status]}`}>
                  {statusLabels[ticket.status]}
                </span>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-2">{ticket.description}</p>
              <div className="flex justify-between items-center">
                <Link
                  href={`/admin/tickets/${ticket.id}`}
                  className="text-primary hover:text-accent font-medium transition-colors"
                >
                  مشاهده و پاسخ →
                </Link>
                <span className="text-xs text-gray-500">
                  آخرین به‌روزرسانی: {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

