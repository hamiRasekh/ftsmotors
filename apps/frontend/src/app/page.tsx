import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSlider } from '@/components/sections/HeroSlider';
import LogoLoop from '@/components/sections/LogoLoop';
import { Features } from '@/components/sections/Features';
import { Stats } from '@/components/sections/Stats';
import { Testimonials } from '@/components/sections/Testimonials';
import { CarCard } from '@/components/ui/CarCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { SlideIn } from '@/components/animations/SlideIn';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { StaggerItem } from '@/components/animations/StaggerItem';
import { api } from '@/lib/api';

export const metadata: Metadata = {
  title: 'خانه',
  description: 'FTS Motors - نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده',
  openGraph: {
    title: 'FTS Motors - نمایندگی رسمی خودرو',
    description: 'خرید و فروش خودروهای جدید و کارکرده',
    type: 'website',
  },
};

async function getHomeData() {
  try {
    const [cars, articles, news] = await Promise.all([
      api.cars.getAll({ limit: 6 }),
      api.articles.getAll({ published: true, limit: 3 }),
      api.news.getAll({ published: true, limit: 3 }),
    ]);
    return { cars, articles, news };
  } catch (error) {
    return {
      cars: { data: [] },
      articles: { data: [] },
      news: { data: [] },
    };
  }
}

export default async function HomePage() {
  const { cars, articles, news } = await getHomeData();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-16">
        {/* Hero Slider */}
        <section className="relative">
          <HeroSlider />
        </section>

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

        {/* Featured Cars Section */}
        {cars.data && cars.data.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <FadeIn>
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    خودروهای برتر
                  </h2>
                  <p className="text-xl text-gray-600">
                    انتخاب از بهترین خودروهای موجود
                  </p>
                </div>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {cars.data.map((car: any, index: number) => (
                  <StaggerItem key={car.id}>
                    <CarCard car={car} index={index} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <FadeIn delay={0.3}>
                <div className="text-center">
                  <Link
                    href="/cars"
                    className="inline-block px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
                  >
                    مشاهده همه خودروها
                  </Link>
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* Articles Section */}
        {articles.data && articles.data.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <SlideIn direction="up">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    آخرین مقالات
                  </h2>
                  <p className="text-xl text-gray-600">
                    مطالب آموزشی و راهنمای خرید خودرو
                  </p>
                </div>
              </SlideIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {articles.data.map((article: any, index: number) => (
                  <StaggerItem key={article.id}>
                    <Link href={`/blog/${article.slug}`} className="block group">
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-all duration-300 h-full">
                        {article.image && (
                          <div className="aspect-video relative overflow-hidden">
                            <Image
                              src={article.image}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-gray-600 line-clamp-3 text-sm mb-4">
                              {article.excerpt}
                            </p>
                          )}
                          <span className="text-black font-semibold text-sm inline-flex items-center gap-2">
                            ادامه مطلب
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <FadeIn delay={0.3}>
                <div className="text-center">
                  <Link
                    href="/blog"
                    className="inline-block px-8 py-4 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors font-semibold text-lg"
                  >
                    مشاهده همه مقالات
                  </Link>
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* News Section */}
        {news.data && news.data.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <SlideIn direction="up">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    آخرین اخبار
                  </h2>
                  <p className="text-xl text-gray-600">
                    تازه‌ترین اخبار خودرو و صنعت خودرو
                  </p>
                </div>
              </SlideIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {news.data.map((newsItem: any, index: number) => (
                  <StaggerItem key={newsItem.id}>
                    <Link href={`/news/${newsItem.slug}`} className="block group">
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50 transition-all duration-300 h-full">
                        {newsItem.image && (
                          <div className="aspect-video relative overflow-hidden">
                            <Image
                              src={newsItem.image}
                              alt={newsItem.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500 grayscale"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                            {newsItem.title}
                          </h3>
                          {newsItem.excerpt && (
                            <p className="text-gray-600 line-clamp-3 text-sm mb-4">
                              {newsItem.excerpt}
                            </p>
                          )}
                          <span className="text-black font-semibold text-sm inline-flex items-center gap-2">
                            ادامه مطلب
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <FadeIn delay={0.3}>
                <div className="text-center">
                  <Link
                    href="/news"
                    className="inline-block px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-lg"
                  >
                    مشاهده همه اخبار
                  </Link>
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <Testimonials />

        {/* CTA Section */}
        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                آماده برای شروع؟
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
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
