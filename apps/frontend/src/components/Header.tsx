'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './layout/Sidebar';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'خانه' },
    { href: '/cars', label: 'خودروها' },
    { href: '/blog', label: 'مقالات' },
    { href: '/news', label: 'اخبار' },
    { href: '/about', label: 'درباره ما' },
    { href: '/contact', label: 'تماس با ما' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/photo_2025-12-08_17-46-46-removebg-preview.png"
              alt="FTS Motors Logo"
              width={40}
              height={40}
              className="object-contain w-8 h-8 sm:w-10 sm:h-10"
            />
          </Link>

          {/* Desktop Menu - Center */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-2 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-700 hover:text-black font-medium transition-colors rounded-lg hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="منوی کناری"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link
              href="/contact"
              className="px-4 xl:px-5 py-2 xl:py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm xl:text-base"
            >
              دریافت مشاوره
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 overflow-hidden"
            >
              <ul className="flex flex-col gap-1 py-4">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:text-black hover:bg-gray-50 transition-colors font-medium rounded-lg mx-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="px-2 pt-2">
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-center"
                  >
                    دریافت مشاوره
                  </Link>
                </li>
                <li className="px-2">
                  <button
                    onClick={() => {
                      setSidebarOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium text-right"
                  >
                    منوی کناری
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </motion.header>
  );
}
