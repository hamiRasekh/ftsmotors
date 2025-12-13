'use client';

import { motion } from 'framer-motion';
import { ReactNode, MouseEvent } from 'react';
import Link from 'next/link';

interface AnimatedButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedButton({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  size = 'md',
}: AnimatedButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 relative overflow-hidden';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonContent = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}

