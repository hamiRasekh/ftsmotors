'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, MouseEvent } from 'react';

interface RippleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function RippleButton({ children, onClick, className = '' }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white opacity-50"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y }}
          animate={{ width: 300, height: 300, x: ripple.x - 150, y: ripple.y - 150, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </motion.button>
  );
}

