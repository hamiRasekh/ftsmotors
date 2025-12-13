import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';

export const metadata: Metadata = {
  title: 'اخبار',
  description: 'آخرین اخبار خودرو و صنعت خودرو - FTS Motors',
  keywords: ['اخبار خودرو', 'اخبار صنعت خودرو', 'تازه‌های خودرو'],
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
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">اخبار</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.data?.map((news: any) => (
              <Link
                key={news.id}
                href={`/news/${news.slug}`}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {news.image && (
                  <div className="aspect-video bg-muted">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                  {news.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {news.excerpt}
                    </p>
                  )}
                  {news.publishedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(news.publishedAt).toLocaleDateString('fa-IR')}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {newsData.data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">خبری یافت نشد.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

