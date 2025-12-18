'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Car3DViewer } from '@/components/3d/Car3DViewer';

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

// Helper to get absolute Y position of element
const getAbsY = (el: HTMLElement): number => {
  return el.getBoundingClientRect().top + window.scrollY;
};

export function Car3DSlider() {
  const shouldReduceMotion = useReducedMotion();
  const totalSlides = carSlides.length;

  // Refs for DOM elements
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rotationValue, setRotationValue] = useState(0);

  // Internal state refs
  const progressRef = useRef(0);
  const isLockedRef = useRef(false);
  const lockedScrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTouchYRef = useRef<number | null>(null);
  const pendingDeltaRef = useRef(0);

  // Constants
  const rotationMax = useMemo(() => (totalSlides - 1) * (Math.PI / 2), [totalSlides]);
  const EPS = 0.005; // Threshold for boundary detection

  // Update slide and rotation from progress
  const updateFromProgress = useCallback(
    (progress: number) => {
      const clampedProgress = clamp(progress, 0, 1);
      progressRef.current = clampedProgress;

      const slideIndex = clamp(Math.round(clampedProgress * (totalSlides - 1)), 0, totalSlides - 1);
      const rotation = clampedProgress * rotationMax;

      setCurrentSlide((prev) => (prev !== slideIndex ? slideIndex : prev));
      setRotationValue(rotation);
    },
    [rotationMax, totalSlides]
  );

  // Lock body scroll
  const lockBodyScroll = useCallback(() => {
    if (isLockedRef.current) return;

    const scrollY = window.scrollY;
    lockedScrollYRef.current = scrollY;
    isLockedRef.current = true;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
  }, []);

  // Unlock body scroll with target position
  const unlockBodyScrollTo = useCallback((targetY: number) => {
    if (!isLockedRef.current) return;

    isLockedRef.current = false;

    // Restore body styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.overscrollBehavior = '';

    // Temporarily disable smooth scrolling
    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    // Scroll to target position
    requestAnimationFrame(() => {
      window.scrollTo({
        top: targetY,
        behavior: 'auto',
      });

      // Restore smooth scrolling after scroll
      requestAnimationFrame(() => {
        html.style.scrollBehavior = prevScrollBehavior;
      });
    });
  }, []);

  // Handle scroll input (wheel/touch/keyboard)
  const handleScrollInput = useCallback(
    (delta: number): boolean => {
      if (!isLockedRef.current) return false;

      const currentProgress = progressRef.current;
      const viewportHeight = window.innerHeight;
      
      // Increased sensitivity for smoother transitions
      // Normalize delta by viewport height for consistent behavior
      // Higher sensitivity = less scroll needed to change slides
      const sensitivity = shouldReduceMotion ? 0.005 : 0.0035;
      const progressDelta = (delta / viewportHeight) * sensitivity;

      // Check boundaries BEFORE calculating new progress
      const atStart = currentProgress <= EPS;
      const atEnd = currentProgress >= 1 - EPS;

      // Unlock at boundaries
      if (atStart && delta < 0) {
        // Scrolling up at start -> unlock and scroll to before section
        const beforeY = beforeRef.current ? getAbsY(beforeRef.current) : lockedScrollYRef.current;
        unlockBodyScrollTo(beforeY);
        return false; // Don't prevent default
      }

      if (atEnd && delta > 0) {
        // Scrolling down at end -> unlock and scroll to after section
        const afterY = afterRef.current ? getAbsY(afterRef.current) : lockedScrollYRef.current;
        unlockBodyScrollTo(afterY);
        return false; // Don't prevent default
      }

      // Update progress if not at boundary
      const newProgress = clamp(currentProgress + progressDelta, 0, 1);
      updateFromProgress(newProgress);
      return true; // Prevent default
    },
    [shouldReduceMotion, unlockBodyScrollTo, updateFromProgress]
  );

  // RAF throttling for scroll input
  const scheduleScrollInput = useCallback(
    (delta: number): boolean => {
      // Accumulate delta
      pendingDeltaRef.current += delta;

      // If already scheduled, just prevent default
      if (rafIdRef.current !== null) {
        return true;
      }

      // Schedule update
      rafIdRef.current = requestAnimationFrame(() => {
        const totalDelta = pendingDeltaRef.current;
        pendingDeltaRef.current = 0;
        rafIdRef.current = null;

        // Process accumulated delta
        if (totalDelta !== 0 && isLockedRef.current) {
          handleScrollInput(totalDelta);
        }
      });

      // Always prevent default when locked (boundary checks happen in handleScrollInput)
      return isLockedRef.current;
    },
    [handleScrollInput]
  );

  // IntersectionObserver to detect when section is pinned
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Section is pinned when it's fully visible (intersectionRatio close to 1)
          // and top is at or above viewport top
          const rect = entry.boundingClientRect;
          const isPinned = entry.isIntersecting && entry.intersectionRatio >= 0.95 && rect.top <= 10;

          if (isPinned && !isLockedRef.current) {
            // Section is pinned, lock scroll
            lockBodyScroll();
            // Only initialize progress to 0 if we're starting fresh
            // Don't reset if user was already scrolling through slides
            if (progressRef.current === 0) {
              updateFromProgress(0);
            }
          } else if (!isPinned && isLockedRef.current) {
            // Section is no longer pinned, unlock scroll
            // Only unlock if we're not at a boundary (let boundary handlers manage unlock)
            const currentProgress = progressRef.current;
            const notAtBoundary = currentProgress > EPS && currentProgress < 1 - EPS;
            if (notAtBoundary) {
              const currentY = window.scrollY;
              unlockBodyScrollTo(currentY);
            }
          }
        }
      },
      {
        threshold: [0, 0.5, 0.95, 1],
        rootMargin: '0px',
      }
    );

    observer.observe(sectionEl);

    // Handle window resize while locked
    const handleResize = () => {
      if (isLockedRef.current && sectionEl) {
        // Re-check pinned state on resize
        const rect = sectionEl.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isPinned = rect.top <= 10 && rect.bottom >= viewportHeight - 10;
        
        if (!isPinned) {
          const currentY = window.scrollY;
          unlockBodyScrollTo(currentY);
        }
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (isLockedRef.current) {
        const currentY = window.scrollY;
        unlockBodyScrollTo(currentY);
      }
    };
  }, [lockBodyScroll, unlockBodyScrollTo, updateFromProgress]);

  // Input handlers (wheel, touch, keyboard)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isLockedRef.current) return;

      const shouldPrevent = scheduleScrollInput(e.deltaY);
      if (shouldPrevent) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isLockedRef.current || e.touches.length !== 1) return;
      lastTouchYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLockedRef.current || e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;
      const lastY = lastTouchYRef.current;

      if (lastY === null) {
        lastTouchYRef.current = currentY;
        return;
      }

      const deltaY = lastY - currentY; // swipe up => scroll down
      lastTouchYRef.current = currentY;

      const shouldPrevent = scheduleScrollInput(deltaY);
      if (shouldPrevent) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchEnd = () => {
      lastTouchYRef.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLockedRef.current) return;

      let delta = 0;
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          delta = e.shiftKey ? -140 : 140;
          break;
        case 'ArrowUp':
        case 'PageUp':
          delta = -140;
          break;
        default:
          return;
      }

      const shouldPrevent = scheduleScrollInput(delta);
      if (shouldPrevent) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Attach listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingDeltaRef.current = 0;
      lastTouchYRef.current = null;
    };
  }, [scheduleScrollInput]);

  return (
    <>
      {/* Anchor before section */}
      <div ref={beforeRef} style={{ height: '1px', width: '100%' }} aria-hidden="true" />

      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
        style={{
          height: '100vh',
        }}
      >
        <div className="sticky top-0 w-full h-screen flex flex-col lg:flex-row">
          {/* 3D Model */}
          <div className="relative lg:w-1/2 w-full h-[50vh] sm:h-[55vh] lg:h-full z-0 overflow-hidden flex items-center justify-center">
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
                                  <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
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
                  dotIndex === currentSlide ? 'bg-black w-6 sm:w-8' : 'bg-gray-400 w-2 sm:w-3'
                }`}
                aria-label={`اسلاید ${dotIndex + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Anchor after section */}
      <div ref={afterRef} style={{ height: '1px', width: '100%' }} aria-hidden="true" />
    </>
  );
}
