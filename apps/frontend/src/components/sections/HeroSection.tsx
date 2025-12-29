'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface HomeContent {
  tagline: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  logo?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function HeroSection() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api.homeContent.getPublic();
        setContent(data);
      } catch (error) {
        console.error('Error fetching home content:', error);
        // Fallback to default content
        setContent({
          tagline: 'تحقق یک رویا',
          title: 'تحقق یک رویا',
          subtitle: 'شما را با بهترین خودروهای لوکس آلمانی و کره‌ای متصل می‌کنیم',
          backgroundImage: '/photo_2025-12-28_18-06-14.jpg',
          logo: '/logos/loho.png',
          ctaText: 'دریافت مشاوره',
          ctaLink: '/contact',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading || !content) {
    return (
      <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={content.backgroundImage || '/photo_2025-12-28_18-06-14.jpg'}
          alt="کشتی حمل خودرو"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-screen flex items-center" dir="ltr">
        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto flex flex-col items-start justify-start gap-4 sm:gap-6">
          {/* Logo - Top Left */}
          {content.logo && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex justify-start items-start self-start"
            >
              <Image
                src={content.logo}
                alt="فیدار تجارت سوبا"
                width={200}
                height={200}
                className="object-contain h-16 w-auto sm:h-20 md:h-24 lg:h-28"
                priority
              />
            </motion.div>
          )}

          {/* Text Content - Below Logo */}
          <div className="max-w-xl w-full" dir="rtl">
            {/* Tagline */}
            {content.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-base sm:text-lg md:text-xl text-white/90 mb-2 sm:mb-3 leading-relaxed text-left"
                dir="rtl"
              >
                {content.tagline}
              </motion.p>
            )}

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight text-left"
              dir="rtl"
            >
              {content.title}
            </motion.h1>

            {/* Subtitle */}
            {content.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-sm sm:text-base md:text-lg text-white/90 mb-5 sm:mb-6 leading-relaxed text-left"
                dir="rtl"
              >
                {content.subtitle}
              </motion.p>
            )}

            {/* CTA Button */}
            {content.ctaText && content.ctaLink && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="text-left"
              >
                <Link
                  href={content.ctaLink}
                  className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border-2 border-white text-white rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {content.ctaText}
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 bg-white/70 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
