'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const statusLabels: Record<string, string> = {
  OPEN: 'باز',
  IN_PROGRESS: 'در حال بررسی',
  CLOSED: 'بسته شده',
  RESOLVED: 'حل شده',
};

const statusColors: Record<string, string> = {
  OPEN: 'bg-gray-200 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  CLOSED: 'bg-gray-100 text-gray-600',
  RESOLVED: 'bg-green-100 text-green-800',
};

export default function FeedbackPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicketData, setNewTicketData] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchTickets();
    }
  }, []);

  useEffect(() => {
    // Auto-refresh tickets every 30 seconds if authenticated
    if (isAuthenticated && !selectedTicket) {
      const interval = setInterval(() => {
        fetchTickets();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, selectedTicket]);

  const fetchTickets = async () => {
    try {
      setRefreshing(true);
      const data = await api.tickets.getAll();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
        // Token expired, logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const data = await api.tickets.getOne(ticketId);
      setSelectedTicket(data);
    } catch (error: any) {
      console.error('Error fetching ticket:', error);
      setError('خطا در بارگذاری تیکت');
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Format phone number
      let formattedPhone = phone.trim().replace(/\s+/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = formattedPhone.substring(1);
      }

      await api.auth.sendOTP(formattedPhone);
      setOtpSent(true);
      setPhone(formattedPhone);
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال کد تایید. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await api.auth.verifyOTP(phone, otpCode);
      
      // Store token and user info
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      setIsAuthenticated(true);
      setOtpSent(false);
      setOtpCode('');
      await fetchTickets();
    } catch (err: any) {
      setError(err.message || 'کد تایید نامعتبر است. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.tickets.create(newTicketData);
      setShowNewTicketForm(false);
      setNewTicketData({ title: '', description: '' });
      await fetchTickets();
    } catch (err: any) {
      setError(err.message || 'خطا در ایجاد تیکت. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedTicket) return;

    setSubmitting(true);
    setError('');

    try {
      await api.tickets.addMessage(selectedTicket.id, { content: message });
      setMessage('');
      await fetchTicketDetails(selectedTicket.id);
      await fetchTickets();
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setTickets([]);
    setSelectedTicket(null);
    setPhone('');
    setOtpSent(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-16">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-md mx-auto">
              <FadeIn>
                <h1 className="text-4xl font-bold text-primary mb-6 text-center">
                  انتقادات و پیشنهادات
                </h1>
                <p className="text-gray-600 text-center mb-8">
                  برای ارسال تیکت و ارتباط با پشتیبانی، لطفاً وارد شوید
                </p>
              </FadeIn>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                >
                  {error}
                </motion.div>
              )}

              {!otpSent ? (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSendOTP}
                  className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg"
                >
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شماره موبایل
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09123456789"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
                  </AnimatedButton>
                </motion.form>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleVerifyOTP}
                  className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg"
                >
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      کد تایید به شماره <strong>{phone}</strong> ارسال شد.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                        setError('');
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      تغییر شماره موبایل
                    </button>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      کد تایید (6 رقم)
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtpCode(value);
                      }}
                      placeholder="123456"
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                    />
                  </div>
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading || otpCode.length !== 6}
                  >
                    {loading ? 'در حال تایید...' : 'تایید و ورود'}
                  </AnimatedButton>
                </motion.form>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <FadeIn>
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">انتقادات و پیشنهادات</h1>
                <p className="text-gray-600">تیکت‌های خود را مشاهده و مدیریت کنید</p>
              </div>
            </FadeIn>
            <div className="flex gap-3">
              <AnimatedButton
                onClick={() => {
                  setShowNewTicketForm(true);
                  setSelectedTicket(null);
                }}
                variant="primary"
                size="md"
              >
                تیکت جدید
              </AnimatedButton>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
              >
                خروج
              </button>
            </div>
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

          {showNewTicketForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-8 mb-8 shadow-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">ایجاد تیکت جدید</h2>
                <button
                  onClick={() => {
                    setShowNewTicketForm(false);
                    setNewTicketData({ title: '', description: '' });
                    setError('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان تیکت <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTicketData.title}
                    onChange={(e) => setNewTicketData({ ...newTicketData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="عنوان تیکت خود را وارد کنید"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newTicketData.description}
                    onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="توضیحات تیکت خود را بنویسید..."
                  />
                </div>
                <div className="flex gap-3">
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting ? 'در حال ایجاد...' : 'ایجاد تیکت'}
                  </AnimatedButton>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewTicketForm(false);
                      setNewTicketData({ title: '', description: '' });
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {selectedTicket ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-2">{selectedTicket.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedTicket.status]}`}>
                    {statusLabels[selectedTicket.status]}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedTicket(null);
                    setMessage('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕ بستن
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {selectedTicket.messages?.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg ${
                      msg.isAdmin
                        ? 'bg-primary/10 border-r-4 border-primary mr-8'
                        : 'bg-gray-50 border-l-4 border-gray-300 ml-8'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm font-medium ${msg.isAdmin ? 'text-primary' : 'text-gray-700'}`}>
                        {msg.isAdmin ? 'پشتیبانی' : 'شما'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString('fa-IR')}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="border-t border-gray-200 pt-6">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="پیام خود را بنویسید..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4 resize-none"
                />
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={submitting || !message.trim()}
                >
                  {submitting ? 'در حال ارسال...' : 'ارسال پیام'}
                </AnimatedButton>
              </form>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {refreshing && (
                <div className="text-center py-4 text-gray-500">در حال به‌روزرسانی...</div>
              )}
              {tickets.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                  <p className="text-gray-600 mb-4">هنوز تیکتی ایجاد نکرده‌اید.</p>
                  <AnimatedButton
                    onClick={() => setShowNewTicketForm(true)}
                    variant="primary"
                    size="md"
                  >
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
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => fetchTicketDetails(ticket.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-primary mb-2">{ticket.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${statusColors[ticket.status]}`}>
                        {statusLabels[ticket.status]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>
                        {ticket.messages?.length > 0 && (
                          <span className="text-primary font-medium">
                            {ticket.messages.length} پیام
                          </span>
                        )}
                      </span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString('fa-IR')}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

