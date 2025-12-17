'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { Car3DViewer } from '@/components/3d/Car3DViewer';

interface CarSlide {
  title: string;
  priceRange: string;
  description: string;
  features: string[];
}

// فقط یک مدل 3D (BMW X2) برای همه اسلایدها
const MODEL_PATH = '/glb/2019_bmw_x2_xdrive20d_m_sport_x.glb';

const carSlides: CarSlide[] = [
  {
    title: 'خودروهای تا 25 هزار دلار',
    priceRange: 'تا 25,000 دلار',
    description: 'خودروهای اقتصادی و مقرون به صرفه با کیفیت بالا و مصرف سوخت بهینه. مناسب برای استفاده روزمره و سفرهای شهری.',
    features: [
      'مصرف سوخت بهینه',
      'قیمت مناسب',
      'قابلیت اطمینان بالا',
      'خدمات پس از فروش کامل',
    ],
  },
  {
    title: 'خودروهای 30 هزار دلار',
    priceRange: 'حدود 30,000 دلار',
    description: 'خودروهای لوکس و مدرن با طراحی جذاب و امکانات پیشرفته. ترکیبی از راحتی، عملکرد و سبک.',
    features: [
      'طراحی مدرن و جذاب',
      'امکانات پیشرفته',
      'عملکرد عالی',
      'کیفیت ساخت بالا',
    ],
  },
  {
    title: 'خودروهای 35 هزار دلار',
    priceRange: 'حدود 35,000 دلار',
    description: 'خودروهای پریمیوم با بهترین تکنولوژی‌ها و امکانات لوکس. انتخابی ایده‌آل برای کسانی که به کیفیت و راحتی اهمیت می‌دهند.',
    features: [
      'تکنولوژی پیشرفته',
      'راحتی و لوکس',
      'عملکرد حرفه‌ای',
      'امنیت بالا',
    ],
  },
  {
    title: 'خودروهای وارداتی',
    priceRange: 'قیمت‌های متنوع',
    description: 'خودروهای وارداتی با کیفیت بالا و گارانتی معتبر. انتخاب گسترده از برندهای معتبر جهانی.',
    features: [
      'کیفیت تضمین شده',
      'گارانتی معتبر',
      'انتخاب گسترده',
      'پشتیبانی کامل',
    ],
  },
];

// Helper function to clamp a value between min and max
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export function Car3DSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rotationValue, setRotationValue] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const totalSlides = carSlides.length;

  // Use Framer Motion's scroll tracking for this section only
  // 'start start' = when section top reaches viewport top (sticky starts)
  // 'end start' = when section bottom reaches viewport top (sticky ends)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Derive rotation from scroll progress using useTransform
  // rotationRadians = progress * (totalSlides - 1) * (Math.PI / 2)
  const rotationMotionValue = useTransform(
    scrollYProgress,
    [0, 1],
    [0, (totalSlides - 1) * (Math.PI / 2)]
  );

  // Subscribe to rotation MotionValue and update state
  useEffect(() => {
    const unsubscribe = rotationMotionValue.on('change', (latest) => {
      setRotationValue(latest);
    });
    return unsubscribe;
  }, [rotationMotionValue]);

  // Derive currentSlide from scrollYProgress with stable mapping
  // Map progress (0..1) to slide index (0..totalSlides-1)
  // Use Math.round for stable mapping to prevent flickering
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const progress = clamp(latest, 0, 1);
    
    // Stable mapping: each slide gets equal portion of progress
    // For 4 slides: [0-0.25) -> 0, [0.25-0.5) -> 1, [0.5-0.75) -> 2, [0.75-1] -> 3
    // Math.round ensures stable transitions at boundaries
    const slideIndex = clamp(Math.round(progress * (totalSlides - 1)), 0, totalSlides - 1);
    
    // Only update state when index actually changes to prevent unnecessary re-renders
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
    }
  });

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
      style={{ 
        height: `${carSlides.length * 100}vh`,
      }}
    >
      {/* Sticky container for 3D model and content - stays fixed while scrolling */}
      <div 
        className="sticky top-0 w-full h-screen flex flex-col lg:flex-row"
        style={{ 
          willChange: 'transform',
          position: 'sticky',
        }}
      >
        {/* 3D Model Container - Left Side (Desktop) / Top (Mobile) */}
        <div 
          className="relative lg:w-1/2 w-full h-[50vh] sm:h-[55vh] lg:h-full z-0 overflow-hidden flex items-center justify-center"
          style={{ willChange: 'transform' }}
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

        {/* Content Container - Right Side (Desktop) / Bottom (Mobile) */}
        <div 
          className="relative w-full lg:w-1/2 h-[50vh] sm:h-[45vh] lg:h-full z-10 overflow-hidden"
          style={{ willChange: 'contents' }}
        >
        <AnimatePresence mode="wait" initial={false}>
        {carSlides.map((slide, index) => 
          index === currentSlide ? (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
            transition={shouldReduceMotion ? { duration: 0 } : { 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute inset-0 h-full flex items-center justify-center bg-transparent"
            style={{ 
              willChange: 'opacity, transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 h-full flex items-center">
              <div className="max-w-2xl mx-auto w-full">
                {/* Text Content */}
                <div className="space-y-4 sm:space-y-5 lg:space-y-8">
                  <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-2 sm:mb-3 lg:mb-4 leading-tight">
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
                        <li
                          key={featureIndex}
                          className="flex items-start gap-2 sm:gap-3 opacity-0 animate-fade-in"
                          style={{ 
                            animationDelay: `${featureIndex * 0.05}s`,
                            animationFillMode: 'forwards'
                          }}
                        >
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-black mt-0.5 sm:mt-1 flex-shrink-0"
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
                          <span className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          ) : null
        )}
        </AnimatePresence>

        </div>
        {/* Slide Indicator */}
        <div 
          className="absolute bottom-3 sm:bottom-4 lg:bottom-8 left-1/2 lg:left-auto lg:right-8 transform -translate-x-1/2 lg:transform-none flex gap-1.5 sm:gap-2 z-20"
          style={{ willChange: 'contents' }}
        >
          {carSlides.map((_, dotIndex) => (
            <div
              key={dotIndex}
              className={`h-2 sm:h-3 rounded-full transition-all duration-200 ease-out ${
                dotIndex === currentSlide
                  ? 'bg-black w-6 sm:w-8'
                  : 'bg-gray-400 w-2 sm:w-3'
              }`}
              aria-label={`اسلاید ${dotIndex + 1}`}
              style={{ 
                willChange: 'width, background-color',
                transform: 'translateZ(0)'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


