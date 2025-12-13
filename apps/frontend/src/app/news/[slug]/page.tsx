import type { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const news = await api.news.getBySlug(params.slug);
    return {
      title: news.seoTitle || news.title,
      description: news.seoDescription || news.excerpt || news.content.substring(0, 160),
      keywords: news.seoKeywords,
      openGraph: {
        title: news.seoTitle || news.title,
        description: news.seoDescription || news.excerpt,
        images: news.image ? [news.image] : [],
        type: 'article',
        publishedTime: news.publishedAt || undefined,
      },
    };
  } catch {
    return {
      title: 'خبر',
    };
  }
}

async function getNewsData(slug: string) {
  try {
    const news = await api.news.getBySlug(slug);
    return news;
  } catch (error) {
    return null;
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await getNewsData(params.slug);

  if (!news || !news.published) {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-8">خبر یافت نشد</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/news" className="hover:text-foreground">
              اخبار
            </Link>
            {' / '}
            <span>{news.title}</span>
          </nav>

          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
            {news.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">{news.excerpt}</p>
            )}
            {news.image && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{news.content}</ReactMarkdown>
            </div>
            {news.publishedAt && (
              <p className="text-sm text-muted-foreground mt-8">
                تاریخ انتشار: {new Date(news.publishedAt).toLocaleDateString('fa-IR')}
              </p>
            )}
          </article>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'NewsArticle',
                headline: news.title,
                description: news.excerpt || news.content.substring(0, 160),
                image: news.image || '',
                datePublished: news.publishedAt || news.createdAt,
                author: {
                  '@type': 'Person',
                  name: news.author?.email || 'FTS Motors',
                },
              }),
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

