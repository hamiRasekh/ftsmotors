'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Car3DViewer } from '@/components/3d/Car3DViewer';
import { use3DScroll } from '@/hooks/use3DScroll';

interface ImportedCarsSectionProps {
  className?: string;
}

export function ImportedCarsSection({ className = '' }: ImportedCarsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const car1Ref = useRef<HTMLDivElement>(null);
  const car2Ref = useRef<HTMLDivElement>(null);

  const { rotation: rotation1 } = use3DScroll(car1Ref, {
    rotationSpeed: 0.5,
    autoRotate: false,
  });

  const { rotation: rotation2 } = use3DScroll(car2Ref, {
    rotationSpeed: 0.5,
    autoRotate: false,
  });

  // Scale down cars as user scrolls
  const carScale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1, 0.6, 0.6, 0.4]);
  
  // Move cars closer together
  const car1X = useTransform(scrollYProgress, [0, 0.4, 0.6], [0, -10, -15]);
  const car2X = useTransform(scrollYProgress, [0, 0.4, 0.6], [0, 10, 15]);

  // Show info after rotation
  const infoOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const infoY = useTransform(scrollYProgress, [0.5, 0.7], [50, 0]);
  
  // Car name opacity
  const carNameOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Update showInfo state
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest > 0.6 && !showInfo) {
        setShowInfo(true);
      }
    });
    return unsubscribe;
  }, [scrollYProgress, showInfo]);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 ${className}`}
    >
      <div className="container mx-auto px-4 py-20">
        {/* Two Cars Side by Side */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] mb-12 md:mb-20">
          {/* Car 1 - Kia Sportage */}
          <motion.div
            ref={car1Ref}
            style={{ scale: carScale, x: car1X }}
            className="absolute left-1/2 top-1/2 -translate-x-[60%] -translate-y-1/2 w-[45%] sm:w-[45%] h-full"
          >
            <Car3DViewer
              modelPath="/glb/kia_sportage.glb"
              rotation={rotation1}
              autoRotate={false}
              scale={1}
              position={[0, -1, 0]}
              className="w-full h-full"
              cameraPosition={[0, 2, 8]}
            />
            <motion.div
              style={{ opacity: carNameOpacity }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
            >
              <h3 className="text-xl md:text-2xl font-bold text-black">Kia Sportage</h3>
            </motion.div>
          </motion.div>

          {/* Car 2 - Kia K5 */}
          <motion.div
            ref={car2Ref}
            style={{ scale: carScale, x: car2X }}
            className="absolute left-1/2 top-1/2 -translate-x-[40%] -translate-y-1/2 w-[45%] sm:w-[45%] h-full"
          >
            <Car3DViewer
              modelPath="/glb/kia_optima_k5.glb"
              rotation={rotation2}
              autoRotate={false}
              scale={1}
              position={[0, -1, 0]}
              className="w-full h-full"
              cameraPosition={[0, 2, 8]}
            />
            <motion.div
              style={{ opacity: carNameOpacity }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
            >
              <h3 className="text-xl md:text-2xl font-bold text-black">Kia K5</h3>
            </motion.div>
          </motion.div>
        </div>

        {/* Information Section */}
        <motion.div
          style={{ opacity: infoOpacity, y: infoY }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4"
          >
            خودروهای وارداتی
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            مجموعه‌ای از بهترین خودروهای وارداتی با کیفیت بالا و قیمت مناسب. 
            خودروهای ما با گواهی‌نامه‌های معتبر و خدمات پس از فروش کامل ارائه می‌شوند.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
          >
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-3">Kia Sportage</h3>
              <p className="text-gray-600">
                شاسی‌بلند مدرن با طراحی جذاب و امکانات کامل. مناسب برای خانواده‌های بزرگ.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-3">Kia K5</h3>
              <p className="text-gray-600">
                سدان لوکس با عملکرد عالی و طراحی مدرن. انتخابی ایده‌آل برای رانندگی روزمره.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

