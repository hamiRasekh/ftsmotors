import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const page = await api.pages.getBySlug(params.slug);
    return {
      title: page.seoTitle || page.title,
      description: page.seoDescription || '',
      keywords: page.seoKeywords?.split(',') || [],
    };
  } catch {
    return {
      title: 'صفحه یافت نشد',
    };
  }
}

export default async function PageDetail({ params }: { params: { slug: string } }) {
  let page;
  try {
    page = await api.pages.getBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        <article className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">{page.title}</h1>
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}

