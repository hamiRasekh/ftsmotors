import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSlider } from '@/components/sections/HeroSlider';
import LogoLoop from '@/components/sections/LogoLoop';
import { Features } from '@/components/sections/Features';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { MasonryGallery } from '@/components/sections/MasonryGallery';
import { FadeIn } from '@/components/animations/FadeIn';
import { api } from '@/lib/api';

// Dynamic import for 3D components to avoid SSR issues
const Car3DSlider = dynamic(
  () => import('@/components/sections/Car3DSlider').then(mod => ({ default: mod.Car3DSlider })).catch(() => ({ default: () => null })),
  {
    ssr: false,
    loading: () => (
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400">در حال بارگذاری...</div>
      </section>
    ),
  }
);

export const metadata: Metadata = {
  title: 'خانه',
  description: 'فیدار تجارت سوبا - نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده',
  openGraph: {
    title: 'فیدار تجارت سوبا - نمایندگی رسمی خودرو',
    description: 'خرید و فروش خودروهای جدید و کارکرده',
    type: 'website',
  },
};

async function getHomeData() {
  try {
    // Use Promise.allSettled to handle errors gracefully
    const [articles, news] = await Promise.allSettled([
      api.articles.getAll({ published: true, limit: 10 }),
      api.news.getAll({ published: true, limit: 10 }),
    ]);
    
    return {
      articles: articles.status === 'fulfilled' 
        ? articles.value 
        : { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
      news: news.status === 'fulfilled' 
        ? news.value 
        : { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  } catch (error) {
    // Silently handle errors - page will work with empty data
    return {
      articles: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
      news: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
}

export default async function HomePage() {
  const { articles, news } = await getHomeData();

  return (
    <>
      <Header isHomePage={true} />
      <main className="min-h-screen bg-white">
        {/* Hero Slider */}
        <section className="relative">
          <HeroSlider />
        </section>

        {/* 3D Car Slider with Scroll Animation */}
        <Car3DSlider />

        {/* Brand Logos Slider */}
        <section className="relative bg-white py-12 md:py-16 overflow-hidden border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="w-full overflow-hidden">
              <LogoLoop
                logos={[
                  { src: '/4photoshop-bmw-vector-logo-لوگو-بی-ام-و-removebg-preview.png', alt: 'BMW', href: 'https://www.bmw.com' },
                  { src: '/images-removebg-preview.png', alt: 'Brand Logo' },
                  { src: '/3952193-removebg-preview.png', alt: 'Brand Logo' },
                ]}
                speed={120}
                direction="left"
                logoHeight={60}
                gap={40}
                fadeOut
                fadeOutColor="#ffffff"
                scaleOnHover
                pauseOnHover
                ariaLabel="برندهای خودرو"
                width="100%"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* Stats Section */}
        <Stats />

        {/* Testimonials */}
        <Testimonials />

        {/* Latest Articles and News */}
        {(articles.data && articles.data.length > 0) || (news.data && news.data.length > 0) ? (
          <MasonryGallery
            articles={
              articles.data?.map((article: any) => ({
                id: article.id,
                title: article.title,
                excerpt: article.excerpt,
                image: article.image,
                slug: article.slug,
                type: 'article' as const,
                date: article.createdAt,
              })) || []
            }
            news={
              news.data?.map((newsItem: any) => ({
                id: newsItem.id,
                title: newsItem.title,
                excerpt: newsItem.excerpt,
                image: newsItem.image,
                slug: newsItem.slug,
                type: 'news' as const,
                date: newsItem.createdAt,
              })) || []
            }
          />
        ) : null}

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                آماده برای شروع؟
              </h2>
              <p className="text-xl text-secondary/90 mb-8 max-w-2xl mx-auto">
                با ما تماس بگیرید و از مشاوره رایگان ما بهره‌مند شوید
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-block px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold text-lg"
                >
                  تماس با ما
                </Link>
                <Link
                  href="/cars"
                  className="inline-block px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-black transition-colors font-semibold text-lg"
                >
                  مشاهده خودروها
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
