import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
      <main className="min-h-screen">
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">به FTS Motors خوش آمدید</h1>
            <p className="text-xl text-muted-foreground mb-8">
              نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/cars"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                مشاهده خودروها
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
              >
                درباره ما
              </Link>
            </div>
          </div>
        </section>

        {cars.data && cars.data.length > 0 && (
          <section className="bg-muted/50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">خودروهای برتر</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.data.map((car: any) => (
                  <Link
                    key={car.id}
                    href={`/cars/${car.category.slug}/${car.slug}`}
                    className="border rounded-lg overflow-hidden bg-background hover:shadow-lg transition-shadow"
                  >
                    {car.images && car.images.length > 0 && (
                      <div className="aspect-video bg-muted">
                        <img
                          src={car.images[0]}
                          alt={car.brand + ' ' + car.model}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-sm text-muted-foreground">{car.category.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/cars"
                  className="px-6 py-3 border rounded-lg hover:bg-primary hover:text-primary-foreground"
                >
                  مشاهده همه خودروها
                </Link>
              </div>
            </div>
          </section>
        )}

        {articles.data && articles.data.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8">آخرین مقالات</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.data.map((article: any) => (
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
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/blog"
                className="px-6 py-3 border rounded-lg hover:bg-primary hover:text-primary-foreground"
              >
                مشاهده همه مقالات
              </Link>
            </div>
          </section>
        )}

        {news.data && news.data.length > 0 && (
          <section className="bg-muted/50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">آخرین اخبار</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {news.data.map((newsItem: any) => (
                  <Link
                    key={newsItem.id}
                    href={`/news/${newsItem.slug}`}
                    className="border rounded-lg overflow-hidden bg-background hover:shadow-lg transition-shadow"
                  >
                    {newsItem.image && (
                      <div className="aspect-video bg-muted">
                        <img
                          src={newsItem.image}
                          alt={newsItem.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{newsItem.title}</h3>
                      {newsItem.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {newsItem.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/news"
                  className="px-6 py-3 border rounded-lg hover:bg-primary hover:text-primary-foreground"
                >
                  مشاهده همه اخبار
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

