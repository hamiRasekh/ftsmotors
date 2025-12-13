import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-8">خودرو یافت نشد</h1>
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
            <Link href="/cars" className="hover:text-foreground">
              خودروها
            </Link>
            {' / '}
            <Link href={`/cars/${car.category.slug}`} className="hover:text-foreground">
              {car.category.name}
            </Link>
            {' / '}
            <span>{car.brand} {car.model}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              {car.images && car.images.length > 0 && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                  <img
                    src={car.images[0]}
                    alt={car.brand + ' ' + car.model}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {car.images && car.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {car.images.slice(1, 5).map((image: string, index: number) => (
                    <div key={index} className="aspect-video bg-muted rounded overflow-hidden">
                      <img
                        src={image}
                        alt={`${car.brand} ${car.model} - تصویر ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">
                {car.brand} {car.model}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">{car.category.name}</p>
              <div className="prose max-w-none mb-6">
                <p className="text-lg leading-relaxed">{car.description}</p>
              </div>
              {car.features && (
                <div className="border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">ویژگی‌ها</h2>
                  <ul className="space-y-2">
                    {Object.entries(car.features).map(([key, value]) => (
                      <li key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span>{String(value)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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

