'use client';

import { useEffect, useState, RefObject } from 'react';

interface Use3DScrollOptions {
  rotationSpeed?: number;
  autoRotate?: boolean;
  minRotation?: number;
  maxRotation?: number;
}

export function use3DScroll(
  ref: RefObject<HTMLElement>,
  options: Use3DScrollOptions = {}
) {
  const {
    rotationSpeed = 1,
    autoRotate = true,
    minRotation = 0,
    maxRotation = Math.PI * 2,
  } = options;

  const [rotation, setRotation] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      
      // Check if element is in viewport
      const isVisible =
        rect.top < windowHeight &&
        rect.bottom > 0 &&
        rect.left < windowWidth &&
        rect.right > 0;

      setIsInView(isVisible);

      if (isVisible) {
        // Calculate scroll progress within the element
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const viewportCenter = windowHeight / 2;
        const elementCenter = elementTop + elementHeight / 2;
        
        // Distance from viewport center to element center
        const distanceFromCenter = (elementCenter - viewportCenter) / windowHeight;
        
        // Calculate rotation based on scroll position
        let newRotation = distanceFromCenter * rotationSpeed * Math.PI;
        
        // Clamp rotation
        newRotation = Math.max(minRotation, Math.min(maxRotation, newRotation));
        
        setRotation(newRotation);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [ref, rotationSpeed, minRotation, maxRotation]);

  return { rotation, isInView };
}

