'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { FadeIn } from '@/components/animations/FadeIn';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement users API
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-20">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <FadeIn>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">مدیریت کاربران</h1>
      </FadeIn>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-600">صفحه مدیریت کاربران - در حال توسعه</p>
      </div>
    </div>
  );
}

