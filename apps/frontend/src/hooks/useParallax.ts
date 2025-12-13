'use client';

import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

export function useElementParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return { ref, y };
}

