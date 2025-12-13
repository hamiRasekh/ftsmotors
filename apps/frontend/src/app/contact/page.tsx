'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.contact.send(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">تماس با ما</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">اطلاعات تماس</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">آدرس</h3>
                  <p className="text-muted-foreground">
                    تهران، خیابان ولیعصر، پلاک 123
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">تلفن</h3>
                  <p className="text-muted-foreground">021-12345678</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ایمیل</h3>
                  <p className="text-muted-foreground">info@ftsmotors.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ساعات کاری</h3>
                  <p className="text-muted-foreground">
                    شنبه تا پنج‌شنبه: 9:00 - 18:00
                    <br />
                    جمعه: تعطیل
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-6">فرم تماس</h2>
              {success && (
                <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
                  پیام شما با موفقیت ارسال شد!
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-2 font-medium">
                    تلفن (اختیاری)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium">
                    موضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">
                    پیام
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? 'در حال ارسال...' : 'ارسال پیام'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

