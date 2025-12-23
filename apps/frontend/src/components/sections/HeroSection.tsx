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
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
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

      {/* Car Image - Responsive for mobile */}
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
            } bottom-0 w-[85vw] h-[50vh] sm:h-[55vh] md:w-[60vw] md:h-[80vh]`}
            style={{
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

      {/* Logo and Text - Responsive for mobile, centered, higher on mobile */}
      <div 
        className="absolute top-[15%] sm:top-[20%] md:top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 z-20 w-full max-w-[90vw] md:max-w-5xl px-4"
        dir="rtl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex flex-col gap-2 sm:gap-3 md:gap-6 items-center text-center w-full"
          >
            {/* Logo - Responsive size for mobile */}
            <Image
              src="/photo_2025-12-08_17-46-46-removebg-preview.png"
              alt="فیدار تجارت سوبا"
              width={120}
              height={120}
              className="object-contain w-20 h-20 sm:w-24 sm:h-24 md:w-48 md:h-48"
              priority
            />

            {/* Company Name - Responsive for mobile, bolder and bigger */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold md:font-bold text-primary text-center leading-tight" style={{ fontFamily: 'inherit' }}>
              فیدار تجارت سوبا
            </h1>

            {/* Rotating Text - Responsive for mobile, bolder and bigger */}
            <div className="h-10 sm:h-12 md:h-12 lg:h-16 flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`text-${currentTextIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="text-lg sm:text-xl md:text-xl lg:text-3xl font-bold md:font-semibold text-primary text-center px-2"
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

      {/* Slide Indicators - Responsive for mobile */}
      <div className="absolute bottom-2 sm:bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 sm:h-1.5 md:h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-4 sm:w-6 md:w-8 bg-primary'
                : 'w-1 sm:w-1.5 md:w-2 bg-gray-300 hover:bg-secondary'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
