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
    const article = await api.articles.getBySlug(params.slug);
    return {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || article.content.substring(0, 160),
      keywords: article.seoKeywords,
      openGraph: {
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.excerpt,
        images: article.image ? [article.image] : [],
        type: 'article',
        publishedTime: article.publishedAt || undefined,
      },
    };
  } catch {
    return {
      title: 'مقاله',
    };
  }
}

async function getArticleData(slug: string) {
  try {
    const article = await api.articles.getBySlug(slug);
    return article;
  } catch (error) {
    return null;
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug);

  if (!article || !article.published) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-16">
          <div className="container mx-auto px-4 py-16">
            <FadeIn>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-black mb-4">مقاله یافت نشد</h1>
                <Link href="/blog" className="text-black hover:text-gray-700 underline">
                  بازگشت به لیست مقالات
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
            <Link href="/blog" className="hover:text-black transition-colors">مقالات</Link>
            {' / '}
            <span className="text-black">{article.title}</span>
          </nav>

          <article className="max-w-4xl mx-auto">
            <FadeIn>
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
                  {article.title}
                </h1>
                {article.excerpt && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  {article.publishedAt && (
                    <span>
                      📅 {new Date(article.publishedAt).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                  {article.author && (
                    <span>✍️ {article.author.name || article.author.email}</span>
                  )}
                </div>
              </header>
            </FadeIn>

            {article.image && (
              <div className="mb-8 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={article.image}
                  alt={article.title}
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
                  code: ({ children }) => (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-black">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                      {children}
                    </pre>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                بازگشت به لیست مقالات
              </Link>
            </div>
          </article>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: article.seoTitle || article.title,
                description: article.seoDescription || article.excerpt || article.content.substring(0, 160),
                image: article.image ? [article.image] : [],
                datePublished: article.publishedAt || article.createdAt,
                dateModified: article.updatedAt || article.publishedAt || article.createdAt,
                author: {
                  '@type': 'Person',
                  name: article.author?.name || article.author?.email || 'فیدار تجارت سوبا',
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'فیدار تجارت سوبا',
                  logo: {
                    '@type': 'ImageObject',
                    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/photo_2025-12-08_17-46-46-removebg-preview.png`,
                  },
                },
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${article.slug}`,
                },
                keywords: article.seoKeywords || '',
              }),
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
