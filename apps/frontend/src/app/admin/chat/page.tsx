'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FadeIn } from '@/components/animations/FadeIn';

export default function AdminChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await api.chat.getMessages(100);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <FadeIn>
        <h1 className="text-4xl font-bold text-black mb-8">مدیریت چت</h1>
      </FadeIn>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-lg ${
              msg.isAdmin ? 'bg-gray-100 mr-8' : 'bg-gray-50 ml-8'
            }`}
          >
            <div className="text-sm text-gray-600 mb-2">
              {msg.isAdmin ? 'پشتیبانی' : msg.user?.name || msg.user?.phone}
            </div>
            <p className="text-black">{msg.content}</p>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(msg.createdAt).toLocaleString('fa-IR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
