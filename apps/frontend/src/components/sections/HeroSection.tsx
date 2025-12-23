'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const rotatingTexts = [
  'نمایندگی رسمی خودرو',
  'خرید و فروش با تضمین کیفیت',
  'خدمات پس از فروش حرفه‌ای',
  'مشاوره رایگان و تخصصی',
];

export function HeroSection() {
  const [animationStage, setAnimationStage] = useState<'logo' | 'company' | 'texts'>('logo');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Handle animation stages
  useEffect(() => {
    // Logo appears first
    const logoTimer = setTimeout(() => {
      setAnimationStage('company');
    }, 2000);

    // Company name appears after logo
    const companyTimer = setTimeout(() => {
      setAnimationStage('texts');
    }, 4000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(companyTimer);
    };
  }, []);

  // Rotate texts every 3.5 seconds
  useEffect(() => {
    if (animationStage !== 'texts') return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [animationStage]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 -mt-12 md:-mt-14">
      {/* Smoke/Fog Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 blur-3xl"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${(i * 15) % 100}%`,
              top: `${(i * 20) % 100}%`,
              background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(200,200,200,0.1) 50%, transparent 100%)`,
              animation: `smokeFloat ${15 + i * 3}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          {/* Logo Animation */}
          <AnimatePresence mode="wait">
            {animationStage === 'logo' && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{
                  duration: 1.5,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="flex justify-center"
              >
                <div className="relative">
                  <Image
                    src="/photo_2025-12-08_17-46-46-removebg-preview.png"
                    alt="فیدار تجارت سوبا"
                    width={300}
                    height={300}
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                  {/* Glow effect around logo */}
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl -z-10 scale-150" />
                </div>
              </motion.div>
            )}

            {/* Company Name */}
            {animationStage === 'company' && (
              <motion.div
                key="company"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex justify-center mb-8"
                >
                  <Image
                    src="/photo_2025-12-08_17-46-46-removebg-preview.png"
                    alt="فیدار تجارت سوبا"
                    width={200}
                    height={200}
                    className="object-contain drop-shadow-2xl"
                  />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-4"
                >
                  فیدار تجارت سوبا
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-xl md:text-2xl text-white/80"
                >
                  نمایندگی رسمی خودرو
                </motion.p>
              </motion.div>
            )}

            {/* Rotating Texts */}
            {animationStage === 'texts' && (
              <motion.div
                key="texts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="flex justify-center mb-8"
                >
                  <Image
                    src="/photo_2025-12-08_17-46-46-removebg-preview.png"
                    alt="فیدار تجارت سوبا"
                    width={180}
                    height={180}
                    className="object-contain drop-shadow-2xl"
                  />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-6"
                >
                  فیدار تجارت سوبا
                </motion.h1>
                <div className="h-20 md:h-24 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentTextIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      className="text-xl md:text-3xl text-white/90 font-medium"
                    >
                      {rotatingTexts[currentTextIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CSS for smoke animation */}
      <style jsx>{`
        @keyframes smokeFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.1;
          }
          25% {
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.2;
          }
          50% {
            transform: translate(-20px, -50px) scale(0.9);
            opacity: 0.15;
          }
          75% {
            transform: translate(40px, -20px) scale(1.05);
            opacity: 0.2;
          }
        }
      `}</style>
    </section>
  );
}

