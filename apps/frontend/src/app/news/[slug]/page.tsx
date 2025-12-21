import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/animations/FadeIn';
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
        <main className="min-h-screen bg-white pt-16">
          <div className="container mx-auto px-4 py-16">
            <FadeIn>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-black mb-4">خبر یافت نشد</h1>
                <Link href="/news" className="text-black hover:text-gray-700 underline">
                  بازگشت به لیست اخبار
                </Link>
              </div>
            </FadeIn>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-black transition-colors">خانه</Link>
            {' / '}
            <Link href="/news" className="hover:text-black transition-colors">اخبار</Link>
            {' / '}
            <span className="text-black">{news.title}</span>
          </nav>

          <article className="max-w-4xl mx-auto">
            <FadeIn>
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
                  {news.title}
                </h1>
                {news.excerpt && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">{news.excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  {news.publishedAt && (
                    <span>
                      📅 {new Date(news.publishedAt).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                  {news.author && (
                    <span>✍️ {news.author.name || news.author.email}</span>
                  )}
                </div>
              </header>
            </FadeIn>

            {news.image && (
              <div className="mb-8 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={news.image}
                  alt={news.title}
                  width={1200}
                  height={600}
                  className="w-full h-auto object-cover grayscale"
                  priority
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-8">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold text-black mb-4 mt-8">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-bold text-black mb-3 mt-6">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-bold text-black mb-2 mt-4">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
                  a: ({ href, children }) => (
                    <a href={href} className="text-black underline hover:text-gray-700">
                      {children}
                    </a>
                  ),
                }}
              >
                {news.content}
              </ReactMarkdown>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                بازگشت به لیست اخبار
              </Link>
            </div>
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
                  name: news.author?.name || news.author?.email || 'فیدار تجارت سوبا',
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
