'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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

  // Internal state refs to prevent infinite loops and jitter
  const progressRef = useRef(0);
  const isLockedRef = useRef(false);
  const lockedScrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTouchYRef = useRef(0);

  // Update slide and rotation from internal progress
  const updateFromProgress = useCallback((progress: number) => {
    progressRef.current = progress;
    
    // Compute slide index: stable mapping using Math.round
    const slideIndex = clamp(Math.round(progress * (totalSlides - 1)), 0, totalSlides - 1);
    
    // Compute rotation: continuous rotation based on progress
    const rotation = progress * (totalSlides - 1) * (Math.PI / 2);
    
    // Update state only when values change to prevent unnecessary re-renders
    setCurrentSlide((prev) => {
      if (prev !== slideIndex) {
        return slideIndex;
      }
      return prev;
    });
    
    setRotationValue(rotation);
  }, [totalSlides]);

  // Lock body scroll
  const lockBodyScroll = useCallback(() => {
    if (isLockedRef.current) return;
    
    const scrollY = window.scrollY;
    lockedScrollYRef.current = scrollY;
    isLockedRef.current = true;
    
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    
    // Prevent rubber band on mobile
    body.style.overscrollBehavior = 'none';
  }, []);

  // Unlock body scroll
  const unlockBodyScroll = useCallback(() => {
    if (!isLockedRef.current) return;
    
    isLockedRef.current = false;
    const scrollY = lockedScrollYRef.current;
    
    const body = document.body;
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    body.style.overflow = '';
    body.style.overscrollBehavior = '';
    
    // Restore scroll position - use requestAnimationFrame to ensure it happens after style changes
    requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollY,
        behavior: 'auto'
      });
    });
  }, []);

  // Check if section is in pinned/active state
  const checkPinnedState = useCallback(() => {
    if (!sectionRef.current) return false;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Section is pinned when: top <= 0 and bottom >= viewport height
    return rect.top <= 0 && rect.bottom >= viewportHeight;
  }, []);

  // Handle scroll input (wheel, touch, keyboard)
  const handleScrollInput = useCallback((delta: number) => {
    if (!sectionRef.current || !isLockedRef.current) return;
    
    const currentProgress = progressRef.current;
    const sectionHeight = sectionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const maxScroll = sectionHeight - viewportHeight;
    
    // Calculate sensitivity - increased for faster slide changes
    // Higher sensitivity = less scroll needed to change slides
    // Direct calculation based on viewport for responsive behavior
    const sensitivity = shouldReduceMotion ? 0.5 : 0.35;
    // Convert delta directly to progress change (more responsive)
    const progressDelta = (delta / viewportHeight) * sensitivity;
    
    let newProgress = clamp(currentProgress + progressDelta, 0, 1);
    
    // Unlock conditions
    if (currentProgress === 0 && delta < 0) {
      // At start, scrolling up -> unlock and scroll to section top
      const sectionTop = sectionRef.current.offsetTop;
      
      // Update locked scroll position before unlocking
      lockedScrollYRef.current = sectionTop;
      unlockBodyScroll();
      
      // Scroll to section top to continue normal scrolling upward
      requestAnimationFrame(() => {
        window.scrollTo({
          top: sectionTop,
          behavior: 'auto'
        });
      });
      return;
    }
    
    if (currentProgress === 1 && delta > 0) {
      // At end, scrolling down -> unlock and scroll just past section
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const targetScroll = sectionTop + sectionHeight;
      
      // Update locked scroll position before unlocking
      lockedScrollYRef.current = targetScroll;
      unlockBodyScroll();
      
      // Scroll to just past the section to continue normal scrolling
      requestAnimationFrame(() => {
        window.scrollTo({
          top: targetScroll,
          behavior: 'auto'
        });
      });
      return;
    }
    
    // Update progress and derived values
    updateFromProgress(newProgress);
  }, [shouldReduceMotion, unlockBodyScroll, updateFromProgress]);

  // Wheel handler with RAF throttling
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isLockedRef.current) return;
    
    e.preventDefault();
    
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    rafIdRef.current = requestAnimationFrame(() => {
      handleScrollInput(e.deltaY);
      rafIdRef.current = null;
    });
  }, [handleScrollInput]);

  // Touch handler
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isLockedRef.current || e.touches.length !== 1) return;
    
    e.preventDefault();
    
    const touch = e.touches[0];
    const currentY = touch.clientY;
    
    if (lastTouchYRef.current === 0) {
      lastTouchYRef.current = currentY;
      return;
    }
    
    const delta = lastTouchYRef.current - currentY; // Inverted: touch up = scroll down
    lastTouchYRef.current = currentY;
    
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    rafIdRef.current = requestAnimationFrame(() => {
      handleScrollInput(delta);
      rafIdRef.current = null;
    });
  }, [handleScrollInput]);

  const handleTouchEnd = useCallback(() => {
    lastTouchYRef.current = 0;
  }, []);

  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isLockedRef.current) return;
    
    let delta = 0;
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        delta = 100;
        break;
      case 'ArrowUp':
      case 'PageUp':
        delta = -100;
        break;
      case ' ':
        delta = e.shiftKey ? -100 : 100;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    handleScrollInput(delta);
  }, [handleScrollInput]);

  // Main effect: detect pinned state and manage scroll locking
  useEffect(() => {
    if (!sectionRef.current) return;

    let isActive = false;

    const checkAndUpdate = () => {
      const pinned = checkPinnedState();
      
      if (pinned && !isActive) {
        // Entering pinned state - lock scroll
        isActive = true;
        lockBodyScroll();
        
        // Calculate progress based on current scroll position within section
        const rect = sectionRef.current!.getBoundingClientRect();
        const sectionHeight = sectionRef.current!.offsetHeight;
        const viewportHeight = window.innerHeight;
        const maxScroll = sectionHeight - viewportHeight;
        
        // Calculate how much we've scrolled through the section
        const sectionTop = sectionRef.current!.offsetTop;
        const currentScrollY = window.scrollY;
        const scrolledInSection = currentScrollY - sectionTop;
        const initialProgress = maxScroll > 0 ? clamp(scrolledInSection / maxScroll, 0, 1) : progressRef.current;
        
        // Always update progress when entering pinned state to sync with scroll position
        // This ensures we continue from where we left off
        updateFromProgress(initialProgress);
      } else if (!pinned && isActive) {
        // Exiting pinned state - unlock scroll but preserve progress
        isActive = false;
        unlockBodyScroll();
        // Progress is preserved in progressRef, so it will continue from where it was when re-entering
      }
    };

    // Use IntersectionObserver for efficient detection
    const observer = new IntersectionObserver(
      () => {
        checkAndUpdate();
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: '0px',
      }
    );

    // Also check on scroll for immediate response
    const handleScroll = () => {
      checkAndUpdate();
    };

    observer.observe(sectionRef.current);
    window.addEventListener('scroll', handleScroll, { passive: true });
    checkAndUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (isLockedRef.current) {
        unlockBodyScroll();
      }
    };
  }, [checkPinnedState, lockBodyScroll, unlockBodyScroll, updateFromProgress]);

  // Attach/detach input handlers - always attach, check locked state inside handlers
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [handleWheel, handleTouchMove, handleTouchEnd, handleKeyDown]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
      style={{ 
        height: `${carSlides.length * 100}vh`,
        marginBottom: 0,
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


