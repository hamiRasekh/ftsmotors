'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FadeIn } from '@/components/animations/FadeIn';

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetchFeedbacks();
  }, [filter]);

  const fetchFeedbacks = async () => {
    try {
      const data = await api.feedbacks.getAll(filter || undefined);
      setFeedbacks(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
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
        <h1 className="text-4xl font-bold text-black mb-8">مدیریت نظرات</h1>
      </FadeIn>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">همه انواع</option>
          <option value="SUGGESTION">پیشنهاد</option>
          <option value="COMPLAINT">انتقاد</option>
        </select>
      </div>

      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  feedback.type === 'SUGGESTION' ? 'bg-gray-200 text-black' : 'bg-gray-300 text-black'
                }`}>
                  {feedback.type === 'SUGGESTION' ? 'پیشنهاد' : 'انتقاد'}
                </span>
                <p className="text-gray-600 text-sm mt-2">{feedback.user?.name || feedback.user?.phone}</p>
              </div>
              {feedback.rating && (
                <div className="text-gray-600">{'⭐'.repeat(feedback.rating)}</div>
              )}
            </div>
            <p className="text-gray-700">{feedback.message}</p>
            <div className="text-sm text-gray-500 mt-2">
              {new Date(feedback.createdAt).toLocaleDateString('fa-IR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
