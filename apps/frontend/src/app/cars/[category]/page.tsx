import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer } from '@/components/animations/StaggerContainer';
import { StaggerItem } from '@/components/animations/StaggerItem';
import { CarCard } from '@/components/ui/CarCard';
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
        <main className="min-h-screen bg-white pt-16">
          <div className="container mx-auto px-4 py-16">
            <FadeIn>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-black mb-4">دسته‌بندی یافت نشد</h1>
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
        {/* Hero Section */}
        <section className="py-20 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <FadeIn>
              <nav className="mb-6 text-sm text-gray-600">
                <Link href="/" className="hover:text-black transition-colors">خانه</Link>
                {' / '}
                <Link href="/cars" className="hover:text-black transition-colors">خودروها</Link>
                {' / '}
                <span className="text-black">{category.name}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">{category.name}</h1>
              {category.description && (
                <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">{category.description}</p>
              )}
            </FadeIn>
          </div>
        </section>

        {/* Cars Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            {cars.data && cars.data.length > 0 ? (
              <>
                <FadeIn>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-black">خودروهای این دسته‌بندی</h2>
                    <span className="text-gray-600">
                      {cars.total} خودرو
                    </span>
                  </div>
                </FadeIn>
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.data.map((car: any, index: number) => (
                    <StaggerItem key={car.id}>
                      <CarCard car={car} index={index} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </>
            ) : (
              <FadeIn>
                <div className="text-center py-20">
                  <p className="text-xl text-gray-600 mb-4">خودرویی در این دسته‌بندی یافت نشد.</p>
                  <Link
                    href="/cars"
                    className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    مشاهده همه خودروها
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
