'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Sidebar } from './layout/Sidebar';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'خانه' },
    { href: '/cars', label: 'خودروها' },
    { href: '/blog', label: 'مقالات' },
    { href: '/news', label: 'اخبار' },
    { href: '/about', label: 'درباره ما' },
    { href: '/contact', label: 'تماس با ما' },
    { href: '/feedback', label: 'انتقادات و پیشنهادات' },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHovered || !scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
          : 'bg-white/60 backdrop-blur-sm border-b border-gray-200/30'
      } ${scrolled ? 'shadow-lg' : 'shadow-none'}`}
    >
      <div className="px-6 sm:px-6 lg:px-0">
        <nav className="flex items-center justify-between h-12 md:h-14">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/photo_2025-12-08_17-46-46-removebg-preview.png"
              alt="فیدار تجارت سوبا"
              width={40}
              height={40}
              className="object-contain w-8 h-8 sm:w-10 sm:h-10 transition-all"
            />
          </Link>

          {/* Desktop Menu - Center */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-2 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href} className="relative">
                  <motion.div
                    className="relative"
                    whileHover="hover"
                    initial="initial"
                  >
                    <Link
                      href={item.href}
                      className={`relative px-3 xl:px-4 py-2 text-sm xl:text-base font-medium transition-all duration-300 block overflow-hidden ${
                        isActive ? 'text-primary' : 'text-gray-700'
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      
                      {/* Animated Underline - slides from right to left */}
                      <motion.div
                        className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-l from-primary via-accent to-primary"
                        variants={{
                          initial: { width: isActive ? '100%' : '0%' },
                          hover: { width: '100%' },
                        }}
                        transition={{
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      />
                      
                      {/* Animated Background Glow */}
                      <motion.div
                        className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"
                        variants={{
                          initial: { opacity: isActive ? 1 : 0, scale: 1 },
                          hover: { opacity: 1, scale: 1.05 },
                        }}
                        transition={{
                          duration: 0.3,
                          ease: 'easeOut',
                        }}
                      />
                      
                      {/* Shine Effect - sweeps across on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                        variants={{
                          initial: { x: '-100%', opacity: 0 },
                          hover: {
                            x: '200%',
                            opacity: [0, 1, 0],
                            transition: {
                              duration: 0.8,
                              ease: 'easeInOut',
                            },
                          },
                        }}
                      />
                    </Link>
                  </motion.div>
                </li>
              );
            })}
          </ul>

          {/* Desktop Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/contact"
              className="px-4 xl:px-5 py-2 xl:py-2.5 rounded-lg transition-colors font-medium text-sm xl:text-base bg-primary text-white hover:bg-accent"
            >
              دریافت مشاوره
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
            aria-label="منو"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

      </div>

      {/* Mobile Sidebar Menu - Rendered via Portal */}
      {mounted && typeof window !== 'undefined' ? createPortal(
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
                style={{ 
                  zIndex: 9998,
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              
              {/* Sidebar */}
              <motion.aside
                key="sidebar"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ 
                  type: 'spring', 
                  damping: 30, 
                  stiffness: 300,
                  mass: 0.8
                }}
                className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl lg:hidden overflow-y-auto"
                style={{ 
                  zIndex: 9999,
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  height: '100vh',
                }}
              >
              {/* Sidebar Header */}
              <div className="sticky top-0 bg-primary text-white p-4 flex items-center justify-between border-b border-primary/20 z-10">
                <div className="flex items-center gap-3">
                  <Image
                    src="/photo_2025-12-08_17-46-46-removebg-preview.png"
                    alt="فیدار تجارت سوبا"
                    width={32}
                    height={32}
                    className="object-contain brightness-0 invert"
                  />
                  <span className="font-bold text-lg">فیدار تجارت سوبا</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="بستن منو"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    
                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`relative block px-4 py-3 rounded-lg transition-all duration-300 font-medium group overflow-hidden ${
                            isActive
                              ? 'bg-primary text-white shadow-md'
                              : 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10'
                          }`}
                        >
                          <span className="relative z-10 flex items-center gap-3">
                            <motion.span
                              className={`w-1 h-6 rounded-full ${
                                isActive
                                  ? 'bg-white'
                                  : 'bg-transparent group-hover:bg-primary'
                              }`}
                              animate={{
                                height: isActive ? '100%' : '1.5rem',
                                opacity: isActive ? 1 : 0.5,
                              }}
                              whileHover={{
                                height: '100%',
                                opacity: 1,
                              }}
                              transition={{ duration: 0.3 }}
                            />
                            {item.label}
                          </span>
                          
                          {/* Active indicator background */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          
                          {/* Hover effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-gray-200"
                >
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-semibold text-center shadow-lg"
                  >
                    دریافت مشاوره
                  </Link>
                </motion.div>
              </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body
      ) : null}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </motion.header>
  );
}
