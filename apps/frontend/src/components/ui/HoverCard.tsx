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
          className="absolute inset-0 bg-blue-500 opacity-0 blur-xl rounded-xl"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

