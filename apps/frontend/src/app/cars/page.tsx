import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';

export const metadata: Metadata = {
  title: 'خودروها',
  description: 'لیست کامل خودروهای موجود در FTS Motors - خرید و فروش خودروهای جدید و کارکرده',
  keywords: ['خودرو', 'خرید خودرو', 'فروش خودرو', 'لیست خودروها'],
  openGraph: {
    title: 'خودروها | FTS Motors',
    description: 'لیست کامل خودروهای موجود در FTS Motors',
    type: 'website',
  },
};

async function getCars() {
  try {
    const data = await api.cars.getAll({ published: true, limit: 20 });
    return data;
  } catch (error) {
    return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
  }
}

async function getCategories() {
  try {
    const data = await api.categories.getAll();
    return data;
  } catch (error) {
    return [];
  }
}

export default async function CarsPage() {
  const [carsData, categories] = await Promise.all([getCars(), getCategories()]);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">خودروها</h1>

          {categories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">دسته‌بندی‌ها</h2>
              <div className="flex flex-wrap gap-4">
                {categories.map((category: any) => (
                  <Link
                    key={category.id}
                    href={`/cars/${category.slug}`}
                    className="px-4 py-2 border rounded-lg hover:bg-primary hover:text-primary-foreground"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carsData.data?.map((car: any) => (
              <Link
                key={car.id}
                href={`/cars/${car.category.slug}/${car.slug}`}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
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
                  <p className="text-sm text-muted-foreground mb-2">{car.category.name}</p>
                  {car.description && (
                    <p className="text-sm line-clamp-2">{car.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {carsData.data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">خودرویی یافت نشد.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

