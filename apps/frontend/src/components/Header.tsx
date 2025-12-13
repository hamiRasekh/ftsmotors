'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/photo_2025-12-08_17-46-46-removebg-preview.png"
              alt="FTS Motors Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-gray-900">FTS Motors</span>
          </Link>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 items-center">
            <li>
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                خانه
              </Link>
            </li>
            <li>
              <Link href="/cars" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                خودروها
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                مقالات
              </Link>
            </li>
            <li>
              <Link href="/news" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                اخبار
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                درباره ما
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                تماس با ما
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                دریافت مشاوره
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
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
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <ul className="flex flex-col gap-4 pt-4">
              <li>
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium block">
                  خانه
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-gray-700 hover:text-blue-600 transition-colors font-medium block">
                  خودروها
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium block">
                  مقالات
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-700 hover:text-blue-600 transition-colors font-medium block">
                  اخبار
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium block">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium block">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium inline-block text-center w-full"
                >
                  دریافت مشاوره
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
