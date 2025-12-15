'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/utils';

export default function AdminContactPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/contact?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/contact/${id}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMessages();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (loading) {
    return <div className="text-gray-600">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-8">پیام‌های تماس</h1>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`border border-gray-200 rounded-lg p-6 ${
              !message.read ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-black">{message.subject}</h3>
                <p className="text-sm text-gray-600">
                  از: {message.name} ({message.email})
                  {message.phone && ` - ${message.phone}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
              {!message.read && (
                <span className="px-2 py-1 bg-black text-white rounded text-sm">
                  جدید
                </span>
              )}
            </div>
            <p className="mb-4 text-gray-700">{message.message}</p>
            <div className="flex gap-2">
              {!message.read && (
                <button
                  onClick={() => handleMarkAsRead(message.id)}
                  className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors"
                >
                  علامت‌گذاری به عنوان خوانده شده
                </button>
              )}
              <button
                onClick={() => handleDelete(message.id)}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">پیامی یافت نشد.</p>
          </div>
        )}
      </div>
    </div>
  );
}
