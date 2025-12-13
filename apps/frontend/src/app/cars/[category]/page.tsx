import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  try {
    const category = await api.categories.getBySlug(params.category);
    return {
      title: category.name,
      description: category.description || `خودروهای دسته‌بندی ${category.name}`,
    };
  } catch {
    return {
      title: 'دسته‌بندی خودرو',
    };
  }
}

async function getCategoryData(slug: string) {
  try {
    const category = await api.categories.getBySlug(slug);
    const cars = await api.cars.getAll({ categoryId: category.id, limit: 50 });
    return { category, cars };
  } catch (error) {
    return { category: null, cars: { data: [], total: 0 } };
  }
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category, cars } = await getCategoryData(params.category);

  if (!category) {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-8">دسته‌بندی یافت نشد</h1>
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
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-muted-foreground mb-8">{category.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.data?.map((car: any) => (
              <Link
                key={car.id}
                href={`/cars/${category.slug}/${car.slug}`}
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
                  {car.description && (
                    <p className="text-sm line-clamp-2">{car.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {cars.data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">خودرویی در این دسته‌بندی یافت نشد.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

