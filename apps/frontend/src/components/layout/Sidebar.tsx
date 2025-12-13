'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getAll(),
  });

  const { data: cars } = useQuery({
    queryKey: ['cars', 'sidebar'],
    queryFn: () => api.cars.getAll({ limit: 10 }),
  });

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">دسترسی سریع</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="جستجو..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">دسته‌بندی‌ها</h3>
                  <ul className="space-y-2">
                    {categories?.data?.map((category: any) => (
                      <li key={category.id}>
                        <Link
                          href={`/cars/${category.slug}`}
                          onClick={onClose}
                          className="block px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Links */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">لینک‌های سریع</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/cars"
                        onClick={onClose}
                        className="block px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        همه خودروها
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/blog"
                        onClick={onClose}
                        className="block px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        مقالات
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/news"
                        onClick={onClose}
                        className="block px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        اخبار
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        onClick={onClose}
                        className="block px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        تماس با ما
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Recent Cars */}
                {cars?.data && cars.data.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">خودروهای اخیر</h3>
                    <ul className="space-y-2">
                      {cars.data.slice(0, 5).map((car: any) => (
                        <li key={car.id}>
                          <Link
                            href={`/cars/${car.category.slug}/${car.slug}`}
                            onClick={onClose}
                            className="block px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {car.brand} {car.model}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

