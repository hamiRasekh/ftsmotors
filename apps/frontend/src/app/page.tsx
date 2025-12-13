import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';

export const metadata: Metadata = {
  title: 'خانه',
  description: 'FTS Motors - نمایندگی رسمی خودرو - خرید و فروش خودروهای جدید و کارکرده',
  openGraph: {
    title: 'FTS Motors - نمایندگی رسمی خودرو',
    description: 'خرید و فروش خودروهای جدید و کارکرده',
    type: 'website',
  },
};

async function getHomeData() {
  try {
    const [cars, articles, news] = await Promise.all([
      api.cars.getAll({ limit: 6 }),
      api.articles.getAll({ published: true, limit: 3 }),
      api.news.getAll({ published: true, limit: 3 }),
    ]);
    return { cars, articles, news };
  } catch (error) {
    return {
      cars: { data: [] },
      articles: { data: [] },
      news: { data: [] },
    };
  }
}

export default async function HomePage() {
  const { cars, articles, news } = await getHomeData();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-20">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  خودروهای لوکس را به حداکثر برسانید
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  ما طیف گسترده‌ای از خدمات را از خرید خودروهای جدید تا فروش خودروهای کارکرده با بهترین کیفیت ارائه می‌دهیم.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg"
                >
                  دریافت مشاوره رایگان
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                {/* Hero Car Image */}
                <div className="mt-12 relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/img/BMW (@BMW) on X.jpg"
                    alt="خودروهای لوکس"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">خدمات ما</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/cars" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                        <div className="w-16 h-12 rounded-lg overflow-hidden">
                          <Image
                            src="/img/download.jpg"
                            alt="خودروها"
                            width={64}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium">خودروهای جدید</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/cars" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                        <div className="w-16 h-12 rounded-lg overflow-hidden">
                          <Image
                            src="/img/Joshua Balduf.jpg"
                            alt="خودروهای کارکرده"
                            width={64}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium">خودروهای کارکرده</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center">
                          <span className="text-2xl">🚗</span>
                        </div>
                        <span className="font-medium">مشاوره رایگان</span>
                      </Link>
                    </li>
                  </ul>
                  <Link
                    href="/contact"
                    className="mt-6 block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-center font-semibold"
                  >
                    دریافت مشاوره
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                  ما خدمات خودرو را برای تمام برندها ارائه می‌دهیم
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    تلاش‌های ما بر روی بهبود مستمر مهارت‌ها و تکنولوژی‌های خرید و فروش خودرو متمرکز است. 
                    ما با اطمینان می‌توانیم کیفیت استثنایی کار، زمان‌بندی کوتاه و قیمت‌های مناسب را تضمین کنیم.
                  </p>
                  <p>
                    استانداردهای بالای کیفیت به ما اجازه داده است که گواهینامه‌های لازم را برای تمامی 
                    خدمات خود دریافت کنیم، از جمله خدمات پس از فروش و گارانتی کامل.
                  </p>
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg"
                >
                  درباره شرکت
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Sidebar Benefits */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">چرا ما را انتخاب کنید؟</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-xl font-bold text-blue-600 mb-3">کیفیت 100%</h4>
                    <p className="text-gray-600">
                      انتخاب دقیق خودروهای با کیفیت تضمین می‌کند که هیچ تفاوتی با استانداردهای روز وجود ندارد.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-xl font-bold text-blue-600 mb-3">خدمات شماره 1</h4>
                    <p className="text-gray-600">
                      ده‌ها مشتری راضی به ما اعتماد کرده‌اند. اگر حتی یک بار کار بد انجام دهیم، 
                      اعتبار خود را از دست می‌دهیم.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-xl font-bold text-blue-600 mb-3">متناسب با بودجه شما</h4>
                    <p className="text-gray-600">
                      ما چندین گزینه قیمتی حتی برای همان نوع خودرو ارائه می‌دهیم. 
                      بیایید صادقانه در مورد قیمت‌ها صحبت کنیم.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-xl font-bold text-blue-600 mb-3">دوستان شما متوجه تفاوت نمی‌شوند</h4>
                    <p className="text-gray-600">
                      طبق آمار، 9 از 10 آشنایان مشتری پس از خرید، هیچ تفاوتی با خودروهای جدید نمی‌بینند.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Car Types Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              انواع خودروهای موجود
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Car Type Cards */}
              {cars.data && cars.data.length > 0 ? (
                cars.data.slice(0, 6).map((car: any) => (
                  <Link
                    key={car.id}
                    href={`/cars/${car.category.slug}/${car.slug}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    {car.images && car.images.length > 0 && (
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={car.images[0]}
                          alt={car.brand + ' ' + car.model}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-gray-600 mb-4">{car.category.name}</p>
                      <span className="text-blue-600 font-semibold hover:underline">
                        بیشتر بدانید →
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <>
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src="/img/pexels-highervibration-10573462.jpg"
                        alt="خودروهای سواری"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">خودروهای سواری</h3>
                      <p className="text-gray-600 mb-4">خودروهای شخصی و خانوادگی</p>
                      <span className="text-blue-600 font-semibold">بیشتر بدانید →</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src="/img/pexels-hyundaimotorgroup-11194874.jpg"
                        alt="خودروهای شاسی بلند"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">خودروهای شاسی بلند</h3>
                      <p className="text-gray-600 mb-4">SUV و کراس‌اوور</p>
                      <span className="text-blue-600 font-semibold">بیشتر بدانید →</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src="/img/pexels-mikebirdy-112460.jpg"
                        alt="خودروهای اسپرت"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">خودروهای اسپرت</h3>
                      <p className="text-gray-600 mb-4">خودروهای ورزشی و پرسرعت</p>
                      <span className="text-blue-600 font-semibold">بیشتر بدانید →</span>
                    </div>
                  </div>
                </>
              )}
              
              {/* CTA Card */}
              <div className="bg-blue-600 rounded-xl p-8 text-white shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-4">درخواست مشاوره رایگان</h3>
                  <p className="text-blue-100 mb-6">
                    فرم را پر کنید و ما با شما تماس می‌گیریم
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="block w-full px-6 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all text-center font-semibold"
                >
                  دریافت مشاوره
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stand Out Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  با FTS Motors از دیگران متمایز شوید
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  درخواست خود را برای خرید خودرو ثبت کنید و ما در تمامی مراحل شما را راهنمایی می‌کنیم.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg"
                >
                  دریافت مشاوره
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/img/pexels-hyundaimotorgroup-15865525.jpg"
                  alt="خودروهای متنوع"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Articles & News Section */}
        {(articles.data && articles.data.length > 0) || (news.data && news.data.length > 0) ? (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Articles */}
                {articles.data && articles.data.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">آخرین مقالات</h2>
                    <div className="space-y-4">
                      {articles.data.map((article: any) => (
                        <Link
                          key={article.id}
                          href={`/blog/${article.slug}`}
                          className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                        >
                          {article.image && (
                            <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                              <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                          {article.excerpt && (
                            <p className="text-gray-600 line-clamp-2">{article.excerpt}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* News */}
                {news.data && news.data.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">آخرین اخبار</h2>
                    <div className="space-y-4">
                      {news.data.map((newsItem: any) => (
                        <Link
                          key={newsItem.id}
                          href={`/news/${newsItem.slug}`}
                          className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                        >
                          {newsItem.image && (
                            <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                              <Image
                                src={newsItem.image}
                                alt={newsItem.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{newsItem.title}</h3>
                          {newsItem.excerpt && (
                            <p className="text-gray-600 line-clamp-2">{newsItem.excerpt}</p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
