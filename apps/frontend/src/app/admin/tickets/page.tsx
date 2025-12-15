'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';

const statusLabels: Record<string, string> = {
  OPEN: 'باز',
  IN_PROGRESS: 'در حال بررسی',
  CLOSED: 'بسته شده',
  RESOLVED: 'حل شده',
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      const data = await api.tickets.getAll(filter || undefined);
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.tickets.update(id, { status });
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-20">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <FadeIn>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">مدیریت تیکت‌ها</h1>
      </FadeIn>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="OPEN">باز</option>
          <option value="IN_PROGRESS">در حال بررسی</option>
          <option value="CLOSED">بسته شده</option>
          <option value="RESOLVED">حل شده</option>
        </select>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{ticket.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{ticket.user?.name || ticket.user?.phone}</p>
              </div>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-gray-700 mb-4">{ticket.description}</p>
            <div className="text-sm text-gray-500">
              {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

