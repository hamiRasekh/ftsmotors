import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { StaggerItem } from '@/components/animations/StaggerItem';
import { CarCard } from '@/components/ui/CarCard';
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
    const data = await api.cars.getAll({ limit: 20 });
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
      <main className="min-h-screen bg-white pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
                  خودروهای ما
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  انتخاب از بهترین خودروهای موجود با تضمین کیفیت و قیمت مناسب
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="py-12 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
              <FadeIn>
                <h2 className="text-2xl font-bold text-primary mb-6">دسته‌بندی‌ها</h2>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category: any) => (
                    <Link
                      key={category.id}
                      href={`/cars/${category.slug}`}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-medium"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* Cars Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            {carsData.data && carsData.data.length > 0 ? (
              <>
                <FadeIn>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-primary">همه خودروها</h2>
                    <span className="text-gray-600">
                      {carsData.total} خودرو
                    </span>
                  </div>
                </FadeIn>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {carsData.data.map((car: any, index: number) => (
                    <StaggerItem key={car.id}>
                      <CarCard car={car} index={index} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </>
            ) : (
              <FadeIn>
                <div className="text-center py-20">
                  <p className="text-xl text-gray-600 mb-4">خودرویی یافت نشد.</p>
                  <Link
                    href="/contact"
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                  >
                    تماس با ما
                  </Link>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
