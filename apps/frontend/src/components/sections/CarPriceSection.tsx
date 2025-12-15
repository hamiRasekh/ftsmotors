'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Car3DViewer } from '@/components/3d/Car3DViewer';
import { use3DScroll } from '@/hooks/use3DScroll';

interface CarPriceSectionProps {
  modelPath: string;
  title: string;
  priceRange: string;
  description: string;
  features: string[];
  reverse?: boolean; // If true, text on left, model on right
  className?: string;
}

export function CarPriceSection({
  modelPath,
  title,
  priceRange,
  description,
  features,
  reverse = false,
  className = '',
}: CarPriceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const { rotation, isInView } = use3DScroll(sectionRef, {
    rotationSpeed: 0.5,
    autoRotate: false,
  });

  // Animate text from bottom to top
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Animate model scale
  const modelScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const modelY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-white ${className}`}
    >
      <div className="container mx-auto px-4 py-20">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
            reverse ? 'lg:grid-flow-dense' : ''
          }`}
        >
          {/* Text Content */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className={`space-y-6 ${reverse ? 'lg:col-start-2' : ''}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
                {title}
              </h2>
              <p className="text-2xl md:text-3xl text-gray-700 font-semibold mb-6">
                {priceRange}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 leading-relaxed"
            >
              {description}
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-3"
            >
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
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
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* 3D Model */}
          <motion.div
            style={{ scale: modelScale, y: modelY }}
            className={`relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] order-first lg:order-none ${
              reverse ? 'lg:col-start-1 lg:row-start-1' : ''
            }`}
          >
            {isInView && (
              <Car3DViewer
                modelPath={modelPath}
                rotation={rotation}
                autoRotate={false}
                scale={1}
                position={[0, -1, 0]}
                className="w-full h-full"
                cameraPosition={[0, 2, 8]}
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

