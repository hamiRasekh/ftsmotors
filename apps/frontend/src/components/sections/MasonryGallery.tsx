'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { StaggerItem } from '@/components/animations/StaggerItem';

interface MasonryItem {
  id: string;
  title: string;
  excerpt?: string;
  image?: string;
  slug: string;
  type: 'article' | 'news';
  date?: string;
}

interface MasonryGalleryProps {
  articles: MasonryItem[];
  news: MasonryItem[];
  className?: string;
}

// Generate random heights for masonry effect
const getRandomHeight = (index: number) => {
  const heights = ['h-64', 'h-80', 'h-96', 'h-[28rem]', 'h-[32rem]'];
  return heights[index % heights.length];
};

export function MasonryGallery({ articles, news, className = '' }: MasonryGalleryProps) {
  // Combine articles and news, shuffle for random layout
  const allItems = [...articles, ...news].sort(() => Math.random() - 0.5);

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            آخرین اخبار و مقالات
          </h2>
          <p className="text-xl text-gray-600">
            تازه‌ترین مطالب و اخبار خودرو
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[10px]">
          {allItems.map((item, index) => {
            const height = getRandomHeight(index);
            const isLarge = index % 7 === 0; // Every 7th item is larger
            const span = isLarge ? 'md:col-span-2 md:row-span-2' : '';

            return (
              <StaggerItem key={item.id}>
                <Link
                  href={item.type === 'article' ? `/blog/${item.slug}` : `/news/${item.slug}`}
                  className={`block group ${span}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className={`relative ${height} ${span} bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300`}
                  >
                    {item.image && (
                      <div className="relative w-full h-2/3 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500 grayscale"
                        />
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.type === 'article'
                                ? 'bg-black text-white'
                                : 'bg-gray-800 text-white'
                            }`}
                          >
                            {item.type === 'article' ? 'مقاله' : 'خبر'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4 h-1/3 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        {item.date && (
                          <span className="text-xs text-gray-500">
                            {new Date(item.date).toLocaleDateString('fa-IR')}
                          </span>
                        )}
                        <span className="text-black font-semibold text-sm inline-flex items-center gap-2">
                          ادامه مطلب
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-block px-8 py-4 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors font-semibold text-lg"
            >
              مشاهده همه مقالات
            </Link>
            <Link
              href="/news"
              className="inline-block px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
            >
              مشاهده همه اخبار
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

