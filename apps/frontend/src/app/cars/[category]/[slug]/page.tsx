import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/animations/FadeIn';
import { api } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  try {
    const car = await api.cars.getBySlug(params.slug);
    return {
      title: car.seoTitle || `${car.brand} ${car.model}`,
      description: car.seoDescription || car.description,
      keywords: car.seoKeywords,
      openGraph: {
        title: car.seoTitle || `${car.brand} ${car.model}`,
        description: car.seoDescription || car.description,
        images: car.images && car.images.length > 0 ? [car.images[0]] : [],
      },
    };
  } catch {
    return {
      title: 'خودرو',
    };
  }
}

async function getCarData(slug: string) {
  try {
    const car = await api.cars.getBySlug(slug);
    return car;
  } catch (error) {
    return null;
  }
}

export default async function CarDetailPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const car = await getCarData(params.slug);

  if (!car) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-16">
          <div className="container mx-auto px-4 py-16">
            <FadeIn>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-black mb-4">خودرو یافت نشد</h1>
                <Link href="/cars" className="text-black hover:text-gray-700 underline">
                  بازگشت به لیست خودروها
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
            <Link href="/cars" className="hover:text-black transition-colors">خودروها</Link>
            {' / '}
            <Link href={`/cars/${car.category.slug}`} className="hover:text-black transition-colors">
              {car.category.name}
            </Link>
            {' / '}
            <span className="text-black">{car.brand} {car.model}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Images */}
            <FadeIn>
              <div>
                {car.images && car.images.length > 0 && (
                  <>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 border border-gray-200">
                      <Image
                        src={car.images[0]}
                        alt={car.brand + ' ' + car.model}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        priority
                      />
                    </div>
                    {car.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {car.images.slice(1, 5).map((image: string, index: number) => (
                          <div key={index} className="aspect-video bg-gray-100 rounded overflow-hidden border border-gray-200">
                            <Image
                              src={image}
                              alt={`${car.brand} ${car.model} - تصویر ${index + 2}`}
                              width={200}
                              height={150}
                              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </FadeIn>

            {/* Details */}
            <FadeIn delay={0.2}>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                  {car.brand} {car.model}
                </h1>
                <p className="text-lg text-gray-600 mb-6">{car.category.name}</p>
                
                {car.description && (
                  <div className="prose max-w-none mb-8">
                    <p className="text-lg text-gray-700 leading-relaxed">{car.description}</p>
                  </div>
                )}

                {car.features && Object.keys(car.features).length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-black mb-6">ویژگی‌ها</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(car.features).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                          <span className="font-medium text-black">{key}:</span>
                          <span className="text-gray-600">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Link
                    href="/contact"
                    className="flex-1 px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-center"
                  >
                    تماس برای خرید
                  </Link>
                  <Link
                    href="/cars"
                    className="px-8 py-4 border-2 border-black text-black rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    مشاهده سایر خودروها
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: `${car.brand} ${car.model}`,
                description: car.description,
                image: car.images || [],
                category: car.category.name,
                brand: {
                  '@type': 'Brand',
                  name: car.brand,
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
