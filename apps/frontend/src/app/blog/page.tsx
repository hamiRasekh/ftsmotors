import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';

export const metadata: Metadata = {
  title: 'مقالات',
  description: 'مقالات و مطالب آموزشی درباره خودرو - FTS Motors',
  keywords: ['مقالات خودرو', 'مطالب آموزشی', 'راهنمای خرید خودرو'],
  openGraph: {
    title: 'مقالات | FTS Motors',
    description: 'مقالات و مطالب آموزشی درباره خودرو',
    type: 'website',
  },
};

async function getArticles() {
  try {
    const data = await api.articles.getAll({ published: true, limit: 20 });
    return data;
  } catch (error) {
    return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
  }
}

export default async function BlogPage() {
  const articlesData = await getArticles();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">مقالات</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesData.data?.map((article: any) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {article.image && (
                  <div className="aspect-video bg-muted">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                  {article.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  {article.publishedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(article.publishedAt).toLocaleDateString('fa-IR')}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {articlesData.data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">مقاله‌ای یافت نشد.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

