'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function HoverCard({ children, className = '', glow = false }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
      }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
    >
      {glow && (
        <motion.div
          className="absolute inset-0 bg-black opacity-0 blur-xl rounded-xl"
          whileHover={{ opacity: 0.2 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}
