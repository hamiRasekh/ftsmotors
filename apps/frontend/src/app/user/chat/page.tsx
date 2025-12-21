'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/utils';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Socket.IO needs full URL without /api prefix
    const socketUrl = SOCKET_URL.replace('/api', '').replace(/\/$/, '');
    const newSocket = io(socketUrl, {
      auth: { token },
    });

    newSocket.on('connect', () => {
      newSocket.emit('chat:join');
    });

    newSocket.on('chat:messages', (data: any) => {
      setMessages(data.reverse());
    });

    newSocket.on('chat:new-message', (data: any) => {
      setMessages((prev) => [...prev, data]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('chat:message', { content: message });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <FadeIn>
        <h1 className="text-4xl font-bold text-primary mb-6">چت آنلاین</h1>
      </FadeIn>

      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-md p-4 rounded-lg ${
                  msg.isAdmin ? 'bg-gray-100' : 'bg-gray-200'
                }`}
              >
                <div className="text-sm text-gray-600 mb-1">
                  {msg.isAdmin ? 'پشتیبانی' : 'شما'}
                </div>
                <p className="text-primary">{msg.content}</p>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString('fa-IR')}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSend} className="flex gap-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <AnimatedButton type="submit" variant="primary" size="md" onClick={() => {}}>
          ارسال
        </AnimatedButton>
      </form>
    </div>
  );
}
