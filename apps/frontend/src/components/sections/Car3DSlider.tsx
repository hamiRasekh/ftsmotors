'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Car3DViewer } from '@/components/3d/Car3DViewer';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CarSlide {
  title: string;
  priceRange: string;
  description: string;
  features: string[];
}

const MODEL_PATH = '/glb/2019_bmw_x2_xdrive20d_m_sport_x.glb';

const carSlides: CarSlide[] = [
  {
    title: 'خودروهای تا 25 هزار دلار',
    priceRange: 'تا 25,000 دلار',
    description:
      'خودروهای اقتصادی و مقرون به صرفه با کیفیت بالا و مصرف سوخت بهینه. مناسب برای استفاده روزمره و سفرهای شهری.',
    features: ['مصرف سوخت بهینه', 'قیمت مناسب', 'قابلیت اطمینان بالا', 'خدمات پس از فروش کامل'],
  },
  {
    title: 'خودروهای 30 هزار دلار',
    priceRange: 'حدود 30,000 دلار',
    description:
      'خودروهای لوکس و مدرن با طراحی جذاب و امکانات پیشرفته. ترکیبی از راحتی، عملکرد و سبک.',
    features: ['طراحی مدرن و جذاب', 'امکانات پیشرفته', 'عملکرد عالی', 'کیفیت ساخت بالا'],
  },
  {
    title: 'خودروهای 35 هزار دلار',
    priceRange: 'حدود 35,000 دلار',
    description:
      'خودروهای پریمیوم با بهترین تکنولوژی‌ها و امکانات لوکس. انتخابی ایده‌آل برای کسانی که به کیفیت و راحتی اهمیت می‌دهند.',
    features: ['تکنولوژی پیشرفته', 'راحتی و لوکس', 'عملکرد حرفه‌ای', 'امنیت بالا'],
  },
  {
    title: 'خودروهای وارداتی',
    priceRange: 'قیمت‌های متنوع',
    description:
      'خودروهای وارداتی با کیفیت بالا و گارانتی معتبر. انتخاب گسترده از برندهای معتبر جهانی.',
    features: ['کیفیت تضمین شده', 'گارانتی معتبر', 'انتخاب گسترده', 'پشتیبانی کامل'],
  },
];

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Note: Only CSS scroll-behavior: smooth found in globals.css. No Lenis/locomotive/ScrollSmoother detected.
// ScrollTrigger works with native scroll, no scrollerProxy needed.

export function Car3DSlider() {
  const shouldReduceMotion = useReducedMotion();
  const totalSlides = carSlides.length;

  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [rotationValue, setRotationValue] = useState(0);

  const rotationMax = useMemo(() => (totalSlides - 1) * (Math.PI / 2), [totalSlides]);

  useLayoutEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const ctx = gsap.context(() => {
      // Calculate end position: each slide takes one viewport height
      const endValue = () => `+=${window.innerHeight * (totalSlides - 1)}`;

      // Create array of snap points for each slide
      const snapPoints = Array.from({ length: totalSlides }, (_, i) => i / (totalSlides - 1));

      // Create ScrollTrigger with pin, scrub, and snap
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: endValue,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.15, max: 0.35 },
          ease: 'power2.out',
        },
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = clamp(self.progress, 0, 1);

          // Calculate rotation continuously
          const rotation = progress * rotationMax;
          setRotationValue(rotation);

          // Calculate slide index - only update state when slide changes
          const slideIndex = clamp(Math.round(progress * (totalSlides - 1)), 0, totalSlides - 1);
          setCurrentSlide((prev) => {
            if (prev !== slideIndex) {
              return slideIndex;
            }
            return prev;
          });
        },
      });
    }, sectionEl);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === sectionEl) {
          trigger.kill();
        }
      });
    };
  }, [rotationMax, totalSlides]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
      style={{
        height: '100vh',
      }}
    >
      <div className="sticky top-0 w-full h-screen flex flex-col lg:flex-row">
        {/* 3D Model */}
        <div
          ref={canvasWrapperRef}
          className="relative lg:w-1/2 w-full h-[50vh] sm:h-[55vh] lg:h-full z-0 overflow-hidden flex items-center justify-center"
          style={{
            touchAction: 'pan-y',
            pointerEvents: 'auto',
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Car3DViewer
              modelPath={MODEL_PATH}
              rotation={rotationValue}
              autoRotate={false}
              scale={1.6}
              position={[0, 0, 0]}
              className="w-full h-full"
              cameraPosition={[0, 0.5, 6]}
              enableControls={false}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative w-full lg:w-1/2 h-[50vh] sm:h-[45vh] lg:h-full z-10 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {carSlides.map(
              (slide, index) =>
                index === currentSlide && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -18 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                    }
                    className="absolute inset-0 h-full flex items-center justify-center bg-transparent"
                    style={{ willChange: 'opacity, transform' }}
                  >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 h-full flex items-center">
                      <div className="max-w-2xl mx-auto w-full">
                        <div className="space-y-4 sm:space-y-5 lg:space-y-8">
                          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                            <div>
                              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-2 sm:mb-3 lg:mb-4 leading-tight">
                                {slide.title}
                              </h2>
                              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 font-semibold mb-4 sm:mb-5 lg:mb-6">
                                {slide.priceRange}
                              </p>
                            </div>

                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                              {slide.description}
                            </p>

                            <ul className="space-y-2 sm:space-y-3 lg:space-y-4">
                              {slide.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                                  <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-0.5 sm:mt-1 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>

        {/* Slide Indicator */}
        <div className="absolute bottom-3 sm:bottom-4 lg:bottom-8 left-1/2 lg:left-auto lg:right-8 transform -translate-x-1/2 lg:transform-none flex gap-1.5 sm:gap-2 z-20">
          {carSlides.map((_, dotIndex) => (
            <div
              key={dotIndex}
              className={`h-2 sm:h-3 rounded-full transition-all duration-200 ease-out ${
                dotIndex === currentSlide ? 'bg-primary w-6 sm:w-8' : 'bg-gray-400 w-2 sm:w-3'
              }`}
              aria-label={`اسلاید ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
