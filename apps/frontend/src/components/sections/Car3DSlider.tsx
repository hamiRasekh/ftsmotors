'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export function Car3DSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const [rotation, setRotation] = useState(0);

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;

      // Calculate which slide should be active based on scroll position
      const slideIndex = Math.round(scrollPercentage * (carSlides.length - 1));
      const newSlide = Math.max(0, Math.min(carSlides.length - 1, slideIndex));

      if (newSlide !== currentSlide) {
        setCurrentSlide(newSlide);
      }

      // Calculate rotation based on scroll - هر اسلاید 90 درجه (π/2) می‌چرخد
      const newRotation = scrollPercentage * (carSlides.length - 1) * (Math.PI / 2);
      setRotation(newRotation);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [currentSlide]);

  // Snap to slide on scroll end
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScrollEnd = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
        const slideIndex = Math.round(scrollPercentage * (carSlides.length - 1));
        const targetSlide = Math.max(0, Math.min(carSlides.length - 1, slideIndex));

        // Smooth scroll to slide
        const slideHeight = scrollHeight / carSlides.length;
        const targetScroll = targetSlide * slideHeight;

        container.scrollTo({
          top: targetScroll,
          behavior: 'smooth',
        });
      }, 150);
    };

    container.addEventListener('scroll', handleScrollEnd, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScrollEnd);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);


  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="relative w-full h-full flex flex-col lg:flex-row">
        {/* 3D Model Container - Left Side (Desktop) / Top (Mobile) */}
        <div className="absolute lg:relative lg:w-1/2 w-full h-[50vh] lg:h-full z-0 overflow-hidden">
          <div className="relative w-full h-full">
            <Car3DViewer
              modelPath={MODEL_PATH}
              rotation={rotation}
              autoRotate={false}
              scale={1.3}
              position={[0, -0.5, 0]}
              className="w-full h-full"
              cameraPosition={[0, 1.5, 6]}
              enableControls={false}
            />
          </div>
        </div>

        {/* Scrollable Content - Right Side (Desktop) / Bottom (Mobile) */}
        <section
          ref={containerRef}
          className="relative w-full lg:w-1/2 h-[50vh] lg:h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth z-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
        <style jsx>{`
          section::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {carSlides.map((slide, index) => (
          <div
            key={index}
            className="h-[50vh] lg:h-screen snap-start snap-always flex items-center justify-center bg-transparent"
          >
            <div className="container mx-auto px-4 py-12 lg:px-8">
              <div className="max-w-2xl mx-auto">
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{
                    opacity: index === currentSlide ? 1 : 0.3,
                    x: index === currentSlide ? 0 : 50,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="space-y-6 lg:space-y-8"
                >
                  <AnimatePresence mode="wait">
                    {index === currentSlide && (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 leading-tight">
                            {slide.title}
                          </h2>
                          <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-6">
                            {slide.priceRange}
                          </p>
                        </div>

                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                          {slide.description}
                        </p>

                        <ul className="space-y-4">
                          {slide.features.map((feature, featureIndex) => (
                            <motion.li
                              key={featureIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: featureIndex * 0.1, duration: 0.4 }}
                              className="flex items-start gap-3"
                            >
                              <svg
                                className="w-6 h-6 text-black mt-1 flex-shrink-0"
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
                              <span className="text-gray-700 text-base md:text-lg">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicator */}
        <div className="absolute bottom-4 lg:bottom-8 left-1/2 lg:left-auto lg:right-8 transform -translate-x-1/2 lg:transform-none flex gap-2 z-20">
          {carSlides.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => {
                const container = containerRef.current;
                if (container) {
                  const slideHeight = container.scrollHeight / carSlides.length;
                  container.scrollTo({
                    top: dotIndex * slideHeight,
                    behavior: 'smooth',
                  });
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                dotIndex === currentSlide
                  ? 'bg-black w-8'
                  : 'bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`اسلاید ${dotIndex + 1}`}
            />
          ))}
        </div>
      </section>
      </div>
    </section>
  );
}

