'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';

const statusLabels: Record<string, string> = {
  OPEN: 'باز',
  IN_PROGRESS: 'در حال بررسی',
  CLOSED: 'بسته شده',
  RESOLVED: 'حل شده',
};

const statusColors: Record<string, string> = {
  OPEN: 'bg-gray-200 text-black',
  IN_PROGRESS: 'bg-gray-300 text-black',
  CLOSED: 'bg-gray-100 text-gray-600',
  RESOLVED: 'bg-primary text-white',
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const data = await api.tickets.getOne(params.id as string);
      setTicket(data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.tickets.addMessage(params.id as string, { content: message });
      setMessage('');
      fetchTicket();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600">در حال بارگذاری...</div>;
  }

  if (!ticket) {
    return <div className="text-center py-20 text-gray-600">تیکت یافت نشد</div>;
  }

  return (
    <div>
      <FadeIn>
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="text-primary hover:text-accent">
            ← بازگشت
          </button>
          <h1 className="text-4xl font-bold text-primary">{ticket.title}</h1>
        </div>
      </FadeIn>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-sm ${statusColors[ticket.status]}`}>
            {statusLabels[ticket.status]}
          </span>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
      </div>

      <div className="space-y-4 mb-6">
        {ticket.messages?.map((msg: any) => (
          <div
            key={msg.id}
            className={`p-4 rounded-lg ${
              msg.isAdmin ? 'bg-gray-100 mr-8' : 'bg-gray-50 ml-8'
            }`}
          >
            <div className="text-sm text-gray-600 mb-2">
              {msg.isAdmin ? 'پشتیبانی' : 'شما'} - {new Date(msg.createdAt).toLocaleDateString('fa-IR')}
            </div>
            <p className="text-primary">{msg.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="bg-white border border-gray-200 rounded-lg p-6">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="پیام خود را بنویسید..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        />
        <AnimatedButton type="submit" variant="primary" size="md" onClick={() => {}}>
          ارسال پیام
        </AnimatedButton>
      </form>
    </div>
  );
}
