import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { StaggerItem } from '@/components/animations/StaggerItem';
import { api } from '@/lib/api';

export const metadata: Metadata = {
  title: 'اخبار',
  description: 'آخرین اخبار خودرو و صنعت خودرو - FTS Motors',
  keywords: ['اخبار خودرو', 'اخبار صنعت خودرو', 'تازه‌ترین اخبار'],
  openGraph: {
    title: 'اخبار | FTS Motors',
    description: 'آخرین اخبار خودرو و صنعت خودرو',
    type: 'website',
  },
};

async function getNews() {
  try {
    const data = await api.news.getAll({ published: true, limit: 20 });
    return data;
  } catch (error) {
    return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
  }
}

export default async function NewsPage() {
  const newsData = await getNews();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
                  اخبار
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  تازه‌ترین اخبار خودرو و صنعت خودرو
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            {newsData.data && newsData.data.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsData.data.map((newsItem: any, index: number) => (
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
                          <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            {newsItem.title}
                          </h3>
                          {newsItem.excerpt && (
                            <p className="text-gray-600 line-clamp-3 text-sm mb-4">
                              {newsItem.excerpt}
                            </p>
                          )}
                          <span className="text-primary font-semibold text-sm inline-flex items-center gap-2">
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
            ) : (
              <FadeIn>
                <div className="text-center py-20">
                  <p className="text-xl text-gray-600">خبری یافت نشد</p>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
