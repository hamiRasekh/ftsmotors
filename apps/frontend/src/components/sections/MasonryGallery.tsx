'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Autoplay, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

export function MasonryGallery({ articles, news, className = '' }: MasonryGalleryProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Combine and sort by date (newest first)
  const allItems = [...articles, ...news].sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA; // Newest first
  });

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            آخرین اخبار و مقالات
          </h2>
          <p className="text-xl text-gray-600">
            تازه‌ترین مطالب و اخبار خودرو
          </p>
        </motion.div>

        {allItems.length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay, Pagination, Mousewheel, Keyboard]}
              spaceBetween={24}
              slidesPerView={1}
              grabCursor={true}
              mousewheel={{
                forceToAxis: true,
                sensitivity: 1,
                releaseOnEdges: true,
              }}
              keyboard={{
                enabled: true,
                onlyInViewport: true,
              }}
              touchEventsTarget="container"
              touchRatio={1}
              resistance={true}
              resistanceRatio={0.85}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              className="!pb-12"
            >
              {allItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <Link
                    href={item.type === 'article' ? `/blog/${item.slug}` : `/news/${item.slug}`}
                    className="block group h-full"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ y: -8 }}
                      className="h-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
                    >
                      {/* Image Section */}
                      {item.image ? (
                        <div className="relative w-full h-48 md:h-56 overflow-hidden bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute top-4 right-4 z-10">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                                item.type === 'article'
                                  ? 'bg-primary/90 text-white'
                                  : 'bg-accent/90 text-white'
                              }`}
                            >
                              {item.type === 'article' ? 'مقاله' : 'خبر'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-48 md:h-56 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <div className="text-6xl opacity-30">
                            {item.type === 'article' ? '📝' : '📰'}
                          </div>
                          <div className="absolute top-4 right-4">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                                item.type === 'article'
                                  ? 'bg-primary text-white'
                                  : 'bg-accent text-white'
                              }`}
                            >
                              {item.type === 'article' ? 'مقاله' : 'خبر'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Content Section */}
                      <div className="p-5 md:p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2 min-h-[3.5rem]">
                            {item.title}
                          </h3>
                          {item.excerpt && (
                            <p className="text-gray-600 text-sm md:text-base line-clamp-3 mb-4">
                              {item.excerpt}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          {item.date && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(item.date).toLocaleDateString('fa-IR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          )}
                          <span className="text-primary font-semibold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                            ادامه مطلب
                            <svg
                              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className={`hidden md:flex absolute top-1/2 -translate-y-1/2 right-0 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 items-center justify-center group ${
                isBeginning ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-label="قبلی"
            >
              <svg
                className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className={`hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 z-10 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 items-center justify-center group ${
                isEnd ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-label="بعدی"
            >
              <svg
                className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-gray-600">مطلبی یافت نشد</p>
          </motion.div>
        )}

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
              className="inline-block px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold text-lg"
            >
              مشاهده همه مقالات
            </Link>
            <Link
              href="/news"
              className="inline-block px-8 py-4 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-semibold text-lg"
            >
              مشاهده همه اخبار
            </Link>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: hsl(var(--muted));
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: hsl(var(--foreground));
        }
      `}</style>
    </section>
  );
}
