'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/photo_2025-12-28_18-06-14.jpg"
          alt="کشتی حمل خودرو"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-end">
        <div className="max-w-xl w-full sm:w-auto mr-0 sm:mr-8 lg:mr-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 sm:mb-6 text-left"
          >
            <Image
              src="/logos/loho.png"
              alt="فیدار تجارت سوبا"
              width={100}
              height={100}
              className="object-contain h-12 w-auto sm:h-16 md:h-20"
              priority
            />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight text-left"
            dir="rtl"
          >
            شریک شما در تجارت خودرو
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-white/90 mb-5 sm:mb-6 leading-relaxed text-left"
            dir="rtl"
          >
            شما را با بهترین خودروهای لوکس آلمانی و کره‌ای متصل می‌کنیم
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-left"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border-2 border-white text-white rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              دریافت مشاوره
            </Link>
          </motion.div>
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
