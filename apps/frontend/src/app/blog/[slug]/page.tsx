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
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-8">مقاله یافت نشد</h1>
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
            <Link href="/blog" className="hover:text-foreground">
              مقالات
            </Link>
            {' / '}
            <span>{article.title}</span>
          </nav>

          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            {article.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
            )}
            {article.image && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
            {article.publishedAt && (
              <p className="text-sm text-muted-foreground mt-8">
                تاریخ انتشار: {new Date(article.publishedAt).toLocaleDateString('fa-IR')}
              </p>
            )}
          </article>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: article.title,
                description: article.excerpt || article.content.substring(0, 160),
                image: article.image || '',
                datePublished: article.publishedAt || article.createdAt,
                author: {
                  '@type': 'Person',
                  name: article.author?.email || 'FTS Motors',
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

