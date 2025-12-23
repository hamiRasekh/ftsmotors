'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    image: '/img/slider/download__1_-removebg-preview.png',
    position: 'left', // عکس در چپ
    entryDirection: 'left', // از چپ می‌آید
  },
  {
    image: '/img/slider/benz_c300_2016-removebg-preview.png',
    position: 'right', // عکس در راست
    entryDirection: 'right', // از راست می‌آید
  },
  {
    image: '/img/slider/Get_closer_to_the_road_with_available_All-Wheel_Drive___KiaK5-removebg-preview.png',
    position: 'right', // عکس در راست
    entryDirection: 'right', // از راست می‌آید
  },
];

const rotatingTexts = [
  'نمایندگی رسمی خودرو',
  'خرید و فروش با تضمین کیفیت',
  'خدمات پس از فروش حرفه‌ای',
  'مشاوره رایگان و تخصصی',
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Auto-rotate slides every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Rotate texts every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const currentSlideData = slides[currentSlide];
  const isLeftPosition = currentSlideData.position === 'left';
  // متن باید سمت مخالف عکس باشد: اگر عکس چپ است، متن راست باشد
  const textPosition = isLeftPosition ? 'right' : 'left';

  // محاسبه جهت انیمیشن عکس - فقط از چپ و راست
  const getCarInitialPosition = () => {
    const direction = currentSlideData.entryDirection;
    // فقط از چپ یا راست می‌آید
    if (direction === 'left') {
      return { x: '-50%', y: 0, opacity: 0 };
    } else if (direction === 'right') {
      return { x: '50%', y: 0, opacity: 0 };
    }
    // به صورت پیش‌فرض از همان طرف position
    return { x: currentSlideData.position === 'left' ? '-50%' : '50%', y: 0, opacity: 0 };
  };

  const getCarExitPosition = () => {
    const direction = currentSlideData.entryDirection;
    // فقط از چپ یا راست می‌رود
    if (direction === 'left') {
      return { x: '-50%', y: 0, opacity: 0 };
    } else if (direction === 'right') {
      return { x: '50%', y: 0, opacity: 0 };
    }
    // به صورت پیش‌فرض به همان طرف position
    return { x: currentSlideData.position === 'left' ? '-50%' : '50%', y: 0, opacity: 0 };
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/Download Beautiful green color gradient background for free.jpeg"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Car Image - Half out of screen at corners, only from left or right */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`car-${currentSlide}`}
            initial={getCarInitialPosition()}
            animate={{ 
              opacity: 1,
              x: 0,
              y: 0,
            }}
            exit={getCarExitPosition()}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className={`absolute ${
              currentSlideData.position === 'left' 
                ? 'left-0' 
                : 'right-0'
            } bottom-0`}
            style={{
              width: '60vw',
              height: '80vh',
              [currentSlideData.position === 'left' ? 'left' : 'right']: 0,
            }}
          >
            <Image
              src={currentSlideData.image}
              alt="Car"
              fill
              className={`object-contain ${
                currentSlideData.position === 'left' 
                  ? 'object-left-bottom' 
                  : 'object-right-bottom'
              }`}
              priority={currentSlide === 0}
              style={{
                objectPosition: currentSlideData.position === 'left' 
                  ? 'left bottom' 
                  : 'right bottom',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Logo and Text - Opposite side of car, center-aligned */}
      <div 
        className={`absolute top-1/2 transform -translate-y-1/2 z-20 w-full max-w-5xl px-4 ${
          textPosition === 'right' ? 'right-4 md:right-16' : 'left-4 md:left-16'
        }`}
        dir="rtl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex flex-col gap-4 md:gap-6 items-center text-center"
          >
            {/* Logo - Responsive size */}
            <Image
              src="/photo_2025-12-08_17-46-46-removebg-preview.png"
              alt="فیدار تجارت سوبا"
              width={120}
              height={120}
              className="object-contain w-24 h-24 md:w-48 md:h-48"
              priority
            />

            {/* Company Name - Responsive, center-aligned */}
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-primary text-center" style={{ fontFamily: 'inherit' }}>
              فیدار تجارت سوبا
            </h1>

            {/* Rotating Text - Responsive, center-aligned, fade only (no slide) */}
            <div className="h-8 md:h-12 lg:h-16 flex items-center justify-center min-w-[200px] md:min-w-[300px] lg:min-w-[400px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`text-${currentTextIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="text-base md:text-xl lg:text-3xl font-semibold text-primary text-center"
                  style={{ 
                    fontFamily: 'inherit',
                    letterSpacing: '0.5px',
                  }}
                >
                  {rotatingTexts[currentTextIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators - Responsive */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-6 md:w-8 bg-primary'
                : 'w-1.5 md:w-2 bg-gray-300 hover:bg-secondary'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
