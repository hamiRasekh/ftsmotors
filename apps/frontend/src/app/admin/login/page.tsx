'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/utils';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطا در ورود');
      }

      localStorage.setItem('token', data.access_token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-2xl border">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold mb-2">ورود به پنل مدیریت</h1>
          <p className="text-muted-foreground">لطفا اطلاعات خود را وارد کنید</p>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              ایمیل
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="admin@ftsmotors.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-medium">
              رمز عبور
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              در حال ورود...
            </span>
            ) : (
              'ورود'
            )}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>FTS Motors Admin Panel</p>
        </div>
      </div>
    </div>
  );
}
