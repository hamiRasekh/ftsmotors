'use client';

import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/animations/FadeIn';
import { SlideIn } from '@/components/animations/SlideIn';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { StaggerItem } from '@/components/animations/StaggerItem';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

const values = [
  {
    icon: '🎯',
    title: 'تجربه و تخصص',
    description: 'بیش از 20 سال تجربه در زمینه خرید و فروش خودرو',
  },
  {
    icon: '🛡️',
    title: 'گارانتی و تضمین',
    description: 'تمامی خودروهای ما با گارانتی و تضمین کیفیت ارائه می‌شوند',
  },
  {
    icon: '🔧',
    title: 'خدمات پس از فروش',
    description: 'خدمات پس از فروش کامل و پشتیبانی 24/7',
  },
  {
    icon: '💰',
    title: 'قیمت‌های منصفانه',
    description: 'بهترین قیمت‌ها با شفافیت کامل در معاملات',
  },
];

const timeline = [
  { year: '2000', title: 'تأسیس', description: 'شروع فعالیت با هدف ارائه بهترین خدمات' },
  { year: '2005', title: 'گسترش', description: 'افزایش تعداد خودروها و خدمات' },
  { year: '2010', title: 'نوآوری', description: 'پیاده‌سازی سیستم‌های مدرن' },
  { year: '2020', title: 'تحول دیجیتال', description: 'راه‌اندازی پلتفرم آنلاین' },
  { year: '2024', title: 'پیشرو', description: 'یکی از برترین نمایندگی‌های کشور' },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                  درباره ما
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  FTS Motors با بیش از 20 سال تجربه، یکی از معتبرترین نمایندگی‌های خودرو در کشور است. ما با تکیه بر تجربه و تخصص تیم خود، همواره تلاش کرده‌ایم تا بهترین خودروها را با مناسب‌ترین قیمت‌ها به مشتریان خود ارائه دهیم.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* History Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <SlideIn direction="right">
                <div>
                  <h2 className="text-4xl font-bold text-black mb-6">تاریخچه شرکت</h2>
                  <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                    <p>
                      FTS Motors در سال 2000 با هدف ارائه بهترین خدمات در زمینه خرید و فروش خودرو
                      تأسیس شد. ما با بیش از 20 سال تجربه، یکی از معتبرترین نمایندگی‌های خودرو در
                      کشور هستیم.
                    </p>
                    <p>
                      ما با تکیه بر تجربه و تخصص تیم خود، همواره تلاش کرده‌ایم تا بهترین خودروها را
                      با مناسب‌ترین قیمت‌ها به مشتریان خود ارائه دهیم.
                    </p>
                    <p>
                      امروز، FTS Motors با داشتن تیمی متخصص و مجرب، آماده ارائه خدمات با کیفیت به تمامی مشتریان عزیز است.
                    </p>
                  </div>
                  <div className="mt-8">
                    <Link
                      href="/contact"
                      className="inline-block px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                    >
                      تماس با ما
                    </Link>
                  </div>
                </div>
              </SlideIn>
              <SlideIn direction="left">
                <div className="relative h-96 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/img/pexels-highervibration-10573462.jpg"
                    alt="تاریخچه شرکت"
                    fill
                    className="object-cover grayscale"
                  />
                </div>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <FadeIn>
              <h2 className="text-4xl font-bold text-black mb-12 text-center">خط زمانی ما</h2>
            </FadeIn>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300 hidden lg:block"></div>
              <StaggerContainer className="space-y-12">
                {timeline.map((item, index) => (
                  <StaggerItem key={index}>
                    <div className={`flex items-center ${index % 2 === 0 ? 'flex-row lg:flex-row' : 'flex-row-reverse lg:flex-row-reverse'}`}>
                      <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8 text-right' : 'lg:pl-8 text-left'}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="text-2xl font-bold text-black mb-2">{item.year}</div>
                          <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </motion.div>
                      </div>
                      <div className="hidden lg:block relative z-10 w-4 h-4 bg-black rounded-full border-4 border-white"></div>
                      <div className="hidden lg:block w-1/2"></div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                  چرا ما را انتخاب کنید؟
                </h2>
                <p className="text-xl text-gray-600">ارزش‌های ما</p>
              </div>
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <StaggerItem key={index}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white border border-gray-200 rounded-lg p-8 hover:bg-gray-50 transition-all duration-300 text-center h-full"
                  >
                    <div className="text-5xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-bold text-black mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">ماموریت ما</h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  ماموریت ما ارائه خدمات با کیفیت و رضایت کامل مشتریان است. ما متعهد هستیم که:
                </p>
                <ul className="text-right space-y-4 text-lg max-w-2xl mx-auto">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>بهترین خودروها را با تضمین کیفیت ارائه دهیم</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>خدمات پس از فروش عالی ارائه کنیم</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>قیمت‌های منصفانه و شفاف داشته باشیم</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>رضایت مشتری را در اولویت قرار دهیم</span>
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
