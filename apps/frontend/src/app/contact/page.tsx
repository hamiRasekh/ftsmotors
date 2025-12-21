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
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.contact.send(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'آدرس',
      content: 'تهران، خیابان ولیعصر، پلاک 123',
      link: '#',
    },
    {
      icon: '📞',
      title: 'تلفن',
      content: '021-12345678',
      link: 'tel:02112345678',
    },
    {
      icon: '✉️',
      title: 'ایمیل',
      content: 'info@ftsmotors.com',
      link: 'mailto:info@ftsmotors.com',
    },
    {
      icon: '🕐',
      title: 'ساعات کاری',
      content: 'شنبه تا پنجشنبه: 9 صبح تا 6 عصر',
      link: '#',
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
                  تماس با ما
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  ما آماده پاسخگویی به سوالات و درخواست‌های شما هستیم. از طریق فرم زیر یا اطلاعات تماس با ما در ارتباط باشید.
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
                  <h2 className="text-3xl font-bold text-primary mb-8">اطلاعات تماس</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <motion.a
                        key={index}
                        href={info.link}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors block"
                      >
                        <div className="text-3xl">{info.icon}</div>
                        <div>
                          <h3 className="font-bold text-primary mb-1">{info.title}</h3>
                          <p className="text-gray-600">{info.content}</p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                  
                  {/* Map Placeholder */}
                  <div className="mt-8 bg-gray-100 rounded-lg h-64 flex items-center justify-center border border-gray-200">
                    <p className="text-gray-500">نقشه</p>
                  </div>
                </div>
              </SlideIn>

              {/* Contact Form */}
              <SlideIn direction="left">
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                  <h2 className="text-3xl font-bold text-primary mb-8">ارسال پیام</h2>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg text-primary"
                    >
                      ✓ پیام شما با موفقیت ارسال شد! ما در اسرع وقت با شما تماس خواهیم گرفت.
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg text-primary"
                    >
                      ✗ {error}
                    </motion.div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                        نام و نام خانوادگی <span className="text-gray-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="نام و نام خانوادگی خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                        ایمیل <span className="text-gray-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
                        تلفن
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="09123456789"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-primary mb-2">
                        موضوع <span className="text-gray-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="موضوع پیام خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                        پیام <span className="text-gray-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                        placeholder="پیام خود را بنویسید..."
                      />
                    </div>
                    <AnimatedButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => {}}
                    >
                      {loading ? 'در حال ارسال...' : 'ارسال پیام'}
                    </AnimatedButton>
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
