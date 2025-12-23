'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    image: '/img/slider/download__1_-removebg-preview.png',
    position: 'left', // از چپ می‌آید
  },
  {
    image: '/img/slider/benz_c300_2016-removebg-preview.png',
    position: 'right', // از راست می‌آید
  },
  {
    image: '/img/slider/Get_closer_to_the_road_with_available_All-Wheel_Drive___KiaK5-removebg-preview.png',
    position: 'right', // از راست می‌آید
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

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

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

  return (
    <section className="relative w-full overflow-hidden bg-white" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
      {/* Smoke Effect Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const isPrimary = i % 3 === 0;
          const isSecondary = i % 3 === 1;
          const color = isPrimary 
            ? 'rgba(14, 47, 62, 0.15)' 
            : isSecondary 
            ? 'rgba(154, 124, 100, 0.15)' 
            : 'rgba(25, 104, 134, 0.12)';
          
          return (
            <div
              key={i}
              className="absolute"
              style={{
                width: `${150 + i * 60}px`,
                height: `${300 + i * 100}px`,
                left: `${(i * 8) % 100}%`,
                top: `${(i * 10) % 100}%`,
                background: `radial-gradient(ellipse at center, ${color} 0%, ${color} 30%, transparent 70%)`,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                filter: 'blur(40px)',
                opacity: 0.4,
                animation: `smokeFloat ${25 + i * 3}s ease-in-out infinite`,
                animationDelay: `${i * 2}s`,
                transform: `rotate(${i * 15}deg)`,
              }}
            />
          );
        })}
      </div>

      {/* Car Image - Half out of screen at corners */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`car-${currentSlide}`}
            initial={{ 
              opacity: 0,
              x: currentSlideData.position === 'left' ? '-50%' : '50%',
            }}
            animate={{ 
              opacity: 1,
              x: 0,
            }}
            exit={{ 
              opacity: 0,
              x: currentSlideData.position === 'left' ? '-50%' : '50%',
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
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

      {/* Logo and Text - Center positioned */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6 text-center"
          dir="rtl"
        >
          {/* Logo - Bigger */}
          <Image
            src="/photo_2025-12-08_17-46-46-removebg-preview.png"
            alt="فیدار تجارت سوبا"
            width={180}
            height={180}
            className="object-contain"
            priority
          />

          {/* Company Name */}
          <h1 className="text-4xl md:text-6xl font-bold text-primary" style={{ fontFamily: 'inherit' }}>
            فیدار تجارت سوبا
          </h1>

          {/* Rotating Text - Centered, better font, different color */}
          <div className="h-12 md:h-16 flex items-center justify-center min-w-[250px] md:min-w-[400px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={`text-${currentTextIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-xl md:text-3xl font-semibold text-primary"
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
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-primary'
                : 'w-2 bg-gray-300 hover:bg-secondary'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* CSS for smoke animation */}
      <style jsx>{`
        @keyframes smokeFloat {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          20% {
            transform: translate(60px, -80px) scale(1.2) rotate(10deg);
            opacity: 0.5;
          }
          40% {
            transform: translate(-40px, -120px) scale(0.9) rotate(-8deg);
            opacity: 0.4;
          }
          60% {
            transform: translate(80px, -100px) scale(1.15) rotate(12deg);
            opacity: 0.45;
          }
          80% {
            transform: translate(-20px, -140px) scale(0.95) rotate(-5deg);
            opacity: 0.35;
          }
          100% {
            transform: translate(0, -160px) scale(1) rotate(0deg);
            opacity: 0.2;
          }
        }
      `}</style>
    </section>
  );
}
