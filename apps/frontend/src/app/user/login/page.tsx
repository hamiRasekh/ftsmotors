'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await api.auth.login({
          phone: formData.phone,
          password: formData.password,
        });
      } else {
        response = await api.auth.register({
          phone: formData.phone,
          password: formData.password,
          name: formData.name || undefined,
          email: formData.email || undefined,
        });
      }

      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        router.push('/user/dashboard');
      } else {
        setError('خطا در ورود یا ثبت‌نام');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در ورود یا ثبت‌نام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <FadeIn>
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg"
          >
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/photo_2025-12-08_17-46-46-removebg-preview.png"
                  alt="فیدار تجارت سوبا"
                  width={64}
                  height={64}
                  className="mx-auto"
                />
              </Link>
              <h1 className="text-3xl font-bold text-primary mb-2">
                {isLogin ? 'ورود به حساب کاربری' : 'ثبت‌نام'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? 'به حساب کاربری خود وارد شوید' : 'حساب کاربری جدید ایجاد کنید'}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg text-primary text-sm"
              >
                ✗ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-primary mb-2">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="نام خود را وارد کنید"
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  شماره موبایل <span className="text-gray-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="09123456789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-primary mb-2">
                    ایمیل (اختیاری)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="example@email.com"
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  رمز عبور <span className="text-gray-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="رمز عبور خود را وارد کنید"
                />
              </div>

              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {}}
              >
                {loading ? 'در حال پردازش...' : isLogin ? 'ورود' : 'ثبت‌نام'}
              </AnimatedButton>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ phone: '', password: '', name: '', email: '' });
                }}
                className="text-primary hover:text-accent underline text-sm"
              >
                {isLogin ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید'}
              </button>
            </div>
          </motion.div>
        </div>
      </FadeIn>
    </div>
  );
}
