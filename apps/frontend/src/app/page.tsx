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
import { AnimatedButton } from '@/components/ui/AnimatedButton';
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
      <main className="min-h-screen bg-white">
        {/* Hero Slider */}
        <section className="relative">
          <HeroSlider />
        </section>

        {/* Brand Logos Slider */}
        <section className="relative bg-white py-12 md:py-16 overflow-hidden">
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
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    خودروهای برتر
                  </h2>
                  <p className="text-xl text-gray-600">
                    انتخاب از بهترین خودروهای موجود
                  </p>
                </div>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {cars.data.map((car: any, index: number) => (
                  <StaggerItem key={car.id}>
                    <CarCard car={car} index={index} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <FadeIn delay={0.3}>
                <div className="text-center">
                  <AnimatedButton href="/cars" variant="primary" size="lg">
                    مشاهده همه خودروها
                  </AnimatedButton>
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* Articles Section */}
        {articles.data && articles.data.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
              <SlideIn direction="up">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    آخرین مقالات
                  </h2>
                  <p className="text-xl text-gray-600">
                    مطالب آموزشی و راهنمای خرید خودرو
                  </p>
                </div>
              </SlideIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {articles.data.map((article: any, index: number) => (
                  <StaggerItem key={article.id}>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                        {article.image && (
                          <div className="aspect-video relative overflow-hidden">
                            <Image
                              src={article.image}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-gray-600 line-clamp-2 text-sm">
                              {article.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <FadeIn delay={0.3}>
                <div className="text-center">
                  <AnimatedButton href="/blog" variant="outline" size="lg">
                    مشاهده همه مقالات
                  </AnimatedButton>
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
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    آخرین اخبار
                  </h2>
                  <p className="text-xl text-gray-600">
                    تازه‌ترین اخبار خودرو و صنعت خودرو
                  </p>
                </div>
              </SlideIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {news.data.map((newsItem: any, index: number) => (
                  <StaggerItem key={newsItem.id}>
                    <Link
                      href={`/news/${newsItem.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                        {newsItem.image && (
                          <div className="aspect-video relative overflow-hidden">
                            <Image
                              src={newsItem.image}
                              alt={newsItem.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {newsItem.title}
                          </h3>
                          {newsItem.excerpt && (
                            <p className="text-gray-600 line-clamp-2 text-sm">
                              {newsItem.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <FadeIn delay={0.3}>
                <div className="text-center">
                  <AnimatedButton href="/news" variant="primary" size="lg">
                    مشاهده همه اخبار
                  </AnimatedButton>
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <Testimonials />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                آماده برای شروع؟
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                با ما تماس بگیرید و از مشاوره رایگان ما بهره‌مند شوید
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AnimatedButton href="/contact" variant="secondary" size="lg">
                  تماس با ما
                </AnimatedButton>
                <AnimatedButton href="/cars" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  مشاهده خودروها
                </AnimatedButton>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
