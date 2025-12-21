'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'SUGGESTION',
    message: '',
    rating: 5,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const data = await api.feedbacks.getAll();
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.feedbacks.create(formData);
      setSuccess(true);
      setShowForm(false);
      setFormData({ type: 'SUGGESTION', message: '', rating: 5 });
      fetchFeedbacks();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال نظر. لطفاً دوباره تلاش کنید.');
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
            <h1 className="text-4xl font-bold text-primary mb-2">انتقادات و پیشنهادات</h1>
            <p className="text-gray-600">نظرات و پیشنهادات خود را با ما به اشتراک بگذارید</p>
          </div>
        </FadeIn>
        <AnimatedButton onClick={() => setShowForm(!showForm)} variant="primary" size="md">
          {showForm ? 'انصراف' : 'ارسال نظر'}
        </AnimatedButton>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg text-primary"
        >
          ✓ نظر شما با موفقیت ارسال شد. از مشارکت شما سپاسگزاریم!
        </motion.div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">ارسال نظر جدید</h2>
          {error && (
            <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-lg text-primary">
              ✗ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                نوع نظر <span className="text-gray-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="SUGGESTION">پیشنهاد</option>
                <option value="COMPLAINT">انتقاد</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                پیام <span className="text-gray-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="نظر، پیشنهاد یا انتقاد خود را بنویسید..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                امتیاز (1-5) <span className="text-gray-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <div className="text-2xl font-bold text-primary min-w-[3rem] text-center">
                  {formData.rating}
                </div>
                <div className="text-2xl text-gray-400">
                  {'⭐'.repeat(formData.rating)}
                </div>
              </div>
            </div>
            <AnimatedButton type="submit" variant="primary" size="lg" className="w-full" onClick={() => {}}>
              {submitting ? 'در حال ارسال...' : 'ارسال نظر'}
            </AnimatedButton>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <p className="text-gray-600">هنوز نظری ارسال نشده است.</p>
          </div>
        ) : (
          feedbacks.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    feedback.type === 'SUGGESTION' ? 'bg-muted text-primary' : 'bg-secondary text-white'
                  }`}>
                    {feedback.type === 'SUGGESTION' ? 'پیشنهاد' : 'انتقاد'}
                  </span>
                  {feedback.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600 text-sm">امتیاز:</span>
                      <span className="text-gray-600">{'⭐'.repeat(feedback.rating)}</span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{feedback.message}</p>
              {feedback.response && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-primary mb-1">پاسخ مدیریت:</p>
                  <p className="text-gray-600 text-sm">{feedback.response}</p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
