'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/animations/FadeIn';
import { SlideIn } from '@/components/animations/SlideIn';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { motion } from 'framer-motion';
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
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'آدرس',
      content: 'تهران، خیابان ولیعصر، پلاک 123',
    },
    {
      icon: '📞',
      title: 'تلفن',
      content: '021-12345678',
    },
    {
      icon: '✉️',
      title: 'ایمیل',
      content: 'info@ftsmotors.com',
    },
    {
      icon: '🕐',
      title: 'ساعات کاری',
      content: 'شنبه تا پنجشنبه: 9 صبح تا 6 عصر',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                  تماس با ما
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  ما آماده پاسخگویی به سوالات و درخواست‌های شما هستیم
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <SlideIn direction="right">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">اطلاعات تماس</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ x: 10 }}
                        className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-3xl">{info.icon}</div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                          <p className="text-gray-600">{info.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </SlideIn>

              {/* Contact Form */}
              <SlideIn direction="left">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">ارسال پیام</h2>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
                    >
                      پیام شما با موفقیت ارسال شد!
                    </motion.div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        نام و نام خانوادگی
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        ایمیل
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        تلفن
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        موضوع
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        پیام
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                      />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AnimatedButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={() => {}}
                      >
                        {loading ? 'در حال ارسال...' : 'ارسال پیام'}
                      </AnimatedButton>
                    </motion.div>
                  </form>
                </div>
              </SlideIn>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
